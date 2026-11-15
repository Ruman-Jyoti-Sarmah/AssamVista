import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB_PATH = path.join(__dirname, "..", "..", "..", "data", "db.json");
export const DB_PATH = process.env.ASSAMVISTA_DB_PATH
  ? path.resolve(process.env.ASSAMVISTA_DB_PATH)
  : DEFAULT_DB_PATH;

const DEFAULT_DB = {
  districts: [],
  content: { note: "Extend with hero/dining/experiences overrides here" },
  bookings: [],
  newsletter: [],
  users: [],
  sessions: [],
  orders: [],
  tripPlans: [],
};

let writeQueue = Promise.resolve();

function normalize(db) {
  const next = { ...DEFAULT_DB, ...(db || {}) };
  for (const key of Object.keys(DEFAULT_DB)) {
    if (!Array.isArray(DEFAULT_DB[key]) && typeof DEFAULT_DB[key] === "object") {
      next[key] = { ...DEFAULT_DB[key], ...(next[key] || {}) };
    } else if (Array.isArray(DEFAULT_DB[key]) && !Array.isArray(next[key])) {
      next[key] = [];
    }
  }
  return next;
}

export async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return normalize(JSON.parse(raw || "{}"));
  } catch (error) {
    if (error?.code === "ENOENT") return normalize({});
    throw error;
  }
}

export async function writeDb(db) {
  const normalized = normalize(db);
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  const tmp = `${DB_PATH}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(normalized, null, 2));
  await fs.rename(tmp, DB_PATH);
  return normalized;
}

export async function updateDb(mutator) {
  const run = async () => {
    const db = await readDb();
    const result = await mutator(db);
    await writeDb(db);
    return result;
  };
  const next = writeQueue.then(run, run);
  writeQueue = next.catch(() => {});
  return next;
}

export function readDbSync() {
  try {
    return normalize(JSON.parse(fsSync.readFileSync(DB_PATH, "utf8") || "{}"));
  } catch (error) {
    if (error?.code === "ENOENT") return normalize({});
    throw error;
  }
}
