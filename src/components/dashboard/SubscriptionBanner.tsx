import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import type { DashboardData } from "@/lib/dashboardData";
import {
  GENERIC_ERROR,
  openBillingPortalSession,
  readSubscriptionStatus,
} from "@/lib/subscriptionApi";

export const subPrimaryButtonStyle: CSSProperties = {
  display: "inline-block",
  background: "var(--indigo)",
  color: "#FFFFFF",
  fontFamily: "var(--font-sans)",
  fontSize: "14.5px",
  fontWeight: 700,
  border: "none",
  borderRadius: "8px",
  padding: "12px 22px",
  textDecoration: "none",
  cursor: "pointer",
  transition: "opacity 0.2s ease",
};

export const subSecondaryButtonStyle: CSSProperties = {
  display: "inline-block",
  background: "transparent",
  color: "var(--midnight)",
  fontFamily: "var(--font-sans)",
  fontSize: "14.5px",
  fontWeight: 600,
  border: "1.5px solid rgba(13,27,62,0.18)",
  borderRadius: "8px",
  padding: "11px 20px",
  textDecoration: "none",
  cursor: "pointer",
  transition: "opacity 0.2s ease",
};

const bannerTextStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "14.5px",
  lineHeight: 1.65,
  color: "var(--text-primary)",
  whiteSpace: "pre-line",
};

const infoBannerStyle: CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid rgba(107,114,128,0.3)",
  borderRadius: "10px",
  padding: "14px 18px",
  marginBottom: "20px",
};

const trialBannerStyle: CSSProperties = {
  background: "var(--indigo-pale)",
  borderLeft: "3px solid var(--indigo)",
  borderRadius: "0 10px 10px 0",
  padding: "14px 20px",
  marginBottom: "20px",
  fontFamily: "var(--font-sans)",
  fontSize: "14px",
  lineHeight: 1.5,
  color: "var(--text-primary)",
};

/** Ouvre le portail de facturation Stripe. Aucun payload n'est envoyé. */
function BillingPortalButton({ label = "Mettre à jour mon moyen de paiement" }: { label?: string }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const open = async () => {
    setBusy(true);
    setMessage(null);
    const result = await openBillingPortalSession();
    if (!result.failed && result.status === "ok" && result.url) {
      window.location.href = result.url;
      return;
    }
    if (result.message.includes("souscrivez pour accéder à vos factures")) {
      navigate({ to: "/dashboard/abonnement" });
      return;
    }
    if (result.message.includes("terminez la création de votre espace")) {
      navigate({ to: "/onboarding" });
      return;
    }
    setMessage(GENERIC_ERROR);
    setBusy(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={open}
        disabled={busy}
        style={{ ...subSecondaryButtonStyle, opacity: busy ? 0.6 : 1, cursor: busy ? "default" : "pointer" }}
      >
        {busy ? "Ouverture…" : label}
      </button>
      {message ? (
        <div style={{ ...bannerTextStyle, marginTop: "10px", color: "var(--text-muted)" }}>{message}</div>
      ) : null}
    </div>
  );
}

function SubscribeLink({ label }: { label: string }) {
  const navigate = useNavigate();
  return (
    <button type="button" style={subPrimaryButtonStyle} onClick={() => navigate({ to: "/dashboard/abonnement" })}>
      {label}
    </button>
  );
}

function ReturnBanner({ initialStatus }: { initialStatus: string | null }) {
  const navigate = useNavigate();
  const search = useRouterState({ select: (s) => s.location.search }) as { abonnement?: string };
  const flag = search?.abonnement;
  const [status, setStatus] = useState<string | null>(initialStatus);
  const [exhausted, setExhausted] = useState(false);
  const cleared = useRef(false);

  useEffect(() => {
    if (flag !== "ok") return;
    if (status === "active") return;
    let attempts = 0;
    let stopped = false;
    const id = window.setInterval(() => {
      attempts += 1;
      void readSubscriptionStatus().then((next) => {
        if (stopped) return;
        if (next) setStatus(next);
        if (next === "active" || attempts >= 5) {
          window.clearInterval(id);
          if (next !== "active") setExhausted(true);
        }
      });
    }, 3000);
    return () => {
      stopped = true;
      window.clearInterval(id);
    };
  }, [flag, status]);

  useEffect(() => {
    if (flag === "ok" && status === "active" && !cleared.current) {
      cleared.current = true;
      const timer = window.setTimeout(() => {
        navigate({ to: "/dashboard", search: {}, replace: true });
      }, 4000);
      return () => window.clearTimeout(timer);
    }
    if (flag === "annule" && !cleared.current) {
      cleared.current = true;
      const timer = window.setTimeout(() => {
        navigate({ to: "/dashboard", search: {}, replace: true });
      }, 6000);
      return () => window.clearTimeout(timer);
    }
    return;
  }, [flag, status, navigate]);

  if (flag === "annule") {
    return (
      <div style={{ ...infoBannerStyle }}>
        <div style={{ ...bannerTextStyle, color: "var(--text-muted)" }}>
          Souscription annulée. Vous pouvez reprendre quand vous voulez.
        </div>
      </div>
    );
  }

  if (flag !== "ok") return null;

  return (
    <div style={trialBannerStyle}>
      <div style={bannerTextStyle}>
        {status === "active"
          ? "Votre abonnement est actif. Merci."
          : exhausted
            ? "Paiement reçu. Votre abonnement est en cours d'activation, cela prend quelques instants. Rechargez la page dans un moment."
            : "Paiement reçu. Votre abonnement est en cours d'activation, cela prend quelques instants."}
      </div>
    </div>
  );
}

function TrialCounter({ reportCount }: { reportCount: number }) {
  if (reportCount < 1) return null;
  return (
    <div
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "13px",
        color: "var(--text-muted)",
        textAlign: "right",
        marginBottom: "20px",
      }}
    >
      {reportCount === 1
        ? "Premier rapport sur deux inclus dans votre essai"
        : "Deux rapports sur deux inclus dans votre essai"}
    </div>
  );
}

/** Bandeau d'abonnement. Il ne masque jamais le contenu du tableau de bord. */
export function SubscriptionBanner({ data }: { data: DashboardData }) {
  const status = data.subscriptionStatus;
  const count = data.reportCount ?? 0;

  const stateBanner = (() => {
    if (status === "past_due") {
      return (
        <div style={infoBannerStyle}>
          <div style={bannerTextStyle}>
            Un paiement n'a pas abouti. Vos questionnaires et vos rapports continuent normalement pendant la
            régularisation.
          </div>
          <div style={{ marginTop: "12px" }}>
            <BillingPortalButton />
          </div>
        </div>
      );
    }

    if (status === "canceled") {
      return (
        <div style={infoBannerStyle}>
          <div style={bannerTextStyle}>Votre abonnement est résilié. Vos rapports restent consultables.</div>
          <div style={{ marginTop: "12px" }}>
            <SubscribeLink label="Reprendre un abonnement" />
          </div>
        </div>
      );
    }

    if (status === "paused" || status === "orphaned") {
      return (
        <div style={infoBannerStyle}>
          <div style={bannerTextStyle}>Votre espace est suspendu. Écrivez-nous à contact@heedup.fr.</div>
        </div>
      );
    }

    if (status === "trial_expired") {
      if (count >= 2) {
        return (
          <div style={trialBannerStyle}>
            <div style={bannerTextStyle}>
              {"Votre essai est terminé. Plus aucun questionnaire ne sera envoyé à votre équipe et aucun nouveau rapport ne sera produit.\n\nVos deux rapports restent consultables ci-dessous."}
            </div>
            <div style={{ marginTop: "12px" }}>
              <SubscribeLink label="S'abonner" />
            </div>
          </div>
        );
      }
      if (count === 1) {
        return (
          <div style={trialBannerStyle}>
            <div style={bannerTextStyle}>
              {"Votre essai est terminé. Plus aucun questionnaire ne sera envoyé à votre équipe et aucun nouveau rapport ne sera produit.\n\nVotre rapport reste consultable ci-dessous."}
            </div>
            <div style={{ marginTop: "12px" }}>
              <SubscribeLink label="S'abonner" />
            </div>
          </div>
        );
      }
      return (
        <div style={trialBannerStyle}>
          <div style={bannerTextStyle}>
            {"Votre essai est terminé, mais aucun rapport n'a pu être produit : il faut au moins cinq réponses complètes sur une même semaine.\n\nÉcrivons-nous, on regarde ensemble ce qui a bloqué."}
          </div>
          <div style={{ marginTop: "12px" }}>
            <a href="mailto:contact@heedup.fr" style={subSecondaryButtonStyle}>
              Nous écrire
            </a>
          </div>
        </div>
      );
    }

    if (status === "trialing" && data.trialEndsAt) {
      return <TrialCounter reportCount={count} />;
    }

    return null;
  })();

  const sticky =
    status === "past_due" ||
    status === "canceled" ||
    status === "paused" ||
    status === "orphaned" ||
    status === "trial_expired";

  return (
    <>
      <ReturnBanner initialStatus={status} />
      {stateBanner ? (
        sticky ? (
          <div className="heedup-sticky-banner">{stateBanner}</div>
        ) : (
          stateBanner
        )
      ) : null}
    </>
  );
}
