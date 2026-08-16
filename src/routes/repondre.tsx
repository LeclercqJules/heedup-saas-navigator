import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck } from "lucide-react";
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

function Shell({ children, progress }: { children: React.ReactNode; progress?: number }) {
  return (
    <div
      id="repondre-root"
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
          width: "100%",
          maxWidth: "620px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            fontStyle: "italic",
            color: "var(--midnight)",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          HeedUp
        </div>
        {progress !== undefined && (
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              width: "100%",
              marginBottom: "20px",
              backgroundColor: "var(--bg-main)",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
          >
            <div
              style={{
                height: "3px",
                borderRadius: "2px",
                backgroundColor: "color-mix(in oklab, var(--text-muted) 15%, transparent)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.round(progress * 100)}%`,
                  backgroundColor: "var(--indigo)",
                  transition: "width 200ms ease",
                }}
              />
            </div>
          </div>
        )}
        <div style={{ flex: 1, width: "100%" }}>{children}</div>
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
    </div>
  );
}

function Message({ title, text, icon }: { title: string; text: string; icon?: boolean }) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(107,114,128,0.25)",
        borderRadius: "14px",
        padding: "28px 24px",
        textAlign: icon ? "center" : "left",
      }}
    >
      {icon && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
          <CheckCircle2 size={32} strokeWidth={1.8} color="var(--indigo)" aria-hidden="true" />
        </div>
      )}
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
  const [highlighted, setHighlighted] = useState<QuestionId | null>(null);
  const cardRefs = useRef<Partial<Record<QuestionId, HTMLDivElement | null>>>({});
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        <Message title={outcome.title} text={outcome.text} icon={outcome.kind === "success"} />
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

  const focusFirstMissing = () => {
    const missing = QUESTIONS.find((q) => answers[q.id] === undefined);
    if (!missing) return;
    const node = cardRefs.current[missing.id];
    if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlighted(missing.id);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlighted(null), 2000);
  };

  const onPrimaryClick = () => {
    if (sending || locked) return;
    if (!complete) {
      focusFirstMissing();
      return;
    }
    void submit();
  };

  return (
    <Shell progress={answered / QUESTIONS.length}>
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
          margin: "0 0 20px",
        }}
      >
        5 questions, deux minutes.
      </p>

      <div
        style={{
          backgroundColor: "var(--indigo-pale)",
          borderRadius: "14px",
          padding: "14px 15px",
          marginBottom: "22px",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          lineHeight: 1.45,
          color: "var(--text-primary)",
        }}
      >
        <ShieldCheck
          size={20}
          strokeWidth={1.8}
          color="var(--indigo)"
          aria-hidden="true"
          style={{ flexShrink: 0, marginTop: "1px" }}
        />
        <div>
          Vos réponses sont anonymes : le lien entre votre réponse et votre identité est supprimé au
          moment de l'envoi. Votre manager reçoit uniquement des moyennes d'équipe, à partir de 5
          réponses.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {QUESTIONS.map((q, index) => {
          const isAnswered = answers[q.id] !== undefined;
          return (
            <div
              key={q.id}
              ref={(el) => {
                cardRefs.current[q.id] = el;
              }}
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "14px",
                padding: "15px 18px",
                boxShadow: "0 1px 3px rgba(13,27,62,0.06)",
                borderLeft: isAnswered ? "3px solid var(--indigo)" : "3px solid transparent",
                outline: highlighted === q.id ? "2px solid var(--indigo)" : "none",
                outlineOffset: "0px",
                transition: "opacity 0.2s ease",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "16px",
                  lineHeight: 1.45,
                  color: "var(--text-primary)",
                  margin: "0 0 14px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    lineHeight: 1.75,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>
                <span>{q.label}</span>
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
                        onMouseEnter={(e) => {
                          if (!selected && !locked)
                            e.currentTarget.style.border = "1px solid var(--indigo)";
                        }}
                        onMouseLeave={(e) => {
                          if (!selected)
                            e.currentTarget.style.border = "1px solid rgba(107,114,128,0.2)";
                        }}
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
                            whiteSpace: "nowrap",
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
          );
        })}
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "14px",
          padding: "16px 18px",
          boxShadow: "0 1px 3px rgba(13,27,62,0.06)",
          marginTop: "16px",
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
          maxLength={1000}
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
        {freeText.length >= 800 && (
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              color: "var(--text-muted)",
              textAlign: "right",
              marginTop: "6px",
            }}
          >
            {freeText.length} / 1000
          </div>
        )}
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

      <div style={{ marginTop: "22px" }}>
        <button
          type="button"
          onClick={onPrimaryClick}
          disabled={sending || locked}
          style={{
            width: "100%",
            minHeight: "52px",
            backgroundColor: complete ? "var(--indigo)" : "var(--bg-card)",
            color: complete ? "#FFFFFF" : "var(--text-muted)",
            border: complete ? "none" : "1px solid rgba(107,114,128,0.25)",
            borderRadius: "10px",
            fontFamily: "var(--font-sans)",
            fontSize: "16px",
            fontWeight: 700,
            cursor: sending || locked ? "default" : complete ? "pointer" : "not-allowed",
            transition: "background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease",
            opacity: sending || locked ? 0.6 : 1,
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
            {answered} réponse{answered > 1 ? "s" : ""} sur 5
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

