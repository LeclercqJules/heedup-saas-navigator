import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { heedupClient } from "@/config/heedupClient";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  AuthShell,
  authButtonStyle,
  authInputStyle,
  authLabelStyle,
  authErrorStyle,
} from "@/components/auth/AuthShell";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Créons votre espace · HeedUp" },
      { name: "description", content: "Créez l'espace de votre entreprise pour démarrer avec HeedUp." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Créons votre espace · HeedUp" },
      { property: "og:description", content: "Créez l'espace de votre entreprise sur HeedUp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OnboardingPage,
});

const GENERIC = "Une erreur est survenue. Réessayez dans quelques instants.";
const MAX = 100;

/** Correspondance tolérante : minuscules, point final retiré, sous-chaîne. */
function normalize(message: unknown): string {
  if (typeof message !== "string") return "";
  return message.toLowerCase().trim().replace(/\.+$/, "");
}

function OnboardingPage() {
  return (
    <AuthGuard allowMissingOrganization>
      <OnboardingForm />
    </AuthGuard>
  );
}

function OnboardingForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [closed, setClosed] = useState(false);

  const trimmed = name.trim();
  const disabled = trimmed.length === 0 || loading || blocked;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    setError(null);
    setLoading(true);
    try {
      const { data, error: invokeError } = await heedupClient.functions.invoke(
        "create-organization",
        { body: { organization_name: trimmed } },
      );

      if (invokeError) {
        setError(GENERIC);
        setLoading(false);
        return;
      }

      const payload = (data ?? {}) as { status?: string; message?: string };
      const msg = normalize(payload.message);

      if (payload.status === "success" || msg.includes("vous avez déjà une organisation")) {
        navigate({ to: "/dashboard", replace: true });
        return;
      }

      if (payload.status === "error" && msg.includes("pas encore ouverte")) {
        setClosed(true);
        setLoading(false);
        return;
      }

      if (msg.includes("administrateur")) {
        setError("Ce compte ne peut pas créer d'espace. Utilisez votre accès administrateur.");
        setBlocked(true);
        setLoading(false);
        return;
      }
      if (msg.includes("obligatoire")) {
        setError("Le nom de votre entreprise est obligatoire.");
        setLoading(false);
        return;
      }
      if (msg.includes("100 caractères")) {
        setError("Le nom ne doit pas dépasser 100 caractères.");
        setLoading(false);
        return;
      }
      if (msg.includes("compte introuvable")) {
        setError(GENERIC);
        await heedupClient.auth.signOut();
        navigate({ to: "/connexion", replace: true });
        return;
      }

      setError(GENERIC);
      setLoading(false);
    } catch {
      setError(GENERIC);
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Créons votre espace"
      subtitle="Une dernière étape avant d'accéder à vos rapports."
      footer={
        <>
          Une question ?{" "}
          <a href="mailto:contact@heedup.fr" style={{ color: "var(--indigo)", textDecoration: "underline" }}>
            contact@heedup.fr
          </a>
        </>
      }
    >
      <form onSubmit={submit}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="organization_name" style={authLabelStyle}>
            Nom de votre entreprise
          </label>
          <input
            id="organization_name"
            type="text"
            maxLength={MAX}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={authInputStyle}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              marginTop: "6px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "var(--text-muted)",
              }}
            >
              Il apparaîtra sur les questionnaires envoyés à votre équipe.
            </span>
            {name.length >= 80 && (
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {name.length} / {MAX}
              </span>
            )}
          </div>
        </div>

        {error && (
          <p role="alert" style={{ ...authErrorStyle, marginBottom: "14px" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={disabled} className="heedup-auth-primary" style={authButtonStyle}>
          {loading ? "Création en cours…" : "Créer mon espace"}
        </button>
      </form>
    </AuthShell>
  );
}

