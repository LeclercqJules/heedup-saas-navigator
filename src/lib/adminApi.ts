import { heedupClient } from "@/config/heedupClient";
import { HEEDUP_SUPABASE_URL } from "@/config/heedupBackend";

export type AdminErrorKind =
  | "no_auth_header"
  | "expired"
  | "forbidden"
  | "not_found"
  | "server"
  | "network";

export class AdminApiError extends Error {
  kind: AdminErrorKind;
  constructor(kind: AdminErrorKind, message: string) {
    super(message);
    this.kind = kind;
  }
}

export const ADMIN_ERROR_TEXT: Record<AdminErrorKind, string> = {
  no_auth_header: "Erreur technique : en-tête d'autorisation manquant.",
  expired: "Votre session a expiré.",
  forbidden: "Accès refusé",
  not_found: "Conversation introuvable",
  server: "Une erreur est survenue. Réessayez.",
  network: "Une erreur est survenue. Réessayez.",
};

export async function callAdminFunction<T>(
  name: string,
  body: Record<string, unknown>,
): Promise<T> {
  const { data } = await heedupClient.auth.getSession();
  const token = data.session?.access_token;

  let res: Response;
  try {
    res = await fetch(`${HEEDUP_SUPABASE_URL}/functions/v1/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AdminApiError("network", ADMIN_ERROR_TEXT.network);
  }

  if (res.ok) return (await res.json()) as T;

  let payload: Record<string, unknown> = {};
  try {
    payload = (await res.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }
  const code = String(payload["code"] ?? "");
  const errMsg = String(payload["error"] ?? "");

  if (res.status === 401) {
    if (code === "UNAUTHORIZED_NO_AUTH_HEADER" || errMsg === "Authorization header manquant") {
      throw new AdminApiError("no_auth_header", ADMIN_ERROR_TEXT.no_auth_header);
    }
    throw new AdminApiError("expired", ADMIN_ERROR_TEXT.expired);
  }
  if (res.status === 403) throw new AdminApiError("forbidden", ADMIN_ERROR_TEXT.forbidden);
  if (res.status === 404) throw new AdminApiError("not_found", ADMIN_ERROR_TEXT.not_found);
  throw new AdminApiError("server", ADMIN_ERROR_TEXT.server);
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function formatCost(v: number | null | undefined): string {
  if (typeof v !== "number" || Number.isNaN(v)) return "-";
  return `${v.toFixed(4)} $`;
}

export const ESCALATION_LEVELS = ["none", "chaud", "support", "sensible"] as const;

export function escalationStyle(level: string | null | undefined): {
  bg: string;
  color: string;
  label: string;
} {
  switch (level) {
    case "chaud":
      return { bg: "rgba(34,197,94,0.12)", color: "var(--semantic-green)", label: "chaud" };
    case "sensible":
      return { bg: "rgba(239,68,68,0.12)", color: "var(--semantic-red)", label: "sensible" };
    case "support":
      return { bg: "var(--indigo-pale)", color: "var(--midnight)", label: "support" };
    default:
      return { bg: "var(--bg-main)", color: "var(--text-muted)", label: level || "none" };
  }
}
