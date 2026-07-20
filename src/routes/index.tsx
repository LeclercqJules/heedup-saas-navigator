import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { Upload, Clock, Rocket, Check, Calculator, Mail, User, Users } from "lucide-react";
import {
  IconPlayerPlay,
  IconBrain,
  IconRefresh,
  IconBuilding,
  IconTag,
  IconShieldCheck,
  IconCheck,
} from "@tabler/icons-react";
import { SiteLayout } from "@/components/SiteLayout";
import { CostCalculatorModal } from "@/components/CostCalculatorModal";
import { FloatingNav } from "@/components/FloatingNav";
import { useWaitlistCount } from "@/hooks/use-waitlist-count";


export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "HeedUp — Pilotez votre équipe sans devenir RH" },
      {
        name: "description",
        content:
          "HeedUp pilote votre équipe avec 5 questions anonymes chaque vendredi et un rapport d'équipe IA chaque lundi. Conçu pour les PME de 10 à 50 salariés, sans équipe RH.",
      },
      {
        property: "og:title",
        content: "HeedUp — Pilotez votre équipe sans devenir RH",
      },
      {
        property: "og:description",
        content:
          "5 questions anonymes chaque vendredi. Un rapport d'équipe actionnable chaque lundi. Opérationnel en 10 minutes. À partir de 50€/mois.",
      },
      { property: "og:url", content: "https://heedup.fr" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "HeedUp — Pilotez votre équipe sans devenir RH",
      },
      {
        name: "twitter:description",
        content:
          "5 questions anonymes chaque vendredi. Un rapport d'équipe actionnable chaque lundi.",
      },
    ],
    links: [{ rel: "canonical", href: "https://heedup.fr" }],
  }),
});

const whyItems = [
  {
    icon: IconPlayerPlay,
    label: "Self-serve total",
    sub: "Aucune démo requise",
    badge: "Self-serve",
    title: "Vous démarrez seul. Maintenant.",
    description: "Inscription, configuration, live ce vendredi. Sans appel commercial ou rendez-vous requis.",
    bullets: [
      "Accès immédiat, sans validation commerciale",
      "Configuration complète en moins de 10 minutes",
      "Aucun déploiement IT, aucun ticket, aucune réunion",
      "Premier survey planifié automatiquement au vendredi suivant",
    ],
  },
  {
    icon: IconBrain,
    label: "IA actionnable",
    sub: "Plan d'action, pas un score",
    badge: "IA actionnable",
    title: "Un plan d'action, pas un tableau de bord.",
    description: "HeedUp interprète vos résultats et vous dit quoi faire cette semaine, formulé pour un manager, pas pour un analyste RH.",
    bullets: [
      "Recommandations managériales générées à partir de vos données réelles",
      "Actions priorisées par impact et faisabilité",
      "Formulées pour un dirigeant, pas pour un analyste RH",
      "Effet mesurable dès le rapport de la semaine suivante",
    ],
  },
  {
    icon: IconRefresh,
    label: "Boucle hebdomadaire",
    sub: "Signal frais chaque semaine",
    badge: "Boucle hebdomadaire",
    title: "Un signal frais, chaque semaine.",
    description: "Un signal qui arrive après le problème ne sert à rien. HeedUp mesure chaque vendredi pour que vous puissiez agir dans la semaine.",
    bullets: [
      "Détection des signaux faibles avant qu'ils deviennent des problèmes",
      "Mesure de l'impact de vos actions dès la semaine suivante",
      "Tendances consultables dans le temps via le dashboard",
      "2 minutes pour vos salariés, une seule fois par semaine",
    ],
  },
  {
    icon: IconBuilding,
    label: "Calibré PME 10-50",
    sub: "Pas adapté, conçu",
    badge: "Calibré PME 10-50",
    title: "Conçu pour votre réalité, pas adapté pour elle.",
    description: "Interface, seuil d'anonymat et recommandations IA sont tous calibrés pour des équipes de 10 à 50 personnes. Pas une adaptation d'un outil pensé pour 500.",
    bullets: [
      "Anonymat statistique garanti dès 10 répondants",
      "Interface lisible sans formation RH préalable",
      "Prix structuré pour une PME, pas pour un service RH de 5 personnes",
      "Recommandations adaptées à des équipes que vous connaissez personnellement",
    ],
  },
  {
    icon: IconTag,
    label: "Prix transparents",
    sub: "Affiché avant inscription",
    badge: "Prix transparents",
    title: "Ce que vous payez, avant de vous inscrire.",
    description: "Prix public, calculé par siège. Aucun devis, aucun appel, aucune case à cocher pour voir les tarifs.",
    bullets: [
      "Prix affiché publiquement avant toute inscription",
      "Facturation mensuelle ou annuelle, résiliation libre à tout moment",
      "Aucun frais de mise en place, d'onboarding ou de support",
      "Support inclus dans tous les plans, en français",
    ],
  },
  {
    icon: IconShieldCheck,
    label: "RGPD + France",
    sub: "Conforme et souverain",
    badge: "RGPD + France",
    title: "Conforme, documenté, souverain.",
    description: "La conformité RGPD n'est pas un badge. C'est de la documentation contractuelle et un hébergement sans aucun sous-traitant américain.",
    bullets: [
      "Hébergement EU West, aucune donnée hors Union Européenne",
      "DPA contractualisé à la signature, registre de traitement inclus",
      "Politique de confidentialité employé fournie prête à l'emploi",
      "Made 100% in France, interlocuteur direct, soumis au droit français",
    ],
  },
];

function Index() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeWhy, setActiveWhy] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const waitlistCount = useWaitlistCount();

  const renderFaqAnswer = (text: string, boldPart: string) => {
    const idx = text.indexOf(boldPart);
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ fontWeight: 600, color: "var(--midnight)" }}>{boldPart}</span>
        {text.slice(idx + boldPart.length)}
      </>
    );
  };

  const faqLeft = [
    {
      q: "Mes employés vont-ils vraiment répondre ?",
      a: "C'est la question que tous nos bêta-testeurs ont posée. En moyenne, plus de 75% des salariés répondent dès le premier vendredi. La raison principale : l'anonymat est visible et garanti avant même la première réponse. Vos employés savent que vous ne pouvez pas lire leurs réponses individuelles, même si vous le vouliez.",
      b: "plus de 75% des salariés répondent dès le premier vendredi",
    },
    {
      q: "L'anonymat est-il vraiment garanti, ou c'est une promesse ?",
      a: "C'est une contrainte architecturale, pas une promesse managériale. Les réponses ne sont jamais stockées avec un identifiant nominatif. Même notre équipe ne peut pas retrouver qui a répondu quoi. Vous ne verrez toujours que des scores agrégés, peu importe le nombre de répondants.",
      b: "contrainte architecturale, pas une promesse managériale",
    },
    {
      q: "Que reçoit exactement le manager chaque lundi ?",
      a: "Un email avec votre Rapport d'équipe : 3 scores agrégés (charge, ambiance, motivation), le delta par rapport à la semaine précédente, le taux de réponse, et 2 à 3 recommandations managériales concrètes générées par IA. Vous comprenez l'état de votre équipe en moins de 2 minutes.",
      b: "Rapport d'équipe",
    },
    {
      q: "Combien de temps ça prend à mettre en place ?",
      a: "Moins de 10 minutes. Vous créez votre compte, importez les emails de votre équipe (CSV ou saisie manuelle), et activez le premier survey. Aucun IT requis, aucun déploiement. Le premier survey part automatiquement le vendredi suivant.",
      b: "Aucun IT requis, aucun déploiement",
    },
    {
      q: "Mes employés doivent-ils créer un compte ?",
      a: "Non. Vos salariés reçoivent un lien par email chaque vendredi. Ils répondent directement depuis ce lien, sans inscription, sans application, sans mot de passe à retenir. Zéro friction de leur côté.",
      b: "un lien par email chaque vendredi",
    },
  ];

  const faqRight = [
    {
      q: "HeedUp remplace-t-il les entretiens annuels ?",
      a: "Non, et ce n'est pas l'objectif. HeedUp détecte les signaux faibles en continu, semaine après semaine. L'entretien annuel reste votre espace de dialogue approfondi. HeedUp vous aide à y arriver avec une vraie visibilité sur l'année, pas juste un ressenti.",
      b: "en continu, semaine après semaine",
    },
    {
      q: "Que se passe-t-il si peu d'employés répondent ?",
      a: "Sous 5 répondants, les scores ne sont pas affichés pour préserver l'anonymat statistique. Vous recevez une alerte avec le faible taux de participation et une suggestion pour améliorer l'adhésion. En pratique, nos bêta-testeurs observent un taux supérieur à 70% dès la deuxième semaine.",
      b: "préserver l'anonymat statistique",
    },
    {
      q: "Est-ce que ça fonctionne pour des équipes en télétravail ?",
      a: "Oui, c'est même là qu'il est le plus utile. Sur des équipes hybrides ou distantes, le manager voit moins ses employés au quotidien. HeedUp comble précisément ce manque de visibilité informelle que le bureau permettait naturellement.",
      b: "le plus utile",
    },
    {
      q: "Puis-je personnaliser les questions ?",
      a: "Dans la V1, les 5 questions sont fixes et ancrées sur le modèle Gallup Q12, validé scientifiquement sur des milliers d'équipes. Elles couvrent charge, ambiance, motivation, clarté des missions et relation au travail. La personnalisation est prévue dans les prochaines versions.",
      b: "Gallup Q12",
    },
    {
      q: "Où sont hébergées les données de mes employés ?",
      a: "En France. HeedUp utilise Supabase sur la région Paris (eu-west-3), ce qui garantit que vos données ne quittent pas le territoire français. HeedUp fournit un DPA contractualisé à la signature et un registre de traitement sur demande. Conforme RGPD par conception.",
      b: "En France",
    },
  ];

  const renderFaqItem = (item: { q: string; a: string; b: string }, id: number) => {
    const isOpen = openFaq === id;
    return (
      <div key={id} style={{ borderBottom: "1px solid rgba(67,56,202,0.08)", padding: 0 }}>
        <button
          type="button"
          onClick={() => setOpenFaq(isOpen ? null : id)}
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            padding: "20px 0",
            cursor: "pointer",
            userSelect: "none",
            width: "100%",
            background: "transparent",
            border: "none",
            textAlign: "left",
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--midnight)",
            lineHeight: 1.4,
          }}
        >
          <span>{item.q}</span>
          <span
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: isOpen ? "var(--indigo)" : "#EEEEFF",
              color: isOpen ? "#FFFFFF" : "var(--indigo)",
              flexShrink: 0,
              marginTop: "1px",
              fontSize: "14px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            {isOpen ? "−" : "+"}
          </span>
        </button>
        {isOpen && (
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13.5px",
              color: "var(--text-muted)",
              lineHeight: 1.7,
              paddingBottom: "20px",
              maxWidth: "480px",
            }}
          >
            {renderFaqAnswer(item.a, item.b)}
          </div>
        )}
      </div>
    );
  };

  const steps = [
    {
      num: "01",
      label: "Connectez\nvotre équipe",
      badge: "Mise en place · 10 minutes",
      title: "Connectez votre équipe",
      description: (
        <>Importez les emails de vos salariés. Moins de 10 minutes, aucune installation de leur côté. Aucun appel commercial requis, mise en place immédiate.</>
      ),
      calloutLabel: "ACTIF DÈS CE VENDREDI",
      calloutText: "Vous configurez une fois. HeedUp envoie automatiquement chaque semaine, sans que vous ayez à y penser.",
      visual: "setup" as const,
    },
    {
      num: "02",
      label: "5 questions\nanonymes",
      badge: "Vendredi · 9h00",
      title: "5 questions anonymes",
      description: (
        <>Vos salariés reçoivent un lien par email. Ils répondent en 2 minutes, depuis leur téléphone ou ordinateur. Pas de compte à créer, <span style={{ fontWeight: 700 }}>anonymat</span> garanti dès la première réponse.</>
      ),
      calloutLabel: "TAUX DE RÉPONSE MOYEN",
      calloutText: "L'anonymat garanti dès le premier écran est le principal facteur de réponse. Vos salariés répondent parce qu'ils savent que c'est vrai.",
      visual: "phone" as const,
    },
    {
      num: "03",
      label: "Votre Rapport\nd'équipe",
      badge: "Lundi · 8h00",
      title: "Votre Rapport d'équipe",
      description: (
        <>3 scores agrégés, la tendance de la semaine, et le signal à surveiller en priorité. Vous comprenez l'état de votre équipe en 2 minutes.</>
      ),
      calloutLabel: "PAS UN DASHBOARD À INTERPRÉTER",
      calloutText: "Les scores arrivent avec le contexte. Vous voyez immédiatement ce qui change et dans quel sens.",
      visual: "scores" as const,
    },
    {
      num: "04",
      label: "Vous agissez,\nvous mesurez",
      badge: "Dans la semaine",
      title: "Vous agissez, vous mesurez",
      description: (
        <>2 à 3 recommandations managériales concrètes vous sont proposées, calibrées sur vos résultats réels. Leur effet apparaît dès le rapport suivant.</>
      ),
      calloutLabel: "RECOMMANDATIONS MANAGÉRIALES, PAS DES KPIs",
      calloutText: "HeedUp ne vous donne pas un score à interpréter. Il vous donne une action à faire cette semaine, formulée pour un manager, pas pour un DRH.",
      visual: "recos" as const,
    },
  ];

  const current = steps[activeStep];

  return (
    <SiteLayout>
      {/* Hero */}
      <section
        id="hero"
        className="heedup-hero"
        style={{
          height: "calc(100vh - 84px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "var(--bg-main)",
        }}
      >
        <div
          className="heedup-hero-inner"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 5%",
          }}
        >
          <div className="heedup-hero-grid grid w-full items-center md:grid-cols-2" style={{ gap: "64px" }}>
            {/* Colonne gauche : texte */}
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "var(--indigo-pale)",
                  color: "var(--midnight)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: "5px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Votre équipe, enfin lisible.
              </span>

              <h1
                className="heedup-hero-h1"
                style={{
                  fontFamily: "var(--font-display)",
                fontSize: "58px",
                lineHeight: 1.08,
                letterSpacing: "-1.5px",
                color: "var(--midnight)",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                Votre prochain départ surprise, vous l'aurez{" "}
                <span style={{ fontStyle: "italic", color: "var(--indigo)" }}>vu venir</span>.
              </h1>

              <p
                className="heedup-hero-sub"
                style={{
                  fontFamily: "var(--font-sans)",
                  maxWidth: "460px",
                  fontSize: "17px",
                  lineHeight: 1.7,
                  color: "var(--text-muted)",
                  marginBottom: "32px",
                }}
              >
                Pilotez votre équipe sans devenir RH. 5 questions anonymes chaque vendredi, un rapport d'équipe actionnable chaque lundi.
              </p>

              <div
                className="heedup-hero-actions"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <button
                  type="button"
                  className="heedup-hero-cta inline-flex items-center gap-2"
                  {...{
                    "data-tally-open": "obpYab",
                    "data-tally-overlay": "1",
                    "data-tally-emoji-text": "👋",
                    "data-tally-emoji-animation": "wave",
                    "data-tally-width": "500",
                  }}
                  style={{
                    backgroundColor: "var(--indigo)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "16px",
                    borderRadius: "8px",
                    padding: "15px 28px",
                    fontFamily: "var(--font-sans)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Rejoindre la liste d'attente →
                </button>


                <div
                  className="heedup-hero-social inline-flex items-center gap-2"
                  style={{
                    marginTop: "14px",
                    backgroundColor: "rgba(67,56,202,0.07)",
                    borderRadius: "20px",
                    padding: "7px 16px",
                    alignSelf: "flex-start",
                  }}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full animate-pulse"
                    style={{ backgroundColor: "var(--semantic-green)" }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--midnight)",
                    }}
                  >
                    {waitlistCount} dirigeants déjà sur la liste d'attente
                  </span>
                </div>
              </div>
            </div>

            {/* Colonne droite : carte */}
            <div
              className="heedup-hero-card"
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "12px",
                border: "1px solid rgba(67,56,202,0.12)",
                overflow: "hidden",
                fontFamily: "var(--font-sans)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  backgroundColor: "var(--midnight)",
                  padding: "14px 22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: "#FFFFFF",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ color: "var(--indigo)" }}>●</span>
                  Rapport d'équipe — Lundi 16 juin
                </div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                  Semaine 24
                </div>
              </div>

              {/* 3 scores */}
              <div
                className="grid grid-cols-3 gap-4 p-5"
                style={{ backgroundColor: "var(--bg-main)" }}
              >
                {[
                  { label: "Charge", value: "3.6", change: "▼ 0.3", changeColor: "var(--semantic-red)" },
                  { label: "Ambiance", value: "4.1", change: "▲ 0.2", changeColor: "var(--semantic-green)" },
                  { label: "Motivation", value: "4.3", change: "—", changeColor: "var(--text-muted)" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg p-4 text-center"
                    style={{ backgroundColor: "var(--bg-card)" }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "4px",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: "26px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </div>
                    <div style={{ fontSize: "12px", color: s.changeColor, marginTop: "4px" }}>
                      {s.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommandations */}
              <div className="px-6 pt-5 pb-2">
                <div
                  style={{
                    fontSize: "11.5px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                    marginBottom: "12px",
                  }}
                >
                  Recommandations IA
                </div>
                <div
                  className="mb-4 flex items-start gap-3 rounded-lg p-4"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.18)",
                  }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{ backgroundColor: "var(--semantic-red)", width: "18px", height: "18px" }}
                  >
                    <span style={{ fontSize: "11px", color: "#FFFFFF" }}>↓</span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.5,
                      color: "var(--text-primary)",
                    }}
                  >
                    Charge en baisse 2 semaines. Organisez un point d'équipe avant vendredi.
                  </p>
                </div>
                <div
                  className="mb-4 flex items-start gap-3 rounded-lg p-4"
                  style={{
                    backgroundColor: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.18)",
                  }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{ backgroundColor: "var(--semantic-green)", width: "18px", height: "18px" }}
                  >
                    <span style={{ fontSize: "11px", color: "#FFFFFF" }}>↑</span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.5,
                      color: "var(--text-primary)",
                    }}
                  >
                    Ambiance en hausse. Bon moment pour lancer un projet à forte visibilité.
                  </p>
                </div>
                <div
                  className="mb-4 flex items-start gap-3 rounded-lg p-4"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.18)",
                  }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{ backgroundColor: "var(--semantic-red)", width: "18px", height: "18px" }}
                  >
                    <span style={{ fontSize: "11px", color: "#FFFFFF" }}>!</span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.5,
                      color: "var(--text-primary)",
                    }}
                  >
                    2 employés n'ont pas répondu cette semaine. Envoie un rappel discret avant vendredi. Le silence est aussi un signal.
                  </p>
                </div>
              </div>

              {/* Footer carte */}
              <div className="px-6 pb-6 pt-3">
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    marginBottom: "10px",
                  }}
                >
                  Taux de réponse : 8 / 10 employés
                </div>
                <div
                  style={{
                    height: "7px",
                    backgroundColor: "rgba(67,56,202,0.1)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "80%",
                      height: "100%",
                      backgroundColor: "var(--indigo)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div
          id="impact"
          className="heedup-trust"
          style={{
            backgroundColor: "var(--midnight)",
            padding: "16px 5%",
          }}
        >
          <div className="heedup-trust-inner flex flex-wrap items-center justify-center" style={{ gap: "36px" }}>
            {[
              "RGPD natif",
              "Hébergé en France",
              "Réponses anonymes",
              "Actif en 10 minutes",
              "Sans engagement",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <span style={{ color: "var(--indigo-pale)" }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact business */}
      <section
        className="heedup-impact"
        style={{
          backgroundColor: "var(--bg-main)",
          padding: "64px 5%",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="text-center" style={{ marginBottom: "40px" }}>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.9px",
                textTransform: "uppercase",
                color: "var(--midnight)",
                opacity: 0.35,
                marginBottom: "12px",
              }}
            >
              IMPACT BUSINESS
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "52px",
                letterSpacing: "-1px",
                lineHeight: 1.15,
                color: "var(--midnight)",
                marginBottom: "12px",
              }}
            >
              Ce que les données disent de vos équipes.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "19px",
                lineHeight: 1.65,
                color: "var(--text-muted)",
                marginBottom: "40px",
                maxWidth: "620px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              On ne perd pas un salarié le jour de sa démission. On le perd bien avant, en silence.
            </p>
          </div>

          <div
            className="heedup-impact-grid grid grid-cols-1 gap-[14px] md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                eyebrow: "TAUX D'ENGAGEMENT",
                figure: "13 %",
                label: "des salariés français réellement engagés dans leur travail, l'un des taux les plus bas en Europe.",
                source: "Gallup, 2024",
              },
              {
                eyebrow: "COÛT CHRONIQUE",
                figure: "~14 300 €",
                label: "par salarié et par an, le coût du désengagement en France, avant même le moindre départ.",
                source: "IBET, 2024",
              },
              {
                eyebrow: "COÛT D'UN DÉPART",
                figure: "15–30 K€",
                label: "le coût réel d'un départ en PME, recrutement, formation et désorganisation compris.",
                source: "Deloitte, 2024",
              },
              {
                eyebrow: "LE LEVIER MANAGER",
                figure: "70 %",
                label: "du climat d'équipe dépend directement du manager, pas de la politique RH globale.",
                source: "Gallup, 2024",
              },
            ].map((c) => (
              <div
                key={c.figure}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid rgba(67,56,202,0.10)",
                  borderTop: "3px solid var(--midnight)",
                  borderRadius: "12px",
                  padding: "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                  }}
                >
                  {c.eyebrow}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "52px",
                    lineHeight: 1,
                    color: "var(--midnight)",
                  }}
                >
                  {c.figure}
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "14.5px",
                    lineHeight: 1.6,
                    color: "var(--text-primary)",
                    flex: 1,
                  }}
                >
                  {c.label}
                </p>
                <span
                  style={{
                    backgroundColor: "#EEEEFF",
                    color: "var(--midnight)",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    display: "inline-block",
                    alignSelf: "flex-start",
                  }}
                >
                  {c.source}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: "32px" }}>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "var(--text-muted)",
                marginBottom: "14px",
              }}
            >
              Combien vous coûte réellement le désengagement dans votre équipe ?
            </p>
            <a
              href="/estimer-cout"
              className="inline-flex items-center gap-2"
              style={{
                backgroundColor: "var(--indigo)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "16px",
                borderRadius: "8px",
                padding: "14px 32px",
                fontFamily: "var(--font-sans)",
                border: "none",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <Calculator size={18} strokeWidth={2} />
              Estimer le coût pour mon équipe
            </a>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" style={{ backgroundColor: "#EEEEFF", padding: "64px 5%" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Intro */}
          <div className="text-center">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "56px",
                letterSpacing: "-1px",
                lineHeight: 1.05,
                color: "var(--midnight)",
                marginBottom: "16px",
              }}
            >
              Comment ça{" "}
              <span style={{ fontStyle: "italic", color: "var(--indigo)" }}>marche ?</span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                color: "var(--midnight)",
                marginBottom: "8px",
              }}
            >
              De la question posée à l'action, en une semaine.
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                fontStyle: "italic",
                color: "var(--text-muted)",
                maxWidth: "480px",
                margin: "0 auto 48px",
                lineHeight: 1.6,
              }}
            >
              Une seule boucle, automatique. Vous la mettez en place une fois, elle tourne toute seule.
            </p>
          </div>

          {/* Stepper */}
          <div
            className="heedup-steps"
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              padding: "6px",
              border: "1px solid rgba(67,56,202,0.10)",
              display: "flex",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            {steps.map((s, i) => (
              <Fragment key={s.num}>
                {i > 0 && (
                  <div
                    style={{ width: "1px", height: "40px", backgroundColor: "rgba(13,27,62,0.10)" }}
                  />
                )}
                <button
                  key={s.num}
                  onClick={() => setActiveStep(i)}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    padding: "14px 8px",
                    borderRadius: "8px",
                    border: "none",
                    background: activeStep === i ? "var(--midnight)" : "transparent",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: activeStep === i ? "var(--indigo)" : "#EEEEFF",
                      color: activeStep === i ? "#FFFFFF" : "var(--midnight)",
                      fontFamily: "var(--font-display)",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.num}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: activeStep === i ? "#EEEEFF" : "var(--text-muted)",
                      textAlign: "center",
                      letterSpacing: "0.3px",
                      lineHeight: 1.3,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {s.label}
                  </div>
                </button>
              </Fragment>
            ))}
          </div>

          {/* Content card */}
          <div
            className="heedup-step-panel"
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              border: "1px solid rgba(67,56,202,0.10)",
              overflow: "hidden",
              marginBottom: "28px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              minHeight: "280px",
            }}
          >
            {/* Left column */}
            <div
              style={{
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "14px",
                borderRight: "1px solid rgba(67,56,202,0.08)",
              }}
            >
              <span
                style={{
                  backgroundColor: "var(--midnight)",
                  color: "#EEEEFF",
                  fontSize: "10px",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.7px",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  gap: "6px",
                }}
              >
                {current.badge}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "26px",
                  color: "var(--midnight)",
                }}
              >
                {current.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                  lineHeight: 1.7,
                }}
              >
                {current.description}
              </p>
              <div
                style={{
                  backgroundColor: "#EEEEFF",
                  borderRadius: "8px",
                  padding: "14px 16px",
                  borderLeft: "3px solid var(--indigo)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    color: "var(--indigo)",
                    marginBottom: "5px",
                  }}
                >
                  {current.calloutLabel}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    color: "var(--midnight)",
                    lineHeight: 1.55,
                  }}
                >
                  {current.calloutText}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div
              style={{
                padding: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--bg-main)",
              }}
            >
              {current.visual === "setup" && <SetupVisual />}
              {current.visual === "phone" && <PhoneVisual />}
              {current.visual === "scores" && <ScoresVisual />}
              {current.visual === "recos" && <RecosVisual />}
            </div>
          </div>

          {/* Closing line */}
          <div
            style={{
              borderTop: "1px solid rgba(67,56,202,0.10)",
              paddingTop: "24px",
              maxWidth: "600px",
              margin: "0 auto",
              textAlign: "center",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              color: "var(--text-muted)",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            Pas de paramétrage, pas de tableau de bord à configurer. Le vendredi part tout seul, le lundi vous lisez, c'est tout.
          </div>
        </div>
      </section>

      {/* Simple pour vous, simple pour eux */}
      <section id="simplicite" style={{ backgroundColor: "var(--bg-card)", padding: "64px 5%" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Intro */}
          <div className="text-center" style={{ marginBottom: "52px" }}>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "var(--midnight)",
                opacity: 0.35,
                marginBottom: "12px",
              }}
            >
              ZÉRO FRICTION
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "52px",
                letterSpacing: "-1px",
                lineHeight: 1.08,
                color: "var(--midnight)",
                marginBottom: "14px",
              }}
            >
              Simple pour vous,{" "}
              <span style={{ fontStyle: "italic", color: "var(--indigo)" }}>simple pour eux.</span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "17px",
                lineHeight: 1.6,
                color: "var(--text-muted)",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              L'outil qui s'efface est celui qu'on utilise vraiment. HeedUp est conçu pour disparaître dans votre routine.
            </p>
          </div>

          {/* Two columns */}
          <div
            className="heedup-simplicite"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "stretch",
              gap: "0",
            }}
          >
            {/* Left column */}
            <div
              style={{
                backgroundColor: "var(--bg-main)",
                borderRadius: "12px",
                border: "1px solid rgba(67,56,202,0.10)",
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <span
                style={{
                  backgroundColor: "var(--midnight)",
                  color: "#EEEEFF",
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <User size={13} strokeWidth={2} />
                Pour vous, le manager
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  lineHeight: 1.25,
                  letterSpacing: "-0.3px",
                  color: "var(--midnight)",
                }}
              >
                Vous pilotez. Vous ne maintenez pas.
              </h3>

              {[
                {
                  label: "Pas de projet informatique",
                  desc: "Aucune intégration SIRH, aucun ticket IT, aucune réunion de déploiement. Vous importez un fichier CSV et c'est terminé.",
                },
                {
                  label: "L'information vient à vous",
                  desc: "Vous n'ouvrez pas un outil pour aller chercher les données. Le rapport d'équipe arrive dans votre boîte mail. Vous n'avez rien à déclencher.",
                },
                {
                  label: "Des actions, pas des données brutes",
                  desc: "HeedUp ne vous donne pas un score à interpréter. Il vous dit quoi faire cette semaine, formulé pour un manager, pas pour un analyste RH.",
                },
                {
                  label: "Un budget PME, pas un budget ETI",
                  desc: "À partir de 50€/mois, sans engagement annuel obligatoire. Prix affiché publiquement, sans devis, sans appel commercial préalable.",
                },
              ].map((b) => (
                <div
                  key={b.label}
                  style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: "var(--midnight)",
                      color: "#EEEEFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 700 }}>✓</span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "13.5px",
                        fontWeight: 600,
                        color: "var(--midnight)",
                        marginBottom: "3px",
                      }}
                    >
                      {b.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "12.5px",
                        lineHeight: 1.55,
                        color: "var(--text-muted)",
                      }}
                    >
                      {b.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Central separator */}
            <div
              style={{
                padding: "0 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <div style={{ width: "1px", flex: 1, backgroundColor: "rgba(67,56,202,0.15)" }} />
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "var(--midnight)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  color: "#EEEEFF",
                }}
              >
                H
              </div>
              <div style={{ width: "1px", flex: 1, backgroundColor: "rgba(67,56,202,0.15)" }} />
            </div>

            {/* Right column */}
            <div
              style={{
                backgroundColor: "var(--bg-main)",
                borderRadius: "12px",
                border: "1px solid rgba(67,56,202,0.10)",
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <span
                style={{
                  backgroundColor: "var(--indigo)",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Users size={13} strokeWidth={2} />
                Pourquoi vos salariés répondent vraiment
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  lineHeight: 1.25,
                  letterSpacing: "-0.3px",
                  color: "var(--midnight)",
                }}
              >
                Ils participent parce qu'ils font confiance.
              </h3>

              {[
                {
                  label: "L'anonymat est dans le code, pas dans la charte",
                  desc: "Même vous ne pouvez pas voir les réponses individuelles. Ce n'est pas une promesse managériale, c'est une contrainte architecturale.",
                },
                {
                  label: "Un seul contact par semaine",
                  desc: "Un email le vendredi matin. Pas d'app, pas de compte, pas de relance. Moins intrusif qu'un point d'équipe.",
                },
                {
                  label: "Ils voient que ça change quelque chose",
                  desc: "Quand vos actions du lundi reflètent les signaux de la semaine, le taux de réponse monte. La boucle de confiance se referme d'elle-même.",
                },
                {
                  label: "Zéro surcharge cognitive",
                  desc: "5 questions, une échelle de 1 à 5, 2 minutes. Aucune question ouverte obligatoire, aucun formulaire à rallonge.",
                },
              ].map((b) => (
                <div
                  key={b.label}
                  style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: "var(--indigo)",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 700 }}>✓</span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "13.5px",
                        fontWeight: 600,
                        color: "var(--midnight)",
                        marginBottom: "3px",
                      }}
                    >
                      {b.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "12.5px",
                        lineHeight: 1.55,
                        color: "var(--text-muted)",
                      }}
                    >
                      {b.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Closing line */}
          <div
            style={{
              borderTop: "1px solid rgba(67,56,202,0.08)",
              paddingTop: "32px",
              marginTop: "40px",
              maxWidth: "580px",
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              color: "var(--text-muted)",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            Un outil que vos salariés acceptent d'utiliser est un outil qui vous donne de vraies données. C'est le seul pari de HeedUp.
          </div>
        </div>
      </section>

      {/* Pourquoi HeedUp */}
      <section id="pourquoi" style={{ backgroundColor: "var(--bg-main)", padding: "64px 5%" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Intro */}
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "52px",
                letterSpacing: "-1px",
                lineHeight: 1.08,
                color: "var(--midnight)",
                marginBottom: "14px",
              }}
            >
              Pourquoi{" "}
              <span style={{ fontStyle: "italic", color: "var(--indigo)" }}>HeedUp</span> ?
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "17px",
                lineHeight: 1.6,
                color: "var(--text-muted)",
                maxWidth: "520px",
                margin: "0 auto",
              }}
            >
              Plusieurs outils mesurent l'engagement. HeedUp est conçu pour que vous fassiez quelque chose des résultats.
            </p>
          </div>

          {/* Layout */}
          <div
            className="heedup-pourquoi"
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              gap: "16px",
              alignItems: "start",
            }}
          >
            {/* Vertical nav */}
            <div
              className="heedup-pourquoi-nav"
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "12px",
                border: "1px solid rgba(67,56,202,0.10)",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {whyItems.map((item, idx) => {
                const isActive = activeWhy === idx;
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => setActiveWhy(idx)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: isActive ? "#EEEEFF" : "transparent",
                      cursor: "pointer",
                      borderLeft: `3px solid ${isActive ? "var(--indigo)" : "transparent"}`,
                      textAlign: "left",
                    }}
                  >
                    <Icon
                      size={18}
                      style={{
                        color: isActive ? "var(--indigo)" : "var(--text-muted)",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--midnight)",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "11.5px",
                          color: "var(--text-muted)",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Panels */}
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "12px",
                border: "1px solid rgba(67,56,202,0.10)",
                overflow: "hidden",
              }}
            >
              {whyItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    style={{
                      display: activeWhy === idx ? "block" : "none",
                      padding: "48px 52px",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "var(--midnight)",
                        color: "#EEEEFF",
                        fontFamily: "var(--font-sans)",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.6px",
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        marginBottom: "20px",
                      }}
                    >
                      <Icon size={13} strokeWidth={2} />
                      {item.badge}
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "26px",
                        color: "var(--midnight)",
                        letterSpacing: "-0.3px",
                        lineHeight: 1.2,
                        marginBottom: "16px",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "16px",
                        color: "var(--text-muted)",
                        lineHeight: 1.65,
                        marginBottom: "32px",
                        maxWidth: "560px",
                      }}
                    >
                      {item.description}
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0",
                      }}
                    >
                      {item.bullets.map((bullet, bidx) => {
                        const isLeft = bidx % 2 === 0;
                        const isSecondRow = bidx >= 2;
                        return (
                          <div
                            key={bullet}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              padding: isLeft
                                ? "14px 24px 14px 0"
                                : "14px 0 14px 24px",
                              borderTop: "1px solid rgba(67,56,202,0.07)",
                              borderBottom: isSecondRow
                                ? "1px solid rgba(67,56,202,0.07)"
                                : undefined,
                              borderRight: isLeft
                                ? "1px solid rgba(67,56,202,0.07)"
                                : undefined,
                            }}
                          >
                            <div
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                backgroundColor: "#EEEEFF",
                                color: "var(--indigo)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <IconCheck size={13} strokeWidth={3} />
                            </div>
                            <div
                              style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "var(--midnight)",
                                lineHeight: 1.4,
                              }}
                            >
                              {bullet}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section id="temoignages" style={{ backgroundColor: "var(--bg-card)", padding: "64px 5%" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Intro */}
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "var(--midnight)",
                opacity: 0.35,
                marginBottom: "12px",
              }}
            >
              ILS ONT TESTÉ HEEDUP
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "52px",
                letterSpacing: "-1px",
                lineHeight: 1.08,
                color: "var(--midnight)",
                marginBottom: "14px",
              }}
            >
              Ce que les premiers dirigeants{" "}
              <span style={{ fontStyle: "italic", color: "var(--indigo)" }}>en disent.</span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "17px",
                lineHeight: 1.6,
                color: "var(--text-muted)",
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              Bêta-testeurs recrutés avant le lancement public.
            </p>
          </div>

          {/* Grille 3 colonnes */}
          <div
            className="heedup-testimonials"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {[
              {
                stars: "★★★★★",
                tag: "Restauration · 18 sal.",
                quote:
                  "Au début j'étais sceptique, je pensais que mes employés n'allaient jamais répondre à un truc comme ça. Le premier vendredi, 15 sur 18 ont répondu. Et le rapport m'a montré que la charge était bien plus lourde qu'ils ne me le laissaient voir.",
                initial: "M",
                name: "Marie L.",
                role: "Gérante, Bordeaux",
              },
              {
                stars: "★★★★★",
                tag: "Transport · 34 sal.",
                quote:
                  "J'ai des équipes de nuit que je vois deux fois par semaine. Avec HeedUp, j'ai su pour la première fois ce qu'ils pensaient vraiment, sans avoir à les convoquer pour ça. C'est ça qui change.",
                initial: "T",
                name: "Thomas D.",
                role: "Directeur opérationnel, Lyon",
              },
              {
                stars: "★★★★★",
                tag: "Services B2B · 22 sal.",
                quote:
                  "Je pensais que la motivation était le problème dans mon équipe. Les scores m'ont montré que c'était la charge. J'ai réorganisé les priorités de la semaine, et deux semaines après les chiffres remontaient. Sans ça, je me serais trompée de sujet.",
                initial: "C",
                name: "Camille R.",
                role: "Co-gérante, Nantes",
              },
            ].map((t) => (
              <div
                key={t.name}
                style={{
                  backgroundColor: "var(--bg-main)",
                  borderRadius: "12px",
                  border: "1px solid rgba(67,56,202,0.10)",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                {/* Ligne top */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      letterSpacing: "2px",
                      color: "var(--indigo)",
                    }}
                  >
                    {t.stars}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      backgroundColor: "rgba(67,56,202,0.07)",
                      padding: "3px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {t.tag}
                  </div>
                </div>

                {/* Quote */}
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "15px",
                    lineHeight: 1.65,
                    color: "var(--midnight)",
                    flex: 1,
                  }}
                >
                  {t.quote}
                </p>

                {/* Auteur */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(67,56,202,0.08)",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "var(--midnight)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontSize: "17px",
                      color: "#EEEEFF",
                    }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--midnight)",
                        marginBottom: "2px",
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "11.5px",
                        lineHeight: 1.4,
                        color: "var(--text-muted)",
                      }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ backgroundColor: "var(--bg-card)", padding: "64px 5%" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              textTransform: "uppercase",
              fontWeight: 700,
              letterSpacing: "1px",
              color: "var(--midnight)",
              opacity: 0.35,
              marginBottom: "12px",
            }}
          >
            FAQ
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "52px",
              color: "var(--midnight)",
              letterSpacing: "-1px",
              lineHeight: 1.08,
              marginBottom: "14px",
            }}
          >
            Les questions que{" "}
            <span style={{ fontStyle: "italic", color: "var(--indigo)" }}>
              vous posez sûrement.
            </span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "17px",
              color: "var(--text-muted)",
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            Réponses directes, sans langue de bois.
          </p>
        </div>
        <div
          className="heedup-faq"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 48px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <div>{faqLeft.map((item, i) => renderFaqItem(item, i))}</div>
          <div>{faqRight.map((item, i) => renderFaqItem(item, i + faqLeft.length))}</div>
        </div>
      </section>

      {/* CTA final */}
      <section id="rejoindre" style={{ backgroundColor: "#EEEEFF", padding: "80px 5%", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "38px",
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
            color: "var(--midnight)",
            marginBottom: "14px",
          }}
        >
          Arrêtez de découvrir les problèmes trop tard.
        </h2>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "17px",
            lineHeight: 1.6,
            color: "var(--text-muted)",
            maxWidth: "480px",
            margin: "0 auto 32px",
          }}
        >
          Rejoignez les {waitlistCount} dirigeants déjà sur la liste d'attente. Lancement dans les prochaines semaines.
        </p>
        <button
          type="button"
          {...{
            "data-tally-open": "obpYab",
            "data-tally-overlay": "1",
            "data-tally-emoji-text": "👋",
            "data-tally-emoji-animation": "wave",
            "data-tally-width": "500",
          }}
          style={{
            backgroundColor: "var(--indigo)",
            color: "#FFFFFF",
            fontFamily: "var(--font-sans)",
            fontSize: "16px",
            fontWeight: 700,
            padding: "14px 32px",
            borderRadius: "8px",
            border: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          Rejoindre la liste d'attente →
        </button>

      </section>

      <FloatingNav />
      <CostCalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </SiteLayout>
  );
}

const cardBase: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: "8px",
  padding: "12px 14px",
  border: "1px solid rgba(67,56,202,0.10)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  fontFamily: "var(--font-sans)",
};

const iconBox: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "6px",
  backgroundColor: "var(--midnight)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#EEEEFF",
  flexShrink: 0,
};

const checkCircle: React.CSSProperties = {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  backgroundColor: "#EEEEFF",
  color: "var(--indigo)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: "auto",
  flexShrink: 0,
};

function SetupRow({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div style={cardBase}>
      <div style={iconBox}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--midnight)" }}>{title}</div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
          {subtitle}
        </div>
      </div>
      <div style={checkCircle}>
        <Check size={12} strokeWidth={3} />
      </div>
    </div>
  );
}

function SetupVisual() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
      <SetupRow
        icon={<Upload size={16} strokeWidth={2} />}
        title="Import CSV des emails"
        subtitle="marie@restaurant.fr, thomas@logistique.fr..."
      />
      <SetupRow
        icon={<Clock size={16} strokeWidth={2} />}
        title="Jour d'envoi configuré"
        subtitle="Chaque vendredi à 9h00"
      />
      <SetupRow
        icon={<Rocket size={16} strokeWidth={2} />}
        title="Premier survey planifié"
        subtitle="Vendredi 13 juin · 9h00"
      />
    </div>
  );
}

function PhoneVisual() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Mini preview email */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          border: "1px solid rgba(67,56,202,0.1)",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "12px",
          fontFamily: "var(--font-sans)",
          width: "180px",
        }}
      >
        <Mail size={16} style={{ color: "var(--indigo)", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--midnight)" }}>
            HeedUp · Votre avis de la semaine
          </div>
          <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
            Vendredi · 9h00
          </div>
        </div>
      </div>

      {/* Phone */}
      <div
        style={{
          backgroundColor: "var(--midnight)",
          borderRadius: "20px",
          padding: "16px",
          width: "180px",
          fontFamily: "var(--font-sans)",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "4px",
            backgroundColor: "rgba(255,255,255,0.2)",
            margin: "0 auto 12px",
            borderRadius: "2px",
          }}
        />
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            padding: "14px",
          }}
        >
          <div style={{ fontSize: "9px", color: "var(--text-muted)", marginBottom: "4px" }}>
            2 / 5 complétées
          </div>
          <div
            style={{
              height: "3px",
              backgroundColor: "rgba(67,56,202,0.12)",
              borderRadius: "2px",
              overflow: "hidden",
              marginBottom: "10px",
            }}
          >
            <div
              style={{ width: "40%", height: "100%", backgroundColor: "var(--indigo)", borderRadius: "2px" }}
            />
          </div>
          <div
            style={{
              fontSize: "9px",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "8px",
            }}
          >
            Question 2 sur 5
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--midnight)",
              lineHeight: 1.4,
              marginBottom: "10px",
            }}
          >
            Comment évaluez-vous votre niveau d'énergie cette semaine ?
          </div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "var(--indigo)",
              marginBottom: "10px",
            }}
          >
            🔒 Réponse anonyme
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "6px 0",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: 700,
                  backgroundColor: n === 3 ? "var(--indigo)" : "#EEEEFF",
                  color: n === 3 ? "#FFFFFF" : "var(--midnight)",
                }}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoresVisual() {
  const scores = [
    { label: "CHARGE", value: "3.6", delta: "▼ 0.3 vs semaine dernière", color: "var(--semantic-red)" },
    { label: "AMBIANCE", value: "4.1", delta: "▲ 0.2 vs semaine dernière", color: "var(--semantic-green)" },
    { label: "MOTIVATION", value: "4.3", delta: "— stable", color: "var(--text-muted)" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
      {scores.map((s) => (
        <div
          key={s.label}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            padding: "12px 16px",
            border: "1px solid rgba(67,56,202,0.10)",
            display: "grid",
            gridTemplateColumns: "1fr 50px 1fr",
            alignItems: "center",
            fontFamily: "var(--font-sans)",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              fontWeight: 600,
              letterSpacing: "0.6px",
              textAlign: "left",
            }}
          >
            {s.label}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              color: "var(--midnight)",
              textAlign: "left",
            }}
          >
            {s.value}
          </div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: s.color, textAlign: "right" }}>{s.delta}</div>
        </div>
      ))}
    </div>
  );
}

function RecosVisual() {
  const recos = [
    {
      bg: "var(--semantic-red)",
      symbol: "↓",
      title: "Charge en baisse 2 semaines consécutives",
      sub: "Planifiez un point collectif avant vendredi pour identifier les blocages.",
    },
    {
      bg: "var(--semantic-green)",
      symbol: "↑",
      title: "Ambiance en hausse",
      sub: "Bon moment pour lancer un projet à forte visibilité.",
    },
    {
      bg: "var(--indigo)",
      symbol: "!",
      title: "2 employés n'ont pas répondu",
      sub: "Le silence est aussi un signal. Envoyez un rappel discret avant vendredi.",
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "10px",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          fontWeight: 700,
          letterSpacing: "0.5px",
          marginBottom: "8px",
        }}
      >
        Recommandations IA · Semaine 24
      </div>
      {recos.map((r) => (
        <div
          key={r.symbol + r.title}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            padding: "12px 14px",
            border: "1px solid rgba(67,56,202,0.10)",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            fontFamily: "var(--font-sans)",
          }}
        >
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "6px",
              backgroundColor: r.bg,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {r.symbol}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--midnight)" }}>
              {r.title}
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "3px", lineHeight: 1.5 }}>
              {r.sub}
            </div>
          </div>
        </div>
      ))}
      <div
        style={{
          borderTop: "1px solid rgba(67,56,202,0.08)",
          paddingTop: "10px",
          marginTop: "6px",
        }}
      >
        <div style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>
          Taux de réponse · Semaine 24 · 8 / 10 employés
        </div>
        <div
          style={{
            height: "3px",
            backgroundColor: "rgba(67,56,202,0.12)",
            borderRadius: "2px",
            overflow: "hidden",
            marginTop: "6px",
          }}
        >
          <div
            style={{
              width: "80%",
              height: "100%",
              backgroundColor: "var(--indigo)",
              borderRadius: "2px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
