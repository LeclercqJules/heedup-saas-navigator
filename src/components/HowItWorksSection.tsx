import {
  ArrowRight,
  Bell,
  BrainCircuit,
  Building2,
  Check,
  MailPlus,
  Send,
  Sparkles,
  Target,
} from "lucide-react";

const weeklyCards = [
  {
    key: "vendredi",
    day: "VENDREDI",
    title: "Votre équipe répond",
    icon: Send,
    tone: "violet",
    points: ["5 questions anonymes", "Environ 2 minutes", "Aucun compte à créer"],
    visual: "question",
  },
  {
    key: "heedup",
    day: "HEEDUP",
    title: "Analyse les signaux",
    icon: BrainCircuit,
    tone: "blue",
    points: ["Tendances et évolutions", "Commentaires anonymisés", "Analyse par IA"],
    visual: "analysis",
  },
  {
    key: "lundi",
    day: "LUNDI",
    title: "Vous êtes prévenu",
    icon: Bell,
    tone: "amber",
    points: ["5 indicateurs et leur évolution", "2 à 3 recommandations", "Une synthèse collective"],
    visual: "notification",
  },
  {
    key: "semaine",
    day: "ENSUITE",
    title: "Vous agissez",
    icon: Target,
    tone: "plum",
    points: ["Une conversation", "Une décision", "Un ajustement"],
    visual: "objective",
  },
] as const;

function CompanyVisual() {
  return (
    <div className="heedup-start-visual heedup-start-company" aria-label="Écran de création d'espace">
      <div className="heedup-mini-window-bar"><span /><span /><span /></div>
      <label>Nom de votre entreprise</label>
      <div className="heedup-mini-input">Atelier Horizon</div>
      <div className="heedup-mini-button">Créer mon espace</div>
    </div>
  );
}

function EmailsVisual() {
  return (
    <div className="heedup-start-visual" aria-label="Zone de collage des adresses email">
      <div className="heedup-mini-window-bar"><span /><span /><span /></div>
      <div className="heedup-email-area">
        <span className="heedup-email-line is-long" />
        <span className="heedup-email-line is-medium" />
        <span className="heedup-email-line is-short" />
        <span className="heedup-email-caret" aria-hidden="true" />
      </div>
      <div className="heedup-email-footer"><MailPlus size={16} aria-hidden="true" /> 24 adresses détectées</div>
    </div>
  );
}

function ConfirmationVisual() {
  return (
    <div className="heedup-start-visual heedup-confirmation-visual" aria-label="Confirmation d'envoi côté manager">
      <span className="heedup-confirmation-icon"><Check size={22} strokeWidth={2.5} aria-hidden="true" /></span>
      <strong>Le questionnaire est parti à 24 salariés.</strong>
      <p>Votre rapport sera disponible dès que cinq réponses complètes seront arrivées.</p>
    </div>
  );
}

function WeeklyVisual({ type }: { type: (typeof weeklyCards)[number]["visual"] }) {
  if (type === "question") {
    return (
      <div className="heedup-weekly-mini">
        <p>Ma charge de travail a été tenable cette semaine</p>
        <div className="heedup-answer-scale" aria-label="Échelle de réponse de 1 à 5">
          {[1, 2, 3, 4, 5].map((value) => <span key={value} className={value === 4 ? "is-selected" : ""}>{value}</span>)}
        </div>
      </div>
    );
  }

  if (type === "analysis") {
    return (
      <div className="heedup-weekly-mini heedup-analysis-mini">
        <div className="heedup-analysis-row"><span /><i /></div>
        <div className="heedup-analysis-row"><span /><i /></div>
        <div className="heedup-analysis-row"><span /><i /></div>
        <div className="heedup-ai-badge"><Sparkles size={14} aria-hidden="true" /> Analysé par l'IA HeedUp</div>
      </div>
    );
  }

  if (type === "notification") {
    return (
      <div className="heedup-weekly-mini heedup-notification-mini">
        <span className="heedup-notification-icon"><Bell size={18} aria-hidden="true" /></span>
        <div><strong>Votre rapport est disponible</strong><p>Ouvrez-le dans votre espace manager.</p></div>
        <ArrowRight size={17} aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="heedup-weekly-mini heedup-objective-mini">
      <Target size={19} aria-hidden="true" />
      <p>L'objectif : une équipe plus écoutée, semaine après semaine.</p>
    </div>
  );
}

function WeeklyCard({ card, index }: { card: (typeof weeklyCards)[number]; index: number }) {
  const Icon = card.icon;
  return (
    <article className={`heedup-weekly-card is-${card.tone} fade-up fade-up-delay-${index + 1}`}>
      <header>
        <span className="heedup-weekly-card-icon"><Icon size={20} aria-hidden="true" /></span>
        <div><span>{card.day}</span><h3>{card.title}</h3></div>
      </header>
      <ul>{card.points.map((point) => <li key={point}><Check size={15} aria-hidden="true" />{point}</li>)}</ul>
      <WeeklyVisual type={card.visual} />
    </article>
  );
}

export function HowItWorksSection() {
  return (
    <section id="comment-ca-marche" className="heedup-how">
      <div className="heedup-how-start">
        <div className="heedup-how-heading">
          <div>
            <span className="heedup-hero-eyebrow">COMMENT ÇA MARCHE</span>
            <h2>Commencer prend quelques minutes.</h2>
            <p>Pas de démo commerciale obligatoire. Pas de déploiement complexe. Vous créez votre espace et lancez votre premier questionnaire directement.</p>
          </div>
        </div>

        <div className="heedup-start-steps">
          <article className="heedup-start-step fade-up fade-up-delay-1">
            <div className="heedup-start-step-head"><span>01</span><span className="heedup-duration">30 secondes</span></div>
            <Building2 className="heedup-start-icon" size={22} aria-hidden="true" />
            <h3>Créez votre espace</h3>
            <p>Le nom de votre entreprise, et c'est tout.</p>
            <CompanyVisual />
          </article>
          <ArrowRight className="heedup-step-arrow" size={24} aria-hidden="true" />
          <article className="heedup-start-step fade-up fade-up-delay-2">
            <div className="heedup-start-step-head"><span>02</span><span className="heedup-duration">3 minutes</span></div>
            <MailPlus className="heedup-start-icon" size={22} aria-hidden="true" />
            <h3>Ajoutez votre équipe</h3>
            <p>Collez les adresses email de vos salariés. Rien à installer, aucun compte à créer pour eux.</p>
            <EmailsVisual />
          </article>
          <ArrowRight className="heedup-step-arrow" size={24} aria-hidden="true" />
          <article className="heedup-start-step fade-up fade-up-delay-3">
            <div className="heedup-start-step-head"><span>03</span><span className="heedup-duration">C'est parti.</span></div>
            <Send className="heedup-start-icon" size={22} aria-hidden="true" />
            <h3>Lancez le premier questionnaire</h3>
            <p>Votre équipe reçoit son premier questionnaire immédiatement.</p>
            <ConfirmationVisual />
          </article>
        </div>
      </div>

      <div className="heedup-ritual-separator"><span>ET CHAQUE SEMAINE, LE MÊME RITUEL</span></div>

      <div className="heedup-how-ritual">


        <div className="heedup-ritual-heading">
          <h2>Un rituel de 2 minutes. Une vision chaque semaine.</h2>
          <p>De la réponse de vos équipes au passage à l'action, en toute simplicité.</p>
        </div>

        <div className="heedup-weekly-sequence">
          <div className="heedup-weekly-cards">
            {weeklyCards.map((card, index) => <WeeklyCard key={card.key} card={card} index={index} />)}
          </div>
        </div>
      </div>
    </section>
  );
}