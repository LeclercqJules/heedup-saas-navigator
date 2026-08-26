import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { heedupClient } from "@/config/heedupClient";
import {
  AuthShell,
  authButtonStyle,
  authInputStyle,
  authLabelStyle,
  authErrorStyle,
} from "@/components/auth/AuthShell";
import { resolvePostLoginDestination, GENERIC_ERROR } from "@/lib/postLoginRoute";

type ConnexionSearch = {
  code?: string;
  error?: string;
  error_description?: string;
};

export const Route = createFileRoute("/connexion")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): ConnexionSearch => {
    const out: ConnexionSearch = {};
    if (typeof search["code"] === "string") out.code = search["code"];
    if (typeof search["error"] === "string") out.error = search["error"];
    if (typeof search["error_description"] === "string")
      out.error_description = search["error_description"];
    return out;
  },
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

function ConnexionPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | null>(null);

  // Retour d'un fournisseur OAuth : échange explicite du code (detectSessionInUrl: false).
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (search.error) {
        if (!cancelled) setError("Connexion impossible via ce fournisseur. Réessayez.");
        return;
      }
      try {
        if (search.code) {
          const { error: exchangeError } = await heedupClient.auth.exchangeCodeForSession(
            window.location.href,
          );
          if (cancelled) return;
          if (exchangeError) {
            setError(GENERIC_ERROR);
            return;
          }
        } else {
          const { data } = await heedupClient.auth.getSession();
          if (cancelled || !data.session) return;
        }
        const dest = await resolvePostLoginDestination();
        if (cancelled) return;
        if (dest.kind === "error") {
          setError(dest.message);
          return;
        }
        if (dest.to === "/connexion") return;
        navigate({ to: dest.to, replace: true });
      } catch {
        if (!cancelled) setError(GENERIC_ERROR);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, search.code, search.error]);

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
      const dest = await resolvePostLoginDestination();
      if (dest.kind === "error") {
        setError(dest.message);
        setLoading(false);
        return;
      }
      navigate({ to: dest.to, replace: true });
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
          <p role="alert" style={{ ...authErrorStyle, marginBottom: "14px" }}>
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
