import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { heedupClient } from "@/config/heedupClient";

type TokenSearch = { token?: string };

export const Route = createFileRoute("/repondre")({
  validateSearch: (search: Record<string, unknown>): TokenSearch => {
    const value = search["token"];
    return typeof value === "string" ? { token: value } : {};
  },
  head: () => ({
    meta: [
      { title: "Votre check-in de la semaine · HeedUp" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Questionnaire hebdomadaire anonyme HeedUp, 5 questions, deux minutes.",
      },
      { property: "og:title", content: "Votre check-in de la semaine · HeedUp" },
      {
        property: "og:description",
        content: "Questionnaire hebdomadaire anonyme HeedUp, 5 questions, deux minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RepondrePage,
});

const QUESTIONS = [
  { id: "workload", label: "Ma charge de travail a été tenable cette semaine." },
  { id: "recognition", label: "Le travail que j'ai fourni cette semaine a été reconnu." },
  { id: "clarity", label: "Je savais ce qu'on attendait de moi cette semaine." },
  { id: "support", label: "J'ai pu compter sur du soutien quand j'en ai eu besoin." },
  { id: "meaning", label: "Ce que je fais a du sens pour moi." },
] as const;

type QuestionId = (typeof QUESTIONS)[number]["id"];

const GENERIC_ERROR = "Une erreur est survenue. Réessayez dans quelques instants.";

function normalize(text: string) {
  return text.toLowerCase().trim().replace(/\.+$/, "");
}

function matches(message: string, known: string) {
  return normalize(message).includes(normalize(known));
}

type Outcome =
  | { kind: "success"; title: string; text: string }
  | { kind: "terminal"; title: string; text: string }
  | { kind: "retryable"; title: string; text: string };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-main)",
        display: "flex",
        flexDirection: "column",
        padding: "28px 20px 32px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "26px",
          fontStyle: "italic",
          color: "var(--midnight)",
          textAlign: "center",
          marginBottom: "28px",
        }}
      >
        HeedUp
      </div>
      <div style={{ flex: 1, width: "100%", maxWidth: "620px", margin: "0 auto" }}>{children}</div>
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <a
          href="/confidentialite"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12.5px",
            color: "var(--text-muted)",
            textDecoration: "none",
          }}
        >
          Confidentialité
        </a>
      </div>
    </div>
  );
}

function Message({ title, text }: { title: string; text: string }) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(107,114,128,0.25)",
        borderRadius: "14px",
        padding: "28px 24px",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "26px",
          color: "var(--midnight)",
          margin: "0 0 12px",
          letterSpacing: "-0.3px",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "15.5px",
          lineHeight: 1.65,
          color: "var(--text-muted)",
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function RepondrePage() {
  const { token } = Route.useSearch();
  const [answers, setAnswers] = useState<Partial<Record<QuestionId, number>>>({});
  const [freeText, setFreeText] = useState("");
  const [sending, setSending] = useState(false);
  const [locked, setLocked] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  if (!token) {
    return (
      <Shell>
        <Message
          title="Ce lien n'est pas valide."
          text="Vérifiez que vous avez copié l'adresse complète depuis votre email."
        />
      </Shell>
    );
  }

  if (outcome && outcome.kind !== "retryable") {
    return (
      <Shell>
        <Message title={outcome.title} text={outcome.text} />
      </Shell>
    );
  }

  const answered = QUESTIONS.filter((q) => answers[q.id] !== undefined).length;
  const complete = answered === QUESTIONS.length;

  const resolve = (message: string): Outcome => {
    if (matches(message, "Token invalide")) {
      return {
        kind: "terminal",
        title: "Ce lien n'est pas valide.",
        text: "Vérifiez que vous avez copié l'adresse complète depuis votre email.",
      };
    }
    if (matches(message, "Ce lien a déjà été utilisé")) {
      return {
        kind: "success",
        title: "Votre réponse a déjà été enregistrée",
        text: "Merci, c'est bien noté pour cette semaine.",
      };
    }
    if (matches(message, "Ce lien a expiré")) {
      return {
        kind: "terminal",
        title: "Ce lien a expiré.",
        text: "Les liens sont valables 3 jours. Vous recevrez un nouveau questionnaire vendredi prochain.",
      };
    }
    return { kind: "retryable", title: "", text: GENERIC_ERROR };
  };

  const submit = async () => {
    if (!complete || sending || locked) return;
    setSending(true);
    setLocked(true);
    setOutcome(null);

    const trimmed = freeText.trim();
    const payload = {
      token,
      answers: {
        workload: Number(answers.workload),
        recognition: Number(answers.recognition),
        clarity: Number(answers.clarity),
        support: Number(answers.support),
        meaning: Number(answers.meaning),
      },
      free_text: trimmed === "" ? null : trimmed,
    };

    let message = "";
    try {
      const { data, error } = await heedupClient.functions.invoke("submit-survey-response", {
        body: payload,
      });

      if (data && typeof data === "object") {
        const status = (data as { status?: string }).status;
        if (status === "success") {
          setSending(false);
          setOutcome({
            kind: "success",
            title: "Merci, c'est enregistré.",
            text: "Votre réponse rejoint celles de vos collègues. Votre manager recevra lundi une synthèse d'équipe : des moyennes, jamais des réponses individuelles, et uniquement si au moins 5 personnes ont répondu. Vous recevrez le prochain questionnaire vendredi.",
          });
          return;
        }
        if (status === "error") {
          message = String((data as { message?: string }).message ?? "");
        }
      }

      if (!message && error) {
        try {
          const body = await (error as { context?: { json: () => Promise<unknown> } }).context?.json();
          if (body && typeof body === "object") {
            const b = body as { message?: string; error?: string };
            message = String(b.message ?? b.error ?? "");
          }
        } catch {
          message = "";
        }
      }
    } catch {
      message = "";
    }

    setSending(false);
    const next = resolve(message);
    setOutcome(next);
    if (next.kind === "retryable") setLocked(false);
  };

  return (
    <Shell>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "30px",
          color: "var(--midnight)",
          margin: "0 0 8px",
          letterSpacing: "-0.4px",
        }}
      >
        Votre check-in de la semaine
      </h1>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "15.5px",
          color: "var(--text-muted)",
          margin: "0 0 24px",
        }}
      >
        5 questions, deux minutes.
      </p>

      <div
        style={{
          backgroundColor: "var(--indigo-pale)",
          borderRadius: "14px",
          padding: "18px 20px",
          marginBottom: "28px",
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          lineHeight: 1.6,
          color: "var(--text-primary)",
        }}
      >
        Vos réponses sont anonymes : le lien entre votre réponse et votre identité est supprimé au
        moment de l'envoi. Votre manager reçoit uniquement des moyennes d'équipe, à partir de 5
        réponses.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {QUESTIONS.map((q, index) => (
          <div
            key={q.id}
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "14px",
              padding: "22px 20px",
              boxShadow: "0 1px 3px rgba(13,27,62,0.06)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "8px",
              }}
            >
              Question {index + 1} sur 5
            </div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "16px",
                lineHeight: 1.5,
                color: "var(--text-primary)",
                margin: "0 0 18px",
                fontWeight: 500,
              }}
            >
              {q.label}
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {[1, 2, 3, 4, 5].map((value) => {
                const selected = answers[q.id] === value;
                return (
                  <div key={value} style={{ flex: 1, minWidth: 0 }}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: value }))}
                      disabled={locked}
                      style={{
                        width: "100%",
                        minWidth: "44px",
                        minHeight: "48px",
                        borderRadius: "10px",
                        cursor: locked ? "default" : "pointer",
                        fontFamily: "var(--font-sans)",
                        fontSize: "16px",
                        fontWeight: 600,
                        backgroundColor: selected ? "var(--indigo)" : "var(--bg-card)",
                        color: selected ? "#FFFFFF" : "var(--text-primary)",
                        border: selected ? "1px solid var(--indigo)" : "1px solid rgba(107,114,128,0.2)",
                        transition: "opacity 0.2s ease",
                      }}
                    >
                      {value}
                    </button>
                    {(value === 1 || value === 5) && (
                      <div
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          marginTop: "6px",
                          textAlign: value === 1 ? "left" : "right",
                        }}
                      >
                        {value === 1 ? "Pas du tout" : "Tout à fait"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "14px",
          padding: "22px 20px",
          boxShadow: "0 1px 3px rgba(13,27,62,0.06)",
          marginTop: "18px",
        }}
      >
        <label
          htmlFor="free-text"
          style={{
            display: "block",
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: "10px",
          }}
        >
          Un commentaire à ajouter ? (facultatif)
        </label>
        <textarea
          id="free-text"
          rows={4}
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          disabled={locked}
          style={{
            width: "100%",
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            lineHeight: 1.55,
            color: "var(--text-primary)",
            backgroundColor: "var(--bg-main)",
            border: "1px solid rgba(107,114,128,0.2)",
            borderRadius: "10px",
            padding: "12px",
            resize: "vertical",
          }}
        />
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12.5px",
            color: "var(--text-muted)",
            marginTop: "8px",
            lineHeight: 1.5,
          }}
        >
          Ce champ est partagé sous forme de synthèse collective, jamais transmis individuellement à
          votre manager.
        </div>
      </div>

      <div style={{ marginTop: "26px" }}>
        <button
          type="button"
          onClick={() => void submit()}
          disabled={!complete || sending || locked}
          style={{
            width: "100%",
            minHeight: "52px",
            backgroundColor: "var(--indigo)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "10px",
            fontFamily: "var(--font-sans)",
            fontSize: "16px",
            fontWeight: 700,
            cursor: !complete || sending || locked ? "default" : "pointer",
            opacity: !complete || sending || locked ? 0.45 : 1,
            transition: "opacity 0.2s ease",
          }}
        >
          {sending ? "Envoi en cours…" : "Envoyer mes réponses"}
        </button>
        {!complete && (
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12.5px",
              color: "var(--text-muted)",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            {answered} question{answered > 1 ? "s" : ""} sur 5 répondue{answered > 1 ? "s" : ""}
          </div>
        )}
        {outcome?.kind === "retryable" && (
          <div
            style={{
              marginTop: "14px",
              border: "1px solid rgba(107,114,128,0.35)",
              borderRadius: "10px",
              padding: "14px 16px",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              color: "var(--text-primary)",
            }}
          >
            {outcome.text}
          </div>
        )}
      </div>
    </Shell>
  );
}
