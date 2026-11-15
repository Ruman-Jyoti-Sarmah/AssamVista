import { useMemo } from "react";
import { useAuth } from "@/store/AuthContext";
import { getPendingAuthAction, clearPendingAuthAction } from "@/lib/authFlow";
import AuthScreen from "@/components/auth/AuthScreen";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const pending = useMemo(() => getPendingAuthAction(), []);

  if (isAuthenticated) {
    const target = pending?.returnHash || "#/account";
    if (pending) clearPendingAuthAction();
    window.location.hash = target;
  }

  return <AuthScreen initialMode="login" />;
}
