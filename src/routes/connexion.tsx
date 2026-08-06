import { useState } from "react";
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

function ConnexionPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
