import { useMemo } from "react";
import { useAuth } from "@/store/AuthContext";
import { getPendingAuthAction, clearPendingAuthAction } from "@/lib/authFlow";
import AuthPage from "@/components/auth/AuthPage";

export default function SignupPage() {
  const { isAuthenticated } = useAuth();
  const pending = useMemo(() => getPendingAuthAction(), []);

  if (isAuthenticated) {
    const target = pending?.returnHash || "#/account";
    if (pending) clearPendingAuthAction();
    window.location.hash = target;
  }

  return <AuthPage />;
}
