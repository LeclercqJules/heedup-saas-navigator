import { Link } from "@tanstack/react-router";
import { Gauge, Award, Lightbulb, LifeBuoy, Compass, Check } from "lucide-react";

const bubbles = [
  { label: "Charge de travail", tone: "workload", Icon: Gauge, side: "left", pos: 1 },
  { label: "Reconnaissance", tone: "recognition", Icon: Award, side: "left", pos: 2 },
  { label: "Clarté", tone: "clarity", Icon: Lightbulb, side: "left", pos: 3 },
  { label: "Soutien", tone: "support", Icon: LifeBuoy, side: "right", pos: 1 },
  { label: "Sens", tone: "meaning", Icon: Compass, side: "right", pos: 2 },
] as const;

const assurances = [
  "2 premiers rapports gratuits",
  "Sans carte bancaire",
  "Mise en place en quelques minutes",
];

export function FinalCta() {
  return (
    <section className="heedup-finalcta" id="rejoindre">
      <div className="heedup-finalcta-arc" aria-hidden="true" />

      {bubbles.map((b, i) => (
        <div
          key={b.label}
          aria-hidden="true"
          className={`heedup-finalcta-bubble is-${b.side}-${b.pos} fade-up fade-up-delay-${i + 1}`}
        >
          <span className={`heedup-finalcta-bubble-icon is-${b.tone}`}>
            <b.Icon size={16} strokeWidth={2} />
          </span>
          <span className="heedup-finalcta-bubble-label">{b.label}</span>
        </div>
      ))}

      <div className="heedup-finalcta-inner fade-up">
        <span className="heedup-finalcta-eyebrow">Prêt à commencer ?</span>
        <h2 className="heedup-finalcta-title">
          Alors, comment va vraiment
          <br />
          <span>votre équipe&nbsp;?</span>
        </h2>
        <p className="heedup-finalcta-sub">Commencez à le savoir dès cette semaine.</p>
        <Link to="/connexion" className="heedup-finalcta-button">
          Créer mon espace →
        </Link>
        <ul className="heedup-finalcta-assurances">
          {assurances.map((a) => (
            <li key={a}>
              <span className="heedup-finalcta-check">
                <Check size={11} strokeWidth={3} />
              </span>
              {a}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
