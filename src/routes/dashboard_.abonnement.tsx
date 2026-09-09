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
type Confirmation = { periodicite: "mensuel" | "annuel"; quantite: number; url: string } | null;

const INCLUS = [
  "Un questionnaire anonyme envoyé chaque vendredi à votre équipe",
  "Un rapport d'équipe chaque lundi, avec cinq scores et leur évolution",
  "Deux à trois recommandations managériales par rapport",
  "Historique complet, sans limite de durée",
  "Résiliation à tout moment depuis votre espace",
];

function AbonnementContent() {
  const navigate = useNavigate();
  const [pending, setPending] = useState<"mensuel" | "annuel" | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [portalBusy, setPortalBusy] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation>(null);

  const choisir = async (periodicite: "mensuel" | "annuel") => {
    setPending(periodicite);
    setFeedback(null);
    const result = await createCheckoutSession(periodicite);

    if (!result.failed && result.status === "ok" && result.url) {
      if (result.quantite === null) {
        window.location.href = result.url;
        return;
      }
      setConfirmation({ periodicite, quantite: result.quantite, url: result.url });
      setPending(null);
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
            marginBottom: "24px",
          }}
        >
          Facturation au nombre de salariés, minimum 10 sièges.
        </p>

        <div className="heedup-sub-list">
          {INCLUS.map((ligne) => (
            <div key={ligne} className="heedup-sub-list-item">
              <span aria-hidden="true" />
              <div>{ligne}</div>
            </div>
          ))}
        </div>

        <div className="heedup-sub-grid">
          <PlanCard
            titre="Mensuel"
            prix="À partir de 5,00 €"
            bouton="Choisir le mensuel"
            busy={pending === "mensuel"}
            disabled={locked}
            onClick={() => void choisir("mensuel")}
          />
          <PlanCard
            titre="Annuel"
            prix="À partir de 4,17 €"
            badge="Deux mois offerts"
            bouton="Choisir l'annuel"
            busy={pending === "annuel"}
            disabled={locked}
            onClick={() => void choisir("annuel")}
          />
        </div>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            lineHeight: 1.65,
            color: "var(--text-primary)",
            marginTop: "22px",
          }}
        >
          Le nombre de sièges correspond à vos salariés actifs, avec un minimum de 10. Il est recalculé automatiquement
          avant chaque échéance : vous n'avez rien à ajuster.
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            lineHeight: 1.65,
            color: "var(--text-muted)",
            marginTop: "10px",
          }}
        >
          Vous pouvez modifier les adresses email de votre équipe à tout moment sans changer votre facturation. Si un
          salarié quitte l'entreprise, remplacez simplement son adresse : aucun siège supplémentaire n'est nécessaire.
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            lineHeight: 1.65,
            color: "var(--text-muted)",
            marginTop: "6px",
          }}
        >
          Le tarif par siège diminue à partir de 25, 50 et 100 salariés.
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

      {confirmation ? (
        <ConfirmationModal
          confirmation={confirmation}
          onCancel={() => setConfirmation(null)}
          onContinue={() => {
            window.location.href = confirmation.url;
          }}
        />
      ) : null}
    </div>
  );
}

function ConfirmationModal({
  confirmation,
  onCancel,
  onContinue,
}: {
  confirmation: NonNullable<Confirmation>;
  onCancel: () => void;
  onContinue: () => void;
}) {
  const sieges =
    confirmation.quantite === 1
      ? "1 siège facturé, sur la base de vos salariés actifs."
      : `${confirmation.quantite} sièges facturés, sur la base de vos salariés actifs.`;
  const formule =
    confirmation.periodicite === "mensuel" ? "Formule mensuelle" : "Formule annuelle, deux mois offerts";

  return (
    <div className="heedup-modal-overlay" role="dialog" aria-modal="true" aria-label="Confirmer votre abonnement">
      <div className="heedup-modal-card">
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "24px",
            color: "var(--midnight)",
            marginBottom: "14px",
          }}
        >
          Confirmer votre abonnement
        </h2>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            lineHeight: 1.65,
            color: "var(--text-primary)",
          }}
        >
          {sieges}
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            lineHeight: 1.65,
            color: "var(--text-muted)",
            marginTop: "12px",
          }}
        >
          {formule}
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            lineHeight: 1.65,
            color: "var(--text-muted)",
            marginTop: "6px",
          }}
        >
          Le montant exact s'affiche sur la page de paiement sécurisée.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "22px" }}>
          <button type="button" style={subPrimaryButtonStyle} onClick={onContinue}>
            Continuer vers le paiement
          </button>
          <button type="button" style={subSecondaryButtonStyle} onClick={onCancel}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  titre,
  prix,
  badge,
  bouton,
  busy,
  disabled,
  onClick,
}: {
  titre: string;
  prix: string;
  badge?: string;
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
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--midnight)" }}>{titre}</h2>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--midnight)" }}>{prix}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)" }}>
        par salarié et par mois
      </div>
      {badge ? (
        <div>
          <span
            style={{
              display: "inline-block",
              background: "var(--indigo-pale)",
              color: "var(--indigo)",
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              fontWeight: 600,
              borderRadius: "6px",
              padding: "4px 10px",
            }}
          >
            {badge}
          </span>
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
