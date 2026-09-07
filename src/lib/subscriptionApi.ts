import { heedupClient } from "@/config/heedupClient";

/** Correspondance tolérante : minuscules, point final retiré, espaces coupés. */
export function normalizeMessage(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase().replace(/\.$/, "") : "";
}

type InvokeResult = {
  status: string | null;
  url: string | null;
  message: string;
  rawMessage: string;
  failed: boolean;
};

function readResult(data: unknown, error: unknown): InvokeResult {
  const payload = (data ?? null) as { status?: unknown; url?: unknown; message?: unknown } | null;
  const rawMessage = typeof payload?.message === "string" ? payload.message : "";
  return {
    status: typeof payload?.status === "string" ? payload.status : null,
    url: typeof payload?.url === "string" ? payload.url : null,
    message: normalizeMessage(rawMessage),
    rawMessage,
    failed: Boolean(error) || payload === null,
  };
}

export const GENERIC_ERROR = "Une erreur est survenue. Réessayez dans quelques instants.";

export async function createCheckoutSession(periodicite: "mensuel" | "annuel"): Promise<InvokeResult> {
  try {
    const { data, error } = await heedupClient.functions.invoke("create-checkout-session", {
      body: { periodicite },
    });
    return readResult(data, error);
  } catch {
    return { status: null, url: null, message: "", rawMessage: "", failed: true };
  }
}

export async function openBillingPortalSession(): Promise<InvokeResult> {
  try {
    const { data, error } = await heedupClient.functions.invoke("billing-portal");
    return readResult(data, error);
  } catch {
    return { status: null, url: null, message: "", rawMessage: "", failed: true };
  }
}

/** Relecture ciblée du statut, utilisée par le retour de paiement. */
export async function readSubscriptionStatus(): Promise<string | null> {
  const { data, error } = await heedupClient
    .from("organizations")
    .select("subscription_status")
    .maybeSingle();
  if (error) return null;
  return (data as { subscription_status?: string | null } | null)?.subscription_status ?? null;
}
