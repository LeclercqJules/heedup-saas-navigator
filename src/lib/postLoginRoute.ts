import { heedupClient } from "@/config/heedupClient";
import { consumeRedirect } from "@/lib/redirectAfterLogin";

export type PostLoginDestination =
  | { kind: "redirect"; to: string }
  | { kind: "error"; message: string };

export const GENERIC_ERROR = "Une erreur est survenue. Réessayez dans quelques instants.";

/**
 * Décide de la destination après connexion.
 * Ordre : session -> admin -> ligne manager (présente / absente / erreur).
 */
export async function resolvePostLoginDestination(): Promise<PostLoginDestination> {
  const { data: sessionData } = await heedupClient.auth.getSession();
  const session = sessionData.session;
  if (!session) return { kind: "redirect", to: "/connexion" };

  // Le compte peut avoir été supprimé entre deux visites (purge des comptes
  // sans organisation inactifs depuis 90 jours). On vérifie donc l'utilisateur
  // auprès du serveur : son absence est une invitation à se reconnecter,
  // jamais une erreur technique.
  const { data: userData, error: userError } = await heedupClient.auth.getUser();
  const user = userData?.user ?? null;
  if (userError || !user) {
    await heedupClient.auth.signOut();
    return { kind: "redirect", to: "/connexion" };
  }

  const accountType = (user.app_metadata as Record<string, unknown> | undefined)?.[
    "account_type"
  ];
  if (accountType === "admin") return { kind: "redirect", to: "/admin/conversations" };

  const { data, error } = await heedupClient
    .from("managers")
    .select("organization_id")
    .maybeSingle();

  if (error) {
    // Une erreur peut aussi signifier que la session ne vaut plus rien.
    const { data: recheck } = await heedupClient.auth.getUser();
    if (!recheck?.user) {
      await heedupClient.auth.signOut();
      return { kind: "redirect", to: "/connexion" };
    }
    return { kind: "error", message: GENERIC_ERROR };
  }

  // error === null ET data === null => pas d'organisation
  if (!data) return { kind: "redirect", to: "/onboarding" };

  const stored = consumeRedirect();
  return { kind: "redirect", to: stored ?? "/dashboard" };
}
