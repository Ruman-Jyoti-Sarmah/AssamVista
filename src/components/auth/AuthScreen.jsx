import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, LogIn, Mail, ShieldCheck, User, UserPlus } from "lucide-react";
import { useAuth } from "@/store/AuthContext";
import { getPendingAuthAction } from "@/lib/authFlow";

function readHash() {
  return window.location.hash || "#/login";
}

export default function AuthScreen({ initialMode = "login" }) {
  const { login, register, isAuthenticated, loading } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [pending, setPending] = useState(() => getPendingAuthAction());
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptPrivacy: false,
    acceptTerms: false,
  });

  useEffect(() => {
    const h = readHash().split("?")[0];
    setMode(h === "#/signup" ? "signup" : "login");
    setPending(getPendingAuthAction());
    setError("");
  }, []);

  useEffect(() => {
    const onHash = () => {
      const h = readHash().split("?")[0];
      setMode(h === "#/signup" ? "signup" : "login");
      setPending(getPendingAuthAction());
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const switchMode = (next) => {
    setMode(next);
    setError("");
    window.location.hash = next === "signup" ? "#/signup" : "#/login";
  };

  const set = (k) => (e) => {
    const value = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  // AuthFlowProvider auto-resumes pending actions after authentication becomes true.
  // Keep this page passive to avoid duplicate submissions; redirect only if no pending action remains.
  useEffect(() => {
    if (!loading && isAuthenticated && !getPendingAuthAction()) {
      window.location.hash = "#/account";
    }
  }, [isAuthenticated, loading]);

  const validateSignup = () => {
    if (form.name.trim().length < 2) return "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Please enter a valid email address.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) return "Password must include at least one letter and one number.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    if (!form.acceptPrivacy) return "Please accept the Privacy Policy to continue.";
    if (!form.acceptTerms) return "Please accept the Terms of Service to continue.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const msg = mode === "signup" ? validateSignup() : (!form.email || !form.password ? "Email and password are required." : "");
    if (msg) { setError(msg); return; }
    setBusy(true);
    try {
      if (mode === "login") {
        await login({ email: form.email.trim(), password: form.password });
      } else {
        await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      }
      // Do not clear/resume pending action here; AuthFlowProvider handles it centrally.
    } catch (err) {
      setError(err?.message || "Authentication failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-page" id="top">
      <div className="auth-page__wrap">
        <div className="auth-page__intro">
          <span className="label"><ShieldCheck size={14} aria-hidden="true" /> AssamVista Account</span>
          <h1>{mode === "login" ? "Log in to continue" : "Create your account"}</h1>
          <p>
            Browse freely without an account. Sign in is required only when you proceed to checkout
            or submit a completed trip plan. Your cart and trip details are preserved.
          </p>
          {pending ? (
            <div className="auth-page__pending" role="status">
              <Lock size={15} aria-hidden="true" />
              <span>
                {pending.type === "checkout"
                  ? "After signing in, you'll return to checkout with your cart preserved."
                  : pending.type === "submit-trip"
                    ? "After signing in, your trip plan will be submitted with your entered details preserved."
                    : "After signing in, your intended action will continue."}
              </span>
            </div>
          ) : null}
        </div>

        <div className="auth-card">
          <div className="auth-card__tabs" role="tablist" aria-label="Authentication">
            <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "is-active" : ""} onClick={() => switchMode("login")}>
              <LogIn size={15} aria-hidden="true" /> Log in
            </button>
            <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "is-active" : ""} onClick={() => switchMode("signup")}>
              <UserPlus size={15} aria-hidden="true" /> Sign up
            </button>
          </div>

          <form className="auth-form auth-form--page" onSubmit={submit} noValidate>
            {mode === "signup" && (
              <label className="auth-field">
                <span>Full name</span>
                <div className="auth-input">
                  <User size={16} aria-hidden="true" />
                  <input value={form.name} onChange={set("name")} autoComplete="name" required minLength={2} maxLength={80} placeholder="Your full name" />
                </div>
              </label>
            )}

            <label className="auth-field">
              <span>Email address</span>
              <div className="auth-input">
                <Mail size={16} aria-hidden="true" />
                <input type="email" value={form.email} onChange={set("email")} autoComplete="email" required placeholder="you@example.com" />
              </div>
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-input">
                <Lock size={16} aria-hidden="true" />
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={mode === "signup" ? 8 : undefined}
                  placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                />
                <button type="button" className="auth-input__toggle" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {mode === "signup" && <small className="auth-hint">Use at least 8 characters with a letter and a number.</small>}
            </label>

            {mode === "signup" && (
              <>
                <label className="auth-field">
                  <span>Confirm password</span>
                  <div className="auth-input">
                    <Lock size={16} aria-hidden="true" />
                    <input
                      type={showPw2 ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={set("confirmPassword")}
                      autoComplete="new-password"
                      required
                      placeholder="Re-enter password"
                    />
                    <button type="button" className="auth-input__toggle" onClick={() => setShowPw2((v) => !v)} aria-label={showPw2 ? "Hide confirm password" : "Show confirm password"}>
                      {showPw2 ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <label className="auth-check">
                  <input type="checkbox" checked={form.acceptPrivacy} onChange={set("acceptPrivacy")} />
                  <span>I have read and accept the <a href="#/privacy">Privacy Policy</a>.</span>
                </label>
                <label className="auth-check">
                  <input type="checkbox" checked={form.acceptTerms} onChange={set("acceptTerms")} />
                  <span>I agree to the <a href="#/terms">Terms of Service</a>.</span>
                </label>
              </>
            )}

            {mode === "login" && (
              <p className="auth-forgot">
                Forgot password? <span>Account recovery is not yet available in this version. Please contact support if needed.</span>
              </p>
            )}

            {error && <p className="auth-form__error" role="alert">{error}</p>}

            <button type="submit" className="btn btn--solid auth-form__submit" disabled={busy}>
              {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="auth-card__switch">
            {mode === "login" ? (
              <>New to AssamVista? <button type="button" onClick={() => switchMode("signup")}>Create an account</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => switchMode("login")}>Log in</button></>
            )}
          </p>

          <p className="auth-card__note">
            Passwords are hashed server-side. Sessions use HttpOnly cookies with CSRF protection for account actions.
          </p>
        </div>
      </div>
    </section>
  );
}
