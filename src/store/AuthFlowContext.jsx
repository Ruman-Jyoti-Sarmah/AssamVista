import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import AuthModal from "@/components/common/AuthModal";
import { setPendingAuthAction, clearPendingAuthAction, getPendingAuthAction } from "@/lib/authFlow";
import { useAuth } from "@/store/AuthContext";
import { submitTripPlan } from "@/lib/api";

const FlowCtx = createContext(null);

export function AuthFlowProvider({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [modal, setModal] = useState({ open: false, mode: "login", message: "", onSuccess: null });
  const resumedRef = useRef(false);

  const requireAuthAction = useCallback((action, options = {}) => {
    if (isAuthenticated) {
      action?.();
      return true;
    }
    if (options.pending) setPendingAuthAction(options.pending);
    setModal({
      open: true,
      mode: options.mode || "login",
      message: options.message || "",
      // Pending actions are resumed centrally by AuthFlowProvider after auth to avoid duplicates.
      onSuccess: options.pending ? null : (action || null),
    });
    return false;
  }, [isAuthenticated]);

  const close = useCallback(() => setModal((m) => ({ ...m, open: false, onSuccess: null })), []);
  const openLogin = useCallback((opts = {}) => setModal({ open: true, mode: "login", message: opts.message || "", onSuccess: opts.onSuccess || null }), []);
  const openSignup = useCallback((opts = {}) => setModal({ open: true, mode: "signup", message: opts.message || "", onSuccess: opts.onSuccess || null }), []);

  // Auto-resume pending auth-gated actions after successful authentication.
  useEffect(() => {
    if (loading || !isAuthenticated) {
      resumedRef.current = false;
      return;
    }
    if (resumedRef.current) return;
    const pending = getPendingAuthAction();
    if (!pending) return;
    resumedRef.current = true;
    clearPendingAuthAction();
    setModal((m) => ({ ...m, open: false, onSuccess: null }));

    if (pending.type === "checkout") {
      if ((window.location.hash || "").split("?")[0] !== "#/culture/marketplace/checkout") {
        window.location.hash = "#/culture/marketplace/checkout";
      }
      return;
    }

    if (pending.type === "submit-trip") {
      (async () => {
        try {
          const clientRequestId = pending.clientRequestId || `trip-${Date.now()}`;
          const payload = {
            clientRequestId,
            destinations: pending.payload?.destinations || [],
            details: pending.payload?.details || {},
            itinerary: pending.payload?.itinerary || null,
          };
          await submitTripPlan(payload);
          try { sessionStorage.setItem("assamvista:trip:submit-result", JSON.stringify({ ok: true, clientRequestId, at: Date.now() })); } catch {}
          window.location.hash = "#/trip/itinerary?submitted=1";
        } catch (err) {
          try { sessionStorage.setItem("assamvista:trip:submit-result", JSON.stringify({ ok: false, error: err?.message || "Submission failed", at: Date.now() })); } catch {}
          window.location.hash = "#/trip/itinerary?submit_error=1";
        }
      })();
      return;
    }

    if (pending.returnHash) {
      window.location.hash = pending.returnHash;
    } else {
      window.location.hash = "#/account";
    }
  }, [isAuthenticated, loading]);

  const value = useMemo(() => ({
    requireAuthAction,
    openLogin,
    openSignup,
    closeAuthModal: close,
    pending: getPendingAuthAction,
    clearPending: clearPendingAuthAction,
  }), [requireAuthAction, openLogin, openSignup, close]);

  return (
    <FlowCtx.Provider value={value}>
      {children}
      <AuthModal
        open={modal.open}
        mode={modal.mode}
        message={modal.message}
        onClose={close}
        onSuccess={modal.onSuccess || undefined}
      />
    </FlowCtx.Provider>
  );
}

export function useAuthFlow() {
  const ctx = useContext(FlowCtx);
  if (!ctx) throw new Error("useAuthFlow must be used within AuthFlowProvider");
  return ctx;
}
