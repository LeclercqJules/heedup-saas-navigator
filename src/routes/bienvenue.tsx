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

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 28,
  color: "var(--midnight)",
  textAlign: "center",
  margin: "0 0 24px",
};

const cardStyle: React.CSSProperties = {
  background: "var(--bg-main)",
  border: "1px solid rgba(67,56,202,0.10)",
  borderLeft: "3px solid var(--midnight)",
  borderRadius: 12,
  padding: "18px 20px",
};

const employeeCards = [
  {
    Icon: IconMail,
    title: "2 minutes, le vendredi",
    text: "Un email le vendredi matin. 5 questions notées de 1 à 5, et un champ libre facultatif.",
  },
  {
    Icon: IconDeviceLaptopOff,
    title: "Rien à installer",
    text: "Aucun compte à créer, aucune application, aucun mot de passe à retenir.",
  },
  {
    Icon: IconEyeOff,
    title: "Participation volontaire",
    text: "Personne n'est obligé de répondre. Vous voyez combien ont participé, jamais qui.",
  },
];

const anonymityCards = [
  {
    title: "Un token, pas une identité",
    text: "Chaque réponse est associée à un token aléatoire non traçable, régénéré chaque semaine. Aucune donnée nominative n'est collectée côté salarié.",
  },
  {
    title: "Aucun rapport sous 5 réponses",
    text: "Sur une petite équipe, un chiffre isolé serait identifiable. En dessous du seuil, rien n'est généré : ni scores, ni synthèse.",
  },
  {
    title: "Rien ne quitte l'Europe",
    text: "Hébergement en France, région Paris. Réponses conservées 12 mois glissants, puis supprimées.",
  },
];

const dimensions = [
  {
    num: "01",
    title: "Charge de travail",
    text: "Le rythme est-il tenable dans la durée ? Premier facteur de burnout, et le plus simple à corriger : on redistribue.",
  },
  {
    num: "02",
    title: "Reconnaissance",
    text: "Le levier le plus sous-investi par les managers, et le plus rapide à activer. La fenêtre de sept jours a un sens naturel ici.",
  },
  {
    num: "03",
    title: "Clarté",
    text: "Chacun sait-il ce qu'on attend de lui ? Quand ce score chute, c'est presque toujours un problème de communication, pas d'organisation.",
  },
  {
    num: "04",
    title: "Soutien",
    text: "Peut-on demander de l'aide sans crainte ? C'est ce qui distingue un problème de manager d'un problème collectif.",
  },
  {
    num: "05",
    title: "Sens",
    text: "Le signal le plus prédictif de l'intention de rester. Il bouge en premier quand quelqu'un commence à regarder ailleurs.",
  },
];

const trustBadges = ["RGPD natif", "Hébergé en France", "Réponses anonymes", "Actif en 10 minutes"];

const steps = [
  {
    num: "01",
    hook: "Vous importez un CSV",
    text: "Les emails de votre équipe, en une fois.",
    badge: "10 minutes",
  },
  {
    num: "02",
    hook: "Le vendredi part tout seul",
    text: "HeedUp envoie le premier questionnaire le vendredi suivant, puis chaque semaine automatiquement.",
    badge: "Automatique",
  },
  {
    num: "03",
    hook: "Le rapport arrive lundi",
    text: "Dans votre boîte mail, avant votre première réunion de la semaine.",
    badge: "Lecture 30 secondes",
  },
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
  {
    question: "Que se passe-t-il si peu d'employés répondent ?",
    answer:
      "Aucun rapport n'est généré en dessous de 5 réponses. C'est une garantie d'anonymat : sur une petite équipe, un chiffre isolé serait identifiable.",
  },
  {
    question: "Est-ce que ça fonctionne pour des équipes en télétravail ?",
    answer:
      "Oui. Tout passe par email, sans aucune présence physique requise. Le fonctionnement est identique sur site, en hybride ou à distance.",
  },
  {
    question: "Puis-je personnaliser les questions ?",
    answer:
      "Non, et c'est volontaire. Les 5 questions sont identiques chaque semaine : c'est ce qui rend les courbes lisibles et les comparaisons possibles d'une semaine sur l'autre. Des questions qui changent donneraient une photo ponctuelle, pas une tendance. Le champ libre facultatif est là pour tout ce qui sort du cadre.",
  },
];

function AccordionItem({ item, index }: { item: { question: string; answer: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`fade-up fade-up-delay-${(index % 3) + 1}`}
      style={{
        background: "var(--bg-card)",
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
      {/* 1. HERO 2 COLONNES */}
      <section className="fade-up" style={{ background: "var(--bg-main)", padding: "44px 5%" }}>
        <div
          className="bienvenue-hero"
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "left" }}>
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
                fontSize: 17,
                color: "var(--text-muted)",
                lineHeight: 1.6,
                maxWidth: 460,
                margin: "0 0 28px",
              }}
            >
              Vous savez déjà de quoi il s'agit. Pas un tableau de bord à interpréter : une lecture de 30 secondes, et
              trois actions pour la semaine.
            </p>
            <button className="fade-up fade-up-delay-3" {...TALLY} style={{ ...ctaStyle, margin: "0 0 14px" }}>
              Accéder au lancement →
            </button>
            <Link to="/fonctionnalites" style={textLink}>
              Voir toutes les fonctionnalités →
            </Link>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px 18px",
                marginTop: 18,
              }}
            >
              {trustBadges.map((b) => (
                <span
                  key={b}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    color: "var(--text-muted)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span style={{ color: "var(--indigo)" }}>✓</span>
                  {b}
                </span>
              ))}
            </div>
          </div>

          <RapportCard className="fade-up fade-up-delay-2" />
        </div>
      </section>

      {/* 2. CE QUE HEEDUP MESURE */}
      <section className="fade-up" style={{ background: "var(--bg-card)", padding: "40px 5%" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.9px",
              textTransform: "uppercase",
              color: "rgba(13,27,62,0.4)",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            5 dimensions, 1 champ libre
          </div>
          <h2 style={{ ...sectionTitle, margin: "0 0 10px" }}>Ce que HeedUp mesure.</h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              color: "var(--text-muted)",
              textAlign: "center",
              lineHeight: 1.6,
              maxWidth: 520,
              margin: "0 auto 24px",
            }}
          >
            Les mêmes 5 questions chaque vendredi, notées de 1 à 5. Deux minutes.
          </p>

          <div
            className="bienvenue-grid-3"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {dimensions.map(({ num, title, text }, idx) => (
              <div
                key={num}
                className={`fade-up fade-up-delay-${(idx % 3) + 1}`}
                style={{
                  ...cardStyle,
                  gridColumn: idx === 3 ? "1 / span 1" : undefined,
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
                    fontSize: 15,
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

          <div
            style={{
              background: "var(--indigo-pale)",
              border: "1px solid rgba(67,56,202,0.15)",
              borderRadius: 12,
              padding: "22px 24px",
              marginTop: 20,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--midnight)",
                marginBottom: 8,
              }}
            >
              Et un champ libre, facultatif.
            </div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                color: "var(--text-primary)",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Les scores disent qu'il se passe quelque chose. Le champ libre dit quoi. Vous ne recevez jamais les
              messages, ni cités, ni reformulés : uniquement une synthèse des thèmes qui reviennent dans l'ensemble des
              retours.
            </p>
          </div>

          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--text-muted)",
              textAlign: "center",
              lineHeight: 1.7,
              maxWidth: 600,
              margin: "20px auto 0",
            }}
          >
            Les 5 scores sont affichés séparément, avec leur évolution. Vous savez quel levier tirer, pas seulement que
            quelque chose ne va pas.
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--text-muted)",
              textAlign: "center",
              lineHeight: 1.7,
              maxWidth: 600,
              margin: "8px auto 0",
            }}
          >
            Un score isolé ne veut rien dire. C'est la répétition hebdomadaire qui fait apparaître les tendances.
          </p>
        </div>
      </section>


      {/* 2. CE QUE VIVENT VOS SALARIÉS */}
      <section className="fade-up" style={{ background: "var(--bg-card)", padding: "40px 5%" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <h2 style={sectionTitle}>Ce que vivent vos salariés.</h2>
          <div
            className="bienvenue-grid-3"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {employeeCards.map(({ Icon, title, text }, idx) => (
              <div key={title} className={`fade-up fade-up-delay-${idx + 1}`} style={cardStyle}>
                <Icon size={20} color="var(--indigo)" style={{ marginBottom: 10 }} />
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 15,
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
        </div>
      </section>

      {/* 3. ANONYMAT */}
      <section className="fade-up" style={{ background: "var(--midnight)", padding: "40px 5%" }}>
        <div
          className="bienvenue-grid-2"
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            alignItems: "start",
            textAlign: "left",
          }}
        >
          <div>
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
                margin: "0 0 18px",
              }}
            >
              Les réponses sont structurellement détachées de l'identité au niveau de la base de données. Ce n'est pas
              un paramètre que quelqu'un peut désactiver, pas même moi. C'est ce qui rend les réponses honnêtes, pas
              juste récoltées.
            </p>
            <Link to="/confidentialite" style={{ ...textLink, color: "var(--indigo-pale)" }}>
              Comment les données sont traitées →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {anonymityPoints.map((p, idx) => (
              <div
                key={p}
                className={`fade-up fade-up-delay-${idx + 1}`}
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--indigo-pale)",
                    flexShrink: 0,
                    marginTop: 8,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.7,
                  }}
                >
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DÉMARRAGE */}
      <section className="fade-up" style={{ background: "var(--bg-card)", padding: "40px 5%" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <h2 style={sectionTitle}>Vous démarrez en 10 minutes.</h2>
          <div
            className="bienvenue-grid-3"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {steps.map(({ num, text, detail }, idx) => (
              <div key={num} className={`fade-up fade-up-delay-${idx + 1}`} style={cardStyle}>
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
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    marginTop: 6,
                  }}
                >
                  {detail}
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
              margin: "18px 0 0",
            }}
          >
            Aucun appel commercial, aucune démo, aucun déploiement IT.
          </p>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="fade-up" style={{ background: "var(--bg-main)", padding: "40px 5%" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <h2 style={sectionTitle}>Les questions que vous vous posez.</h2>
          <div
            className="bienvenue-grid-2"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "start" }}
          >
            {faqItems.map((item, idx) => (
              <AccordionItem key={item.question} item={item} index={idx} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link to="/" hash="faq" style={textLink}>
              Voir toutes les questions →
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CLÔTURE */}
      <section className="fade-up" style={{ background: "var(--bg-card)", padding: "44px 5%" }}>
        <div
          style={{
            maxWidth: 620,
            margin: "0 auto",
            background: "var(--indigo-pale)",
            border: "1px solid rgba(67,56,202,0.15)",
            borderRadius: 12,
            padding: "32px 28px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              color: "var(--midnight)",
              letterSpacing: "-0.5px",
              margin: "0 0 12px",
            }}
          >
            Rejoignez les premiers managers.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              color: "var(--text-muted)",
              lineHeight: 1.6,
              margin: "0 0 24px",
            }}
          >
            Lancement prévu début septembre 2026. Les inscrits accèdent à l'outil avant l'ouverture publique, sans
            engagement.
          </p>
          <button {...TALLY} style={ctaStyle}>
            Accéder au lancement →
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              margin: "24px 0 0",
              flexWrap: "wrap",
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
                    border: "2px solid var(--indigo-pale)",
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

          <div style={{ height: 1, background: "rgba(13,27,62,0.12)", margin: "24px 0" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
                fontSize: 13,
                color: "var(--text-muted)",
                lineHeight: 1.6,
              }}
            >
              Un départ non anticipé coûte en moyenne 22 500€ (Deloitte, 2024).{" "}
              <Link to="/estimer-cout" style={textLink}>
                Estimer le coût pour mon équipe →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .bienvenue-grid-3 { grid-template-columns: 1fr !important; }
          .bienvenue-grid-2 { grid-template-columns: 1fr !important; }
          .bienvenue-hero { grid-template-columns: 1fr !important; gap: 32px !important; }
          .heedup-nav-minimal .heedup-nav-cta { display: inline-flex !important; }
        }
      `}</style>
    </SiteLayout>
  );
}
