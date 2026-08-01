import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IconEyeOff,
  IconClock,
  IconCurrencyEuro,
  IconUserCheck,
  IconBrain,
  IconLock,
} from "@tabler/icons-react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/bienvenue")({
  head: () => ({
    meta: [
      { title: "Bienvenue depuis LinkedIn — HeedUp" },
      {
        name: "description",
        content:
          "Vous venez de LinkedIn. Voici pourquoi HeedUp existe : un pouls d'équipe anonyme pour prévenir le turnover dans les PME.",
      },
      { property: "og:title", content: "Bienvenue depuis LinkedIn — HeedUp" },
      {
        property: "og:description",
        content:
          "Un pouls d'équipe anonyme pour prévenir le turnover dans les PME françaises.",
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

const problems = [
  {
    Icon: IconEyeOff,
    title: "Les signaux sont invisibles",
    text: "Un salarié qui décroche ne le dit pas en réunion. Il répond moins, s'investit moins, et part quand vous ne l'attendez plus.",
  },
  {
    Icon: IconClock,
    title: "Vous l'apprenez trop tard",
    text: "La démission arrive en moyenne 3 à 6 mois après les premiers signes. Sans outil de mesure hebdomadaire, ces signes passent inaperçus.",
  },
  {
    Icon: IconCurrencyEuro,
    title: "Le coût est réel",
    text: "Chaque départ non anticipé coûte en moyenne 22 500€ en recrutement, formation et perte de productivité. (Source : Deloitte 2024)",
  },
];

const solutions = [
  {
    Icon: IconUserCheck,
    title: "Opt-in volontaire",
    text: "Vos salariés reçoivent une invitation et choisissent de participer librement. Vous voyez combien ont rejoint. Jamais qui.",
    practical: "Invitations envoyées automatiquement dès la mise en place.",
  },
  {
    Icon: IconClock,
    title: "Actif en 10 minutes",
    text: "Import CSV, aucune installation côté salarié, aucun appel commercial requis. Le premier survey part le vendredi suivant.",
    practical: "Moins de temps qu'une réunion d'équipe.",
  },
  {
    Icon: IconBrain,
    title: "Rapport IA le lundi matin",
    text: "Pas un score à interpréter. Une recommandation concrète formulée pour un manager, pas un DRH.",
    practical: "Dans votre boîte mail avant votre première réunion de la semaine.",
  },
  {
    Icon: IconLock,
    title: "Anonymat architectural",
    text: "Les réponses sont structurellement détachées de l'identité. Pas un paramètre, une conception. Personne ne peut désactiver l'anonymat, pas même vous.",
    practical: "Ce qui rend les réponses honnêtes, pas juste récoltées.",
  },
];


const faqItems = [
  {
    question: "Mes salariés vont-ils vraiment répondre ?",
    answer: "La participation est volontaire et anonyme par conception. Les salariés répondent parce qu'ils le choisissent, pas parce qu'ils y sont obligés. C'est précisément ce qui rend les réponses honnêtes et le signal fiable.",
  },
  {
    question: "Est-ce vraiment anonyme ?",
    answer: "Oui, par architecture. Les réponses sont structurellement détachées de l'identité. Vous voyez combien de personnes ont répondu. Jamais qui a répondu quoi. Ce n'est pas un paramètre que vous pouvez désactiver.",
  },
  {
    question: "Est-ce que je peux arrêter quand je veux ?",
    answer: "Oui. Aucun engagement annuel obligatoire. Vous résiliez en un clic, sans frais, sans préavis. L'option annuelle existe mais reste un choix, pas une contrainte.",
  },
  {
    question: "Mes salariés doivent-ils créer un compte ?",
    answer: "Non. Chaque salarié reçoit un lien unique par email. Aucune inscription, aucune application à installer. Deux minutes par semaine, pas plus.",
  },
  {
    question: "Combien de temps pour démarrer ?",
    answer: "Moins de 10 minutes. Vous importez les emails de votre équipe, HeedUp envoie les invitations. Le premier rapport arrive le lundi suivant votre premier vendredi actif.",
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
  const anonymityCard = solutions.find((s) => s.title === "Anonymat architectural")!;
  const otherSolutions = solutions.filter((s) => s.title !== "Anonymat architectural");

  return (
    <SiteLayout>
      {/* 1. HERO */}
      <section
        className="fade-up"
        style={{
          background: "var(--bg-main)",
          padding: "72px 5% 56px",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div
            className="fade-up"
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
              marginBottom: 16,
              margin: "0 0 16px",
            }}
          >
            5 questions chaque vendredi.
            <br />
            Un rapport d'équipe chaque lundi.
          </h1>
          <p
            className="fade-up fade-up-delay-2"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 18,
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: 40,
              margin: 0,
            }}
          >
            Ce qu'une note de connexion ne permet pas de dire : comment HeedUp vous fait voir venir un départ, avant qu'il ne soit trop tard.
          </p>

          <button
            className="fade-up fade-up-delay-3"
            {...TALLY}
            style={{
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
            }}
          >
            Accéder au lancement →
          </button>
        </div>
      </section>

      {/* 2. PROBLÈME */}
      <section
        className="fade-up"
        style={{
          background: "var(--bg-card)",
          padding: "56px 5%",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2
            className="fade-up"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              color: "var(--midnight)",
              textAlign: "center",
              marginBottom: 8,
              margin: "0 0 8px",
            }}
          >
            Le problème n'est pas le départ.
          </h2>
          <p
            className="fade-up fade-up-delay-1"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              color: "var(--text-muted)",
              textAlign: "center",
              marginBottom: 36,
              margin: "0 0 36px",
            }}
          >
            C'est de ne pas l'avoir vu venir.
          </p>
          <div
            className="bienvenue-grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {problems.map(({ Icon, title, text }, idx) => (
              <div
                key={title}
                className={`fade-up fade-up-delay-${idx + 1}`}
                style={{
                  background: "var(--bg-main)",
                  border: "1px solid rgba(67,56,202,0.10)",
                  borderRadius: 12,
                  padding: 22,
                }}
              >
                <Icon size={20} color="var(--indigo)" style={{ marginBottom: 10 }} />
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--midnight)",
                    marginBottom: 6,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                  }}
                >
                  {text}
                </div>
              </div>
            ))}
          </div>
          <div
            className="fade-up fade-up-delay-3"
            style={{
              textAlign: "center",
              marginTop: 24,
            }}
          >
            <Link
              to="/estimer-cout"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--indigo)",
                textDecoration: "none",
              }}
            >
              Estimez ce que le désengagement coûte à votre équipe →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. SOLUTION */}
      <section
        className="fade-up"
        style={{
          background: "var(--midnight)",
          padding: "56px 5%",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div
            className="fade-up"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.5)",
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
            La réponse
          </div>
          <h2
            className="fade-up fade-up-delay-1"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              color: "#FFFFFF",
              marginBottom: 12,
              margin: "0 0 12px",
            }}
          >
            HeedUp est un pouls d'équipe anonyme.
          </h2>
          <p
            className="fade-up fade-up-delay-2"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6,
              marginBottom: 40,
              margin: "0 0 40px",
            }}
          >
            Voici comment HeedUp change ça.
          </p>

          {/* Anonymat architectural — pleine largeur */}
          <div
            className="fade-up fade-up-delay-3"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              padding: "24px 28px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 16,
              textAlign: "left",
            }}
          >
            <anonymityCard.Icon size={18} color="var(--indigo)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  marginBottom: 4,
                }}
              >
                {anonymityCard.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.5,
                }}
              >
                {anonymityCard.text}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  fontStyle: "italic",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  marginTop: 10,
                  paddingTop: 10,
                  lineHeight: 1.5,
                }}
              >
                En pratique : {anonymityCard.practical}
              </div>
            </div>
          </div>

          <div
            className="bienvenue-grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              textAlign: "left",
            }}
          >
            {otherSolutions.map(({ Icon, title, text, practical }, idx) => (
              <div
                key={title}
                className={`fade-up fade-up-delay-${idx + 1}`}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <Icon size={18} color="var(--indigo)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#FFFFFF",
                      marginBottom: 4,
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.45)",
                      lineHeight: 1.5,
                    }}
                  >
                    {text}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.35)",
                      fontStyle: "italic",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      marginTop: 10,
                      paddingTop: 10,
                      lineHeight: 1.5,
                    }}
                  >
                    En pratique : {practical}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="fade-up fade-up-delay-3"
            {...TALLY}
            style={{
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
              margin: "32px auto 0",
              display: "block",
            }}
          >
            Accéder au lancement →
          </button>
        </div>
      </section>

      {/* 4. MINI-FAQ */}
      <section
        className="fade-up"
        style={{
          background: "var(--bg-card)",
          padding: "56px 5%",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            className="fade-up"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              color: "var(--midnight)",
              textAlign: "center",
              marginBottom: 32,
              margin: "0 0 32px",
            }}
          >
            Les questions que vous vous posez.
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {faqItems.map((item, idx) => (
              <AccordionItem key={idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA FINAL */}
      <section
        className="fade-up"
        style={{
          background: "var(--bg-main)",
          padding: "72px 5%",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2
            className="fade-up"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 36,
              color: "var(--midnight)",
              letterSpacing: "-0.5px",
              marginBottom: 12,
              margin: "0 0 12px",
            }}
          >
            Rejoignez les premiers managers.
          </h2>
          <p
            className="fade-up fade-up-delay-1"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              color: "var(--text-muted)",
              marginBottom: 24,
              margin: "0 0 24px",
              lineHeight: 1.6,
            }}
          >
            HeedUp vous donnera accès en priorité dès le lancement. Aucun engagement, résiliable à tout moment.
          </p>
          <div
            className="fade-up fade-up-delay-2"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              À partir de 50€/mois · Sans engagement · Résiliable à tout moment
            </span>
            <Link
              to="/tarifs"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--indigo)",
                textDecoration: "none",
              }}
            >
              Voir les tarifs détaillés →
            </Link>
          </div>
          <button
            className="fade-up fade-up-delay-3"
            {...TALLY}
            style={{
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
            }}
          >
            Accéder au lancement →
          </button>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .bienvenue-grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </SiteLayout>
  );
}
