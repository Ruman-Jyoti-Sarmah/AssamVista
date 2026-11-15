import { useEffect, useState, useRef } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserPlus,
  LogIn,
  MapPin,
  Film,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/store/AuthContext";
import { useApp } from "@/store/AppContext";

export default function AuthPage() {
  const { login, register } = useAuth();

  const [mode, setMode] = useState(window.location.hash.includes("/signup") ? "signup" : "login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const bgRef = useRef(null);

  const formRef = useRef({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    acceptTerms: false,
    remember: false,
  });

  const set = (k) => (e) => {
    const value = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    formRef.current[k] = value;
    setError("");
  };

  useEffect(() => {
    const h = window.location.hash.split("?")[0];
    setMode(h === "#/signup" ? "signup" : "login");
    setError("");
  }, []);

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.split("?")[0];
      setMode(h === "#/signup" ? "signup" : "login");
      setError("");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const googleConfigured = Boolean(
    import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_CLIENT_ID.trim()
  );

  const validate = () => {
    const f = formRef.current;
    if (mode === "login") {
      if (!f.email.trim()) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return "Please enter a valid email address.";
      if (!f.password) return "Please enter your password.";
      return "";
    }
    if (!f.name.trim() || f.name.trim().length < 2) return "Please enter your full name.";
    if (!f.email.trim()) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return "Please enter a valid email address.";
    if (f.phone && !/^\+?[\d\s\-()]{7,}$/.test(f.phone.trim())) return "Please enter a valid phone number.";
    if (!f.password) return "Please enter a password.";
    if (f.password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Za-z]/.test(f.password) || !/[0-9]/.test(f.password)) return "Password must include at least one letter and one number.";
    if (f.password !== f.confirmPassword) return "Passwords do not match.";
    if (!f.acceptTerms) return "Please accept the Terms of Service and Privacy Policy.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const msg = validate();
    if (msg) { setError(msg); return; }
    setBusy(true);
    try {
      if (mode === "login") {
        await login({ email: formRef.current.email.trim(), password: formRef.current.password });
      } else {
        await register({ name: formRef.current.name.trim(), email: formRef.current.email.trim(), password: formRef.current.password });
      }
    } catch (err) {
      setError(err?.message || "Authentication failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleForgot = () => {
    alert("Password reset emails are not configured in this version. Please contact AssamVista support for account recovery.");
  };

  const kicker = "Discover · Explore · Experience";
  const heading = mode === "login" ? "Welcome back" : "Create your account";
  const sub = mode === "login"
    ? "Enter your email and password to access your account and trip plans."
    : "Create an account to plan trips, save favourites and check out faster.";
  const primaryBtn = mode === "login" ? "Sign in" : "Create account";
  const switchLabel = mode === "login" ? "New to AssamVista?" : "Already have an account?";
  const switchAction = mode === "login" ? "Create account" : "Sign in";

  const cards = [
    {
      title: "Plan Your Trip",
      subtitle: "Smart & Easy",
      desc: "Choose your districts, stays and experiences step by step.",
    },
    {
      title: "Explore Culture",
      subtitle: "Our Heritage",
      desc: "Festivals, satras, crafts and living traditions of Assam.",
    },
    {
      title: "Discover Places",
      subtitle: "Unforgettable Beauty",
      desc: "Tea gardens, rivers, wildlife and the mighty Brahmaputra.",
    },
  ];

  return (
    <section className="auth-page" id="top">
      {/* Background */}
      <div className="auth-bg">
        <img
          ref={bgRef}
          className="auth-bg__img"
          src="/images/auth/assam-landscape-hero.jpg"
          alt="Assam landscape with tea gardens, mountains and river"
          aria-hidden="true"
          loading="eager"
          decoding="async"
          onError={(e) => { e.target.src = "/images/culture/bihu-dance.jpg"; }}
        />
        <div className="auth-bg__overlay" />
      </div>

      {/* Layout container */}
      <div className="auth-body">
        <div className="auth-main">
          {/* Left hero (desktop only) */}
          <div className="auth-hero">
            <div className="auth-hero__inner">
              <div className="auth-hero__content">
                <p className="auth-hero__kicker">{kicker}</p>
                <h1 className="auth-hero__title">The Incredible Assam</h1>
                <p className="auth-hero__sub">
                  From lush tea gardens to rich culture, let AssamVista be your travel companion through the heart of Northeast India.
                </p>
                <div className="auth-feature-cards">
                  {cards.map((c, i) => (
                    <div key={c.title} className="auth-feature-card">
                      <div className="auth-feature-card__icon">{i === 0 ? <MapPin size={20} aria-hidden="true" /> : i === 1 ? <Film size={20} aria-hidden="true" /> : <Sparkles size={20} aria-hidden="true" />}</div>
                      <div className="auth-feature-card__text">
                        <div className="auth-feature-card__title">{c.title}</div>
                        <div className="auth-feature-card__subtitle">{c.subtitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right auth card */}
          <div className="auth-wrap">
            <div className="auth-card">
          <div className="auth-card__brand">
            <img className="auth-card__logo" src="/Logo/AssamVista-Logo.png" alt="AssamVista" />
            <div className="auth-card__text">
              <span className="auth-card__name">Assam<span className="auth-card__accent">Vista</span></span>
              <span className="auth-card__tagline">Your Gateway to Assam</span>
            </div>
          </div>

          <div className="auth-card__tabs" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={mode === "login" ? "is-active" : ""}
              onClick={() => { setMode("login"); setError(""); }}
            >
              <LogIn size={15} aria-hidden="true" /> <span>Log in</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              className={mode === "signup" ? "is-active" : ""}
              onClick={() => { setMode("signup"); setError(""); }}
            >
              <UserPlus size={15} aria-hidden="true" /> <span>Sign up</span>
            </button>
          </div>

          <p className="auth-card__kicker">{heading}</p>
          <p className="auth-card__sub">{sub}</p>

          <form className="auth-form" onSubmit={submit} noValidate>
            {mode === "signup" && (
              <>
                <label className="auth-field">
                  <span>Full name</span>
                  <div className="auth-input">
                    <User size={17} aria-hidden="true" />
                    <input
                      value={formRef.current.name}
                      onChange={set("name")}
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={80}
                      disabled={busy}
                      placeholder="Your full name"
                    />
                  </div>
                </label>

                <label className="auth-field">
                  <span>Phone number</span>
                  <div className="auth-input">
                    <Globe size={17} aria-hidden="true" />
                    <input
                      type="tel"
                      value={formRef.current.phone}
                      onChange={set("phone")}
                      autoComplete="tel"
                      disabled={busy}
                      placeholder="+91 9XXXXXXXXX"
                    />
                  </div>
                </label>
              </>
            )}

            <label className="auth-field">
              <span>Email address</span>
              <div className="auth-input">
                <Mail size={17} aria-hidden="true" />
                <input
                  type="email"
                  value={formRef.current.email}
                  onChange={set("email")}
                  autoComplete={mode === "login" ? "email" : "username"}
                  required
                  disabled={busy}
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-input">
                <Lock size={17} aria-hidden="true" />
                <input
                  type={showPw ? "text" : "password"}
                  value={formRef.current.password}
                  onChange={set("password")}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={mode === "signup" ? 8 : undefined}
                  disabled={busy}
                  placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                />
                <button
                  type="button"
                  className="auth-input__toggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  disabled={busy}
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            {mode === "signup" && (
              <label className="auth-field">
                <span>Confirm password</span>
                <div className="auth-input">
                  <Lock size={17} aria-hidden="true" />
                  <input
                    type={showPw2 ? "text" : "password"}
                    value={formRef.current.confirmPassword}
                    onChange={set("confirmPassword")}
                    autoComplete="new-password"
                    required
                    disabled={busy}
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    className="auth-input__toggle"
                    onClick={() => setShowPw2((v) => !v)}
                    aria-label={showPw2 ? "Hide confirm password" : "Show confirm password"}
                    disabled={busy}
                  >
                    {showPw2 ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>
            )}

            {mode === "login" && (
              <label className="auth-check">
                <input
                  type="checkbox"
                  checked={formRef.current.remember}
                  onChange={set("remember")}
                  disabled={busy}
                />
                <span>Remember me</span>
              </label>
            )}

            {mode === "login" && (
              <div className="auth-forgot">
                Forgot password?{" "}
                <button type="button" className="auth-link" onClick={handleForgot}>Reset password</button>
              </div>
            )}

            {mode === "signup" && (
              <label className="auth-check terms">
                <input
                  type="checkbox"
                  checked={formRef.current.acceptTerms}
                  onChange={set("acceptTerms")}
                  required
                  disabled={busy}
                />
                <span>I agree to the <a href="#/terms" className="auth-link">Terms of Service</a> and <a href="#/privacy" className="auth-link">Privacy Policy</a>.</span>
              </label>
            )}

            {error && <p className="auth-form__error" role="alert">{error}</p>}

            <button type="submit" className="auth-form__submit" disabled={busy}>
              {busy ? "Please wait…" : primaryBtn}
            </button>

            <p className="auth-card__switch">
              {switchLabel} <button type="button" className="auth-switch-btn" onClick={() => setMode(mode === "login" ? "signup" : "login")}>{switchAction}</button>
            </p>

            <p className="auth-card__note">
              Passwords are hashed server-side. Sessions use HttpOnly cookies with CSRF protection.
            </p>

            {googleConfigured && (
              <>
                <div className="auth-or"><span>OR</span></div>
                <button type="button" className="auth-form__google" onClick={() => {}} disabled={!googleConfigured}>
                  Continue with Google
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  </div>
    </section>
  );
}
