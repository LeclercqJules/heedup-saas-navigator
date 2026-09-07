import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashTopBar } from "@/components/dashboard/DashNav";
import { subPrimaryButtonStyle, subSecondaryButtonStyle } from "@/components/dashboard/SubscriptionBanner";
import { createCheckoutSession, GENERIC_ERROR, openBillingPortalSession } from "@/lib/subscriptionApi";

export const Route = createFileRoute("/dashboard_/abonnement")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Abonnement · HeedUp" },
      { name: "description", content: "Choisissez la périodicité de votre abonnement HeedUp." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Abonnement · HeedUp" },
      { property: "og:description", content: "Abonnement HeedUp, mensuel ou annuel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AbonnementPage,
});

function AbonnementPage() {
  return (
    <AuthGuard>
      <AbonnementContent />
    </AuthGuard>
  );
}

type Feedback = { message: string; portal: boolean } | null;

function AbonnementContent() {
  const navigate = useNavigate();
  const [pending, setPending] = useState<"mensuel" | "annuel" | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [portalBusy, setPortalBusy] = useState(false);

  const choisir = async (periodicite: "mensuel" | "annuel") => {
    setPending(periodicite);
    setFeedback(null);
    const result = await createCheckoutSession(periodicite);

    if (!result.failed && result.status === "ok" && result.url) {
      window.location.href = result.url;
      return;
    }
    if (result.message.includes("terminez la création de votre espace")) {
      navigate({ to: "/onboarding" });
      return;
    }
    if (result.message.includes("déjà abonnée")) {
      setFeedback({ message: "Votre organisation est déjà abonnée.", portal: true });
      setPending(null);
      return;
    }
    if (result.message.includes("paiement est en cours de régularisation")) {
      setFeedback({ message: result.rawMessage, portal: true });
      setPending(null);
      return;
    }
    if (result.message.includes("n'est pas actif")) {
      setFeedback({ message: result.rawMessage, portal: false });
      setPending(null);
      return;
    }
    setFeedback({ message: GENERIC_ERROR, portal: false });
    setPending(null);
  };

  const ouvrirPortail = async () => {
    setPortalBusy(true);
    const result = await openBillingPortalSession();
    if (!result.failed && result.status === "ok" && result.url) {
      window.location.href = result.url;
      return;
    }
    if (result.message.includes("souscrivez pour accéder à vos factures")) {
      setFeedback({ message: "Vos factures seront disponibles dès votre première échéance.", portal: false });
      setPortalBusy(false);
      return;
    }
    if (result.message.includes("terminez la création de votre espace")) {
      navigate({ to: "/onboarding" });
      return;
    }
    setFeedback({ message: GENERIC_ERROR, portal: false });
    setPortalBusy(false);
  };

  const locked = pending !== null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      <DashTopBar />
      <div className="heedup-dash-wrap">
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "30px",
            color: "var(--midnight)",
            marginBottom: "8px",
          }}
        >
          Abonnement HeedUp
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            color: "var(--text-muted)",
            marginBottom: "28px",
          }}
        >
          Facturation au nombre de salariés, minimum 10 sièges.
        </p>

        <div className="heedup-sub-grid">
          <PlanCard
            titre="Mensuel"
            prix="À partir de 5,00 € par salarié et par mois"
            bouton="Choisir le mensuel"
            busy={pending === "mensuel"}
            disabled={locked}
            onClick={() => void choisir("mensuel")}
          />
          <PlanCard
            titre="Annuel"
            prix="À partir de 4,17 € par salarié et par mois"
            mention="Deux mois offerts"
            bouton="Choisir l'annuel"
            busy={pending === "annuel"}
            disabled={locked}
            onClick={() => void choisir("annuel")}
          />
        </div>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            lineHeight: 1.65,
            color: "var(--text-muted)",
            marginTop: "20px",
          }}
        >
          Le tarif par siège diminue à partir de 25, 50 et 100 salariés. Une équipe de moins de 10 salariés est
          facturée sur 10 sièges.
        </p>

        {feedback ? (
          <div
            style={{
              marginTop: "22px",
              background: "var(--bg-card)",
              border: "1px solid rgba(107,114,128,0.3)",
              borderRadius: "10px",
              padding: "14px 18px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14.5px",
                lineHeight: 1.65,
                color: "var(--text-primary)",
              }}
            >
              {feedback.message}
            </div>
            {feedback.portal ? (
              <div style={{ marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => void ouvrirPortail()}
                  disabled={portalBusy}
                  style={{
                    ...subSecondaryButtonStyle,
                    opacity: portalBusy ? 0.6 : 1,
                    cursor: portalBusy ? "default" : "pointer",
                  }}
                >
                  {portalBusy ? "Ouverture…" : "Gérer ma facturation"}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PlanCard({
  titre,
  prix,
  mention,
  bouton,
  busy,
  disabled,
  onClick,
}: {
  titre: string;
  prix: string;
  mention?: string;
  bouton: string;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: "14px",
        boxShadow: "0 1px 2px rgba(13,27,62,0.04), 0 8px 28px rgba(13,27,62,0.05)",
        padding: "26px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--midnight)" }}>{titre}</h2>
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "15px",
          lineHeight: 1.6,
          color: "var(--text-primary)",
        }}
      >
        {prix}
      </div>
      {mention ? (
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--indigo)" }}>
          {mention}
        </div>
      ) : null}
      <div style={{ marginTop: "12px" }}>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          style={{
            ...subPrimaryButtonStyle,
            width: "100%",
            textAlign: "center",
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? "default" : "pointer",
          }}
        >
          {busy ? "Redirection…" : bouton}
        </button>
      </div>
    </div>
  );
}
