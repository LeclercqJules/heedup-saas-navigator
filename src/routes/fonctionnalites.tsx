import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarCheck,
  Check,
  Clock3,
  Database,
  EyeOff,
  FileText,
  KeyRound,
  Mail,
  Rocket,
  Send,
  ShieldCheck,
  UserRoundX,
} from "lucide-react";
import { DemoReportCard } from "@/components/DemoReportCard";
import { FinalCta } from "@/components/FinalCta";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/fonctionnalites")({
  head: () => ({
    meta: [
      { title: "Fonctionnalités HeedUp pour les PME" },
      {
        name: "description",
        content: "Découvrez le questionnaire, le Rapport d'équipe, l'anonymat, l'historique et la protection des données dans HeedUp.",
      },
      { property: "og:title", content: "Fonctionnalités HeedUp pour les PME" },
      {
        property: "og:description",
        content: "Chaque mécanisme de HeedUp expliqué clairement, du questionnaire hebdomadaire au Rapport d'équipe.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const sections = [
  { id: "questionnaire", label: "Le questionnaire" },
  { id: "rapport", label: "Le rapport" },
  { id: "anonymat", label: "L'anonymat" },
  { id: "historique", label: "L'historique" },
  { id: "donnees", label: "Vos données" },
  { id: "mise-en-route", label: "La mise en route" },
] as const;

type SectionId = (typeof sections)[number]["id"];

const questionnaireBullets = [
  "Réponse facultative : chaque email porte un lien de désinscription, et le manager ne voit jamais qui s'est désinscrit",
  "Réponse sur téléphone ou ordinateur, sans compte",
  "Un champ libre facultatif en fin de questionnaire, jamais transmis tel quel au manager",
  "Vous voyez le nombre de participants, jamais leur identité",
];

const anonymityBullets = [
  "Jeton aléatoire de 32 octets, régénéré chaque semaine, stocké uniquement sous forme hachée",
  "Impossible de tracer un salarié dans le temps",
  "Vous voyez uniquement des scores agrégés",
];

const historyBullets = [
  "Historique complet consultable, sans limite de durée",
  "Vos rapports restent consultables même si vous arrêtez votre abonnement.",
  "Courbes de tendance par dimension (charge de travail, reconnaissance, clarté, soutien, sens)",
  "Taux de réponse semaine par semaine",
];

const dataBullets = [
  "Base de données hébergée en France",
  "L'email professionnel de chaque salarié est conservé pour permettre l'envoi du questionnaire. Aucune réponse ne lui est rattachée : le lien est supprimé à la soumission.",
  "Réponses salariés : 12 mois glissants. Autres durées détaillées dans la politique de confidentialité.",
  "Documentation RGPD disponible sur demande",
];

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="features-scroll-checks">
      {items.map((item) => (
        <li key={item}>
          <span aria-hidden="true"><Check size={12} strokeWidth={3} /></span>
          <p>{item}</p>
        </li>
      ))}
    </ul>
  );
}

function ImportantNote({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="features-scroll-note">
      <strong>{label}</strong>
      <p>{children}</p>
    </aside>
  );
}

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div className="features-scroll-copy">
      <span className="features-scroll-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function QuestionnaireVisual() {
  const dimensions = [
    ["Charge de travail", "workload"],
    ["Reconnaissance", "recognition"],
    ["Clarté", "clarity"],
    ["Soutien", "support"],
    ["Sens", "meaning"],
  ] as const;

  return (
    <div className="features-scroll-visual features-questionnaire-visual" aria-label="Aperçu des cinq dimensions du questionnaire">
      <div className="features-visual-topline">
        <span>Question 1 sur 5</span>
        <span>2 minutes</span>
      </div>
      <p>Cette semaine, ma charge de travail était à un niveau que je peux tenir dans la durée.</p>
      <div className="features-answer-scale" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((number) => <span className={number === 3 ? "is-selected" : ""} key={number}>{number}</span>)}
      </div>
      <div className="features-dimensions">
        {dimensions.map(([label, tone]) => (
          <span className={`is-${tone}`} key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function AnonymityVisual() {
  const rows = [
    { Icon: Mail, title: "Email du salarié", text: "Utilisé uniquement pour l'envoi", status: "Dissocié" },
    { Icon: KeyRound, title: "Jeton aléatoire de 32 octets", text: "Régénéré chaque semaine", status: "Haché" },
    { Icon: BarChart3, title: "Score agrégé", text: "Visible dans le rapport", status: "Collectif" },
    { Icon: UserRoundX, title: "Identité du répondant", text: "Inaccessible par conception", status: "Supprimée" },
  ];

  return (
    <div className="features-scroll-visual features-anonymity-visual" aria-label="Mécanisme d'anonymat">
      <div className="features-visual-topline"><span>Anonymat par construction</span></div>
      {rows.map(({ Icon, title, text, status }) => (
        <div className="features-anonymity-row" key={title}>
          <span className="features-anonymity-icon"><Icon size={16} /></span>
          <div><strong>{title}</strong><small>{text}</small></div>
          <span className="features-anonymity-status">{status}</span>
        </div>
      ))}
    </div>
  );
}

function HistoryVisual() {
  const dimensions = [
    ["Charge de travail", "2,6", "workload"],
    ["Reconnaissance", "3,1", "recognition"],
    ["Clarté", "3,3", "clarity"],
    ["Soutien", "3,0", "support"],
    ["Sens", "3,2", "meaning"],
  ] as const;

  return (
    <div className="features-scroll-visual features-history-visual" aria-label="Aperçu de l'historique des cinq dimensions">
      <div className="features-history-header">
        <div><span>Historique</span><strong>Les cinq dernières semaines</strong></div>
        <CalendarCheck size={20} />
      </div>
      <div className="features-history-chart" aria-hidden="true">
        {[58, 68, 64, 75, 71].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
      </div>
      <div className="features-history-legend">
        {dimensions.map(([label, score, tone]) => (
          <div key={label}><span className={`is-${tone}`} /><small>{label}</small><strong>{score}</strong></div>
        ))}
      </div>
    </div>
  );
}

function DataVisual() {
  const rows = [
    ["Réponses salariés", "12 mois glissants"],
    ["Hébergement", "France, région Paris"],
    ["Documentation", "Disponible sur demande"],
  ];

  return (
    <div className="features-scroll-visual features-data-visual" aria-label="Résumé de la conservation des données">
      <div className="features-data-heading"><Database size={18} /><strong>Données minimisées</strong></div>
      {rows.map(([label, value]) => (
        <div className="features-data-row" key={label}><span>{label}</span><strong>{value}</strong></div>
      ))}
      <div className="features-data-footer"><ShieldCheck size={16} /><span>Documentation RGPD disponible sur demande</span></div>
    </div>
  );
}

function StartCard({ number, Icon, title, text }: { number: string; Icon: typeof Rocket; title: string; text: string }) {
  return (
    <article className="features-start-card fade-up">
      <div className="features-start-card-top"><span>{number}</span><Icon size={20} /></div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function Page() {
  const [activeSection, setActiveSection] = useState<SectionId>("questionnaire");

  useEffect(() => {
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id as SectionId);
      },
      { rootMargin: "-22% 0px -58% 0px", threshold: [0, 0.15, 0.35, 0.6] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <SiteLayout>
      <header className="features-scroll-hero">
        <span className="features-scroll-eyebrow">Le produit en détail</span>
        <h1>Tout ce que fait HeedUp, et rien de plus.</h1>
        <p>Cinq questions le vendredi, un rapport le lundi, des recommandations concrètes. Voici comment chaque pièce fonctionne, en détail.</p>
      </header>

      <nav className="features-mobile-nav" aria-label="Sections de la page">
        {sections.map((section) => (
          <button className={activeSection === section.id ? "is-active" : ""} key={section.id} type="button" onClick={() => scrollToSection(section.id)}>
            {section.label}
          </button>
        ))}
      </nav>

      <div className="features-scroll-layout">
        <aside className="features-scroll-sidebar">
          <nav aria-label="Sections de la page">
            {sections.map((section) => (
              <button className={activeSection === section.id ? "is-active" : ""} key={section.id} type="button" onClick={() => scrollToSection(section.id)}>
                {section.label}
              </button>
            ))}
          </nav>
          <div className="features-sidebar-cta">
            <Link to="/connexion">Créer mon espace</Link>
            <small>2 rapports gratuits, sans carte bancaire</small>
          </div>
        </aside>

        <main className="features-scroll-content">
          <section id="questionnaire" className="features-scroll-section is-visual-right">
            <SectionHeading eyebrow="Le questionnaire" title="5 questions. Pas 50.">
              <p>Les 5 questions couvrent cinq dimensions qui couvrent ce qui se dégrade le plus souvent avant un départ, et sur quoi un manager peut réellement agir.</p>
              <p>Charge de travail, reconnaissance, clarté, soutien, sens. Elles ne changent pas d'une semaine à l'autre, ce qui permet de mesurer des tendances réelles.</p>
              <div className="features-inline-detail"><strong>Pourquoi des questions fixes ?</strong><p>Des questions identiques d'une semaine à l'autre permettent de comparer les données dans le temps. Des questions qui changent donneraient une photo ponctuelle, pas une tendance.</p></div>
              <CheckList items={questionnaireBullets} />
            </SectionHeading>
            <QuestionnaireVisual />
          </section>

          <section id="rapport" className="features-scroll-section is-visual-left">
            <SectionHeading eyebrow="Le rapport" title="Votre lundi commence par l'essentiel.">
              <p>Chaque lundi, un email vous prévient que votre rapport est prêt. Le rapport lui-même s'ouvre dans votre espace, structuré pour être lu en 2 minutes et pour déclencher une action dans la journée. Il reste derrière votre mot de passe plutôt que dans une boîte mail qui peut être transférée.</p>
              <p>Le Rapport d'équipe ne liste pas des scores. Il interprète les tendances et génère 2 à 3 recommandations selon le contexte de la semaine. Chaque recommandation est rattachée à la dimension à laquelle elle répond, ce qui vous permet de voir immédiatement quel score elle cherche à faire bouger.</p>
              <div className="features-inline-detail"><strong>Ce que l'IA analyse</strong><p>Score absolu de la semaine, évolution par rapport à la semaine précédente, et commentaires libres de la semaine. La recommandation combine ces signaux, pas juste le dernier score.</p></div>
            </SectionHeading>
            <div className="features-report-visual"><DemoReportCard /></div>
          </section>

          <section id="anonymat" className="features-scroll-section is-visual-right">
            <SectionHeading eyebrow="L'anonymat" title="Ce que vous ne pouvez pas voir. Même si vous le voulez.">
              <p>L'anonymat de HeedUp est une contrainte d'architecture, pas un paramètre.</p>
              <p>Répondre reste facultatif : chaque email porte un lien de désinscription, et le manager ne voit jamais qui s'est désinscrit. Le lien entre un salarié et sa réponse est supprimé au moment même de la soumission. Cette information n'existe plus dans la base : ce n'est pas une règle interne, c'est une absence de donnée.</p>
              <ImportantNote label="Seuil de protection statistique">Si moins de 5 salariés ont répondu complètement cette semaine, aucun score n'est affiché. La synthèse des commentaires suit un seuil distinct : elle demande 5 commentaires. Ces seuils protègent l'anonymat dans les petites équipes.</ImportantNote>
              <CheckList items={anonymityBullets} />
            </SectionHeading>
            <AnonymityVisual />
          </section>

          <section id="historique" className="features-scroll-section is-visual-left">
            <SectionHeading eyebrow="L'historique" title="L'historique pour comprendre. Le rapport lundi pour agir.">
              <p>Le Rapport d'équipe du lundi est votre outil d'action.</p>
              <p>Le tableau de bord est votre outil de compréhension. Quand un score descend, le tableau de bord vous permet de voir si c'est un accident ou une tendance installée.</p>
              <ImportantNote label="Semaines sous le seuil">Les semaines sous le seuil restent visibles dans la bande temporelle, sans afficher de score.</ImportantNote>
              <CheckList items={historyBullets} />
            </SectionHeading>
            <HistoryVisual />
          </section>

          <section id="donnees" className="features-scroll-section is-visual-right">
            <SectionHeading eyebrow="Vos données" title="Conforme RGPD. Hébergé en France.">
              <p>HeedUp est conçu pour être conforme au RGPD par architecture, pas par paramètre.</p>
              <p>Les données de vos salariés sont hébergées en France, région Paris, minimisées au strict nécessaire, et l'anonymat est garanti par conception. Deux traitements passent par des prestataires hors UE, l'envoi des emails et la génération de la synthèse, sous clauses contractuelles types. La documentation contractuelle est disponible sur demande.</p>
              <div className="features-inline-detail"><strong>Ce qui est collecté. Rien d'autre.</strong><p>Scores numériques de 1 à 5, commentaire libre facultatif, et jeton aléatoire dissocié du salarié à la soumission. L'email professionnel du salarié est conservé pour l'envoi du questionnaire, jamais rattaché à une réponse.</p></div>
              <CheckList items={dataBullets} />
            </SectionHeading>
            <DataVisual />
          </section>

          <section id="mise-en-route" className="features-scroll-section features-start-section">
            <SectionHeading eyebrow="La mise en route" title="10 minutes. Pas 10 semaines.">
              <p>Aucun projet informatique, aucune intégration SIRH, aucun déploiement.</p>
              <p>Vous importez les emails de votre équipe, vous activez, le premier questionnaire part dans la foulée. Le support est inclus dans tous les plans, pas derrière un plan Premium.</p>
            </SectionHeading>
            <div className="features-start-grid">
              <StartCard number="01" Icon={Rocket} title="Créez votre espace" text="Le nom de votre entreprise, et c'est tout." />
              <StartCard number="02" Icon={Mail} title="Ajoutez votre équipe" text="Collez les adresses email de vos salariés. Rien à installer, aucun compte à créer pour eux." />
              <StartCard number="03" Icon={Send} title="Activez HeedUp" text="Le premier questionnaire est envoyé immédiatement après l'activation." />
            </div>
            <ImportantNote label="Délai du premier rapport">Le premier rapport est produit dès que cinq réponses complètes sont arrivées. Les deux premiers rapports réellement produits sont gratuits, sans carte bancaire.</ImportantNote>
            <div className="features-support-line"><Clock3 size={18} /><p><strong>Support humain, pas de chatbot.</strong> Réponse par email sous 24h ouvrées, en français, par une vraie personne qui connaît votre compte. Pas de ticket automatique, pas de FAQ obligatoire avant d'écrire.</p></div>
          </section>
        </main>
      </div>

      <FinalCta />
    </SiteLayout>
  );
}
