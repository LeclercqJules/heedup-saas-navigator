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
      "Rapport d'équipe automatique",
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
          Tarifs
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
          Une tarification lisible. Pas de coûts cachés, pas d'engagement
          pendant le pilote.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.name}
              className="relative"
              style={{
                backgroundColor: p.highlight ? "var(--midnight)" : "var(--bg-card)",
                color: p.highlight ? "#FFFFFF" : "var(--text-primary)",
                borderRadius: "12px",
                padding: "32px",
                border: "1px solid rgba(67,56,202,0.1)",
              }}
            >
              {p.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "var(--indigo)",
                    color: "#FFFFFF",
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
                  color: p.highlight ? "#FFFFFF" : "var(--midnight)",
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
                  color: p.highlight ? "var(--indigo-pale)" : "var(--midnight)",
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

              <a
                href="#waitlist"
                className="mt-6 inline-block"
                style={{
                  backgroundColor: "var(--indigo)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "14px",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Choisir ce plan
              </a>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
