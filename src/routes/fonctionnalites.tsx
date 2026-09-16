import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarCheck,
  Check,
  Clock3,
  Database,
  KeyRound,
  Mail,
  Rocket,
  Send,
  ShieldCheck,
  UserRoundX,
  X,
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
  { id: "mise-en-route", label: "La mise en route" },
  { id: "perimetre", label: "Ce que ce n'est pas" },
  { id: "donnees", label: "Vos données" },
] as const;

type SectionId = (typeof sections)[number]["id"];

const questionnaireBullets = [
  "Réponse facultative : chaque email porte un lien de désinscription, et le manager ne voit jamais qui s'est désinscrit",
  "Réponse sur téléphone ou ordinateur, sans compte",
  "Un champ libre facultatif en fin de questionnaire, jamais transmis tel quel au manager",
  "Vous voyez le nombre de participants, jamais leur identité",
];

const reportBullets = [
  "2 à 3 recommandations, chacune rattachée à la dimension qu'elle cherche à faire bouger",
  "Les cinq scores et leur évolution depuis la semaine précédente",
  "Une synthèse collective des commentaires, jamais une citation individuelle",
];

const anonymityBullets = [
  "Répondre reste facultatif, chaque email porte un lien de désinscription",
  "Le manager n'est jamais informé de qui s'est désinscrit, seulement du nombre",
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
  "L'email professionnel de chaque salarié est conservé pour permettre l'envoi du questionnaire. Aucune réponse ne lui est rattachée : le lien est supprimé à la soumission.",
  "Réponses salariés : 12 mois glissants. Autres durées détaillées dans la politique de confidentialité.",
  "Deux traitements passent par des prestataires hors UE, l'envoi des emails et la génération de la synthèse, sous clauses contractuelles types.",
  "Accord de sous-traitance et documentation RGPD disponibles sur demande",
];

const invisibleItems = [
  "Aucune réponse individuelle, quelle que soit la requête",
  "Aucun commentaire brut, seulement une synthèse collective",
  "Aucune liste de qui a répondu, ni de qui s'est désinscrit",
];

const scopeItems = [
  "Ce n'est pas un SIRH : pas de gestion des congés, des contrats ni de la paie",
  "Ce n'est pas un outil d'évaluation individuelle : aucune donnée ne remonte au niveau d'une personne",
  "Ce n'est pas un outil d'enquête ponctuelle : les questions sont fixes, c'est ce qui permet de mesurer une tendance",
  "Ce n'est pas un outil de communication interne : HeedUp ne diffuse rien à votre équipe en dehors du questionnaire",
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

function NeutralList({ items }: { items: string[] }) {
  return (
    <ul className="features-neutral-list">
      {items.map((item) => (
        <li key={item}>
          <span aria-hidden="true"><X size={12} strokeWidth={2.5} /></span>
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
        if (!visible) return;
        const section = sections.find(({ id }) => id === visible.target.id);
        if (section) setActiveSection(section.id);
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

          <section id="rapport" className="features-scroll-section features-report-section">
            <SectionHeading eyebrow="Le rapport" title="Votre lundi commence par l'essentiel.">
              <p>Chaque lundi, un email vous prévient que votre rapport est prêt. Le rapport s'ouvre dans votre espace, derrière votre mot de passe, structuré pour être lu en deux minutes.</p>
            </SectionHeading>
            <div className="features-report-visual"><DemoReportCard /></div>
            <div className="features-report-columns">
              <CheckList items={reportBullets} />
              <div className="features-report-details">
                <div className="features-inline-detail"><strong>Ce que l'IA analyse</strong><p>Score absolu de la semaine, évolution par rapport à la semaine précédente, et commentaires libres de la semaine. La recommandation combine ces signaux, pas juste le dernier score.</p></div>
                <ImportantNote label="Quand une situation mérite votre attention">Quand un commentaire évoque une situation grave, le rapport vous invite à proposer des points individuels à votre équipe. Il ne cite jamais le commentaire ni son auteur, et ne donne aucun détail supplémentaire.</ImportantNote>
              </div>
            </div>
          </section>

          <section id="anonymat" className="features-scroll-section is-visual-right">
            <SectionHeading eyebrow="L'anonymat" title="Ce que vous ne pouvez pas voir. Même si vous le voulez.">
              <p>Le lien entre un salarié et sa réponse est supprimé au moment même de la soumission. Cette information n'existe plus dans la base : ce n'est pas une règle interne, c'est une absence de donnée.</p>
              <p>Ce n'est pas un réglage que quelqu'un pourrait changer.</p>
              <ImportantNote label="Seuil de protection statistique">Si moins de 5 salariés ont répondu complètement cette semaine, aucun score n'est affiché. La synthèse des commentaires suit un seuil distinct : elle demande 5 commentaires. Ces seuils protègent l'anonymat dans les petites équipes.</ImportantNote>
              <ImportantNote label="Et si peu de salariés répondent ?">En dessous de cinq réponses complètes, aucun score n'est publié : une moyenne cesse alors de protéger les personnes qui la composent. Vous recevez tout de même des pistes concrètes pour améliorer la participation. Et comme l'essai porte sur deux rapports réellement produits, vous ne payez jamais pour un outil qui n'a rien produit.</ImportantNote>
              <CheckList items={anonymityBullets} />
              <div className="features-never-block">
                <strong>Ce que vous ne verrez jamais</strong>
                <NeutralList items={invisibleItems} />
                <p>Ce ne sont pas des affichages que nous avons choisi d'omettre, ce sont des accès qui n'existent pas dans le produit.</p>
              </div>
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
            <div className="features-start-details">
              <article className="features-start-detail">
                <h3>Organiser votre effectif en équipes</h3>
                <p>Vous pouvez répartir vos salariés en équipes distinctes. Le rapport affiche alors, en plus des scores globaux, un détail par équipe.</p>
                <ImportantNote label="Seuil de publication par équipe">Une équipe n'apparaît dans le détail que si elle compte au moins 10 salariés actifs et que 5 d'entre eux au moins ont répondu complètement cette semaine. En dessous, le détail par équipe n'est pas publié : la même règle d'anonymat s'applique à l'échelle de l'équipe qu'à celle de l'entreprise.</ImportantNote>
              </article>
              <article className="features-start-detail">
                <h3>Partager l'accès à votre espace</h3>
                <p>Votre organisation peut accueillir plusieurs managers. Chacun accède aux mêmes rapports de l'organisation, y compris leurs détails par équipe, et reçoit la notification du lundi.</p>
              </article>
            </div>
            <ImportantNote label="Pour quelle taille d'équipe ?">HeedUp est calibré pour les équipes de 10 à 100 salariés. En dessous de 10, le seuil de cinq réponses complètes devient difficile à atteindre chaque semaine, et l'outil produira peu de rapports. Au-delà de 100, <a href="mailto:contact@heedup.fr">écrivez-nous</a> : c'est possible, mais nous préférons en parler avant.</ImportantNote>
            <div className="features-support-line">
              <Clock3 size={18} />
              <div>
                <strong>Si vous avez une question</strong>
                <p>Vous écrivez à <a href="mailto:contact@heedup.fr">contact@heedup.fr</a>, et c'est le fondateur qui vous répond, sous 24 heures. Pas de ticket, pas de service client à plusieurs niveaux, pas de base de connaissances à fouiller avant de pouvoir parler à quelqu'un.</p>
                <small>Un assistant est aussi disponible en bas de chaque page du site pour les questions courantes sur le produit.</small>
              </div>
            </div>
            <p className="features-pricing-line">À partir de 50 € par mois, deux rapports gratuits pour commencer. <Link to="/tarifs">Voir les tarifs →</Link></p>
          </section>

          <section id="perimetre" className="features-scroll-section features-scope-section">
            <SectionHeading eyebrow="Le périmètre" title="Ce que HeedUp ne fait pas.">
              <p>Un outil qui prétend tout faire finit par mal faire l'essentiel. HeedUp mesure le ressenti d'équipe chaque semaine et vous dit où agir. Le reste, d'autres outils le font mieux.</p>
              <NeutralList items={scopeItems} />
            </SectionHeading>
          </section>

          <section id="donnees" className="features-scroll-section is-visual-right">
            <SectionHeading eyebrow="Vos données" title="Hébergé en France, avec des durées précises.">
              <p>La base de données est hébergée en France, région Paris. Les données collectées sont limitées au strict nécessaire pour envoyer les questionnaires.</p>
              <div className="features-inline-detail"><strong>Ce qui est collecté. Rien d'autre.</strong><p>Scores numériques de 1 à 5, commentaire libre facultatif, et jeton aléatoire dissocié du salarié à la soumission. L'email professionnel du salarié est conservé pour l'envoi du questionnaire, jamais rattaché à une réponse.</p></div>
              <CheckList items={dataBullets} />
            </SectionHeading>
            <DataVisual />
          </section>
        </main>
      </div>

      <FinalCta />
    </SiteLayout>
  );
}
