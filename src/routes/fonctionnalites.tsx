import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/fonctionnalites")({
  head: () => ({
    meta: [
      { title: "Fonctionnalités — HeedUp" },
      {
        name: "description",
        content:
          "Détection de signaux faibles, alertes contextuelles, tableaux de bord RH — découvrez ce que fait HeedUp.",
      },
    ],
  }),
  component: Page,
});

const features = [
  {
    t: "Détection de signaux faibles",
    d: "Croisement d'indicateurs comportementaux et organisationnels pour repérer les baisses d'engagement invisibles à l'œil nu.",
  },
  {
    t: "Alertes contextuelles",
    d: "Notifications ciblées avec le contexte utile : ancienneté, équipe, historique — pas de score opaque.",
  },
  {
    t: "Tableau de bord RH",
    d: "Une vue synthétique de la santé de vos équipes, actualisée en continu.",
  },
  {
    t: "Recommandations d'action",
    d: "Des pistes concrètes de conversation ou d'intervention, calibrées par situation.",
  },
  {
    t: "Intégrations",
    d: "Se connecte à vos outils RH et de collaboration existants — sans double saisie.",
  },
  {
    t: "Confidentialité par défaut",
    d: "Pseudonymisation, minimisation des données, hébergement souverain.",
  },
];

function Page() {
  return (
    <SiteLayout>
      <section
        className="mx-auto px-[5%] py-20"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        <h1
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            lineHeight: 1.1,
            color: "var(--midnight)",
          }}
        >
          Fonctionnalités
        </h1>
        <p
          className="mt-4"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            lineHeight: 1.6,
            color: "var(--text-muted)",
          }}
        >
          Tout ce qu'il faut pour agir avant que le désengagement ne devienne
          un départ.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <article
              key={f.t}
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "12px",
                padding: "28px",
                border: "1px solid rgba(67,56,202,0.1)",
              }}
            >
              <h3 style={{ fontSize: "22px", color: "var(--midnight)" }}>{f.t}</h3>
              <p
                className="mt-3"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "var(--text-muted)",
                }}
              >
                {f.d}
              </p>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
