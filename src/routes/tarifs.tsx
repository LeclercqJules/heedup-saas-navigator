import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs — HeedUp" },
      {
        name: "description",
        content:
          "Une tarification simple et transparente pour les PME. Sans engagement pendant la phase pilote.",
      },
    ],
  }),
  component: Page,
});

const plans = [
  {
    name: "Starter",
    price: "40 € / mois",
    desc: "Jusqu'à 10 salariés.",
    features: [
      "5 questions hebdomadaires",
      "Digest manager automatique",
      "Support par email",
    ],
  },
  {
    name: "Growth",
    price: "87 € / mois",
    desc: "Jusqu'à 25 salariés.",
    features: [
      "Tout du plan Starter",
      "Recommandations IA",
      "Export données CSV",
      "Support prioritaire",
    ],
    highlight: true,
    badge: "Le plus choisi",
  },
  {
    name: "Scale",
    price: "150 € / mois",
    desc: "Jusqu'à 50 salariés.",
    features: [
      "Tout du plan Growth",
      "Intégrations SIRH",
      "Rôles manager multiples",
      "Accompagnement à bord",
    ],
  },
];

function Page() {
  return (
    <SiteLayout>
      <section className="mx-auto px-[5%] py-20">
        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.1 }}>
          Tarifs
        </h1>
        <p
          className="mt-4"
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
              className="relative"
              style={{
                backgroundColor: p.highlight ? "#0F1B33" : "#FFFFFF",
                color: p.highlight ? "#F7F5F0" : "#0F1B33",
                borderRadius: "12px",
                padding: "32px",
                border: "1px solid rgba(15,27,51,0.08)",
              }}
            >
              {p.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#C9A06A",
                    color: "#0F1B33",
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {p.badge}
                </span>
              )}
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
