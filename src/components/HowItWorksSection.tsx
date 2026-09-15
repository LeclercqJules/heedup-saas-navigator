import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  Bolt,
  BrainCircuit,
  Building2,
  Check,
  Clock3,
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
    day: "LA SEMAINE",
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

function WeeklyCard({ card, active }: { card: (typeof weeklyCards)[number]; active: boolean }) {
  const Icon = card.icon;
  return (
    <article className={`heedup-weekly-card is-${card.tone}${active ? " is-active" : ""}`} aria-current={active ? "step" : undefined}>
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
  const sequenceRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const sequence = sequenceRef.current;
    if (!sequence) return;

    const updateFromPageScroll = () => {
      if (window.matchMedia("(max-width: 767px)").matches) return;
      const rect = sequence.getBoundingClientRect();
      const travel = Math.max(sequence.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / travel, 0), 0.999);
      setActiveCard(Math.min(weeklyCards.length - 1, Math.floor(progress * weeklyCards.length)));
    };

    updateFromPageScroll();
    window.addEventListener("scroll", updateFromPageScroll, { passive: true });
    window.addEventListener("resize", updateFromPageScroll);
    return () => {
      window.removeEventListener("scroll", updateFromPageScroll);
      window.removeEventListener("resize", updateFromPageScroll);
    };
  }, []);

  const updateFromCarousel = () => {
    const carousel = carouselRef.current;
    if (!carousel || carousel.clientWidth === 0) return;
    setActiveCard(Math.min(weeklyCards.length - 1, Math.round(carousel.scrollLeft / carousel.clientWidth)));
  };

  return (
    <section id="comment-ca-marche" className="heedup-how">
      <div className="heedup-how-start">
        <div className="heedup-how-heading">
          <div>
            <span className="heedup-hero-eyebrow">COMMENT ÇA MARCHE</span>
            <h2>Commencer prend quelques minutes.</h2>
            <p>Pas de démo commerciale obligatoire. Pas de déploiement complexe. Vous créez votre espace et lancez votre premier questionnaire directement.</p>
          </div>
          <div className="heedup-start-assurances" aria-label="Conditions de démarrage">
            <span><Bolt size={16} aria-hidden="true" />Sans appel commercial</span>
            <span><Clock3 size={16} aria-hidden="true" />Mise en place en quelques minutes</span>
            <span><Check size={16} aria-hidden="true" />Sans engagement</span>
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
            <div className="heedup-start-step-head"><span>02</span><span className="heedup-duration">1 minute</span></div>
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

      <div className="heedup-ritual-heading">
        <h2>Un rituel de 2 minutes. Une vision chaque semaine.</h2>
        <p>De la réponse de vos équipes au passage à l'action, en toute simplicité.</p>
      </div>

      <div ref={sequenceRef} className="heedup-weekly-sequence">
        <div className="heedup-weekly-sticky">
          <div ref={carouselRef} className="heedup-weekly-cards" onScroll={updateFromCarousel}>
            {weeklyCards.map((card, index) => <WeeklyCard key={card.key} card={card} active={index === activeCard} />)}
          </div>
          <div className="heedup-weekly-progress" aria-label={`Étape ${activeCard + 1} sur ${weeklyCards.length}`}>
            {weeklyCards.map((card, index) => (
              <button
                key={card.key}
                type="button"
                className={index === activeCard ? "is-active" : ""}
                aria-label={`Voir ${card.day.toLowerCase()}`}
                onClick={() => {
                  setActiveCard(index);
                  const carousel = carouselRef.current;
                  if (carousel) carousel.scrollTo({ left: carousel.clientWidth * index, behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}