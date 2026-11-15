import { useEffect, useId, useState } from "react";
import { Eye, EyeOff, Lock, LogIn, UserPlus, X } from "lucide-react";
import { useAuth } from "@/store/AuthContext";

export default function AuthModal({ open, mode = "login", onClose, onSuccess, message }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState(mode);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptPrivacy: false,
    acceptTerms: false,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (open) {
      setTab(mode || "login");
      setError("");
      setShowPw(false);
      setShowPw2(false);
      setForm({ name: "", email: "", password: "", confirmPassword: "", acceptPrivacy: false, acceptTerms: false });
    }
  }, [open, mode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape" && !busy) onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, busy]);

  if (!open) return null;

  const set = (k) => (e) => {
    const value = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  const validate = () => {
    if (tab === "signup") {
      if (form.name.trim().length < 2) return "Please enter your full name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Please enter a valid email address.";
      if (form.password.length < 8) return "Password must be at least 8 characters.";
      if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) return "Password must include at least one letter and one number.";
      if (form.password !== form.confirmPassword) return "Passwords do not match.";
      if (!form.acceptPrivacy) return "Please accept the Privacy Policy to continue.";
      if (!form.acceptTerms) return "Please accept the Terms of Service to continue.";
      return "";
    }
    if (!form.email.trim() || !form.password) return "Email and password are required.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) { setError(msg); return; }
    setError("");
    setBusy(true);
    try {
      if (tab === "login") {
        await login({ email: form.email.trim(), password: form.password });
      } else {
        await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      const m = err?.message || "Authentication failed. Please try again.";
      setError(m);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="auth-modal__backdrop" aria-label="Close" onClick={() => !busy && onClose?.()} />
      <div className="auth-modal__panel">
        <button type="button" className="auth-modal__close" onClick={() => !busy && onClose?.()} aria-label="Close" disabled={busy}>
          <X size={18} />
        </button>
        <div className="auth-modal__head">
          <span className="label"><Lock size={13} aria-hidden="true" /> Secure account</span>
          <h2 id={titleId}>{tab === "login" ? "Log in to continue" : "Create your account"}</h2>
          <p>{message || "Log in or create an account to continue to checkout or submit your trip plan. Your progress is preserved."}</p>
        </div>

        <div className="auth-modal__tabs" role="tablist" aria-label="Authentication">
          <button type="button" role="tab" aria-selected={tab === "login"} className={tab === "login" ? "is-active" : ""} onClick={() => { setTab("login"); setError(""); }} disabled={busy}>
            <LogIn size={15} aria-hidden="true" /> Log in
          </button>
          <button type="button" role="tab" aria-selected={tab === "signup"} className={tab === "signup" ? "is-active" : ""} onClick={() => { setTab("signup"); setError(""); }} disabled={busy}>
            <UserPlus size={15} aria-hidden="true" /> Sign up
          </button>
        </div>

        <form className="auth-form" onSubmit={submit} noValidate>
          {tab === "signup" && (
            <label className="auth-field">
              <span>Full name</span>
              <input value={form.name} onChange={set("name")} autoComplete="name" required minLength={2} maxLength={80} disabled={busy} />
            </label>
          )}
          <label className="auth-field">
            <span>Email address</span>
            <input type="email" value={form.email} onChange={set("email")} autoComplete="email" required disabled={busy} />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <div className="auth-input">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                autoComplete={tab === "login" ? "current-password" : "new-password"}
                required
                minLength={tab === "signup" ? 8 : undefined}
                disabled={busy}
              />
              <button type="button" className="auth-input__toggle" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"} disabled={busy}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {tab === "signup" && <small className="auth-hint">At least 8 characters with a letter and a number.</small>}
          </label>

          {tab === "signup" && (
            <>
              <label className="auth-field">
                <span>Confirm password</span>
                <div className="auth-input">
                  <input
                    type={showPw2 ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={set("confirmPassword")}
                    autoComplete="new-password"
                    required
                    disabled={busy}
                  />
                  <button type="button" className="auth-input__toggle" onClick={() => setShowPw2((v) => !v)} aria-label={showPw2 ? "Hide confirm password" : "Show confirm password"} disabled={busy}>
                    {showPw2 ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>
              <label className="auth-check">
                <input type="checkbox" checked={form.acceptPrivacy} onChange={set("acceptPrivacy")} disabled={busy} />
                <span>I have read and accept the <a href="#/privacy">Privacy Policy</a>.</span>
              </label>
              <label className="auth-check">
                <input type="checkbox" checked={form.acceptTerms} onChange={set("acceptTerms")} disabled={busy} />
                <span>I agree to the <a href="#/terms">Terms of Service</a>.</span>
              </label>
            </>
          )}

          {tab === "login" && (
            <p className="auth-forgot">
              Forgot password? <span>Password recovery is not available in this version. Please contact the site operator if you need account assistance.</span>
            </p>
          )}

          {error && <p className="auth-form__error" role="alert">{error}</p>}

          <button type="submit" className="btn btn--solid auth-form__submit" disabled={busy}>
            {busy ? "Please wait…" : tab === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="auth-modal__note">
          Passwords are hashed server-side. Sessions use HttpOnly cookies with CSRF protection. Sign-in is required only for checkout and trip plan submission.
        </p>
      </div>
    </div>
  );
}
