import { useCallback, useEffect, useState } from "react";
import { LogOut, Package, Route, Shield, Trash2, User, AlertTriangle, RefreshCw } from "lucide-react";
import { useAuth } from "@/store/AuthContext";

export default function AccountPage() {
  const { user, isAuthenticated, loading, logout, deleteAccount, loadOrders, loadTripPlans } = useAuth();
  const [tab, setTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [plans, setPlans] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refreshData = useCallback(async () => {
    if (!isAuthenticated) return;
    setBusy(true);
    setError("");
    try {
      const [o, p] = await Promise.all([loadOrders(), loadTripPlans()]);
      setOrders(Array.isArray(o) ? o : []);
      setPlans(Array.isArray(p) ? p : []);
    } catch (e) {
      setError(e?.message || "Could not load account data.");
    } finally {
      setBusy(false);
    }
  }, [isAuthenticated, loadOrders, loadTripPlans]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.hash = "#/login";
      return;
    }
    if (isAuthenticated) refreshData();
  }, [isAuthenticated, loading, refreshData]);

  const doLogout = async () => {
    await logout();
    window.location.hash = "#/";
  };

  const doDelete = async () => {
    const ok = window.confirm("Delete your account and associated sessions/orders/trip plans stored by AssamVista? This cannot be undone.");
    if (!ok) return;
    setBusy(true);
    setError("");
    try {
      await deleteAccount();
      window.location.hash = "#/";
    } catch (e) {
      setError(e?.message || "Account deletion failed.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <section className="account-page"><div className="account-wrap"><p>Loading account…</p></div></section>;
  if (!isAuthenticated || !user) return <section className="account-page"><div className="account-wrap"><p>Redirecting to login…</p></div></section>;

  return (
    <section className="account-page" id="top">
      <div className="account-wrap">
        <header className="account-head">
          <span className="label"><User size={14} aria-hidden="true" /> My Account</span>
          <h1>{user.name || "Account"}</h1>
          <p>{user.email}</p>
        </header>

        <div className="account-layout">
          <aside className="account-nav" aria-label="Account sections">
            <button type="button" className={tab === "profile" ? "is-active" : ""} onClick={() => setTab("profile")}><User size={16} /> Profile</button>
            <button type="button" className={tab === "orders" ? "is-active" : ""} onClick={() => setTab("orders")}><Package size={16} /> My Orders</button>
            <button type="button" className={tab === "plans" ? "is-active" : ""} onClick={() => setTab("plans")}><Route size={16} /> My Trip Plans</button>
            <button type="button" className={tab === "settings" ? "is-active" : ""} onClick={() => setTab("settings")}><Shield size={16} /> Account settings</button>
            <button type="button" onClick={refreshData} disabled={busy}><RefreshCw size={16} /> Refresh</button>
            <button type="button" onClick={doLogout}><LogOut size={16} /> Logout</button>
          </aside>

          <div className="account-main">
            {error && <p className="account-alert account-alert--error" role="alert">{error}</p>}
            {notice && <p className="account-alert account-alert--ok">{notice}</p>}

            {tab === "profile" && (
              <div className="account-card">
                <h2>Profile</h2>
                <dl className="account-dl">
                  <div><dt>Name</dt><dd>{user.name}</dd></div>
                  <div><dt>Email</dt><dd>{user.email}</dd></div>
                  <div><dt>Account ID</dt><dd><code>{user.id}</code></dd></div>
                  <div><dt>Created</dt><dd>{user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}</dd></div>
                </dl>
                <p className="account-note">Profile editing is not available in this version. Account actions and your saved orders/trip plans are shown below.</p>
              </div>
            )}

            {tab === "orders" && (
              <div className="account-card">
                <h2>My Orders</h2>
                {!orders.length ? <p>No orders yet. Orders placed through checkout will appear here.</p> : (
                  <ul className="account-list">
                    {orders.map((o) => (
                      <li key={o.id} className="account-item">
                        <div className="account-item__head">
                          <strong>{o.id}</strong>
                          <span>{o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}</span>
                        </div>
                        <p>Status: <strong>{o.status || "placed"}</strong> · Total: <strong>₹{Number(o.total || 0).toLocaleString("en-IN")}</strong></p>
                        <p>{Array.isArray(o.items) ? `${o.items.length} item(s)` : "—"}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {tab === "plans" && (
              <div className="account-card">
                <h2>My Trip Plans</h2>
                {!plans.length ? <p>No submitted trip plans yet. Complete and submit a trip plan to see it here.</p> : (
                  <ul className="account-list">
                    {plans.map((p) => (
                      <li key={p.id} className="account-item">
                        <div className="account-item__head">
                          <strong>{p.id}</strong>
                          <span>{p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}</span>
                        </div>
                        <p>Status: <strong>{p.status || "submitted"}</strong></p>
                        <p>
                          {p.details?.arrivalDate || "—"}{p.details?.departureDate ? ` → ${p.details.departureDate}` : ""} ·{" "}
                          {Array.isArray(p.destinations) ? `${p.destinations.length} destination(s)` : "—"}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {tab === "settings" && (
              <div className="account-card">
                <h2>Account settings</h2>
                <p className="account-note">You can log out of this device or delete your AssamVista account data stored by this application.</p>
                <div className="account-actions">
                  <button type="button" className="btn btn--ghost" onClick={doLogout}><LogOut size={16} /> Logout</button>
                  <button type="button" className="btn btn--danger" onClick={doDelete} disabled={busy}><Trash2 size={16} /> Delete account</button>
                </div>
                <p className="account-alert account-alert--warn"><AlertTriangle size={15} /> Deleting your account removes your account record and associated sessions. Orders and trip plans linked to your account are removed from this application's stored account data.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
