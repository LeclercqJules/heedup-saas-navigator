import { cn } from "@/lib/utils";

type DemoReportCardProps = {
  className?: string;
  presentation?: "hero" | "standard";
};

const scores = [
  { label: "Charge de travail", score: 2.6, value: "2,6", delta: "↓0,2", trend: "down", tone: "workload" },
  { label: "Reconnaissance", score: 3.1, value: "3,1", delta: "↑0,1", trend: "up", tone: "recognition" },
  { label: "Clarté", score: 3.3, value: "3,3", delta: "↑0,1", trend: "up", tone: "clarity" },
  { label: "Soutien", score: 3.0, value: "3,0", delta: "→0,0", trend: "stable", tone: "support" },
  { label: "Sens", score: 3.2, value: "3,2", delta: "↑0,1", trend: "up", tone: "meaning" },
] as const;

const recommendations = [
  { number: 1, critical: true, text: "Cadrer l'heure limite des demandes non urgentes" },
  { number: 2, critical: true, text: "Vérifier la répartition de la charge avant la prochaine échéance" },
  { number: 3, critical: false, text: "Clarifier les priorités pour la semaine prochaine" },
] as const;

export function DemoReportCard({ className, presentation = "standard" }: DemoReportCardProps) {
  return (
    <article
      className={cn("demo-report", presentation === "hero" && "demo-report-hero", className)}
      aria-label="Exemple de Rapport d'équipe HeedUp"
    >
      <header className="demo-report-header">
        <div className="demo-report-brand">
          <img src="/favicon.svg" alt="" className="demo-report-logo" />
          <span>HeedUp</span>
        </div>
        <div className="demo-report-date">Semaine du 27 juillet 2026</div>
        <div className="demo-report-avatar" aria-label="Profil JL">JL</div>
      </header>

      <div className="demo-report-body">
        <div className="demo-report-intro">
          <h2>Votre équipe cette semaine</h2>
          <p>5 réponses · 2 commentaires · Seuil atteint</p>
        </div>

        <div className="demo-report-scores" aria-label="Scores de la semaine">
          {scores.map((item) => (
            <section className={cn("demo-score", `demo-score-${item.tone}`)} key={item.label}>
              <div className="demo-score-topline">
                <span className="demo-score-icon" aria-hidden="true" />
                <span className="demo-score-label">{item.label}</span>
                <strong>{item.value}</strong>
                <span className={cn("demo-score-delta", `is-${item.trend}`)}>{item.delta}</span>
              </div>
              <div className="demo-score-track" aria-hidden="true">
                <span style={{ width: `${(item.score / 5) * 100}%` }} />
              </div>
            </section>
          ))}
        </div>

        <div className="demo-report-details">
          <section className="demo-report-recommendations">
            <h3>Recommandations pour cette semaine</h3>
            <ol>
              {recommendations.map((item) => (
                <li key={item.number}>
                  <span className={cn("demo-recommendation-number", item.critical ? "is-critical" : "is-neutral")}>{item.number}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="demo-report-expression">
            <h3>Ce que l'équipe exprime</h3>
            <p>La charge de travail se tend légèrement, sans que les autres dimensions bougent.</p>
            <p>Plusieurs retours évoquent des demandes qui arrivent en fin de journée.</p>
            <p className="demo-report-privacy">Synthèse collective. Aucun commentaire individuel n'est accessible.</p>
          </section>
        </div>

        <section className="demo-report-vigilance">
          <h3>Un signal de vigilance a été détecté cette semaine.</h3>
          <p>Un ou plusieurs retours évoquent une situation de surcharge ou d'épuisement. Nous recommandons des points individuels. Aucun détail supplémentaire n'est disponible.</p>
        </section>
      </div>
    </article>
  );
}