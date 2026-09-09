import { useCallback, useEffect, useState } from "react";
import { heedupClient } from "@/config/heedupClient";
import type { Effectif } from "@/lib/dashboardData";

export type Salarie = {
  id: string;
  email: string;
  status: string | null;
  team_id: string | null;
  created_at: string | null;
};

export type EquipeData = {
  loading: boolean;
  salaries: Salarie[];
  effectif: Effectif;
  organizationId: string | null;
  subscriptionStatus: string | null;
  refresh: () => Promise<void>;
};

/** Le backend ne traite comme sollicité que le statut exactement "active". */
export function estActif(status: string | null | undefined): boolean {
  return status === "active";
}

export function estInactif(status: string | null | undefined): boolean {
  return status === "inactive";
}

export function useEquipeData(): EquipeData {
  const [loading, setLoading] = useState(true);
  const [salaries, setSalaries] = useState<Salarie[]>([]);
  const [effectif, setEffectif] = useState<Effectif>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  const load = useCallback(async (withSpinner: boolean) => {
    if (withSpinner) setLoading(true);

    const managerRes = await heedupClient.from("managers").select("organization_id").maybeSingle();
    const orgId = (managerRes.data as { organization_id?: string } | null)?.organization_id ?? null;
    setOrganizationId(orgId);

    const [salariesRes, effectifRes, orgRes] = await Promise.all([
      heedupClient.from("employees").select("id, email, status, team_id, created_at").order("email"),
      heedupClient.rpc("compter_desinscrits"),
      orgId
        ? heedupClient.from("organizations").select("subscription_status").eq("id", orgId).maybeSingle()
        : Promise.resolve({ data: null, error: null } as { data: unknown; error: unknown }),
    ]);

    setSalaries(((salariesRes.data as Salarie[] | null) ?? []).map((s) => ({ ...s })));

    const agg = effectifRes.data as Effectif;
    setEffectif(agg && agg.status !== "error" ? agg : null);

    const org = (orgRes.data ?? null) as { subscription_status?: string | null } | null;
    setSubscriptionStatus(org?.subscription_status ?? null);

    setLoading(false);
  }, []);

  useEffect(() => {
    void load(true);
  }, [load]);

  const refresh = useCallback(async () => {
    await load(false);
  }, [load]);

  return { loading, salaries, effectif, organizationId, subscriptionStatus, refresh };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function nettoyerEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function emailValide(value: string): boolean {
  return EMAIL_RE.test(value);
}
