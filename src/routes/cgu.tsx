import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: "Conditions générales — HeedUp" },
      {
        name: "description",
        content:
          "CGU et CGV de HeedUp, service de pulse survey hebdomadaire anonyme pour dirigeants et managers de PME.",
      },
    ],
  }),
  component: Page,
});

const sections: { title: string; content: string }[] = [
  {
    title: "Objet",
    content:
      "HeedUp est un service de pulse survey hebdomadaire anonyme destiné aux dirigeants et managers de PME. Ces conditions régissent l'accès au service et son utilisation. En activant son premier survey, l'utilisateur les accepte sans réserve.",
  },
  {
    title: "Accès au service",
    content:
      "HeedUp est accessible en ligne sur heedup.fr. L'inscription est ouverte à toute personne morale ou physique agissant dans un cadre professionnel, disposant d'une équipe d'au moins 10 salariés. L'accès est conditionné au paiement de l'abonnement correspondant à la taille de l'équipe.",
  },
  {
    title: "Ce que HeedUp fournit",
    content:
      "Envoi automatique de 5 questions anonymes aux salariés chaque vendredi. Rapport d'équipe hebdomadaire chaque lundi avec scores agrégés et recommandations générées par IA. Tableau de bord présentant l'historique des scores. Support inclus dans tous les abonnements.",
  },
  {
    title: "Ce que HeedUp ne fournit pas",
    content:
      "HeedUp n'est pas un outil de diagnostic médical, psychologique ou juridique. Les recommandations générées par IA sont indicatives et ne remplacent pas un conseil professionnel RH ou managérial. HeedUp ne garantit pas un résultat particulier en matière de turnover ou d'engagement.",
  },
  {
    title: "Obligations de l'utilisateur",
    content:
      "Utiliser le service dans un cadre professionnel uniquement. Informer les salariés de la mise en place des surveys avant le premier envoi. Ne pas tenter de désanonymiser les réponses individuelles. Maintenir la confidentialité de ses identifiants. Ne pas revendre ou partager l'accès au service.",
  },
  {
    title: "Tarifs",
    content:
      "Le service est facturé par siège selon un barème dégressif affiché sur heedup.fr/tarifs. Jules Leclercq est auto-entrepreneur au régime de la franchise en base de TVA (art. 293 B du CGI). Aucune TVA n'est applicable. Le paiement est effectué par carte bancaire via Stripe.",
  },
  {
    title: "Durée et résiliation",
    content:
      "L'abonnement mensuel est sans engagement et se renouvelle automatiquement. L'abonnement annuel est engagé pour 12 mois. La résiliation est possible à tout moment depuis l'espace client, avec effet à la fin de la période en cours. Aucun remboursement prorata n'est accordé.",
  },
  {
    title: "Responsabilité",
    content:
      "HeedUp est une obligation de moyens. Sa responsabilité est limitée aux sommes versées par le client au cours des 3 derniers mois. HeedUp ne peut être tenu responsable des dommages indirects, pertes d'exploitation ou préjudices consécutifs à l'utilisation du service.",
  },
  {
    title: "Propriété intellectuelle",
    content:
      "Le service HeedUp, son code et ses interfaces sont la propriété exclusive de Jules Leclercq. Les données et rapports produits par le service restent la propriété du client.",
  },
  {
    title: "Droit applicable",
    content:
      "Ces conditions sont soumises au droit français. En cas de litige, le Tribunal de Commerce de Bordeaux sera seul compétent.",
  },
  {
    title: "Contact",
    content:
      "contact@heedup.fr\n32 Cours Pasteur, 33000 Bordeaux, France",
  },
];

function Page() {
  return (
    <SiteLayout>
      <section className="heedup-legal" style={{ backgroundColor: "var(--bg-main)", padding: "64px 5%" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "42px",
              color: "var(--midnight)",
              letterSpacing: "-0.8px",
              marginBottom: "8px",
            }}
          >
            Conditions générales
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "var(--text-muted)",
              marginBottom: "48px",
            }}
          >
            CGU et CGV, en vigueur depuis juillet 2026
          </p>

          {sections.map((section, index) => (
            <div key={section.title}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  color: "var(--midnight)",
                  paddingTop: "36px",
                  marginBottom: "10px",
                  borderTop: index > 0 ? "1px solid rgba(67,56,202,0.08)" : "none",
                }}
              >
                {section.title}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                  lineHeight: 1.75,
                  whiteSpace: "pre-line",
                }}
              >
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
