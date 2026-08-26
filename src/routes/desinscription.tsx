import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { heedupClient } from "@/config/heedupClient";

type TokenSearch = { token?: string };

export const Route = createFileRoute("/desinscription")({
  validateSearch: (search: Record<string, unknown>): TokenSearch => {
    const value = search["token"];
    return typeof value === "string" ? { token: value } : {};
  },
  head: () => ({
    meta: [
      { title: "Vos préférences d'envoi · HeedUp" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Gérez la réception du questionnaire hebdomadaire HeedUp.",
      },
      { property: "og:title", content: "Vos préférences d'envoi · HeedUp" },
      {
        property: "og:description",
        content: "Gérez la réception du questionnaire hebdomadaire HeedUp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesinscriptionPage,
});

const GENERIC_ERROR = "Une erreur est survenue. Réessayez dans quelques instants.";

function normalize(text: string) {
  return text.toLowerCase().trim().replace(/\.+$/, "");
}

function matches(message: string, known: string) {
  return normalize(message).includes(normalize(known));
}

type Screen =
  | { kind: "loading" }
  | { kind: "etat"; etat: "abonne" | "desinscrit" }
  | { kind: "invalid" }
  | { kind: "generic" };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="desinscription-root"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-main)",
        display: "flex",
        flexDirection: "column",
        padding: "28px 20px 32px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "620px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            fontStyle: "italic",
            color: "var(--midnight)",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          HeedUp
        </div>
        <div style={{ flex: 1, width: "100%" }}>{children}</div>
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <a
            href="/confidentialite"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12.5px",
              color: "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            Confidentialité
          </a>
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "var(--bg-card)",
  border: "1px solid rgba(107,114,128,0.25)",
  borderRadius: "14px",
  padding: "28px 24px",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "26px",
  color: "var(--midnight)",
  margin: "0 0 12px",
  letterSpacing: "-0.3px",
  lineHeight: 1.2,
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "15.5px",
  lineHeight: 1.65,
  color: "var(--text-primary)",
  margin: 0,
};

const secondaryButtonStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "15px",
  fontWeight: 600,
  color: "var(--midnight)",
  background: "transparent",
  border: "1.5px solid rgba(13,27,62,0.18)",
  borderRadius: "8px",
  padding: "14px 22px",
  width: "100%",
  cursor: "pointer",
  transition: "opacity 160ms ease",
};

function ToggleButton({
  label,
  disabled,
  onClick,
  compact,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...secondaryButtonStyle,
        ...(compact
          ? { padding: "10px 16px", fontSize: "13.5px", width: "auto" }
          : null),
        borderColor: hover && !disabled ? "var(--midnight)" : "rgba(13,27,62,0.18)",
        background: hover && !disabled ? "rgba(13,27,62,0.02)" : "transparent",
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {label}
    </button>
  );
}

function LoadingCard() {
  return (
    <div style={cardStyle} className="heedup-auth-skeleton">
      <div
        style={{
          height: "14px",
          borderRadius: "6px",
          background: "rgba(13,27,62,0.06)",
          marginBottom: "12px",
        }}
      />
      <div
        style={{
          height: "32px",
          borderRadius: "6px",
          background: "rgba(13,27,62,0.06)",
          marginBottom: "12px",
        }}
      />
      <div
        style={{
          height: "44px",
          borderRadius: "6px",
          background: "rgba(13,27,62,0.06)",
        }}
      />
    </div>
  );
}

function DesinscriptionPage() {
  const { token } = Route.useSearch();
  const [screen, setScreen] = useState<Screen>(token ? { kind: "loading" } : { kind: "invalid" });
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const call = useCallback(
    async (action: "statut" | "desinscrire" | "reabonner"): Promise<Screen> => {
      try {
        const { data, error } = await heedupClient.functions.invoke("unsubscribe", {
          body: { token, action },
        });

        let payload: { status?: string; etat?: string; message?: string } | null = null;

        if (error) {
          try {
            payload = await (error as { context: Response }).context.json();
          } catch {
            return { kind: "generic" };
          }
        } else {
          payload = data as typeof payload;
        }

        if (!payload || typeof payload !== "object") return { kind: "generic" };

        if (payload.status === "success") {
          if (payload.etat === "abonne" || payload.etat === "desinscrit") {
            return { kind: "etat", etat: payload.etat };
          }
          return { kind: "generic" };
        }

        if (payload.status === "error") {
          const message = typeof payload.message === "string" ? payload.message : "";
          if (matches(message, "Ce lien n'est pas valide")) return { kind: "invalid" };
          return { kind: "generic" };
        }

        return { kind: "generic" };
      } catch {
        return { kind: "generic" };
      }
    },
    [token],
  );

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      const next = await call("statut");
      if (!cancelled) setScreen(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [token, call]);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const retry = async () => {
    setPending(true);
    setErrorMessage(null);
    setScreen({ kind: "loading" });
    const next = await call("statut");
    setScreen(next);
    setPending(false);
  };

  const toggle = async (etat: "abonne" | "desinscrit") => {
    setPending(true);
    setErrorMessage(null);
    const next = await call(etat === "abonne" ? "desinscrire" : "reabonner");
    if (next.kind === "etat") {
      setScreen(next);
    } else {
      setErrorMessage(GENERIC_ERROR);
    }
    setPending(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrorMessage(GENERIC_ERROR);
    }
  };

  if (screen.kind === "loading") {
    return (
      <Shell>
        <LoadingCard />
      </Shell>
    );
  }

  if (screen.kind === "invalid") {
    return (
      <Shell>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Ce lien n'est pas valide.</h1>
          <p style={{ ...bodyStyle, color: "var(--text-muted)" }}>
            Vérifiez que vous avez copié l'adresse complète depuis votre email.
          </p>
        </div>
      </Shell>
    );
  }

  if (screen.kind === "generic") {
    return (
      <Shell>
        <div style={cardStyle}>
          <p style={{ ...bodyStyle, color: "var(--text-muted)", marginBottom: "20px" }}>
            {GENERIC_ERROR}
          </p>
          <ToggleButton label="Réessayer" disabled={pending} onClick={retry} />
        </div>
      </Shell>
    );
  }

  const abonne = screen.etat === "abonne";

  return (
    <Shell>
      <div style={cardStyle}>
        <h1 style={titleStyle}>
          {abonne
            ? "Vous recevez le questionnaire hebdomadaire"
            : "Vous ne recevez plus ces questionnaires"}
        </h1>

        {abonne ? (
          <>
            <p style={bodyStyle}>
              Chaque vendredi, vous recevez cinq questions sur votre semaine. Y répondre est
              facultatif.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                backgroundColor: "var(--indigo-pale)",
                borderRadius: "12px",
                padding: "16px 18px",
                margin: "20px 0",
              }}
            >
              <ShieldCheck
                size={20}
                strokeWidth={1.8}
                color="var(--indigo)"
                aria-hidden="true"
                style={{ flexShrink: 0, marginTop: "2px" }}
              />
              <p style={{ ...bodyStyle, fontSize: "14.5px" }}>
                Vos réponses sont anonymes : le lien entre votre réponse et votre identité est
                supprimé au moment de l'envoi. Votre manager reçoit uniquement des moyennes
                d'équipe, à partir de 5 réponses.
              </p>
            </div>

            <p style={{ ...bodyStyle, color: "var(--text-muted)", marginBottom: "24px" }}>
              Si vous vous désinscrivez, votre manager n'est pas informé de votre choix. Il peut
              voir combien de personnes se sont désinscrites, jamais lesquelles. Dans une petite
              équipe, ce nombre réduit le champ des possibles.
            </p>

            {errorMessage && (
              <p
                style={{
                  ...bodyStyle,
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  marginBottom: "12px",
                }}
              >
                {errorMessage}
              </p>
            )}

            <ToggleButton
              label={pending ? "Enregistrement…" : "Ne plus recevoir ces questionnaires"}
              disabled={pending}
              onClick={() => toggle("abonne")}
            />
          </>
        ) : (
          <>
            <p style={bodyStyle}>
              C'est effectif immédiatement. Vous ne recevrez plus le questionnaire du vendredi.
            </p>

            <div
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1.5px solid rgba(107,114,128,0.3)",
                borderRadius: "12px",
                padding: "16px 18px",
                margin: "20px 0 14px",
              }}
            >
              <p style={{ ...bodyStyle, fontSize: "14.5px" }}>
                Conservez cette adresse. Comme vous ne recevez plus d'email, ce lien est le seul
                moyen de revenir en arrière. Il reste valable indéfiniment, et il figure aussi au
                bas des emails que vous avez déjà reçus.
              </p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <ToggleButton
                compact
                label={copied ? "Lien copié" : "Copier le lien"}
                onClick={copyLink}
              />
            </div>

            {errorMessage && (
              <p
                style={{
                  ...bodyStyle,
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  marginBottom: "12px",
                }}
              >
                {errorMessage}
              </p>
            )}

            <ToggleButton
              label={pending ? "Enregistrement…" : "Recevoir à nouveau les questionnaires"}
              disabled={pending}
              onClick={() => toggle("desinscrit")}
            />
          </>
        )}
      </div>
    </Shell>
  );
}
