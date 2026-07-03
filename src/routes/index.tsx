import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section
        style={{
          height: "calc(100vh - 84px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 5%",
          }}
        >
          <div className="grid w-full items-center md:grid-cols-2" style={{ gap: "64px" }}>
            {/* Colonne gauche : texte */}
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#0F1B33",
                  color: "#C9A06A",
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: "5px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Votre équipe, enfin lisible.
              </span>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "54px",
                  lineHeight: 1.1,
                  letterSpacing: "-1px",
                  color: "#0F1B33",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                Votre prochain départ surprise, vous l'aurez{" "}
                <span style={{ fontStyle: "italic", color: "#C9A06A" }}>vu venir</span>.
              </h1>

              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  maxWidth: "460px",
                  fontSize: "17px",
                  lineHeight: 1.7,
                  color: "rgba(15,27,51,0.65)",
                  marginBottom: "32px",
                }}
              >
                Pilotez votre équipe sans devenir RH. 5 questions anonymes chaque vendredi, un rapport d'équipe actionnable chaque lundi.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <a
                  href="#waitlist"
                  className="inline-flex items-center gap-2"
                  style={{
                    backgroundColor: "#C9A06A",
                    color: "#0F1B33",
                    fontWeight: 700,
                    fontSize: "16px",
                    borderRadius: "8px",
                    padding: "15px 28px",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Rejoindre la liste d'attente →
                </a>

                <div
                  className="inline-flex items-center gap-2"
                  style={{
                    marginTop: "14px",
                    backgroundColor: "rgba(15,27,51,0.05)",
                    borderRadius: "20px",
                    padding: "7px 16px",
                    alignSelf: "flex-start",
                  }}
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-[#7A9B8E] animate-pulse" />
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#0F1B33",
                    }}
                  >
                    27 dirigeants déjà sur la liste d'attente
                  </span>
                </div>
              </div>
            </div>

            {/* Colonne droite : carte */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "15px",
                border: "1px solid rgba(15,27,51,0.12)",
                overflow: "hidden",
                fontFamily: "var(--font-sans)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  backgroundColor: "#0F1B33",
                  padding: "14px 22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: "#FFFFFF",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ color: "#C9A06A" }}>●</span>
                  Rapport d'équipe — Lundi 16 juin
                </div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                  Semaine 24
                </div>
              </div>

              {/* 3 scores */}
              <div
                className="grid grid-cols-3 gap-4 p-5"
                style={{ backgroundColor: "#F7F5F0" }}
              >
                {[
                  { label: "Charge", value: "3.6", change: "▼ 0.3", changeColor: "#B23A48" },
                  { label: "Ambiance", value: "4.1", change: "▲ 0.2", changeColor: "#3A7D44" },
                  { label: "Motivation", value: "4.3", change: "—", changeColor: "#9A9A9A" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg p-4 text-center"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "rgba(15,27,51,0.55)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "4px",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: "26px",
                        fontWeight: 600,
                        color: "#0F1B33",
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </div>
                    <div style={{ fontSize: "12px", color: s.changeColor, marginTop: "4px" }}>
                      {s.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommandations */}
              <div className="px-6 pt-5 pb-2">
                <div
                  style={{
                    fontSize: "11.5px",
                    color: "rgba(15,27,51,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                    marginBottom: "12px",
                  }}
                >
                  Recommandations IA
                </div>
                <div
                  className="mb-4 flex items-start gap-3 rounded-lg p-4"
                  style={{ backgroundColor: "rgba(201,160,106,0.10)" }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{ backgroundColor: "#0F1B33", width: "22px", height: "22px" }}
                  >
                    <span style={{ fontSize: "12px", color: "#C9A06A" }}>↓</span>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.5,
                      color: "rgba(15,27,51,0.85)",
                    }}
                  >
                    Charge en baisse 2 semaines. Organisez un point d'équipe avant vendredi.
                  </p>
                </div>
                <div
                  className="mb-4 flex items-start gap-3 rounded-lg p-4"
                  style={{ backgroundColor: "rgba(201,160,106,0.10)" }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{ backgroundColor: "#0F1B33", width: "22px", height: "22px" }}
                  >
                    <span style={{ fontSize: "12px", color: "#C9A06A" }}>↑</span>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.5,
                      color: "rgba(15,27,51,0.85)",
                    }}
                  >
                    Ambiance en hausse. Bon moment pour lancer un projet à forte visibilité.
                  </p>
                </div>
                <div
                  className="mb-4 flex items-start gap-3 rounded-lg border border-[#C9A06A] p-4"
                  style={{ backgroundColor: "rgba(201,160,106,0.10)" }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{ backgroundColor: "#C9A06A", width: "22px", height: "22px" }}
                  >
                    <span style={{ fontSize: "12px", color: "#0F1B33" }}>!</span>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.5,
                      color: "rgba(15,27,51,0.85)",
                    }}
                  >
                    2 employés n'ont pas répondu cette semaine. Envoie un rappel discret avant vendredi — le silence est aussi un signal.
                  </p>
                </div>
              </div>

              {/* Footer carte */}
              <div className="px-6 pb-6 pt-3">
                <div
                  style={{
                    fontSize: "13px",
                    color: "rgba(15,27,51,0.55)",
                    marginBottom: "10px",
                  }}
                >
                  Taux de réponse : 8 / 10 employés
                </div>
                <div
                  style={{
                    height: "7px",
                    backgroundColor: "rgba(15,27,51,0.08)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "80%",
                      height: "100%",
                      backgroundColor: "#7A9B8E",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div
          style={{
            backgroundColor: "#0F1B33",
            padding: "16px 5%",
          }}
        >
          <div className="flex flex-wrap items-center justify-center" style={{ gap: "36px" }}>
            {[
              "RGPD natif",
              "Hébergé en France",
              "Réponses anonymes",
              "Actif en 10 minutes",
              "Sans engagement",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                <span style={{ color: "#C9A06A" }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards conservées */}
      <section className="mx-auto grid gap-6 px-[5%] pb-24 pt-16 md:grid-cols-3">
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
