import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { heedupClient } from "@/config/heedupClient";
import { AuthShell, authButtonStyle, authInputStyle, authLabelStyle } from "@/components/auth/AuthShell";
import { consumeRedirect } from "@/lib/redirectAfterLogin";

export const Route = createFileRoute("/connexion")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Connexion · HeedUp" },
      { name: "description", content: "Connectez-vous à votre espace HeedUp pour consulter vos rapports d'équipe." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Connexion · HeedUp" },
      { property: "og:description", content: "Connectez-vous à votre espace HeedUp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ConnexionPage,
});

function routeAfterLogin(accountType: unknown) {
  const stored = consumeRedirect();
  if (stored) return stored;
  return accountType === "admin" ? "/admin/conversations" : "/dashboard";
}

function ConnexionPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | null>(null);

  // Retour d'un fournisseur OAuth : la session est déjà posée par Supabase.
  useEffect(() => {
    let cancelled = false;
    void heedupClient.auth.getSession().then(({ data }) => {
      if (cancelled || !data.session) return;
      const accountType = (data.session.user.app_metadata as Record<string, unknown> | undefined)?.["account_type"];
      navigate({ to: routeAfterLogin(accountType), replace: true });
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const signInWithProvider = async (provider: "google") => {
    if (oauthLoading || loading) return;
    setError(null);
    setOauthLoading(provider);
    const { error: oauthError } = await heedupClient.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/connexion` },
    });
    if (oauthError) {
      setError("Connexion via ce fournisseur indisponible pour le moment.");
      setOauthLoading(null);
    }
  };


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const { data, error: signInError } = await heedupClient.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError || !data?.user) {
        setError("Email ou mot de passe incorrect.");
        setLoading(false);
        return;
      }
      const accountType = (data.user.app_metadata as Record<string, unknown> | undefined)?.["account_type"];
      const stored = consumeRedirect();
      if (stored) {
        navigate({ to: stored, replace: true });
        return;
      }
      navigate({ to: accountType === "admin" ? "/admin/conversations" : "/dashboard", replace: true });
    } catch {
      setError("Connexion impossible. Réessayez dans un instant.");
      setLoading(false);
    }
  };

  const providerButtonStyle = {
    width: "100%",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "1.5px solid var(--midnight)",
    background: "transparent",
    color: "var(--midnight)",
    fontFamily: "var(--font-sans)",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  } as const;

  return (
    <AuthShell title="Connexion">
      <form onSubmit={submit}>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="email" style={authLabelStyle}>
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--indigo)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(13,27,62,0.15)")}
            style={authInputStyle}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="password" style={authLabelStyle}>
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--indigo)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(13,27,62,0.15)")}
            style={authInputStyle}
          />
        </div>

        {error && (
          <p
            role="alert"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "#EF4444",
              marginBottom: "14px",
            }}
          >
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} style={{ ...authButtonStyle, opacity: loading ? 0.6 : 1, cursor: loading ? "default" : "pointer" }}>
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "20px", marginBottom: "20px" }}>
        <span style={{ flex: 1, height: "1px", background: "rgba(13,27,62,0.12)" }} />
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-muted)" }}>ou</span>
        <span style={{ flex: 1, height: "1px", background: "rgba(13,27,62,0.12)" }} />
      </div>

      <div style={{ display: "grid", gap: "10px" }}>
        <button
          type="button"
          onClick={() => void signInWithProvider("google")}
          disabled={oauthLoading !== null}
          style={{ ...providerButtonStyle, opacity: oauthLoading ? 0.6 : 1 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.94v2.33A9 9 0 0 0 9 18Z" />
            <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.94a9 9 0 0 0 0 8.1l3.03-2.33Z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .94 4.95l3.03 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
          </svg>
          {oauthLoading === "google" ? "Redirection..." : "Continuer avec Google"}
        </button>
        <button
          type="button"
          onClick={() => void signInWithProvider("apple")}
          disabled={oauthLoading !== null}
          style={{ ...providerButtonStyle, opacity: oauthLoading ? 0.6 : 1 }}
        >
          <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true" fill="currentColor">
            <path d="M13.2 9.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.6.8-3.3 2C1.4 9.2 2.4 13 3.8 15c.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.2-.8-2.2-3ZM11.1 3.3c.6-.7 1-1.7.9-2.7-.8 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6.9.1 1.9-.5 2.5-1.2Z" />
          </svg>
          {oauthLoading === "apple" ? "Redirection..." : "Continuer avec Apple"}
        </button>
      </div>

      <div style={{ marginTop: "18px", textAlign: "center" }}>
        <Link
          to="/reset-password"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "var(--text-muted)",
            textDecoration: "underline",
          }}
        >
          Mot de passe oublié ?
        </Link>
      </div>
    </AuthShell>
  );
}
