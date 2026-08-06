import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { heedupClient } from "@/config/heedupClient";
import { AuthShell, authButtonStyle, authInputStyle, authLabelStyle } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Réinitialiser votre mot de passe · HeedUp" },
      { name: "description", content: "Recevez un lien de réinitialisation pour votre compte HeedUp." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Réinitialiser votre mot de passe · HeedUp" },
      { property: "og:description", content: "Recevez un lien de réinitialisation pour votre compte HeedUp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await heedupClient.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSent(true);
    } catch {
      setError("Connexion impossible. Réessayez dans un instant.");
    }
    setLoading(false);
  };

  return (
    <AuthShell
      title="Mot de passe oublié"
      subtitle="Saisissez votre adresse email, nous vous enverrons un lien de réinitialisation."
    >
      {sent ? (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.6 }}>
          Si un compte existe avec cette adresse, un lien de réinitialisation vient d'être envoyé.
        </p>
      ) : (
        <form onSubmit={submit}>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="reset-email" style={authLabelStyle}>
              Email
            </label>
            <input
              id="reset-email"
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
          {error && (
            <p role="alert" style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#EF4444", marginBottom: "14px" }}>
              {error}
            </p>
          )}
          <button type="submit" disabled={loading} style={{ ...authButtonStyle, opacity: loading ? 0.6 : 1, cursor: loading ? "default" : "pointer" }}>
            {loading ? "Envoi en cours..." : "Envoyer le lien"}
          </button>
        </form>
      )}

      <div style={{ marginTop: "18px", textAlign: "center" }}>
        <Link to="/connexion" style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-muted)", textDecoration: "underline" }}>
          Retour à la connexion
        </Link>
      </div>
    </AuthShell>
  );
}
