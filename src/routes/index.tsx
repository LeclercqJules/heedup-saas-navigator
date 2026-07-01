import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#7A9B8E",
            fontWeight: 600,
          }}
        >
          Bientôt disponible
        </p>
        <h1
          className="mt-6"
          style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1.05 }}
        >
          Anticipez le turnover
          <br />
          avant qu'il n'arrive.
        </h1>
        <p
          className="mx-auto mt-8 max-w-xl"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "16px",
            lineHeight: 1.6,
            color: "rgba(15,27,51,0.7)",
          }}
        >
          HeedUp est un système d'alerte précoce qui aide les équipes RH à
          détecter les signaux faibles du désengagement — bien avant la
          démission.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <a
            href="#waitlist"
            style={{
              backgroundColor: "#C9A06A",
              color: "#0F1B33",
              fontWeight: 700,
              fontSize: "13px",
              borderRadius: "7px",
              padding: "12px 22px",
              fontFamily: "var(--font-sans)",
            }}
          >
            Rejoindre la liste d'attente
          </a>
          <a
            href="/fonctionnalites"
            style={{
              border: "1px solid rgba(15,27,51,0.2)",
              color: "#0F1B33",
              fontWeight: 500,
              fontSize: "13px",
              borderRadius: "7px",
              padding: "12px 22px",
              fontFamily: "var(--font-sans)",
            }}
          >
            Voir les fonctionnalités
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 md:grid-cols-3">
        {[
          {
            t: "Signaux faibles",
            d: "Repérez les micro-changements dans l'engagement avant qu'ils ne se transforment en départ.",
          },
          {
            t: "Alertes précoces",
            d: "Recevez une alerte contextuelle dès qu'un collaborateur entre dans une zone de risque.",
          },
          {
            t: "Conforme RGPD",
            d: "Données hébergées en France, chiffrées et pseudonymisées par défaut.",
          },
        ].map((c) => (
          <div
            key={c.t}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "28px",
              border: "1px solid rgba(15,27,51,0.08)",
            }}
          >
            <h3 style={{ fontSize: "22px" }}>{c.t}</h3>
            <p
              className="mt-3"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                lineHeight: 1.6,
                color: "rgba(15,27,51,0.65)",
              }}
            >
              {c.d}
            </p>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
