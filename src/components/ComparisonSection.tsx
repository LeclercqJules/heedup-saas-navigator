import { Link } from "@tanstack/react-router";
import { Zap, Target, Lock, Check, X, Sparkles, ArrowRight, Building2 } from "lucide-react";

const args = [
  {
    icon: Zap,
    tone: "is-violet",
    title: "Rapide à mettre en place",
    copy: "En quelques minutes, sans mobiliser votre équipe IT.",
  },
  {
    icon: Target,
    tone: "is-blue",
    title: "Pensé pour le terrain",
    copy: "Des signaux clairs et actionnables, pas des tableaux de bord complexes.",
  },
  {
    icon: Lock,
    tone: "is-plum",
    title: "Anonymat par construction",
    copy: "Le lien entre un salarié et sa réponse est supprimé à la soumission, pas masqué par un réglage.",
  },
];

const rows = [
  { crit: "Temps de déploiement", heedup: "10 minutes", autres: "4 à 12 semaines" },
  { crit: "Prix d'entrée", heedup: "Dès 50 €/mois", autres: "Tarification sur devis" },
  { crit: "Appel commercial requis", heedup: "Non", autres: "Systématiquement" },
  { crit: "Adapté aux PME", heedup: "10 à 100 salariés", autres: "Souvent surdimensionnés" },
  { crit: "Anonymat", heedup: "Supprimé à la soumission", autres: "Paramètre désactivable" },
  { crit: "Recommandations concrètes", heedup: "Oui, chaque semaine", autres: "Rarement" },
  { crit: "Nécessite une compétence RH", heedup: "Non", autres: "Souvent indispensable" },
];

export function ComparisonSection() {
  return (
    <section id="comparatif" className="heedup-cmp">
      <div className="heedup-cmp-head fade-up">
        <span className="heedup-hero-eyebrow">Comparaison</span>
        <h2>La même exigence, sans la complexité.</h2>
        <p>
          Des analyses comparables aux grands outils RH, conçues pour les PME, sans l'usine à gaz.
        </p>
      </div>

      <div className="heedup-cmp-grid">
        <div className="heedup-cmp-args">
          {args.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={a.title} className={`heedup-cmp-arg fade-up fade-up-delay-${i + 1}`}>
                <span className={`heedup-cmp-arg-icon ${a.tone}`}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div>
                  <h3>{a.title}</h3>
                  <p>{a.copy}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="heedup-cmp-table-wrap fade-up fade-up-delay-2">
          <div className="heedup-cmp-table" role="table" aria-label="Comparaison HeedUp et outils RH classiques">
            <div className="heedup-cmp-thead" role="row">
              <div className="heedup-cmp-crit-head" role="columnheader" />
              <div className="heedup-cmp-head-cell is-heedup" role="columnheader">
                <span className="heedup-cmp-logo" aria-hidden="true">
                  <Sparkles size={15} />
                </span>
                <strong>HeedUp</strong>
                <em>Simple, rapide, efficace</em>
              </div>
              <div className="heedup-cmp-head-cell is-autres" role="columnheader">
                <span className="heedup-cmp-logo" aria-hidden="true">
                  <Building2 size={15} />
                </span>
                <strong>Outils RH classiques</strong>
                <em>Pensés pour les grandes entreprises</em>
              </div>
            </div>
            {rows.map((row) => (
              <div key={row.crit} className="heedup-cmp-row" role="row">
                <div className="heedup-cmp-crit" role="cell">{row.crit}</div>
                <div className="heedup-cmp-cell is-heedup" role="cell">
                  <span className="heedup-cmp-mark is-yes" aria-hidden="true">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {row.heedup}
                </div>
                <div className="heedup-cmp-cell is-autres" role="cell">
                  <span className="heedup-cmp-mark is-no" aria-hidden="true">
                    <X size={12} strokeWidth={3} />
                  </span>
                  {row.autres}
                </div>
              </div>
            ))}
          </div>

          <div className="heedup-cmp-cards">
            <div className="heedup-cmp-card is-heedup">
              <div className="heedup-cmp-card-head">
                <span className="heedup-cmp-logo" aria-hidden="true">
                  <Sparkles size={15} />
                </span>
                <div>
                  <strong>HeedUp</strong>
                  <em>Simple, rapide, efficace</em>
                </div>
              </div>
              {rows.map((row) => (
                <div key={row.crit} className="heedup-cmp-card-line">
                  <span className="heedup-cmp-card-crit">{row.crit}</span>
                  <span className="heedup-cmp-card-value">
                    <span className="heedup-cmp-mark is-yes" aria-hidden="true">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {row.heedup}
                  </span>
                </div>
              ))}
            </div>
            <div className="heedup-cmp-card is-autres">
              <div className="heedup-cmp-card-head">
                <span className="heedup-cmp-logo" aria-hidden="true">
                  <Building2 size={15} />
                </span>
                <div>
                  <strong>Outils RH classiques</strong>
                  <em>Pensés pour les grandes entreprises</em>
                </div>
              </div>
              {rows.map((row) => (
                <div key={row.crit} className="heedup-cmp-card-line">
                  <span className="heedup-cmp-card-crit">{row.crit}</span>
                  <span className="heedup-cmp-card-value">
                    <span className="heedup-cmp-mark is-no" aria-hidden="true">
                      <X size={12} strokeWidth={3} />
                    </span>
                    {row.autres}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="heedup-cmp-final fade-up fade-up-delay-3">
        <div className="heedup-cmp-final-left">
          <span className="heedup-cmp-final-icon" aria-hidden="true">
            <Sparkles size={18} />
          </span>
          <div>
            <span className="heedup-cmp-final-eyebrow">Au final</span>
            <strong>Moins d'outils. Plus d'impact.</strong>
          </div>
        </div>
        <p className="heedup-cmp-final-copy">
          HeedUp vous donne ce qu'il faut pour comprendre et agir, sans la complexité des outils RH
          traditionnels.
        </p>
        <Link to="/fonctionnalites" className="heedup-cmp-final-button">
          Découvrir HeedUp
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
