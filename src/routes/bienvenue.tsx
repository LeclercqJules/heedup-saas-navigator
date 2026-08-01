import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { IconMail, IconDeviceLaptopOff, IconEyeOff } from "@tabler/icons-react";
import { SiteLayout } from "@/components/SiteLayout";
import { RapportCard } from "@/components/RapportCard";
import { useTallyCount } from "@/hooks/useTallyCount";

export const Route = createFileRoute("/bienvenue")({
  head: () => ({
    meta: [
      { title: "Bienvenue depuis LinkedIn — HeedUp" },
      {
        name: "description",
        content:
          "Le détail concret du rapport d'équipe HeedUp, l'anonymat par conception et la mise en route en 10 minutes.",
      },
      { property: "og:title", content: "Bienvenue depuis LinkedIn — HeedUp" },
      {
        property: "og:description",
        content: "Le rapport d'équipe HeedUp en détail, et comment démarrer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BienvenuePage,
});

const TALLY = {
  "data-tally-open": "VLBY9E",
  "data-tally-overlay": "1",
  "data-tally-emoji-text": "👋",
  "data-tally-emoji-animation": "wave",
} as const;

const ctaStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 400,
  padding: 16,
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 700,
  background: "var(--indigo)",
  color: "#FFFFFF",
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
  margin: "0 auto",
  display: "block",
};

const textLink: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--indigo)",
  textDecoration: "none",
};

const employeePoints = [
  {
    Icon: IconMail,
    text: "Un email le vendredi matin. 5 questions, une échelle de 1 à 5, 2 minutes.",
  },
  {
    Icon: IconDeviceLaptopOff,
    text: "Aucun compte à créer, aucune application à installer.",
  },
  {
    Icon: IconEyeOff,
    text: "La participation est volontaire. Vous voyez combien ont répondu, jamais qui.",
  },
];

const steps = [
  { num: "01", text: "Vous importez les emails de votre équipe (CSV)" },
  { num: "02", text: "HeedUp envoie le premier questionnaire le vendredi suivant" },
  { num: "03", text: "Votre premier rapport arrive le lundi matin" },
];

const faqItems = [
  {
    question: "Mes salariés vont-ils vraiment répondre ?",
    answer:
      "La participation est volontaire et anonyme par conception. Les salariés répondent parce qu'ils le choisissent, pas parce qu'ils y sont obligés. C'est précisément ce qui rend les réponses honnêtes et le signal fiable.",
  },
  {
    question: "Est-ce que je peux arrêter quand je veux ?",
    answer:
      "Oui. Aucun engagement annuel obligatoire. Vous résiliez en un clic, sans frais, sans préavis. L'option annuelle existe mais reste un choix, pas une contrainte.",
  },
  {
    question: "Combien de temps pour démarrer ?",
    answer:
      "Moins de 10 minutes une fois l'outil ouvert. Vous importez les emails de votre équipe, HeedUp envoie les invitations, et le rapport arrive le lundi suivant le premier vendredi actif.",
  },
];

function AccordionItem({ item, index }: { item: { question: string; answer: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`fade-up fade-up-delay-${index + 1}`}
      style={{
        background: "var(--bg-main)",
        border: "1px solid rgba(67,56,202,0.10)",
        borderRadius: 10,
        padding: "16px 20px",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          fontWeight: 600,
          color: "var(--midnight)",
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: 0,
          width: "100%",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        {item.question}
        <span style={{ fontSize: 12, color: "var(--indigo)", flexShrink: 0 }}>{open ? "−" : "+"}</span>
      </button>
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--text-muted)",
          lineHeight: 1.6,
          marginTop: open ? 10 : 0,
          maxHeight: open ? 400 : 0,
          overflow: "hidden",
          opacity: open ? 1 : 0,
          transition: "all 0.25s ease",
        }}
      >
        {item.answer}
      </div>
    </div>
  );
}

function BienvenuePage() {
  const count = useTallyCount();

  return (
    <SiteLayout>
      {/* 1. HERO */}
      <section className="fade-up" style={{ background: "var(--bg-main)", padding: "64px 5% 48px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              background: "var(--indigo-pale)",
              color: "var(--indigo)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              padding: "5px 14px",
              borderRadius: 20,
              display: "inline-block",
              marginBottom: 20,
              fontFamily: "var(--font-sans)",
            }}
          >
            Vous venez de LinkedIn
          </div>
          <h1
            className="fade-up fade-up-delay-1"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 44,
              color: "var(--midnight)",
              letterSpacing: "-1px",
              lineHeight: 1.15,
              margin: "0 0 16px",
            }}
          >
            Ce que vous recevrez, chaque lundi matin.
          </h1>
          <p
            className="fade-up fade-up-delay-2"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 18,
              color: "var(--text-muted)",
              lineHeight: 1.6,
              maxWidth: 460,
              margin: "0 auto 36px",
            }}
          >
            Vous savez déjà de quoi il s'agit. Voici le détail concret, et comment démarrer.
          </p>
          <button className="fade-up fade-up-delay-3" {...TALLY} style={ctaStyle}>
            Accéder au lancement →
          </button>
        </div>
      </section>

      {/* 2. LE RAPPORT D'ÉQUIPE, EN DÉTAIL */}
      <section className="fade-up" style={{ background: "var(--bg-card)", padding: "56px 5%" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              color: "var(--midnight)",
              textAlign: "center",
              margin: "0 0 10px",
            }}
          >
            Le rapport d'équipe, en détail.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              color: "var(--text-muted)",
              textAlign: "center",
              lineHeight: 1.6,
              maxWidth: 520,
              margin: "0 auto 32px",
            }}
          >
            Pas un tableau de bord à interpréter. Une lecture de 30 secondes, et trois actions pour la semaine.
          </p>

          <RapportCard className="fade-up fade-up-delay-1" />

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link to="/fonctionnalites" style={textLink}>
              Voir toutes les fonctionnalités →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CE QUE VIVENT VOS SALARIÉS */}
      <section className="fade-up" style={{ background: "var(--bg-main)", padding: "56px 5%" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              color: "var(--midnight)",
              textAlign: "center",
              margin: "0 0 28px",
            }}
          >
            Ce que vivent vos salariés.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {employeePoints.map(({ Icon, text }, idx) => (
              <div
                key={text}
                className={`fade-up fade-up-delay-${idx + 1}`}
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
              >
                <Icon size={18} color="var(--indigo)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 15,
                    color: "var(--text-primary)",
                    lineHeight: 1.6,
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ANONYMAT */}
      <section className="fade-up" style={{ background: "var(--midnight)", padding: "56px 5%" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 30,
              color: "#FFFFFF",
              margin: "0 0 16px",
              lineHeight: 1.25,
            }}
          >
            L'anonymat est dans le code, pas dans la charte.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              margin: "0 0 20px",
            }}
          >
            Les réponses sont structurellement détachées de l'identité au niveau de la base de données. Ce n'est pas un
            paramètre que quelqu'un peut désactiver, pas même moi. C'est ce qui rend les réponses honnêtes, pas juste
            récoltées.
          </p>
          <Link to="/confidentialite" style={{ ...textLink, color: "var(--indigo-pale)" }}>
            Comment les données sont traitées →
          </Link>
        </div>
      </section>

      {/* 5. DÉMARRAGE */}
      <section className="fade-up" style={{ background: "var(--bg-card)", padding: "56px 5%" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              color: "var(--midnight)",
              textAlign: "center",
              margin: "0 0 28px",
            }}
          >
            Vous démarrez en 10 minutes.
          </h2>
          <div
            className="bienvenue-grid-3"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {steps.map(({ num, text }, idx) => (
              <div
                key={num}
                className={`fade-up fade-up-delay-${idx + 1}`}
                style={{
                  background: "var(--bg-main)",
                  border: "1px solid rgba(67,56,202,0.10)",
                  borderLeft: "3px solid var(--midnight)",
                  borderRadius: 12,
                  padding: "18px 20px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.9px",
                    color: "var(--indigo)",
                    marginBottom: 8,
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    color: "var(--text-primary)",
                    lineHeight: 1.6,
                  }}
                >
                  {text}
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--text-muted)",
              textAlign: "center",
              margin: "20px 0 0",
            }}
          >
            Aucun appel commercial, aucune démo, aucun déploiement IT.
          </p>
        </div>
      </section>

      {/* 6. CLOSING */}
      <section className="fade-up" style={{ background: "var(--bg-main)", padding: "64px 5%" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 34,
              color: "var(--midnight)",
              letterSpacing: "-0.5px",
              margin: "0 0 12px",
            }}
          >
            Vous êtes prévenu en premier.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              color: "var(--text-muted)",
              lineHeight: 1.6,
              margin: "0 0 28px",
            }}
          >
            Lancement prévu début septembre 2026. Les inscrits accèdent à l'outil avant l'ouverture publique.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", flexDirection: "row-reverse" }}>
              {[
                { initials: "AC", bg: "#2d4a6e" },
                { initials: "SP", bg: "#5b4c8a" },
                { initials: "JB", bg: "#1e3a5f" },
                { initials: "CR", bg: "#374151" },
                { initials: "TD", bg: "#4338CA" },
                { initials: "ML", bg: "#0D1B3E" },
              ].map((a, i, arr) => (
                <div
                  key={a.initials}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: a.bg,
                    border: "2px solid var(--bg-main)",
                    marginLeft: i === arr.length - 1 ? 0 : -10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: 13,
                    color: "#FFFFFF",
                    fontStyle: "italic",
                  }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                color: "var(--midnight)",
                fontWeight: 500,
              }}
            >
              <span style={{ fontWeight: 700 }}>{count}</span> dirigeants ont déjà rejoint
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 28 }}>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--text-muted)",
                lineHeight: 1.6,
              }}
            >
              À partir de 50€/mois, sans engagement, résiliable à tout moment.{" "}
              <Link to="/tarifs" style={textLink}>
                Voir les tarifs →
              </Link>
            </div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--text-muted)",
                opacity: 0.75,
                lineHeight: 1.6,
              }}
            >
              Un départ non anticipé coûte en moyenne 22 500€. (Deloitte, 2024){" "}
              <Link to="/estimer-cout" style={{ ...textLink, fontSize: 12 }}>
                Estimer le coût pour mon équipe →
              </Link>
            </div>
          </div>

          <button {...TALLY} style={ctaStyle}>
            Accéder au lancement →
          </button>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="fade-up" style={{ background: "var(--bg-card)", padding: "56px 5%" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              color: "var(--midnight)",
              textAlign: "center",
              margin: "0 0 32px",
            }}
          >
            Les questions que vous vous posez.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faqItems.map((item, idx) => (
              <AccordionItem key={idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .bienvenue-grid-3 { grid-template-columns: 1fr !important; }
          .heedup-nav-minimal .heedup-nav-cta { display: inline-flex !important; }
        }
      `}</style>
    </SiteLayout>
  );
}
