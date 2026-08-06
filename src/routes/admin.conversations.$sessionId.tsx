import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { AuthGuard, SignOutButton } from "@/components/auth/AuthGuard";
import {
  AdminApiError,
  callAdminFunction,
  escalationStyle,
  formatCost,
  formatDateTime,
} from "@/lib/adminApi";

export const Route = createFileRoute("/admin/conversations/$sessionId")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Conversation · Admin HeedUp" },
      { name: "description", content: "Détail d'une conversation du widget HeedUp." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Conversation · Admin HeedUp" },
      { property: "og:description", content: "Détail d'une conversation du widget HeedUp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminConversationDetailPage,
});

const MD_ALLOWED = ["p", "strong", "em", "ul", "ol", "li", "a", "br"];

type Detail = {
  session_id: string;
  messages: { role: "user" | "assistant"; content: string }[];
  escalation_level: string | null;
  collected_contact: Record<string, unknown> | null;
  token_usage: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  cout_estime_usd: number;
};

function AdminConversationDetailPage() {
  return (
    <AuthGuard requireAdmin>
      <Detail />
    </AuthGuard>
  );
}

function BackLink() {
  return (
    <Link
      to="/admin/conversations"
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "14px",
        fontWeight: 600,
        color: "var(--indigo)",
      }}
    >
      Retour à la liste
    </Link>
  );
}

function Detail() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; notFound: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await callAdminFunction<Detail>("admin-chat-history", {
          session_id: sessionId,
        });
        if (!cancelled) setData(res);
      } catch (e) {
        const err = e as AdminApiError;
        if (err.kind === "expired") {
          navigate({ to: "/connexion", replace: true });
          return;
        }
        if (!cancelled) setError({ message: err.message, notFound: err.kind === "not_found" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, navigate]);

  const pill = escalationStyle(data?.escalation_level);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)", padding: "40px 5%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <BackLink />
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "26px",
              color: "var(--midnight)",
              letterSpacing: "-0.3px",
            }}
          >
            Conversation
          </h1>
        </div>
        <SignOutButton />
      </div>

      {loading && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(67,56,202,0.12)",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              style={{
                height: "38px",
                width: i % 2 === 0 ? "60%" : "45%",
                alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
                borderRadius: "12px",
                background: "rgba(13,27,62,0.08)",
              }}
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(67,56,202,0.12)",
            borderRadius: "12px",
            padding: "24px",
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            color: "var(--text-primary)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "flex-start",
          }}
        >
          <span>{error.message}</span>
          {error.notFound && <BackLink />}
        </div>
      )}

      {!loading && !error && data && (
        <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "minmax(0,1fr) 300px" }}>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(67,56,202,0.12)",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {(data.messages ?? []).map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  background: m.role === "user" ? "var(--indigo-pale)" : "var(--bg-main)",
                  border: "1px solid rgba(67,56,202,0.10)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "var(--text-primary)",
                  whiteSpace: m.role === "user" ? "pre-wrap" : "normal",
                }}
              >
                {m.role === "user" ? (
                  m.content
                ) : (
                  <div className="heedup-chat-md">
                    <ReactMarkdown
                      skipHtml
                      allowedElements={MD_ALLOWED}
                      unwrapDisallowed
                      components={{
                        a: ({ href, children }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer">
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
            {(data.messages ?? []).length === 0 && (
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)" }}>
                Aucun message.
              </span>
            )}
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Panel title="Informations">
              <Field label="Escalade">
                <span
                  style={{
                    display: "inline-block",
                    background: pill.bg,
                    color: pill.color,
                    borderRadius: "20px",
                    padding: "3px 10px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {pill.label}
                </span>
              </Field>
              <Field label="Coût estimé">{formatCost(data.cout_estime_usd)}</Field>
              <Field label="Créée le">{formatDateTime(data.created_at)}</Field>
              <Field label="Mise à jour le">{formatDateTime(data.updated_at)}</Field>
              <Field label="Session">
                <span style={{ wordBreak: "break-all" }}>{data.session_id}</span>
              </Field>
            </Panel>

            <Panel title="Contact collecté">
              {data.collected_contact && Object.keys(data.collected_contact).length > 0 ? (
                Object.entries(data.collected_contact).map(([k, v]) => (
                  <Field key={k} label={k}>
                    <span style={{ wordBreak: "break-word" }}>
                      {typeof v === "object" && v !== null ? JSON.stringify(v) : String(v)}
                    </span>
                  </Field>
                ))
              ) : (
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-muted)" }}>
                  Aucun contact collecté.
                </span>
              )}
            </Panel>

            {data.token_usage && Object.keys(data.token_usage).length > 0 && (
              <Panel title="Consommation">
                {Object.entries(data.token_usage).map(([k, v]) => (
                  <Field key={k} label={k}>
                    {typeof v === "object" && v !== null ? JSON.stringify(v) : String(v)}
                  </Field>
                ))}
              </Panel>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid rgba(67,56,202,0.12)",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.9px",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        {title}
      </span>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-muted)" }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-primary)" }}>
        {children}
      </span>
    </div>
  );
}
