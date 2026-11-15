import fs from "fs";
import path from "path";

const dbPath = path.resolve("data/db.test.json");
const db = JSON.parse(fs.readFileSync(path.resolve("data/db.json"), "utf8"));
for (const k of ["users","sessions","orders","tripPlans","bookings","newsletter"]) db[k]=[];
fs.writeFileSync(dbPath, JSON.stringify(db,null,2));

process.env.ASSAMVISTA_DB_PATH = dbPath;
process.env.PORT = "4010";
process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.NODE_ENV = "test";
process.env.ADMIN_KEY = "test-admin-key";

const { startServer } = await import("../server/src/index.js");
const server = startServer(4010);
await new Promise((r,rej)=>{ server.on("listening",r); server.on("error",rej); });

const base = "http://127.0.0.1:4010";
let cookies = {};
function storeCookies(res){ for(const c of (res.headers.getSetCookie?.()||[])){ const [kv]=c.split(";"); const i=kv.indexOf("="); if(i>0) cookies[kv.slice(0,i).trim()]=kv.slice(i+1).trim(); } }
function cookieHeader(){ return Object.entries(cookies).map(([k,v])=>`${k}=${v}`).join("; "); }
function csrf(){ return cookies["av_csrf"]||""; }
async function api(method,path,body,opts={}){
  const headers = {"Accept":"application/json", ...(opts.headers||{})};
  if(body!==undefined) headers["Content-Type"]="application/json";
  if(!opts.noCookie && cookieHeader()) headers["Cookie"]=cookieHeader();
  if(opts.csrf) headers["x-csrf-token"]=csrf();
  const res = await fetch(base+path,{method,headers,body: body!==undefined?JSON.stringify(body):undefined});
  storeCookies(res);
  const text=await res.text(); let data=null; try{ data=text?JSON.parse(text):null; }catch{ data=text; }
  return {status:res.status,data,text,setCookies:res.headers.getSetCookie?.()||[]};
}
const results=[];
function ok(name,cond,detail=""){ const row={name,pass:!!cond,detail:String(detail??"").slice(0,300)}; results.push(row); console.log(`${cond?"PASS":"FAIL"} | ${name}${detail? " | "+row.detail:""}`); }
try {
  let r=await api("GET","/api/health"); ok("GET /api/health 200", r.status===200, JSON.stringify(r.data));
  r=await api("POST","/api/auth/register",{name:"Test User A",email:"a@test.local",password:"Passw0rd1"});
  ok("Register user A success", r.status===200||r.status===201, `status=${r.status}`);
  ok("Register sets HttpOnly session cookie", r.setCookies.some(c=>/av_session=/.test(c)&&/HttpOnly/i.test(c)), r.setCookies.join(" || "));
  ok("Register sets CSRF cookie", cookieHeader().includes("av_csrf"));
  ok("Register response has no passwordHash", !JSON.stringify(r.data||{}).includes("passwordHash"));
  ok("Register returns safe user", r.data?.user?.email==="a@test.local" && !r.data?.user?.passwordHash, JSON.stringify(r.data));
  r=await api("POST","/api/auth/register",{name:"Test User A2",email:"a@test.local",password:"Passw0rd1"});
  ok("Duplicate registration rejected", r.status===409||r.status===400, `status=${r.status}`);
  r=await api("POST","/api/auth/login",{email:"a@test.local",password:"WrongPass1"});
  ok("Invalid password rejected", r.status===401, `status=${r.status}`);
  ok("Invalid login has no passwordHash", !JSON.stringify(r.data||{}).includes("passwordHash"));
  r=await api("POST","/api/auth/login",{email:"a@test.local",password:"Passw0rd1"});
  ok("Login success", r.status===200, `status=${r.status}`);
  ok("Login response has no passwordHash", !JSON.stringify(r.data||{}).includes("passwordHash"));
  r=await api("GET","/api/auth/me");
  ok("GET /auth/me authenticated", r.status===200 && r.data?.user?.email==="a@test.local", `status=${r.status}`);
  ok("/auth/me has no passwordHash", !JSON.stringify(r.data||{}).includes("passwordHash"));
  ok("/auth/me returns csrfToken", !!r.data?.csrfToken);
  const orderBody={items:[{slug:"muga-mekhela-sador",qty:1}], customer:{fullName:"Test User A",phone:"9876543210",email:"a@test.local",address:"123 Test Street",city:"Guwahati",district:"Kamrup Metropolitan",pincode:"781001",notes:"",paymentMethod:"cod"}, clientRequestId:"req-order-1"};
  const rNoCsrf = await fetch(base+"/api/orders",{method:"POST",headers:{"Content-Type":"application/json","Cookie":cookieHeader()},body:JSON.stringify(orderBody)});
  ok("Protected order without CSRF rejected", rNoCsrf.status===403, `status=${rNoCsrf.status}`);
  r=await api("POST","/api/orders", orderBody, {csrf:true});
  ok("Protected order submission success", r.status===200||r.status===201, `status=${r.status}`);
  const orderTotal=r.data?.order?.total ?? r.data?.total;
  ok("Order has server-computed total", typeof orderTotal==="number" && orderTotal>0, JSON.stringify(r.data?.order||r.data).slice(0,220));
  ok("Order records request (no payment processed)", r.data?.order?.paymentStatus==="pending" && !/paid|gateway/i.test(JSON.stringify(r.data?.order?.note||"")), JSON.stringify({paymentStatus:r.data?.order?.paymentStatus,note:r.data?.order?.note}));
  r=await api("POST","/api/orders", orderBody, {csrf:true});
  ok("Duplicate clientRequestId idempotent response", r.status===200, `status=${r.status} dup=${r.data?.duplicate}`);
  r=await api("GET","/api/orders/my");
  const aOrders=r.data?.orders||[];
  ok("GET /orders/my returns 1 order for A", r.status===200 && aOrders.length===1, `count=${aOrders.length}`);
  const tamper={...orderBody, clientRequestId:"req-order-tamper", items:[{slug:"muga-mekhela-sador",qty:1,unitPrice:1,price:1,subtotal:1}]};
  r=await api("POST","/api/orders", tamper, {csrf:true});
  const tamperTotal=r.data?.order?.total ?? r.data?.total;
  ok("Price tampering ignored by server", (r.status===200||r.status===201) && tamperTotal===orderTotal, `status=${r.status} tamper=${tamperTotal} expected=${orderTotal}`);
  const tripBody={selectedIds:["kaziranga-national-park"], details:{arrivalDate:"2026-12-01",departureDate:"2026-12-03",adults:2,children:0,notes:"test trip",budgetCategory:"mid"}, itinerary:{days:[{day:1,items:[{id:"kaziranga-national-park"}]}]}, clientRequestId:"req-trip-1"};
  r=await api("POST","/api/trip-plans", tripBody, {csrf:true});
  ok("Protected trip submission success", r.status===200||r.status===201, `status=${r.status}`);
  r=await api("POST","/api/trip-plans", tripBody, {csrf:true});
  ok("Duplicate trip clientRequestId idempotent", r.status===200, `status=${r.status} dup=${r.data?.duplicate}`);
  r=await api("GET","/api/trip-plans/my");
  const aTrips=r.data?.tripPlans||r.data?.plans||[];
  ok("GET /trip-plans/my returns 1 trip for A", r.status===200 && aTrips.length===1, `count=${aTrips.length}`);
  cookies={};
  r=await api("POST","/api/auth/register",{name:"Test User B",email:"b@test.local",password:"Passw0rd2"});
  ok("Register user B", r.status===200||r.status===201, `status=${r.status}`);
  r=await api("GET","/api/orders/my");
  ok("User B cannot see A orders", r.status===200 && (r.data?.orders||[]).length===0, `count=${(r.data?.orders||[]).length}`);
  r=await api("GET","/api/trip-plans/my");
  ok("User B cannot see A trip plans", r.status===200 && (r.data?.tripPlans||r.data?.plans||[]).length===0, `count=${(r.data?.tripPlans||r.data?.plans||[]).length}`);
  r=await api("POST","/api/auth/logout",{},{csrf:true});
  ok("Logout success", r.status===200, `status=${r.status}`);
  r=await api("GET","/api/auth/me");
  ok("Session invalidated after logout", r.status===401, `status=${r.status}`);
  cookies={};
  r=await api("POST","/api/auth/login",{email:"a@test.local",password:"Passw0rd1"});
  ok("Login A for account deletion", r.status===200, `status=${r.status}`);
  r=await api("DELETE","/api/auth/account", undefined, {csrf:true});
  ok("Account deletion success", r.status===200||r.status===204, `status=${r.status}`);
  r=await api("GET","/api/auth/me");
  ok("Session invalid after account deletion", r.status===401, `status=${r.status}`);
  cookies={};
  r=await api("POST","/api/auth/login",{email:"a@test.local",password:"Passw0rd1"});
  ok("Login rejected after account deletion", r.status===401||r.status===404, `status=${r.status}`);
  cookies={};
  r=await api("GET","/api/orders/my"); ok("Unauthorized orders access rejected", r.status===401, `status=${r.status}`);
  r=await api("GET","/api/trip-plans/my"); ok("Unauthorized trip plans access rejected", r.status===401, `status=${r.status}`);
  r=await api("POST","/api/orders", orderBody); ok("Unauthorized order submission rejected", r.status===401, `status=${r.status}`);
  r=await api("POST","/api/trip-plans", tripBody); ok("Unauthorized trip submission rejected", r.status===401, `status=${r.status}`);

  const finalDb = JSON.parse(fs.readFileSync(dbPath,"utf8"));
  const allHashes = (finalDb.users||[]).every(u=>!u.password && typeof u.passwordHash==="string" && u.passwordHash.startsWith("scrypt$"));
  ok("Stored passwords are scrypt hashes (no plaintext)", allHashes, JSON.stringify((finalDb.users||[]).map(u=>({pfx:u.passwordHash?.slice(0,7),hasPlain:!!u.password}))));
  ok("Deleted user removed from DB", !(finalDb.users||[]).some(u=>u.email==="a@test.local"));
  ok("Deleted user's orders/trip plans removed", !(finalDb.orders||[]).some(o=>o.userId && !(finalDb.users||[]).some(u=>u.id===o.userId)) && !(finalDb.tripPlans||[]).some(p=>p.userId && !(finalDb.users||[]).some(u=>u.id===p.userId)));

  const pass=results.filter(x=>x.pass).length, fail=results.length-pass;
  console.log(`\nSUMMARY: ${pass} passed, ${fail} failed, ${results.length} total`);
  process.exitCode = fail?1:0;
} catch (e) {
  console.error("FATAL", e);
  process.exitCode = 2;
} finally {
  server.close();
  try { fs.unlinkSync(dbPath); } catch {}
}
