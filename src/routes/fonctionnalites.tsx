import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Send,
  Brain,
  EyeOff,
  LineChart,
  ShieldCheck,
  Rocket,
  Mail,
  Key,
  BarChart3,
  User,
  FileText,
  ListChecks,
  Users,
  Check,
  X,
  Unplug,
  Inbox,
  Target,
  Wallet,
  Lock,
  CalendarCheck,
  RefreshCw,
  Timer,
} from "lucide-react";
import {
  IconShieldCheck,
  IconEyeOff,
  IconDatabase,
  IconClock,
  IconFileText,
} from "@tabler/icons-react";
import { SiteLayout } from "@/components/SiteLayout";
import { RapportCard } from "@/components/RapportCard";
import { useTallyCount } from "@/hooks/useTallyCount";


export const Route = createFileRoute("/fonctionnalites")({
  head: () => ({
    meta: [
      { title: "Fonctionnalités : ce que HeedUp fait, précisément" },
      {
        name: "description",
        content:
          "5 questions hebdomadaires, recommandations IA, anonymat architectural, RGPD, onboarding en 10 minutes. Chaque mécanisme expliqué.",
      },
      { property: "og:title", content: "Fonctionnalités HeedUp" },
      {
        property: "og:description",
        content:
          "Explication précise de chaque mécanisme HeedUp, pour que vous compreniez ce que vous achetez.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

type TabId = "q12" | "ai" | "anon" | "dash" | "rgpd" | "onboard";

type Feature = {
  id: TabId;
  label: string;
  Icon: typeof Send;
  tag: string;
  title: string;
  lead: string;
  rest?: string;
  detail: { label: string; text: string };
  bullets?: string[];
};

const features: Feature[] = [
  {
    id: "q12",
    label: "5 questions hebdomadaires",
    Icon: Send,
    tag: "Questions hebdomadaires",
    title: "5 questions. Pas 50.",
    lead: "Les 5 questions couvrent cinq dimensions retenues sur deux critères : prédictives du départ, et actionnables par un manager sans formation RH dans la semaine.",
    rest: "Charge de travail, reconnaissance, clarté, soutien, sens. Elles ne changent pas d'une semaine à l'autre, ce qui permet de mesurer des tendances réelles.",
    detail: {
      label: "Pourquoi des questions fixes ?",
      text: "Des questions identiques d'une semaine à l'autre permettent de comparer les données dans le temps. Des questions qui changent donneraient une photo ponctuelle, pas une tendance.",
    },
    bullets: [
      "Opt-in volontaire : chaque salarié confirme sa participation avant le premier survey",
      "Réponse sur téléphone ou ordinateur, sans compte",
      "Un champ libre facultatif en fin de questionnaire, jamais transmis tel quel",
      "Vous voyez le nombre de participants, jamais leur identité",
    ],
  },
  {
    id: "ai",
    label: "Recommandations IA",
    Icon: Brain,
    tag: "IA actionnable",
    title: "3 types de recommandations. Toujours contextualisées.",
    lead: "Le Rapport d'équipe ne liste pas des scores.",
    rest: "Il interprète les tendances et génère 2 à 3 recommandations selon le contexte de la semaine. Chaque recommandation appartient à l'un de ces 3 types, définis par l'IA en fonction du signal détecté.",
    detail: {
      label: "Ce que l'IA analyse",
      text: "Score absolu de la semaine, delta vs semaine N-1, tendance sur 3 semaines, taux de réponse et présence de silences. La recommandation combine ces signaux, pas juste le dernier score.",
    },
  },
  {
    id: "anon",
    label: "Anonymat architectural",
    Icon: EyeOff,
    tag: "Anonymat",
    title: "Ce que vous ne pouvez pas voir. Même si vous le voulez.",
    lead: "L'anonymat de HeedUp est une contrainte d'architecture, pas un paramètre.",
    rest: "La participation est volontaire : vos salariés choisissent de rejoindre, ce qui renforce la qualité des réponses. Le système ne stocke jamais de lien entre une réponse et un salarié. Techniquement, même si vous demandiez à notre équipe qui a répondu quoi, nous ne pourrions pas vous répondre.",
    detail: {
      label: "Seuil de protection statistique",
      text: "Si moins de 5 salariés ont répondu cette semaine, aucun score n'est affiché. Ce seuil protège l'anonymat dans les petites équipes où un score pourrait trahir un répondant.",
    },
    bullets: [
      "Token UUID aléatoire régénéré chaque semaine",
      "Impossible de tracer un salarié dans le temps",
      "Vous voyez uniquement des scores agrégés",
    ],
  },
  {
    id: "dash",
    label: "Tableau de bord",
    Icon: LineChart,
    tag: "Tableau de bord",
    title: "L'historique pour comprendre. Le rapport lundi pour agir.",
    lead: "Le Rapport d'équipe du lundi est votre outil d'action.",
    rest: "Le tableau de bord est votre outil de compréhension. Quand un score descend, le dashboard vous permet de voir si c'est un accident ou une tendance installée depuis 3 semaines.",
    detail: {
      label: "Alerte automatique",
      text: "Si un score passe sous 3/5 deux semaines consécutives, une alerte est générée automatiquement dans votre rapport. Vous n'avez pas à surveiller le dashboard, il vous prévient.",
    },
    bullets: [
      "Historique consultable sur 12 semaines",
      "Courbes de tendance par dimension (charge de travail, reconnaissance, clarté, soutien, sens)",
      "Taux de réponse semaine par semaine",
    ],
  },
  {
    id: "rgpd",
    label: "RGPD et données",
    Icon: ShieldCheck,
    tag: "RGPD et données",
    title: "Conforme RGPD. Hébergé en France.",
    lead: "HeedUp est conçu pour être conforme au RGPD par architecture, pas par paramètre.",
    rest: "Les données de vos salariés sont hébergées en France, minimisées au strict nécessaire, et l'anonymat est garanti par conception. La documentation contractuelle est disponible sur demande.",
    detail: {
      label: "CE QUI EST COLLECTÉ. RIEN D'AUTRE.",
      text: "Scores numériques de 1 à 5 et token aléatoire non-traçable. Aucune donnée nominative, aucun commentaire libre, aucune donnée de profil salarié.",
    },
    bullets: [
      "Hébergement exclusivement en France",
      "Aucune donnée nominative côté salariés",
      "Durée de conservation : 12 mois glissants",
      "Documentation RGPD disponible sur demande",
    ],
  },
  {
    id: "onboard",
    label: "Onboarding et support",
    Icon: Rocket,
    tag: "Onboarding et support",
    title: "10 minutes. Pas 10 semaines.",
    lead: "Aucun projet informatique, aucune intégration SIRH, aucun déploiement.",
    rest: "Vous importez les emails de votre équipe, vous activez, le premier survey part vendredi. Le support est inclus dans tous les plans, pas derrière un plan Premium.",
    detail: {
      label: "Support humain, pas de chatbot",
      text: "Réponse par email sous 24h ouvrées, en français, par une vraie personne qui connaît votre compte. Pas de ticket automatique, pas de FAQ obligatoire avant d'écrire.",
    },
  },
];

const tabs = features.map(({ id, label, Icon }) => ({ id, label, Icon }));


// -------- shared panel styles --------
const leftColStyle: React.CSSProperties = {
  padding: "36px 32px",
  background: "var(--bg-card)",
  borderRight: "1px solid rgba(67,56,202,0.08)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "16px",
};
const rightColStyle: React.CSSProperties = {
  padding: "28px",
  background: "var(--bg-main)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const tagStyle: React.CSSProperties = {
  background: "var(--midnight)",
  color: "#EEEEFF",
  fontSize: "10px",
  textTransform: "uppercase",
  fontWeight: 700,
  letterSpacing: "0.6px",
  padding: "4px 10px",
  borderRadius: "4px",
  alignSelf: "flex-start",
};
const titleStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "26px",
  color: "var(--midnight)",
  lineHeight: 1.2,
  letterSpacing: "-0.3px",
};
const descStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "13.5px",
  color: "var(--text-primary)",
  lineHeight: 1.7,
};
const boxStyle: React.CSSProperties = {
  background: "#EEEEFF",
  borderRadius: "8px",
  padding: "12px 14px",
  borderLeft: "3px solid var(--indigo)",
};
const boxLabelStyle: React.CSSProperties = {
  fontSize: "10px",
  textTransform: "uppercase",
  fontWeight: 700,
  letterSpacing: "0.6px",
  color: "var(--indigo)",
  marginBottom: "4px",
};
const boxTextStyle: React.CSSProperties = {
  fontSize: "12.5px",
  color: "var(--midnight)",
  lineHeight: 1.5,
};

function Bullets({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {items.map((t) => (
        <div
          key={t}
          style={{
            display: "flex",
            gap: "8px",
            fontSize: "12.5px",
            color: "rgba(13,27,62,0.75)",
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: "#7A9B8E", fontWeight: 700 }}>✓</span>
          <span>{t}</span>
        </div>
      ))}
    </div>
  );
}

function Detail({ label, text }: { label: string; text: string }) {
  return (
    <div style={boxStyle}>
      <div style={boxLabelStyle}>{label}</div>
      <div style={boxTextStyle}>{text}</div>
    </div>
  );
}

// ---------- Panel visuals ----------

function VisualQ12() {
  const scale = [1, 2, 3, 4, 5];
  const cardBase: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1px solid rgba(67,56,202,0.10)",
    borderRadius: "10px",
    padding: "14px 16px",
    width: "100%",
    maxWidth: "340px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", alignItems: "center" }}>
      <div style={cardBase}>
        <div style={{ fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.6px", color: "rgba(13,27,62,0.35)", fontWeight: 700 }}>
          Question 1 sur 5
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ background: "#EEEEFF", color: "var(--indigo)", fontSize: "9.5px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>
            Dimension : Charge de travail
          </span>
          <span style={{ fontSize: "10px", color: "var(--indigo)" }}>🔒 Réponse anonyme</span>
        </div>
        <div style={{ fontSize: "13.5px", color: "var(--midnight)", fontWeight: 600, lineHeight: 1.4 }}>
          Cette semaine, ma charge de travail était à un niveau que je peux tenir dans la durée.
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {scale.map((n) => (
            <div
              key={n}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 0",
                borderRadius: "6px",
                background: n === 3 ? "var(--indigo)" : "#F8F9FF",
                color: n === 3 ? "#FFFFFF" : "var(--midnight)",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...cardBase, opacity: 0.6 }}>
        <div style={{ fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.6px", color: "rgba(13,27,62,0.35)", fontWeight: 700 }}>
          Question 2 sur 5
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ background: "#EEEEFF", color: "var(--indigo)", fontSize: "9.5px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>
            Dimension : relation managériale
          </span>
        </div>
        <div style={{ fontSize: "13.5px", color: "var(--midnight)", fontWeight: 600, lineHeight: 1.4 }}>
          Sentez-vous que votre travail est reconnu cette semaine ?
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {scale.map((n) => (
            <div key={n} style={{ flex: 1, textAlign: "center", padding: "8px 0", borderRadius: "6px", background: "#F8F9FF", fontSize: "12px", color: "var(--midnight)", fontWeight: 600 }}>
              {n}
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center" }}>
        + 3 questions · 2 minutes au total
      </div>
    </div>
  );
}

function RecoCard({
  bg,
  border,
  iconBg,
  symbol,
  title,
  text,
  symbolColor = "#FFFFFF",
}: {
  bg: string;
  border: string;
  iconBg: string;
  symbol: string;
  title: string;
  text: string;
  symbolColor?: string;
}) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: "9px", padding: "12px 14px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
      <div style={{ width: "22px", height: "22px", borderRadius: "5px", background: iconBg, color: symbolColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", flexShrink: 0 }}>
        {symbol}
      </div>
      <div>
        <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--midnight)", marginBottom: "3px" }}>{title}</div>
        <div style={{ fontSize: "10.5px", color: "var(--text-muted)", lineHeight: 1.5 }}>{text}</div>
      </div>
    </div>
  );
}

function VisualAI() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "360px" }}>
      <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.6px", color: "rgba(13,27,62,0.4)", fontWeight: 700, marginBottom: "4px" }}>
        3 types de recommandations
      </div>
      <RecoCard bg="rgba(239,68,68,0.06)" border="rgba(239,68,68,0.18)" iconBg="var(--semantic-red)" symbol="!" title="Reconnaissance en baisse 2 semaines" text="Prenez 10 minutes pour un retour individuel à chacun avant vendredi." />
      <RecoCard bg="rgba(34,197,94,0.06)" border="rgba(34,197,94,0.18)" iconBg="var(--semantic-green)" symbol="↑" title="Clarté en hausse" text="Le point de lundi dernier a eu de l'effet, gardez ce format." />
      <RecoCard bg="rgba(67,56,202,0.06)" border="rgba(67,56,202,0.18)" iconBg="var(--indigo)" symbol="·" title="Détection de silence" text="3 employés n'ont pas répondu cette semaine. Le silence est aussi un signal. Envoyez un rappel discret avant vendredi." />
    </div>
  );
}

function AnonRow({
  Icon,
  title,
  sub,
  badge,
  badgeColor,
  dim = false,
  strike = false,
}: {
  Icon: typeof Mail;
  title: string;
  sub: string;
  badge: string;
  badgeColor: "green" | "red";
  dim?: boolean;
  strike?: boolean;
}) {
  const badgeStyles: React.CSSProperties =
    badgeColor === "green"
      ? { background: "rgba(34,197,94,0.10)", color: "#15803d" }
      : { background: "rgba(239,68,68,0.10)", color: "#991b1b" };
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center", background: "#FFFFFF", borderRadius: "8px", padding: "11px 14px", border: "1px solid rgba(67,56,202,0.10)", opacity: dim ? 0.4 : 1 }}>
      <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "var(--midnight)", color: "#EEEEFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={14} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--midnight)", textDecoration: strike ? "line-through" : "none" }}>{title}</div>
        <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "1px" }}>{sub}</div>
      </div>
      <span style={{ ...badgeStyles, fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px", whiteSpace: "nowrap" }}>{badge}</span>
    </div>
  );
}

function VisualAnon() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "380px" }}>
      <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.6px", color: "rgba(13,27,62,0.4)", fontWeight: 700, marginBottom: "4px" }}>
        Comment l'anonymat est garanti
      </div>
      <AnonRow Icon={Mail} title="Email du salarié" sub="Utilisé uniquement pour l'envoi" badge="✓ Jamais stocké" badgeColor="green" />
      <AnonRow Icon={Key} title="Token UUID aléatoire" sub="Lien unique, régénéré chaque vendredi" badge="✓ Non traçable" badgeColor="green" />
      <AnonRow Icon={BarChart3} title="Score agrégé uniquement" sub="Ce que vous voyez dans le rapport" badge="✓ Anonymisé" badgeColor="green" />
      <AnonRow Icon={User} title="Identité du répondant" sub="Inaccessible par conception" badge="✕ Impossible" badgeColor="red" dim strike />
    </div>
  );
}

function VisualDashboard() {
  return (
    <div style={{ width: "100%" }}>
      <div style={{
        background: "white",
        borderRadius: 10,
        border: "1px solid rgba(67,56,202,0.10)",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          background: "var(--midnight)",
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{ fontSize: 11, color: "white", fontWeight: 500 }}>
            Tableau de bord · Semaines 20-24
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            Charge de travail
          </span>
        </div>
        {/* Chart */}
        <div style={{ padding: "16px 14px 8px" }}>
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            height: 80,
            marginBottom: 8
          }}>
            <div style={{
              flex: 1, height: "80%",
              background: "var(--indigo)",
              borderRadius: "3px 3px 0 0"
            }} />
            <div style={{
              flex: 1, height: "72%",
              background: "var(--indigo)",
              borderRadius: "3px 3px 0 0"
            }} />
            <div style={{
              flex: 1, height: "60%",
              background: "rgba(67,56,202,0.35)",
              borderRadius: "3px 3px 0 0"
            }} />
            <div style={{
              flex: 1, height: "50%",
              background: "rgba(239,68,68,0.35)",
              borderRadius: "3px 3px 0 0"
            }} />
            <div style={{
              flex: 1, height: "42%",
              background: "var(--semantic-red)",
              borderRadius: "3px 3px 0 0",
              opacity: 0.7
            }} />
          </div>
          {/* Labels */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12
          }}>
            {["S20", "S21", "S22", "S23"].map(w => (
              <span key={w} style={{ fontSize: 10, color: "#6B7280" }}>{w}</span>
            ))}
            <span style={{
              fontSize: 10,
              color: "var(--semantic-red)",
              fontWeight: 600
            }}>S24</span>
          </div>
          {/* Alert */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.15)",
            borderRadius: 6,
            padding: "8px 10px"
          }}>
            <div style={{
              width: 16, height: 16,
              borderRadius: "50%",
              background: "var(--semantic-red)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 700,
              flexShrink: 0
            }}>!</div>
            <span style={{
              fontSize: 11,
              color: "#991b1b",
              fontWeight: 600
            }}>
              Reconnaissance en baisse depuis 3 semaines.
              Tendance à surveiller.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocCard({ Icon, title, sub }: { Icon: typeof FileText; title: string; sub: string }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "#FFFFFF", border: "1px solid rgba(67,56,202,0.10)", padding: "11px 14px", borderRadius: "8px" }}>
      <div style={{ width: "32px", height: "32px", borderRadius: "7px", background: "var(--midnight)", color: "#EEEEFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={16} />
      </div>
      <div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--midnight)", marginBottom: "3px" }}>{title}</div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.5 }}>{sub}</div>
      </div>
    </div>
  );
}

function ComplianceItem({ Icon, title, sub }: { Icon: typeof IconShieldCheck; title: string; sub: string }) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center", background: "#FFFFFF", border: "1px solid rgba(67,56,202,0.10)", borderRadius: "8px", padding: "9px 12px" }}>
      <div style={{ width: "20px", height: "20px", borderRadius: "5px", background: "var(--indigo)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={12} stroke={2.5} />
      </div>
      <div>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--midnight)" }}>{title}</div>
        <div style={{ fontSize: "10.5px", color: "var(--text-muted)", lineHeight: 1.45 }}>{sub}</div>
      </div>
    </div>
  );
}

function VisualRgpd() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "380px" }}>
      <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.6px", color: "rgba(13,27,62,0.4)", fontWeight: 700, marginBottom: "8px" }}>
        Conformité HeedUp
      </div>
      <ComplianceItem Icon={IconShieldCheck} title="Hébergement en France" sub="Serveurs région Paris" />
      <ComplianceItem Icon={IconEyeOff} title="Anonymat architectural" sub="Réponses non-traçables par conception" />
      <ComplianceItem Icon={IconDatabase} title="Données minimisées" sub="Scores 1-5 uniquement, aucune donnée sensible" />
      <ComplianceItem Icon={IconClock} title="Conservation limitée" sub="12 mois glissants, puis suppression" />
      <ComplianceItem Icon={IconFileText} title="Documentation sur demande" sub="DPA et registre disponibles sur demande" />
    </div>
  );
}


function OnboardStep({ n, title, sub, time }: { n: number; title: string; sub: string; time: string }) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center", background: "#FFFFFF", borderRadius: "8px", border: "1px solid rgba(67,56,202,0.10)", padding: "11px 14px" }}>
      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--midnight)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>
        {n}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--midnight)" }}>{title}</div>
        <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "1px" }}>{sub}</div>
      </div>
      <span style={{ background: "rgba(67,56,202,0.12)", color: "var(--indigo)", fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", whiteSpace: "nowrap" }}>{time}</span>
    </div>
  );
}

function VisualOnboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "400px" }}>
      <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.6px", color: "rgba(13,27,62,0.4)", fontWeight: 700, marginBottom: "2px" }}>
        Processus de démarrage complet
      </div>
      <OnboardStep n={1} title="Création du compte" sub="Email et mot de passe" time="60 sec" />
      <OnboardStep n={2} title="Import de l'équipe" sub="CSV ou saisie manuelle" time="5 min" />
      <OnboardStep n={3} title="Activation du survey" sub="Jour, heure, confirmation" time="2 min" />
      <OnboardStep n={4} title="Paiement" sub="Stripe sécurisé, sans engagement annuel" time="2 min" />
      <div style={{ display: "flex", gap: "10px", alignItems: "center", background: "var(--midnight)", borderRadius: "8px", padding: "11px 14px" }}>
        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--indigo)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Check size={14} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#EEEEFF" }}>Live ce vendredi</div>
          <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.45)", marginTop: "1px" }}>Premier survey envoyé automatiquement</div>
        </div>
        <span style={{ background: "rgba(67,56,202,0.2)", color: "var(--indigo)", fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px" }}>~10 min</span>
      </div>
    </div>
  );
}

// ---------- Panels ----------

function Panel({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      className="feature-panel"
      style={{
        display: visible ? "grid" : "none",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "340px",
      }}
    >
      {children}
    </div>
  );
}

// ---------- Spotlight card ----------

// ---------- Page ----------

function Page() {
  const [active, setActive] = useState<TabId>("q12");
  const count = useTallyCount();

  return (
    <SiteLayout>
      {/* Section 1 : Hero */}
      <section style={{ background: "var(--bg-main)", padding: "56px 5% 48px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: "1px", color: "var(--midnight)", opacity: 0.35, marginBottom: "12px" }}>
          Fonctionnalités
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "52px", color: "var(--midnight)", letterSpacing: "-1px", lineHeight: 1.08, marginBottom: "14px" }}>
          Ce que HeedUp fait.
          <br />
          <em style={{ color: "var(--indigo)", fontStyle: "italic" }}>Et comment il le fait.</em>
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-muted)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.6 }}>
          Pas un tour de fonctionnalités, une explication précise de chaque mécanisme, pour que vous compreniez exactement ce que vous achetez avant de vous inscrire.
        </p>
      </section>

      {/* Section 2 : Feature Explorer */}
      <section id="fonctionnalites" className="fade-up" style={{ background: "var(--bg-card)", padding: "52px 5%", borderTop: "1px solid rgba(67,56,202,0.08)" }}>
        <style>{`
          .feature-tab {
            transition: all 0.15s;
          }
          .feature-tab:not(.active):hover {
            border-color: rgba(67,56,202,0.4) !important;
          }
        `}</style>
        <div className="heedup-feature-tabs" style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
          {tabs.map(({ id, label, Icon }) => {
            const isActive = id === active;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={`feature-tab ${isActive ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: `1.5px solid ${isActive ? "var(--midnight)" : "rgba(13,27,62,0.25)"}`,
                  background: isActive ? "var(--midnight)" : "var(--bg-card)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: isActive ? "#EEEEFF" : "var(--midnight)",
                  cursor: "pointer",
                  boxShadow: isActive ? "none" : "0 1px 4px rgba(13,27,62,0.08)",
                }}
              >
                <Icon size={14} color="var(--indigo)" />
                {label}
              </button>
            );
          })}
        </div>

        <div style={{ background: "var(--bg-main)", borderRadius: "14px", border: "1px solid rgba(67,56,202,0.10)", overflow: "hidden" }}>
          {/* Panel 1 : Q12 */}
          <Panel visible={active === "q12"}>
            <div style={leftColStyle}>
              <span style={tagStyle}>Questions hebdomadaires</span>
              <h2 style={titleStyle}>5 questions. Pas 50.</h2>
              <p style={descStyle}>
                Les 5 questions couvrent cinq dimensions retenues sur deux critères : prédictives du départ, et actionnables par un manager sans formation RH dans la semaine. Charge de travail, reconnaissance, clarté, soutien, sens. Elles ne changent pas d'une semaine à l'autre, ce qui permet de mesurer des tendances réelles.
              </p>
              <Detail label="Pourquoi des questions fixes ?" text="Des questions identiques d'une semaine à l'autre permettent de comparer les données dans le temps. Des questions qui changent donneraient une photo ponctuelle, pas une tendance." />
              <Bullets items={[
                "Opt-in volontaire : chaque salarié confirme sa participation avant le premier survey",
                "Réponse sur téléphone ou ordinateur, sans compte",
                "Un champ libre facultatif en fin de questionnaire, jamais transmis tel quel",
                "Vous voyez le nombre de participants, jamais leur identité",
              ]} />
            </div>
            <div style={rightColStyle}><VisualQ12 /></div>
          </Panel>

          {/* Panel 2 : AI */}
          <Panel visible={active === "ai"}>
            <div style={leftColStyle}>
              <span style={tagStyle}>IA actionnable</span>
              <h2 style={titleStyle}>3 types de recommandations. Toujours contextualisées.</h2>
              <p style={descStyle}>
                Le Rapport d'équipe ne liste pas des scores. Il interprète les tendances et génère 2 à 3 recommandations selon le contexte de la semaine. Chaque recommandation appartient à l'un de ces 3 types, définis par l'IA en fonction du signal détecté.
              </p>
              <Detail label="Ce que l'IA analyse" text="Score absolu de la semaine, delta vs semaine N-1, tendance sur 3 semaines, taux de réponse et présence de silences. La recommandation combine ces signaux, pas juste le dernier score." />
            </div>
            <div style={rightColStyle}><VisualAI /></div>
          </Panel>

          {/* Panel 3 : Anonymat */}
          <Panel visible={active === "anon"}>
            <div style={leftColStyle}>
              <span style={tagStyle}>Anonymat</span>
              <h2 style={titleStyle}>Ce que vous ne pouvez pas voir. Même si vous le voulez.</h2>
              <p style={descStyle}>
                L'anonymat de HeedUp est une contrainte d'architecture, pas un paramètre. La participation est volontaire : vos salariés choisissent de rejoindre, ce qui renforce la qualité des réponses. Le système ne stocke jamais de lien entre une réponse et un salarié. Techniquement, même si vous demandiez à notre équipe qui a répondu quoi, nous ne pourrions pas vous répondre.
              </p>
              <Detail label="Seuil de protection statistique" text="Si moins de 5 salariés ont répondu cette semaine, aucun score n'est affiché. Ce seuil protège l'anonymat dans les petites équipes où un score pourrait trahir un répondant." />
              <Bullets items={[
                "Token UUID aléatoire régénéré chaque semaine",
                "Impossible de tracer un salarié dans le temps",
                "Vous voyez uniquement des scores agrégés",
              ]} />
            </div>
            <div style={rightColStyle}><VisualAnon /></div>
          </Panel>

          {/* Panel 4 : Dashboard */}
          <Panel visible={active === "dash"}>
            <div style={leftColStyle}>
              <span style={tagStyle}>Tableau de bord</span>
              <h2 style={titleStyle}>L'historique pour comprendre. Le rapport lundi pour agir.</h2>
              <p style={descStyle}>
                Le Rapport d'équipe du lundi est votre outil d'action. Le tableau de bord est votre outil de compréhension. Quand un score descend, le dashboard vous permet de voir si c'est un accident ou une tendance installée depuis 3 semaines.
              </p>
              <Detail label="Alerte automatique" text="Si un score passe sous 3/5 deux semaines consécutives, une alerte est générée automatiquement dans votre rapport. Vous n'avez pas à surveiller le dashboard, il vous prévient." />
              <Bullets items={[
                "Historique consultable sur 12 semaines",
                "Courbes de tendance par dimension (charge de travail, reconnaissance, clarté, soutien, sens)",
                "Taux de réponse semaine par semaine",
              ]} />
            </div>
            <div style={rightColStyle}><VisualDashboard /></div>
          </Panel>

          {/* Panel 5 : RGPD */}
          <Panel visible={active === "rgpd"}>
            <div style={leftColStyle}>
              <span style={tagStyle}>RGPD et données</span>
              <h2 style={titleStyle}>Conforme RGPD. Hébergé en France.</h2>
              <p style={descStyle}>
                HeedUp est conçu pour être conforme au RGPD par architecture, pas par paramètre. Les données de vos salariés sont hébergées en France, minimisées au strict nécessaire, et l'anonymat est garanti par conception. La documentation contractuelle est disponible sur demande.
              </p>
              <Detail label="CE QUI EST COLLECTÉ. RIEN D'AUTRE." text="Scores numériques de 1 à 5 et token aléatoire non-traçable. Aucune donnée nominative, aucun commentaire libre, aucune donnée de profil salarié." />
              <Bullets items={[
                "Hébergement exclusivement en France",
                "Aucune donnée nominative côté salariés",
                "Durée de conservation : 12 mois glissants",
                "Documentation RGPD disponible sur demande",
              ]} />
            </div>
            <div style={rightColStyle}><VisualRgpd /></div>
          </Panel>


          {/* Panel 6 : Onboarding */}
          <Panel visible={active === "onboard"}>
            <div style={leftColStyle}>
              <span style={tagStyle}>Onboarding et support</span>
              <h2 style={titleStyle}>10 minutes. Pas 10 semaines.</h2>
              <p style={descStyle}>
                Aucun projet informatique, aucune intégration SIRH, aucun déploiement. Vous importez les emails de votre équipe, vous activez, le premier survey part vendredi. Le support est inclus dans tous les plans, pas derrière un plan Premium.
              </p>
              <Detail label="Support humain, pas de chatbot" text="Réponse par email sous 24h ouvrées, en français, par une vraie personne qui connaît votre compte. Pas de ticket automatique, pas de FAQ obligatoire avant d'écrire." />
            </div>
            <div style={rightColStyle}><VisualOnboard /></div>
          </Panel>
        </div>
      </section>

      {/* Section 3 : Spotlight Rapport d'équipe */}
      <section className="fade-up" style={{ background: "var(--midnight)", padding: "56px 5%" }}>
        <div className="heedup-spotlight" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.9px", color: "rgba(255,255,255,0.35)", marginBottom: "12px", fontWeight: 700 }}>
              Ce que vous recevez chaque lundi
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "36px", color: "#FFFFFF", letterSpacing: "-0.5px", lineHeight: 1.15, marginBottom: "14px" }}>
              Le Rapport d'équipe.
              <br />
              <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.6)" }}>De la donnée à l'action en 2 minutes.</em>
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "20px" }}>
              Ce n'est pas un dashboard que vous ouvrez. C'est un email qui arrive dans votre boîte, structuré pour être lu en 2 minutes et pour déclencher une action dans la journée.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { t: "5 scores affichés séparément + deltas", s: "Charge de travail, reconnaissance, clarté, soutien, sens. La variation vs la semaine précédente en rouge ou vert." },
                { t: "Le signal prioritaire", s: "L'IA identifie le signal qui mérite votre attention cette semaine, pas une liste de tout ce qui s'est passé." },
                { t: "2 à 3 recommandations actionnables", s: "Formulées pour un manager qui pilote seul, pas pour un DRH avec une équipe de 5 personnes." },
                { t: "Le taux de réponse + alertes silences", s: "Si un salarié n'a pas répondu 2 semaines de suite, HeedUp vous le signale." },
              ].map((step, i) => (
                <div key={step.t} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--indigo)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#FFFFFF", fontWeight: 600, marginBottom: "2px" }}>{step.t}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.45 }}>{step.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <RapportCard />
          </div>
        </div>
      </section>

      {/* Section 3b : Simple pour vous, simple pour eux */}
      <section className="fade-up" style={{ background: "var(--bg-card)", padding: "56px 5%", borderTop: "1px solid rgba(67,56,202,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: "1px", color: "var(--midnight)", opacity: 0.35, marginBottom: "12px" }}>
            ZÉRO FRICTION
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "26px", color: "var(--midnight)", letterSpacing: "-0.3px", lineHeight: 1.2, marginBottom: "12px" }}>
            Simple pour vous,{" "}
            <span style={{ fontStyle: "italic", color: "var(--indigo)" }}>simple pour eux.</span>
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)", maxWidth: "620px", margin: "0 auto", lineHeight: 1.65 }}>
            L'outil qui s'efface est celui qu'on utilise vraiment. HeedUp est conçu pour disparaître dans votre routine.
          </p>
        </div>

        <div className="heedup-simple-vous-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "stretch", maxWidth: "1000px", margin: "0 auto" }}>
          {/* Carte gauche */}
          <div className="heedup-simple-vous-card" style={{ background: "var(--bg-main)", border: "1px solid rgba(67,56,202,0.10)", borderRadius: "16px", padding: "28px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "var(--indigo-pale)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <User size={20} strokeWidth={1.8} color="var(--indigo)" />
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--indigo)", marginBottom: "6px" }}>
              Pour vous, le manager
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--midnight)", lineHeight: 1.25, marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid rgba(67,56,202,0.10)" }}>
              Vous pilotez.
              <br />
              Vous ne maintenez pas.
            </h3>

            <div>
              {[
                {
                  Icon: Unplug,
                  title: "Pas de projet informatique",
                  text: "Aucune intégration SIRH, aucun ticket IT, aucune réunion de déploiement. Vous importez un fichier CSV et c'est terminé.",
                },
                {
                  Icon: Inbox,
                  title: "L'information vient à vous",
                  text: "Vous n'ouvrez pas un outil pour aller chercher les données. Le rapport d'équipe arrive dans votre boîte mail. Vous n'avez rien à déclencher.",
                },
                {
                  Icon: Target,
                  title: "Des actions, pas des données brutes",
                  text: "HeedUp ne vous donne pas un score à interpréter. Il vous dit quoi faire cette semaine, formulé pour un manager, pas pour un analyste RH.",
                },
                {
                  Icon: Wallet,
                  title: "Un budget PME, pas un budget ETI",
                  text: "À partir de 50€/mois, sans engagement annuel obligatoire. Prix affiché publiquement, sans devis, sans appel commercial préalable.",
                },
              ].map((arg, i, arr) => (
                <div
                  key={arg.title}
                  className="heedup-simple-vous-arg"
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    paddingBottom: i < arr.length - 1 ? "16px" : undefined,
                    marginBottom: i < arr.length - 1 ? "16px" : undefined,
                    borderBottom: i < arr.length - 1 ? "1px solid rgba(67,56,202,0.07)" : undefined,
                  }}
                >
                  <arg.Icon size={17} strokeWidth={1.8} color="var(--indigo)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "13.5px", fontWeight: 700, color: "var(--midnight)", marginBottom: "4px" }}>{arg.title}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.6 }}>{arg.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carte droite */}
          <div className="heedup-simple-vous-card" style={{ background: "var(--bg-main)", border: "1px solid rgba(67,56,202,0.10)", borderRadius: "16px", padding: "28px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "var(--indigo-pale)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <Users size={20} strokeWidth={1.8} color="var(--indigo)" />
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--indigo)", marginBottom: "6px" }}>
              Pourquoi vos salariés répondent vraiment
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--midnight)", lineHeight: 1.25, marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid rgba(67,56,202,0.10)" }}>
              Ils participent
              <br />
              parce qu'ils font confiance.
            </h3>

            <div>
              {[
                {
                  Icon: Lock,
                  title: "L'anonymat est dans le code, pas dans la charte",
                  text: "Même vous ne pouvez pas voir les réponses individuelles. Ce n'est pas une promesse managériale, c'est une contrainte architecturale.",
                },
                {
                  Icon: CalendarCheck,
                  title: "Un seul contact par semaine",
                  text: "Un email le vendredi matin. Pas d'app, pas de compte, pas de relance. Moins intrusif qu'un point d'équipe.",
                },
                {
                  Icon: RefreshCw,
                  title: "Ils voient que ça change quelque chose",
                  text: "Quand vos actions du lundi reflètent les signaux de la semaine, le taux de réponse monte. La boucle de confiance se referme d'elle-même.",
                },
                {
                  Icon: Timer,
                  title: "Zéro surcharge cognitive",
                  text: "5 questions, une échelle de 1 à 5, 2 minutes. Aucune question ouverte obligatoire, aucun formulaire à rallonge.",
                },
              ].map((arg, i, arr) => (
                <div
                  key={arg.title}
                  className="heedup-simple-vous-arg"
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    paddingBottom: i < arr.length - 1 ? "16px" : undefined,
                    marginBottom: i < arr.length - 1 ? "16px" : undefined,
                    borderBottom: i < arr.length - 1 ? "1px solid rgba(67,56,202,0.07)" : undefined,
                  }}
                >
                  <arg.Icon size={17} strokeWidth={1.8} color="var(--indigo)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "13.5px", fontWeight: 700, color: "var(--midnight)", marginBottom: "4px" }}>{arg.title}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.6 }}>{arg.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="heedup-simple-vous-closing" style={{ background: "var(--indigo-pale)", borderRadius: "12px", padding: "20px 28px", marginTop: "24px", maxWidth: "720px", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontStyle: "italic", color: "var(--midnight)", lineHeight: 1.5, margin: 0 }}>
            Un outil que vos salariés acceptent d'utiliser est un outil qui vous donne de vraies données. C'est le seul pari de HeedUp.
          </p>
        </div>
      </section>

      {/* Section 4 : Comparatif */}
      <section id="comparatif" className="fade-up" style={{ background: "var(--bg-main)", padding: "56px 5%", borderTop: "1px solid rgba(67,56,202,0.08)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "42px", color: "var(--midnight)", letterSpacing: "-0.8px", textAlign: "center", marginBottom: "8px" }}>
          Ce qui change vraiment avec HeedUp
        </h2>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)", textAlign: "center", marginBottom: "40px" }}>
          Six différences concrètes avec les outils conçus pour les équipes RH.
        </p>
        <div className="heedup-comparatif-desktop" style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px", marginBottom: "12px" }}>
            <div style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.7px", color: "rgba(13,27,62,0.35)", textAlign: "left" }}>Sans HeedUp</div>
            <div />
            <div style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.7px", color: "var(--indigo)", textAlign: "right" }}>Avec HeedUp</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { left: "Des semaines de déploiement IT avant de pouvoir envoyer la première question.", right: "Opérationnel en 10 minutes. Vous vous inscrivez, vous configurez, le premier survey part vendredi." },
              { left: "Un baromètre mensuel ou trimestriel. Le signal arrive après que le problème s'est installé.", right: "Une mesure hebdomadaire. Vous détectez les signaux faibles avant qu'ils deviennent des départs." },
              { left: "Un dashboard avec des scores à lire, interpréter et traduire en actions vous-même.", right: "2 à 3 recommandations managériales actionnables livrées directement avec le rapport." },
              { left: "Un appel commercial obligatoire avant d'avoir accès au produit ou au moindre tarif.", right: "Inscription directe, prix affiché publiquement. Vous démarrez sans parler à personne." },
              { left: "Un contrat d'un an minimum. Vous êtes engagé avant même d'avoir validé que ça fonctionne pour votre équipe.", right: "Facturation mensuelle, résiliation libre. Vous arrêtez quand vous voulez, sans frais ni préavis." },
              { left: "Des questionnaires pensés pour des DRH qui gèrent des centaines de personnes, pas pour un dirigeant qui pilote seul.", right: "Calibré pour 10 à 100 salariés. Interface, recommandations et seuil d'anonymat pensés pour votre réalité." },
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px" }}>
                <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "10px", padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(239,68,68,0.15)", color: "#b91c1c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <X size={10} />
                  </div>
                  <span style={{ fontSize: "12.5px", color: "rgba(13,27,62,0.55)", lineHeight: 1.5 }}>{row.left}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "18px", color: "rgba(67,56,202,0.3)" }}>→</span>
                </div>
                <div style={{ background: "rgba(67,56,202,0.05)", border: "1px solid rgba(67,56,202,0.15)", borderRadius: "10px", padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--indigo)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={10} />
                  </div>
                  <span style={{ fontSize: "12.5px", color: "var(--midnight)", fontWeight: 600, lineHeight: 1.5 }}>{row.right}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile stacked comparison */}
        <div className="heedup-comparatif-mobile" style={{ display: "none", maxWidth: "560px", margin: "0 auto" }}>
          {[
            { criterion: "Temps de démarrage", heedup: "10 minutes", other: "4 à 12 semaines" },
            { criterion: "Fréquence de mesure", heedup: "Hebdomadaire", other: "Mensuel ou trimestriel" },
            { criterion: "Prix d'entrée (25 salariés)", heedup: "112,50€/mois", other: "Dès 667€/mois" },
            { criterion: "Engagement", heedup: "Mensuel, libre", other: "12 mois minimum" },
            { criterion: "Appel commercial requis", heedup: "Non", other: "Systématiquement" },
            { criterion: "Anonymat", heedup: "Architectural (by design)", other: "Paramètre désactivable" },
            { criterion: "Compte salarié requis", heedup: "Non, lien direct", other: "Oui, inscription requise" },
          ].map((row) => (
            <div
              key={row.criterion}
              style={{
                background: "var(--bg-card)",
                borderRadius: "10px",
                border: "1px solid rgba(67,56,202,0.08)",
                padding: "14px 16px",
                marginBottom: "10px",
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--midnight)", marginBottom: "10px" }}>
                {row.criterion}
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
                <span style={{ background: "var(--indigo)", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", flexShrink: 0 }}>HeedUp</span>
                <span style={{ fontSize: "12px", color: "#15803d", fontWeight: 600 }}>{row.heedup}</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ background: "rgba(13,27,62,0.08)", color: "rgba(13,27,62,0.4)", fontSize: "9px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", flexShrink: 0 }}>Autres</span>
                <span style={{ fontSize: "12px", color: "rgba(13,27,62,0.35)" }}>{row.other}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5 : CTA */}
      <section style={{ background: "#EEEEFF", padding: "64px 5%", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "36px", color: "var(--midnight)", letterSpacing: "-0.5px", marginBottom: "10px" }}>
          Prêt à piloter votre équipe autrement ?
        </h2>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)", marginBottom: "26px", lineHeight: 1.6 }}>
          Rejoignez les {count} dirigeants déjà sur la liste d'attente. Lancement prévu début septembre 2026.
        </p>
        <button
          type="button"
          {...{
            "data-tally-open": "VLBY9E",
            "data-tally-overlay": "1",
            "data-tally-emoji-text": "👋",
            "data-tally-emoji-animation": "wave",
          }}
          style={{
            background: "var(--indigo)",
            color: "#FFFFFF",
            padding: "13px 28px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
          }}
        >
          Accéder au lancement →
        </button>
      </section>
    </SiteLayout>
  );
}
