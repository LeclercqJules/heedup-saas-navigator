import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { heedupClient } from "@/config/heedupClient";
import { AuthLoading } from "./AuthShell";

type Status = "loading" | "denied" | "ok";

export function SignOutButton() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={async () => {
        await heedupClient.auth.signOut();
        navigate({ to: "/connexion", replace: true });
      }}
      style={{
        background: "transparent",
        border: "1.5px solid var(--midnight)",
        color: "var(--midnight)",
        borderRadius: "8px",
        padding: "9px 18px",
        fontFamily: "var(--font-sans)",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Se déconnecter
    </button>
  );
}

export function AuthGuard({ children, requireAdmin = false }: { children: ReactNode; requireAdmin?: boolean }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await heedupClient.auth.getUser();
      if (cancelled) return;
      const u = data?.user ?? null;
      if (error || !u) {
        navigate({ to: "/connexion", replace: true });
        return;
      }
      setUser(u);
      const accountType = (u.app_metadata as Record<string, unknown> | undefined)?.["account_type"];
      if (requireAdmin && accountType !== "admin") {
        setStatus("denied");
        return;
      }
      setStatus("ok");
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, requireAdmin]);

  if (status === "loading") return <AuthLoading />;

  if (status === "denied") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-main)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "40px 5%",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "30px", color: "var(--midnight)" }}>
          Accès refusé
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)", maxWidth: "420px" }}>
          Votre compte n'a pas les droits nécessaires pour consulter cette page.
        </p>
        <SignOutButton />
      </div>
    );
  }

  return <>{children}</>;
}
