import { useCallback, useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AuthGuard, SignOutButton } from "@/components/auth/AuthGuard";
import {
  AdminApiError,
  ESCALATION_LEVELS,
  callAdminFunction,
  escalationStyle,
  formatCost,
  formatDateTime,
} from "@/lib/adminApi";

export const Route = createFileRoute("/admin/conversations/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Conversations · Admin HeedUp" },
      { name: "description", content: "Historique des conversations du widget HeedUp." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Conversations · Admin HeedUp" },
      { property: "og:description", content: "Historique des conversations du widget HeedUp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminConversationsPage,
});

type Row = {
  session_id: string;
  escalation_level: string | null;
  collected_contact: Record<string, unknown> | null;
  nb_messages: number;
  cout_estime_usd: number;
  created_at: string;
  updated_at: string;
};

const PAGE_SIZE = 50;

const inputStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: "14px",
  color: "var(--text-primary)",
  background: "var(--bg-card)",
  border: "1px solid rgba(67,56,202,0.18)",
  borderRadius: "8px",
  padding: "9px 12px",
} as const;

const thStyle = {
  textAlign: "left" as const,
  fontFamily: "var(--font-sans)",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.6px",
  textTransform: "uppercase" as const,
  color: "var(--text-muted)",
  padding: "12px 16px",
  borderBottom: "1px solid rgba(67,56,202,0.12)",
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: "14px",
  color: "var(--text-primary)",
  padding: "13px 16px",
  borderBottom: "1px solid rgba(67,56,202,0.08)",
  whiteSpace: "nowrap" as const,
};

function Skeleton() {
  return (
    <tbody>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: 5 }).map((__, j) => (
            <td key={j} style={tdStyle}>
              <span
                style={{
                  display: "block",
                  height: "12px",
                  width: j === 0 ? "140px" : "70px",
                  borderRadius: "6px",
                  background: "rgba(13,27,62,0.08)",
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function AdminConversationsPage() {
  return (
    <AuthGuard requireAdmin>
      <ConversationsList />
    </AuthGuard>
  );
}

function ConversationsList() {
  const navigate = useNavigate();
  const [level, setLevel] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [offset, setOffset] = useState(0);

  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const body: Record<string, unknown> = { limit: PAGE_SIZE, offset };
    if (level) body["escalation_level"] = level;
    if (search.trim()) body["search"] = search.trim();
    if (dateFrom) body["date_from"] = dateFrom;
    if (dateTo) body["date_to"] = dateTo;
    try {
      const data = await callAdminFunction<{ conversations: Row[]; total: number }>(
        "admin-chat-history",
        body,
      );
      setRows(data.conversations ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      const err = e as AdminApiError;
      if (err.kind === "expired") {
        navigate({ to: "/connexion", replace: true });
        return;
      }
      setRows([]);
      setTotal(0);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [level, search, dateFrom, dateTo, offset, navigate]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const resetOffset = () => setOffset(0);
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + rows.length, total);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)", padding: "40px 5%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "30px",
            color: "var(--midnight)",
            letterSpacing: "-0.5px",
          }}
        >
          Historique des conversations
        </h1>
        <SignOutButton />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
        <select
          aria-label="Niveau d'escalade"
          value={level}
          onChange={(e) => {
            setLevel(e.target.value);
            resetOffset();
          }}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="">Tous</option>
          {ESCALATION_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <input
          aria-label="Recherche"
          placeholder="Rechercher"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetOffset();
          }}
          style={{ ...inputStyle, minWidth: "220px" }}
        />
        <input
          aria-label="Date de début"
          type="date"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
            resetOffset();
          }}
          style={inputStyle}
        />
        <input
          aria-label="Date de fin"
          type="date"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            resetOffset();
          }}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => {
            setLevel("");
            setSearch("");
            setDateFrom("");
            setDateTo("");
            setOffset(0);
          }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--indigo)",
            background: "transparent",
            border: "1px solid var(--indigo)",
            borderRadius: "8px",
            padding: "9px 16px",
            cursor: "pointer",
          }}
        >
          Réinitialiser les filtres
        </button>
      </div>

      {error && (
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            color: "var(--text-primary)",
            background: "var(--bg-card)",
            border: "1px solid rgba(67,56,202,0.12)",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid rgba(67,56,202,0.12)",
          borderRadius: "12px",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "720px" }}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Escalade</th>
              <th style={thStyle}>Messages</th>
              <th style={thStyle}>Contact collecté</th>
              <th style={thStyle}>Coût</th>
            </tr>
          </thead>
          {loading ? (
            <Skeleton />
          ) : (
            <tbody>
              {rows.length === 0 && !error && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      ...tdStyle,
                      color: "var(--text-muted)",
                      textAlign: "center",
                      padding: "40px 16px",
                      whiteSpace: "normal",
                    }}
                  >
                    Aucune conversation ne correspond à ces critères.
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const pill = escalationStyle(r.escalation_level);
                return (
                  <tr
                    key={r.session_id}
                    onClick={() =>
                      navigate({
                        to: "/admin/conversations/$sessionId",
                        params: { sessionId: r.session_id },
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td style={tdStyle}>{formatDateTime(r.updated_at)}</td>
                    <td style={tdStyle}>
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
                    </td>
                    <td style={tdStyle}>{r.nb_messages}</td>
                    <td style={tdStyle}>
                      {r.collected_contact && Object.keys(r.collected_contact).length > 0 ? "oui" : "non"}
                    </td>
                    <td style={tdStyle}>{formatCost(r.cout_estime_usd)}</td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginTop: "16px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-muted)" }}>
          {from} à {to} sur {total}
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <PageButton
            disabled={offset === 0 || loading}
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
          >
            Précédent
          </PageButton>
          <PageButton
            disabled={offset + PAGE_SIZE >= total || loading}
            onClick={() => setOffset(offset + PAGE_SIZE)}
          >
            Suivant
          </PageButton>
        </div>
      </div>

      <div style={{ marginTop: "18px" }}>
        <Link
          to="/"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "var(--indigo)",
            fontWeight: 600,
          }}
        >
          Retour au site
        </Link>
      </div>
    </div>
  );
}

function PageButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "14px",
        fontWeight: 600,
        color: disabled ? "var(--text-muted)" : "var(--indigo)",
        background: "transparent",
        border: `1px solid ${disabled ? "rgba(13,27,62,0.15)" : "var(--indigo)"}`,
        borderRadius: "8px",
        padding: "8px 16px",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {children}
    </button>
  );
}
