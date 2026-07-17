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
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/fonctionnalites")({
  head: () => ({
    meta: [
      { title: "Fonctionnalités : ce que HeedUp fait, précisément" },
      {
        name: "description",
        content:
          "Questions Gallup Q12, recommandations IA, anonymat architectural, RGPD, onboarding en 10 minutes. Chaque mécanisme expliqué.",
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

const tabs: { id: TabId; label: string; Icon: typeof Send }[] = [
  { id: "q12", label: "Questions Gallup Q12", Icon: Send },
  { id: "ai", label: "Recommandations IA", Icon: Brain },
  { id: "anon", label: "Anonymat architectural", Icon: EyeOff },
  { id: "dash", label: "Tableau de bord", Icon: LineChart },
  { id: "rgpd", label: "RGPD et données", Icon: ShieldCheck },
  { id: "onboard", label: "Onboarding et support", Icon: Rocket },
];

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
            Dimension : charge perçue
          </span>
          <span style={{ fontSize: "10px", color: "var(--indigo)" }}>🔒 Réponse 100% anonyme</span>
        </div>
        <div style={{ fontSize: "13.5px", color: "var(--midnight)", fontWeight: 600, lineHeight: 1.4 }}>
          Votre charge de travail est-elle gérable cette semaine ?
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
      <RecoCard bg="rgba(239,68,68,0.06)" border="rgba(239,68,68,0.18)" iconBg="var(--semantic-red)" symbol="!" title="Alerte signal faible" text="Charge en baisse 2 semaines consécutives. Planifiez un point collectif avant vendredi pour identifier les blocages." />
      <RecoCard bg="rgba(34,197,94,0.06)" border="rgba(34,197,94,0.18)" iconBg="var(--semantic-green)" symbol="↑" title="Opportunité à saisir" text="Ambiance en hausse. Bon moment pour lancer un projet à forte visibilité ou impliquer l'équipe dans une décision." />
      <RecoCard bg="rgba(67,56,202,0.06)" border="rgba(67,56,202,0.18)" iconBg="var(--indigo)" symbol="·" title="Détection de silence" text="2 employés n'ont pas répondu cette semaine. Le silence est aussi un signal. Envoyez un rappel discret avant vendredi." />
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
              Charge en baisse depuis 3 semaines.
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

function VisualRgpd() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "380px" }}>
      <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.6px", color: "rgba(13,27,62,0.4)", fontWeight: 700, marginBottom: "2px" }}>
        Documents fournis à la signature
      </div>
      <DocCard Icon={FileText} title="DPA : Data Processing Agreement" sub="Responsabilités de traitement, sous-traitance, procédures en cas de violation." />
      <DocCard Icon={ListChecks} title="Registre de traitement" sub="Finalités, catégories de données, durées de conservation." />
      <DocCard Icon={Users} title="Politique de confidentialité employé" sub="Document prêt à transmettre à vos salariés avant le premier survey." />
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

function SpotlightCard() {
  const scores = [
    { label: "Charge", value: "3,2", delta: "▼ 0,3", color: "#EF4444" },
    { label: "Ambiance", value: "4,1", delta: "▲ 0,2", color: "#22C55E" },
    { label: "Motivation", value: "3,8", delta: "—", color: "#6B7280" },
  ];
  const recoBox: React.CSSProperties = {
    background: "rgba(67,56,202,0.2)",
    border: "1px solid rgba(67,56,202,0.3)",
    borderRadius: "7px",
    padding: "9px 10px",
    display: "flex",
    gap: "8px",
    alignItems: "flex-start",
  };
  const recoIcon: React.CSSProperties = {
    width: "16px",
    height: "16px",
    borderRadius: "4px",
    background: "var(--indigo)",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 700,
    flexShrink: 0,
  };
  return (
    <div style={{ background: "#1a2545", borderRadius: "14px", overflow: "hidden" }}>
      <div style={{ background: "#111d36", padding: "12px 18px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--indigo)" }} />
        <span style={{ fontSize: "12px", color: "#FFFFFF", fontWeight: 600 }}>Rapport d'équipe, Lundi 16 juin</span>
        <span style={{ marginLeft: "auto", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Semaine 24</span>
      </div>
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "6px", marginBottom: "14px" }}>
          {scores.map((s) => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "7px", padding: "9px 4px", textAlign: "center" }}>
              <div style={{ fontSize: "9.5px", fontWeight: 700, color: s.color }}>{s.delta}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "#FFFFFF" }}>{s.value}</div>
              <div style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: "9.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.5px" }}>
          Signal prioritaire cette semaine
        </div>
        <div style={{ ...recoBox, marginBottom: "12px" }}>
          <span style={recoIcon}>!</span>
          <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
            Charge en baisse depuis 3 semaines. Ce n'est plus un accident. Planifiez un point collectif avant vendredi pour identifier les blocages structurels.
          </span>
        </div>

        <div style={{ fontSize: "9.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.5px" }}>
          Recommandations
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={recoBox}>
            <span style={recoIcon}>↑</span>
            <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
              Ambiance en hausse. Bon moment pour impliquer l'équipe dans une décision ou lancer un projet visible.
            </span>
          </div>
          <div style={recoBox}>
            <span style={recoIcon}>·</span>
            <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
              2 employés n'ont pas répondu. Le silence est aussi un signal. Envoyez un rappel discret.
            </span>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "9px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Taux de réponse : 8 / 10</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", color: "#22C55E", fontWeight: 700 }}>8/10</span>
          <div style={{ width: "60px", height: "5px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: "80%", height: "100%", background: "var(--indigo)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}


// ---------- Page ----------

function Page() {
  const [active, setActive] = useState<TabId>("q12");

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
      <section style={{ background: "var(--bg-card)", padding: "52px 5%", borderTop: "1px solid rgba(67,56,202,0.08)" }}>
        <style>{`
          .feature-tab {
            transition: all 0.15s;
          }
          .feature-tab:not(.active):hover {
            border-color: rgba(67,56,202,0.4) !important;
          }
        `}</style>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
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
                Les 5 questions HeedUp sont calibrées sur les 4 dimensions du modèle Gallup Q12 adaptées aux équipes de 10 à 50 salariés : charge perçue, ambiance, motivation et clarté des missions. Elles ne changent pas d'une semaine à l'autre, ce qui permet de mesurer des tendances réelles.
              </p>
              <Detail label="Pourquoi des questions fixes ?" text="Des questions identiques d'une semaine à l'autre permettent de comparer les données dans le temps. Si vous changez les questions, vous perdez la tendance. C'est le principe de base de la psychométrie appliquée." />
              <Bullets items={[
                "Lien unique par salarié, token régénéré chaque semaine",
                "Réponse sur téléphone ou ordinateur, sans compte",
                "Taux de réponse moyen observé en bêta : 76%",
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
                L'anonymat de HeedUp est une contrainte d'architecture, pas un paramètre. Le système ne stocke jamais de lien entre une réponse et un salarié. Techniquement, même si vous demandiez à notre équipe qui a répondu quoi, nous ne pourrions pas vous répondre.
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
                "Courbes de tendance par catégorie (charge, ambiance, motivation)",
                "Taux de réponse semaine par semaine",
              ]} />
            </div>
            <div style={rightColStyle}><VisualDashboard /></div>
          </Panel>

          {/* Panel 5 : RGPD */}
          <Panel visible={active === "rgpd"}>
            <div style={leftColStyle}>
              <span style={tagStyle}>RGPD et données</span>
              <h2 style={titleStyle}>La documentation contractuelle. Pas juste le badge.</h2>
              <p style={descStyle}>
                Beaucoup d'outils affichent Conforme RGPD. HeedUp vous fournit la documentation contractuelle complète avant même votre premier survey : DPA, registre de traitement, politique de confidentialité employé prête à transmettre.
              </p>
              <Detail label="Ce qui est collecté. Rien d'autre." text="Scores entiers de 1 à 5 et token aléatoire non-traçable. Aucune donnée sensible, aucun commentaire libre, aucune donnée de profil salarié." />
              <Bullets items={[
                "Hébergement exclusivement en France",
                "DPA fourni à la signature, sans supplément",
                "Durée de conservation : 12 mois glissants",
                "Politique de confidentialité employé incluse et prête",
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
      <section style={{ background: "var(--midnight)", padding: "56px 5%" }}>
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
                { t: "3 scores agrégés + deltas", s: "Charge, ambiance, motivation. La variation vs la semaine précédente en rouge ou vert." },
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
            <SpotlightCard />
          </div>
        </div>
      </section>

      {/* Section 4 : Comparatif */}
      <section style={{ background: "var(--bg-main)", padding: "56px 5%", borderTop: "1px solid rgba(67,56,202,0.08)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "42px", color: "var(--midnight)", letterSpacing: "-0.8px", textAlign: "center", marginBottom: "8px" }}>
          Ce qui change vraiment avec HeedUp
        </h2>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)", textAlign: "center", marginBottom: "40px" }}>
          Six différences concrètes avec les outils conçus pour les équipes RH.
        </p>
        <div className="heedup-comparatif" style={{ maxWidth: "900px", margin: "0 auto" }}>
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
      </section>

      {/* Section 5 : CTA */}
      <section style={{ background: "#EEEEFF", padding: "64px 5%", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "36px", color: "var(--midnight)", letterSpacing: "-0.5px", marginBottom: "10px" }}>
          Prêt à piloter votre équipe autrement ?
        </h2>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)", marginBottom: "26px", lineHeight: 1.6 }}>
          Rejoignez les 27 dirigeants déjà sur la liste d'attente. Lancement dans les prochaines semaines.
        </p>
        <button
          type="button"
          {...{
            "data-tally-open": "obpYab",
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
          Rejoindre la liste d'attente →
        </button>
      </section>
    </SiteLayout>
  );
}
