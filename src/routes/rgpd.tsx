import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/rgpd")({
  head: () => ({
    meta: [
      { title: "RGPD — HeedUp" },
      {
        name: "description",
        content:
          "Nos engagements RGPD : minimisation, pseudonymisation, hébergement en France.",
      },
    ],
  }),
  component: Page,
});

const blocks = [
  {
    t: "Minimisation des données",
    d: "Nous ne collectons que les données strictement nécessaires à la détection des signaux faibles. Aucune donnée émotionnelle brute n'est stockée.",
  },
  {
    t: "Pseudonymisation par défaut",
    d: "Les identifiants collaborateurs sont pseudonymisés dès l'ingestion. Le rapprochement n'est possible que côté client RH autorisé.",
  },
  {
    t: "Hébergement souverain",
    d: "Toutes les données sont hébergées en France, chez un hébergeur certifié HDS pour les cas cliniques et ISO 27001 par défaut.",
  },
  {
    t: "Droits des personnes",
    d: "Accès, rectification, effacement, opposition — les demandes sont traitées sous 30 jours via dpo@heedup.fr.",
  },
  {
    t: "Sous-traitants",
    d: "Liste tenue à jour et communiquée sur demande. Aucun transfert hors UE sans garantie appropriée.",
  },
];

function Page() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.1 }}>
          RGPD
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
          La conformité n'est pas une case à cocher. C'est un pilier de notre
          conception.
        </p>

        <div className="mt-12 space-y-6">
          {blocks.map((b) => (
            <article
              key={b.t}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                padding: "28px",
                border: "1px solid rgba(15,27,51,0.08)",
              }}
            >
              <h3 style={{ fontSize: "20px" }}>{b.t}</h3>
              <p
                className="mt-3"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "rgba(15,27,51,0.7)",
                }}
              >
                {b.d}
              </p>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
