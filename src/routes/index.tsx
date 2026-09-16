import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useState, useEffect } from "react";
import {
  Check,
  User,
  Users,
  X,
  Activity,
  Banknote,
  UserMinus,
  UserRoundCog,
  Calculator,
  ArrowRight,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";

import { DemoReportCard } from "@/components/DemoReportCard";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ComparisonSection } from "@/components/ComparisonSection";
import { useCountUp } from "@/hooks/useCountUp";
import weeklyReportAsset from "@/assets/rapport-demo-hebdo.png.asset.json";

function ImpactCount({
  target,
  prefix = "",
  suffix = "",
  format,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  format?: (value: number) => string;
}) {
  const { count, ref } = useCountUp(target, 1000);
  return (
    <span ref={ref}>
      {prefix}{format ? format(count) : count}{suffix}
    </span>
  );
}

function ImpactRangeCount() {
  const lower = useCountUp(15, 1000);
  const upper = useCountUp(30, 1000);
  return (
    <span style={{ whiteSpace: "nowrap" }}>
      <span ref={lower.ref}>{lower.count}</span>-<span ref={upper.ref}>{upper.count}</span> K€
    </span>
  );
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isReportPreviewOpen, setIsReportPreviewOpen] = useState(false);


  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  useEffect(() => {
    if (!isReportPreviewOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsReportPreviewOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isReportPreviewOpen]);

  const openReportPreview = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setIsReportPreviewOpen(true);
    }
  };

  const reportAlt = "Exemple de rapport hebdomadaire HeedUp : cinq scores d'équipe, recommandations managériales, synthèse des commentaires et évolution sur six semaines";

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
              <div className="heedup-hero-report-frame">
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

      <section className="heedup-weekly-report" aria-labelledby="weekly-report-title">
        <div className="heedup-weekly-report-heading fade-up">
          <span className="heedup-hero-eyebrow">Votre rapport hebdomadaire</span>
          <h2 id="weekly-report-title">Chaque lundi, vous savez où agir.</h2>
          <p>HeedUp transforme le ressenti de votre équipe en signaux clairs et en actions concrètes.</p>
        </div>


        <div className="heedup-weekly-report-callouts fade-up">
          <div className="heedup-report-callout">
            <span className="heedup-report-callout-number is-01">01</span>
            <div className="heedup-report-callout-body">
              <strong>Ce qui change</strong>
              <p>Les cinq indicateurs vous montrent les évolutions marquantes de votre équipe cette semaine.</p>
            </div>
          </div>
          <div className="heedup-report-callout">
            <span className="heedup-report-callout-number is-02">02</span>
            <div className="heedup-report-callout-body">
              <strong>Pourquoi</strong>
              <p>L'IA analyse les commentaires anonymisés et identifie les causes possibles derrière ces changements.</p>
            </div>
          </div>
          <div className="heedup-report-callout">
            <span className="heedup-report-callout-number is-03">03</span>
            <div className="heedup-report-callout-body">
              <strong>Quoi faire</strong>
              <p>Vous recevez 2 à 3 recommandations managériales concrètes, adaptées au contexte de votre équipe.</p>
            </div>
          </div>
        </div>

        <div className="heedup-weekly-report-visual fade-up">
          <button
            type="button"
            className="heedup-weekly-report-trigger"
            onClick={openReportPreview}
            aria-label="Agrandir l'exemple de rapport hebdomadaire"
          >
            <img
              src={weeklyReportAsset.url}
              alt={reportAlt}
              className="heedup-weekly-report-image"
            />
          </button>
        </div>
        <p className="heedup-weekly-report-hint">Toucher pour agrandir</p>

      </section>

      {isReportPreviewOpen && (
        <div
          className="heedup-report-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Aperçu agrandi du rapport hebdomadaire"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsReportPreviewOpen(false);
          }}
        >
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="heedup-report-lightbox-close"
            onClick={() => setIsReportPreviewOpen(false)}
            aria-label="Fermer l'aperçu"
          >
            <X aria-hidden="true" />
          </Button>
          <div className="heedup-report-lightbox-scroll">
            <img src={weeklyReportAsset.url} alt={reportAlt} />
          </div>
        </div>
      )}

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
        style={{ backgroundColor: "var(--bg-main)", padding: "64px 5%" }}
      >
        <div className="mx-auto" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="heedup-impact-heading text-center">
            <span className="heedup-hero-eyebrow">Impact business</span>
            <h2>
              Ce que les données disent de vos équipes.
            </h2>
            <p>
              On ne perd pas un salarié le jour de sa démission. On le perd bien avant, en silence.
            </p>
          </div>

          <div className="heedup-impact-grid">
            {[
              {
                key: "engagement",
                eyebrow: "TAUX D'ENGAGEMENT",
                figureNode: <ImpactCount target={7} suffix="%" />,
                label: "des salariés français réellement engagés dans leur travail, l'un des taux les plus bas en Europe.",
                source: "Gallup, 2024",
                icon: Activity,
                tone: "violet",
              },
              {
                key: "cout-chronique",
                eyebrow: "COÛT CHRONIQUE",
                figureNode: (
                  <ImpactCount
                    target={14840}
                    prefix="~"
                    suffix=" €"
                    format={(value) => value.toLocaleString("fr-FR")}
                  />
                ),
                label: "par salarié et par an, le coût du désengagement, des salariés présents mais qui ont décroché, avant même le moindre départ.",
                source: "IBET, 2024",
                icon: Banknote,
                tone: "blue",
              },
              {
                key: "cout-depart",
                eyebrow: "COÛT D'UN DÉPART",
                figureNode: <ImpactRangeCount />,
                label: "le coût réel d'un départ en PME, recrutement, formation et désorganisation compris.",
                source: "Estimations sectorielles, 2024",
                icon: UserMinus,
                tone: "amber",
              },
              {
                key: "levier",
                eyebrow: "LE LEVIER MANAGER",
                figureNode: <ImpactCount target={70} suffix="%" />,
                label: "du climat d'équipe dépend directement du manager, pas de la politique RH globale.",
                source: "Recherche Gallup",
                icon: UserRoundCog,
                tone: "teal",
              },
            ].map((card, index) => {
              const CardIcon = card.icon;
              return (
                <article
                  key={card.key}
                  className={`heedup-impact-card fade-up fade-up-delay-${index + 1}`}
                >
                  <div className="heedup-impact-card-head">
                    <span className={`heedup-impact-icon is-${card.tone}`} aria-hidden="true">
                      <CardIcon size={19} strokeWidth={2} />
                    </span>
                    <span className="heedup-impact-label">{card.eyebrow}</span>
                  </div>
                  <div className="heedup-impact-figure">{card.figureNode}</div>
                  <p className="heedup-impact-copy">{card.label}</p>
                  <span className="heedup-impact-source">{card.source}</span>
                </article>
              );
            })}
          </div>

          <div id="calculateur" className="heedup-impact-calculator">
            <div className="heedup-impact-calculator-copy">
              <span className="heedup-impact-calculator-icon" aria-hidden="true">
                <Calculator size={21} strokeWidth={2} />
              </span>
              <p>Estimez ce que le désengagement coûte réellement à votre équipe.</p>
            </div>
            <Button asChild className="heedup-impact-calculator-button">
              <Link to="/estimer-cout">
                Calculer pour mon équipe
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </Button>
          </div>

        </div>
      </section>

      <HowItWorksSection />

      <ComparisonSection />

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
