import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useState, useEffect } from "react";
import { Upload, Clock, Rocket, Check, Mail, User, Users } from "lucide-react";
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

import { DemoReportCard } from "@/components/DemoReportCard";


import { useCountUp } from "@/hooks/useCountUp";

function CountUp({ target, format, suffix }: { target: number; format?: (n: number) => string; suffix?: string }) {
  const { count, ref } = useCountUp(target);
  return (
    <span ref={ref}>
      {format ? format(count) : count}
      {suffix ?? ""}
    </span>
  );
}

function fmtThousands(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


type IndexSearch = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  cas?: string;
};

const INDEX_SEARCH_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "cas",
] as const;

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): IndexSearch => {
    const out: IndexSearch = {};
    for (const key of INDEX_SEARCH_KEYS) {
      const value = search[key];
      if (typeof value === "string") out[key] = value;
    }
    return out;
  },
  component: Index,
  head: () => ({
    meta: [
      { title: "HeedUp · PME : pilotez votre équipe, prévenez le turnover" },
      {
        name: "description",
        content:
          "Prévenez le turnover dans votre PME. HeedUp envoie 5 questions anonymes chaque vendredi et génère un rapport d'équipe IA chaque lundi. Sans équipe RH. Dès 50€/m",
      },
      {
        property: "og:title",
        content: "HeedUp · PME : pilotez votre équipe, prévenez le turnover",
      },
      {
        property: "og:description",
        content:
          "Prévenez le turnover dans votre PME. HeedUp envoie 5 questions anonymes chaque vendredi et génère un rapport d'équipe IA chaque lundi. Sans équipe RH. Dès 50€/m",
      },
      { property: "og:url", content: "https://heedup.fr" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "HeedUp · PME : pilotez votre équipe, prévenez le turnover",
      },
      {
        name: "twitter:description",
        content:
          "Prévenez le turnover dans votre PME. HeedUp envoie 5 questions anonymes chaque vendredi et génère un rapport d'équipe IA chaque lundi. Sans équipe RH. Dès 50€/m",
      },
    ],
    links: [{ rel: "canonical", href: "https://heedup.fr" }],
  }),
});


function Index() {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openStep, setOpenStep] = useState<number | null>(0);


  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
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
      a: "Nous visons plus de 75% de participation. Tout est conçu pour ça : cinq questions, deux minutes, aucun compte à créer, une réponse depuis le téléphone. Le reste dépend de vous : un questionnaire devient une routine quand le manager l'installe comme telle et montre ce qu'il en fait.",
      b: "Nous visons plus de 75% de participation",
    },
    {
      q: "L'anonymat est-il vraiment garanti, ou c'est une promesse ?",
      a: "C'est une contrainte architecturale, pas une promesse managériale. Les réponses ne sont jamais stockées avec un identifiant nominatif. Même notre équipe ne peut pas retrouver qui a répondu quoi. Vous ne verrez que des scores agrégés, et seulement à partir de 5 réponses complètes.",
      b: "contrainte architecturale, pas une promesse managériale",
    },
    {
      q: "Que reçoit exactement le manager chaque lundi ?",
      a: "Un email vous prévient que le rapport est prêt, avec le nombre de réponses reçues. Le rapport lui-même s'ouvre dans votre espace : 5 scores affichés séparément (charge de travail, reconnaissance, clarté, soutien, sens), le delta par rapport à la semaine précédente, et 2 à 3 recommandations managériales concrètes générées par IA. Le rapport reste derrière votre mot de passe plutôt que dans une boîte mail qui peut être transférée. Vous comprenez l'état de votre équipe en moins de 2 minutes.",
      b: "Rapport d'équipe",
    },
    {
      q: "Combien de temps ça prend à mettre en place ?",
      a: "Moins de 10 minutes. Vous créez votre compte, importez les emails de votre équipe (CSV ou saisie manuelle), et activez le premier survey. Aucun IT requis, aucun déploiement. Vous lancez le premier questionnaire immédiatement depuis votre espace, puis les envois deviennent automatiques chaque vendredi.",
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
      a: "Sous 5 réponses complètes, les scores ne sont pas affichés pour préserver l'anonymat statistique. Vous recevez un email vous indiquant que le seuil n'est pas atteint, avec des pistes pour améliorer l'adhésion. Ce message ne contient aucun chiffre : publier le nombre de répondants sous le seuil reviendrait à publier une mesure dans la zone que le seuil protège. Notre objectif est une participation supérieure à 70% dès la deuxième semaine.",
      b: "préserver l'anonymat statistique",
    },
    {
      q: "Est-ce que ça fonctionne pour des équipes en télétravail ?",
      a: "Oui, c'est même là qu'il est le plus utile. Sur des équipes hybrides ou distantes, le manager voit moins ses employés au quotidien. HeedUp comble précisément ce manque de visibilité informelle que le bureau permettait naturellement.",
      b: "le plus utile",
    },
    {
      q: "Puis-je personnaliser les questions ?",
      a: "Non, et c'est volontaire. Les 5 questions sont identiques chaque semaine : c'est ce qui rend les courbes lisibles et les comparaisons possibles d'une semaine sur l'autre. Elles couvrent la charge de travail, la reconnaissance, la clarté, le soutien et le sens. Un champ libre facultatif est là pour tout ce qui sort du cadre.",
      b: "identiques chaque semaine",
    },
    {
      q: "Où sont hébergées les données de mes employés ?",
      a: "En France. HeedUp utilise Supabase sur la région Paris (eu-west-3). Deux traitements passent par des prestataires hors UE, l'envoi des emails et la génération de la synthèse, détaillés dans la politique de confidentialité. La documentation RGPD, dont le DPA et le registre de traitement, est disponible sur demande.",
      b: "En France",
    },
  ];

  const renderFaqItem = (item: { q: string; a: string; b: string }, id: number) => {
    const isOpen = openFaq === id;
    return (
      <div key={id} className="fade-up" style={{ borderBottom: "1px solid rgba(67,56,202,0.08)", padding: 0 }}>
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
      lead: "Importez les emails de vos salariés.",
      rest: (
        <>Moins de 10 minutes, aucune installation de leur côté. Aucun appel commercial requis, mise en place immédiate.</>
      ),
      calloutLabel: "ACTIF IMMÉDIATEMENT",
      calloutText: "Vous lancez le premier questionnaire immédiatement depuis votre espace, puis les envois deviennent automatiques chaque vendredi.",
      visual: "setup" as const,
    },
    {
      num: "02",
      label: "5 questions\nanonymes",
      badge: "Envoi immédiat, puis vendredi",
      title: "5 questions anonymes",
      lead: "Vos salariés reçoivent un lien par email.",
      rest: (
        <>Ils répondent en 2 minutes, depuis leur téléphone ou ordinateur. Pas de compte à créer, <span style={{ fontWeight: 700 }}>anonymat</span> garanti dès la première réponse. Répondre reste facultatif. Chaque email porte un lien de désinscription, et vous n'êtes jamais informé de qui s'est désinscrit.</>
      ),
      calloutLabel: "OBJECTIF DE PARTICIPATION",
      calloutText: "L'anonymat garanti dès le premier écran est le principal facteur de réponse. Vos salariés répondent parce qu'ils savent que c'est vrai.",
      visual: "phone" as const,
    },
    {
      num: "03",
      label: "Votre Rapport\nd'équipe",
      badge: "Lundi matin",
      title: "Votre Rapport d'équipe",
      lead: "5 scores agrégés (charge de travail, reconnaissance, clarté, soutien, sens), la tendance de la semaine, et le signal à surveiller en priorité.",
      rest: <>Vous comprenez l'état de votre équipe en 2 minutes. Vous lancez le premier questionnaire immédiatement. Votre premier rapport arrive sous 24 à 48 heures, dès que cinq personnes ont répondu. Ensuite, le rythme s'installe : questionnaire le vendredi, rapport le lundi.</>,
      calloutLabel: "PAS UN DASHBOARD À INTERPRÉTER",
      calloutText: "Les scores arrivent avec le contexte. Vous voyez immédiatement ce qui change et dans quel sens.",
      visual: "scores" as const,
    },
    {
      num: "04",
      label: "Vous agissez,\nvous mesurez",
      badge: "Dans la semaine",
      title: "Vous agissez, vous mesurez",
      lead: "2 à 3 recommandations managériales concrètes vous sont proposées, calibrées sur vos résultats réels.",
      rest: <>Leur effet apparaît dès le rapport suivant.</>,
      calloutLabel: "RECOMMANDATIONS MANAGÉRIALES, PAS DES KPIs",
      calloutText: "HeedUp ne vous donne pas un score à interpréter. Il vous donne une action à faire cette semaine, formulée pour un manager, pas pour un DRH.",
      visual: "recos" as const,
    },
  ];


  const comparisonRows = [
    { crit: "Temps de démarrage", heedup: "10 minutes", autres: "4 à 12 semaines" },
    { crit: "Prix d'entrée", heedup: "Dès 50€/mois", autres: "Tarification sur devis" },
    { crit: "Appel commercial requis", heedup: "Non", autres: "Systématiquement" },
    { crit: "Anonymat", heedup: "Architectural, non désactivable", autres: "Paramètre désactivable" },
  ];

  const current = steps[activeStep];


  return (
    <SiteLayout>
      {/* Hero */}
      <section
        id="hero"
        className="heedup-hero"
        style={{ background: "var(--bg-main)" }}
      >
        <div className="heedup-hero-inner">
          <div className="heedup-hero-grid">
            <div className="heedup-hero-copy">
              <span className="heedup-hero-eyebrow">Votre équipe, enfin lisible</span>
              <h1 className="heedup-hero-h1">Savez-vous vraiment comment va votre équipe&nbsp;?</h1>
              <p className="heedup-hero-sub">
                Chaque vendredi, vos salariés partagent anonymement leur ressenti. Chaque lundi, HeedUp vous indique ce qui change et où agir.
              </p>
              <div className="heedup-hero-actions">
              <Link
                to="/connexion"
                className="heedup-hero-cta"
              >
                Créer mon espace →
              </Link>
                <a href="#demo-report" className="heedup-hero-secondary">
                  Voir le rapport ↓
                </a>
              </div>
              <div className="heedup-hero-social">
                <div className="heedup-avatar-stack" aria-hidden="true">
                  {["AC", "SP", "JB", "CR"].map((initials) => (
                    <span key={initials}>{initials}</span>
                  ))}
                </div>
                <span>Déjà plus de 20 managers partenaires</span>
              </div>
            </div>

            <div id="demo-report" className="heedup-hero-report-stage">
              <div className="heedup-hero-halo" aria-hidden="true" />
              <div className="heedup-hero-sheet is-beige" aria-hidden="true" />
              <div className="heedup-hero-sheet is-lilac" aria-hidden="true" />
              <div className="heedup-hero-note is-dimensions">✦ Les 5 dimensions mesurées</div>
              <div className="heedup-hero-note is-analysis">↗ Ce que l'IA analyse</div>
              <div className="heedup-hero-note is-action">◈ Ce que vous pouvez faire</div>
              <DemoReportCard presentation="hero" />
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div
          className="heedup-trust"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <div className="heedup-trust-inner">
            {[
              "RGPD natif",
              "Hébergé en France",
              "Réponses anonymes",
              "Actif en 10 minutes",
              "Sans engagement",
            ].map((item) => (
              <div
                key={item}
                className="heedup-trust-item"
              >
                <span>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secteurs représentés */}
      <div
        className="heedup-sectors sectors-ticker"
        style={{
          backgroundColor: "var(--indigo-pale)",
          padding: "12px 5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <span
          className="heedup-sectors-label"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.7px",
            textTransform: "uppercase",
            color: "var(--indigo)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Secteurs représentés
        </span>
        <span
          className="heedup-sectors-separator"
          style={{
            width: "1px",
            height: "16px",
            backgroundColor: "rgba(67,56,202,0.2)",
            flexShrink: 0,
          }}
        />
        <div
          className="heedup-sectors-scroll"
          style={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            className="heedup-sectors-track"
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            {[...Array(2)].map((_, loopIndex) => (
              <Fragment key={loopIndex}>
                {[
                  "Restauration",
                  "BTP",
                  "Logistique",
                  "Commerce de détail",
                  "Conseil",
                  "Marketing",
                  "IT",
                  "Design",
                  "Événementiel",
                  "Comptabilité",
                  "Architecture",
                  "RP",
                  "Immobilier",
                  "Santé",
                ].map((sector) => (
                  <span
                    key={`${loopIndex}-${sector}`}
                    style={{
                      backgroundColor: "rgba(67,56,202,0.08)",
                      color: "var(--indigo)",
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: "20px",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {sector}
                  </span>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Impact business */}
      <section
        id="impact"
        className="heedup-impact fade-up"
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
                key: "engagement",
                eyebrow: "TAUX D'ENGAGEMENT",
                figureNode: <><CountUp target={13} /> %</>,
                label: "des salariés français réellement engagés dans leur travail, l'un des taux les plus bas en Europe.",
                source: "Gallup, 2024",
              },
              {
                key: "cout-chronique",
                eyebrow: "COÛT CHRONIQUE",
                figureNode: <span style={{ whiteSpace: "nowrap" }}>~<CountUp target={14300} format={fmtThousands} /> €</span>,
                label: "par salarié et par an, le coût du désengagement, des salariés présents mais qui ont décroché, avant même le moindre départ.",
                source: "IBET, 2024",
              },
              {
                key: "cout-depart",
                eyebrow: "COÛT D'UN DÉPART",
                figureNode: <><CountUp target={15} />–<CountUp target={30} /> K€</>,
                label: "le coût réel d'un départ en PME, recrutement, formation et désorganisation compris.",
                source: "Deloitte, 2024",
              },
              {
                key: "levier",
                eyebrow: "LE LEVIER MANAGER",
                figureNode: <><CountUp target={70} /> %</>,
                label: "du climat d'équipe dépend directement du manager, pas de la politique RH globale.",
                source: "Gallup, 2024",
              },
            ].map((c, i) => (
              <div
                key={c.key}
                className={`fade-up fade-up-delay-${i + 1} card-hover`}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid rgba(67,56,202,0.10)",
                  borderTop: "3px solid var(--midnight)",
                  borderRadius: "12px",
                  padding: "32px 28px",
                  minHeight: "200px",
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
                    minHeight: "1.2em",
                    display: "block",
                  }}
                >
                  {c.figureNode}
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

          <div
            id="calculateur"
            className="calc-band-inner"
            style={{
              marginTop: "32px",
              paddingTop: "28px",
              borderTop: "1px solid rgba(67,56,202,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "16px",
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Estimez ce que le désengagement coûte réellement à votre équipe.
            </p>
            <Link
              to="/estimer-cout"
              style={{
                backgroundColor: "var(--indigo)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "15px",
                borderRadius: "8px",
                padding: "13px 26px",
                fontFamily: "var(--font-sans)",
                border: "none",
                cursor: "pointer",
                textDecoration: "none",
                transition: "transform 0.2s ease",
                display: "inline-block",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Calculer pour mon équipe →
            </Link>
            <style>{`
              @media (max-width: 768px) {
                .calc-band-inner {
                  flex-direction: column !important;
                  gap: 14px !important;
                }
                .calc-band-inner > a {
                  width: 100% !important;
                  text-align: center !important;
                }
              }
            `}</style>
          </div>

        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="fade-up" style={{ backgroundColor: "#EEEEFF", padding: "64px 5%" }}>
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
            className="heedup-steps heedup-tabs-desktop"
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
            className="heedup-step-panel heedup-tabs-desktop"
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
                {current.lead} {current.rest}
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

          {/* Accordéon mobile */}
          <div className="heedup-accordion" style={{ marginBottom: "28px" }}>
            {steps.map((s, i) => {
              const isOpen = openStep === i;
              return (
                <div key={s.num} className="heedup-accordion-item">
                  <button
                    type="button"
                    className="heedup-accordion-head"
                    aria-expanded={isOpen}
                    onClick={() => setOpenStep(isOpen ? null : i)}
                  >
                    <span>
                      {s.num}. {s.title}
                    </span>
                    <span className="heedup-accordion-chevron">{isOpen ? "−" : "+"}</span>
                  </button>
                  <div className={`heedup-accordion-panel${isOpen ? " is-open" : ""}`}>
                    <div>
                      <div className="heedup-accordion-content">
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
                            display: "inline-block",
                            marginBottom: "12px",
                          }}
                        >
                          {s.badge}
                        </span>
                        <p className="heedup-accordion-lead">{s.lead}</p>
                        <p className="heedup-accordion-rest" style={{ marginBottom: "14px" }}>{s.rest}</p>

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
                              fontSize: "10px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.6px",
                              color: "var(--indigo)",
                              marginBottom: "5px",
                            }}
                          >
                            {s.calloutLabel}
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--midnight)", lineHeight: 1.55 }}>
                            {s.calloutText}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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

      {/* Tableau comparatif */}
      <section
        id="comparatif"
        className="heedup-comparison fade-up"
        style={{
          backgroundColor: "var(--bg-card)",
          padding: "64px 5%",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div
            style={{
              backgroundColor: "var(--indigo-pale)",
              color: "var(--indigo)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              padding: "5px 14px",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
              width: "fit-content",
              margin: "0 auto 16px",
              fontFamily: "var(--font-sans)",
            }}
          >
            COMPARAISON
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              color: "var(--midnight)",
              textAlign: "center",
              letterSpacing: "-0.5px",
              marginBottom: "8px",
              lineHeight: 1.15,
            }}
          >
            Conçu pour ceux que les autres ont ignorés.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "16px",
              color: "var(--text-muted)",
              textAlign: "center",
              marginBottom: "40px",
              lineHeight: 1.6,
            }}
          >
            Les outils RH existants visent les grandes entreprises. HeedUp est construit pour les PME de 10 à 50 salariés sans équipe RH.
          </p>

          <table className="heedup-comparison-table">
            <thead>
              <tr>
                <th style={{ width: "40%" }} />
                <th
                  style={{
                    width: "30%",
                    backgroundColor: "var(--midnight)",
                    padding: "16px 20px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "15px", color: "#FFFFFF" }}>
                    HeedUp
                  </div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                    Votre solution
                  </div>
                </th>
                <th
                  style={{
                    width: "30%",
                    backgroundColor: "var(--bg-main)",
                    padding: "16px 20px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>
                    Outils RH classiques
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.crit}>
                  <td>{row.crit}</td>
                  <td>{row.heedup}</td>
                  <td>{row.autres}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="heedup-comparison-mobile">
            {comparisonRows.map((row) => (
              <div key={row.crit} className="heedup-comparison-mobile-block">
                <div className="heedup-comparison-mobile-crit">{row.crit}</div>
                <div className="heedup-comparison-mobile-line">
                  <span className="heedup-comparison-mobile-badge heedup">HeedUp</span>
                  <span className="heedup-comparison-mobile-value heedup">{row.heedup}</span>
                </div>
                <div className="heedup-comparison-mobile-line">
                  <span className="heedup-comparison-mobile-badge autres">Autres</span>
                  <span className="heedup-comparison-mobile-value autres">{row.autres}</span>
                </div>
              </div>
            ))}
          </div>



          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            Comparaison détaillée disponible sur{" "}
            <Link
              to="/fonctionnalites"
              style={{ color: "var(--indigo)", fontWeight: 600, textDecoration: "none" }}
            >
              la page fonctionnalités →
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="fade-up" style={{ backgroundColor: "var(--bg-card)", padding: "64px 5%" }}>
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
              vous vous posez sûrement.
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
      <section id="rejoindre" className="fade-up" style={{ backgroundColor: "#EEEEFF", padding: "80px 5%", textAlign: "center" }}>
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
          Déjà plus de 20 managers partenaires accompagnent leur équipe avec HeedUp.
        </p>
        <Link
          to="/connexion"
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
            textDecoration: "none",
          }}
        >
          Créer mon espace
        </Link>

      </section>

      
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
        subtitle="Envoi immédiat, puis chaque vendredi 9h00"
      />
      <SetupRow
        icon={<Rocket size={16} strokeWidth={2} />}
        title="Premier questionnaire lancé"
        subtitle="Envoi immédiat, puis chaque vendredi"
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
          padding: "12px 14px",
          marginBottom: "12px",
          fontFamily: "var(--font-sans)",
          width: "200px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Mail size={16} style={{ color: "var(--indigo)", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--midnight)" }}>
              HeedUp · Votre questionnaire de la semaine
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
              5 questions · 2 minutes
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            backgroundColor: "var(--indigo)",
            color: "#FFFFFF",
            fontSize: "11px",
            fontWeight: 700,
            padding: "8px 0",
            borderRadius: "6px",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Répondre au questionnaire
        </div>
        <div style={{ fontSize: "9px", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5, marginTop: "8px" }}>
          Anonyme · Réponse facultative · Lien de désinscription
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
    { label: "Charge de travail", value: "3.6", delta: "▼ 0.3", color: "var(--semantic-red)" },
    { label: "Reconnaissance", value: "3.2", delta: "▼ 0.4", color: "var(--semantic-red)" },
    { label: "Clarté", value: "4.0", delta: "▲ 0.2", color: "var(--semantic-green)" },
    { label: "Soutien", value: "4.1", delta: "stable", color: "var(--text-muted)" },
    { label: "Sens", value: "4.3", delta: "▲ 0.1", color: "var(--semantic-green)" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px", width: "100%" }}>
      {scores.map((s) => (
        <div
          key={s.label}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            padding: "9px 14px",
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
      dimension: "Reconnaissance",
      title: "Reconnaissance en baisse depuis 2 semaines",
      sub: "Prenez 10 minutes pour un retour individuel à chacun avant vendredi.",
    },
    {
      dimension: "Clarté",
      title: "Clarté en hausse",
      sub: "Le point de lundi dernier a eu de l'effet, gardez ce format.",
    },
    {
      dimension: "Charge de travail",
      title: "Charge de travail sous tension",
      sub: "Repriorisez une échéance de la semaine et dites-le en réunion d'équipe.",
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
          key={r.title}
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
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "inline-block",
                fontSize: "9px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                color: "var(--indigo)",
                background: "var(--indigo-pale)",
                padding: "3px 8px",
                borderRadius: "20px",
                marginBottom: "6px",
              }}
            >
              {r.dimension}
            </div>
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
          Taux de réponse · Semaine 24 · 18 / 21 employés
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
