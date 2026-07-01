import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs — HeedUp" },
      {
        name: "description",
        content:
          "Une tarification simple, par collaborateur suivi. Sans engagement pendant la phase pilote.",
      },
    ],
  }),
  component: Page,
});

const plans = [
  {
    name: "Pilote",
    price: "Sur invitation",
    desc: "Pour les premières équipes qui rejoignent HeedUp.",
    features: [
      "Jusqu'à 50 collaborateurs suivis",
      "Alertes précoces incluses",
      "Support prioritaire",
    ],
  },
  {
    name: "Équipe",
    price: "9 € / mois / collaborateur",
    desc: "Pour les PME qui veulent structurer leur veille RH.",
    features: [
      "Collaborateurs illimités",
      "Tableau de bord RH complet",
      "Intégrations SIRH",
    ],
    highlight: true,
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    desc: "Pour les organisations multi-sites avec exigences avancées.",
    features: [
      "SSO, SCIM, audit trail",
      "Hébergement dédié possible",
      "Accompagnement dédié",
    ],
  },
];

function Page() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.1 }}>
          Tarifs
        </h1>
        <p
          className="mt-4 max-w-2xl"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            lineHeight: 1.6,
            color: "rgba(15,27,51,0.7)",
          }}
        >
          Une tarification lisible. Pas de coûts cachés, pas d'engagement
          pendant le pilote.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.name}
              style={{
                backgroundColor: p.highlight ? "#0F1B33" : "#FFFFFF",
                color: p.highlight ? "#F7F5F0" : "#0F1B33",
                borderRadius: "12px",
                padding: "32px",
                border: "1px solid rgba(15,27,51,0.08)",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  color: p.highlight ? "#F7F5F0" : "#0F1B33",
                }}
              >
                {p.name}
              </h3>
              <div
                className="mt-3"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: p.highlight ? "#C9A06A" : "#0F1B33",
                }}
              >
                {p.price}
              </div>
              <p
                className="mt-3"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  opacity: 0.75,
                }}
              >
                {p.desc}
              </p>
              <ul
                className="mt-6 space-y-2"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  opacity: 0.85,
                }}
              >
                {p.features.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
