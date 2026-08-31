import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { heedupClient } from "@/config/heedupClient";
import { AuthGuard, SignOutButton } from "@/components/auth/AuthGuard";
import {
  AuthShell,
  authButtonStyle,
  authInputStyle,
  authLabelStyle,
  authErrorStyle,
} from "@/components/auth/AuthShell";
import { emailValide } from "@/lib/equipeData";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Créons votre espace · HeedUp" },
      { name: "description", content: "Créez l'espace de votre entreprise pour démarrer avec HeedUp." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Créons votre espace · HeedUp" },
      { property: "og:description", content: "Créez l'espace de votre entreprise sur HeedUp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OnboardingPage,
});

const GENERIC = "Une erreur est survenue. Réessayez dans quelques instants.";
const MAX = 100;

/** Correspondance tolérante : minuscules, point final retiré, sous-chaîne. */
function normalize(message: unknown): string {
  if (typeof message !== "string") return "";
  return message.toLowerCase().trim().replace(/\.+$/, "");
}

const mutedText = {
  fontFamily: "var(--font-sans)",
  fontSize: "13px",
  color: "var(--text-muted)",
  lineHeight: 1.6,
} as const;

const secondaryButtonStyle = {
  width: "100%",
  padding: "13px 24px",
  borderRadius: "8px",
  border: "1.5px solid rgba(13,27,62,0.18)",
  background: "transparent",
  color: "var(--midnight)",
  fontFamily: "var(--font-sans)",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
} as const;

function primaryStyle(disabled: boolean) {
  if (!disabled) return authButtonStyle;
  return {
    ...authButtonStyle,
    background: "var(--bg-card)",
    border: "1px solid color-mix(in srgb, var(--text-muted) 25%, transparent)",
    color: "var(--text-muted)",
    cursor: "not-allowed",
  };
}

function StepBars({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "26px" }}>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          style={{
            flex: 1,
            height: "3px",
            borderRadius: "2px",
            background:
              n === step ? "var(--indigo)" : "color-mix(in srgb, var(--text-muted) 20%, transparent)",
          }}
        />
      ))}
    </div>
  );
}

function SignOutRow() {
  return (
    <div style={{ marginTop: "22px", display: "flex", justifyContent: "center" }}>
      <SignOutButton />
    </div>
  );
}

function OnboardingPage() {
  return (
    <AuthGuard allowMissingOrganization>
      <OnboardingFlow />
    </AuthGuard>
  );
}

type Step = 1 | 2 | 3;
type Fin = null | { kind: "lance"; envoyes: number } | { kind: "vendredi" };

function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [fin, setFin] = useState<Fin>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await heedupClient.from("managers").select("organization_id").maybeSingle();
      if (cancelled) return;
      const id = (data as { organization_id?: string } | null)?.organization_id ?? null;
      if (id) {
        setOrgId(id);
        setStep(2);
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;

  if (fin) return <FinScreen fin={fin} onGo={() => navigate({ to: "/dashboard", replace: true })} />;

  if (step === 1) {
    return (
      <EtapeEntreprise
        onDone={async () => {
          const { data } = await heedupClient.from("managers").select("organization_id").maybeSingle();
          setOrgId((data as { organization_id?: string } | null)?.organization_id ?? null);
          setStep(2);
        }}
      />
    );
  }

  if (step === 2) {
    return <EtapeEquipe organizationId={orgId} onDone={() => setStep(3)} />;
  }

  return <EtapePrevenir onRetourEquipe={() => setStep(2)} onRetourEntreprise={() => setStep(1)} onFin={setFin} />;
}

/* ── Écran 1 ─────────────────────────────────────────────── */

function EtapeEntreprise({ onDone }: { onDone: () => void | Promise<void> }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [closed, setClosed] = useState(false);

  const trimmed = name.trim();
  const disabled = trimmed.length === 0 || loading || blocked;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    setError(null);
    setLoading(true);
    try {
      const { data, error: invokeError } = await heedupClient.functions.invoke("create-organization", {
        body: { organization_name: trimmed },
      });

      if (invokeError) {
        setError(GENERIC);
        setLoading(false);
        return;
      }

      const payload = (data ?? {}) as { status?: string; message?: string };
      const msg = normalize(payload.message);

      if (payload.status === "success" || msg.includes("vous avez déjà une organisation")) {
        await onDone();
        return;
      }

      if (payload.status === "error" && msg.includes("pas encore ouverte")) {
        setClosed(true);
        setLoading(false);
        return;
      }

      if (msg.includes("administrateur")) {
        setError("Ce compte ne peut pas créer d'espace. Utilisez votre accès administrateur.");
        setBlocked(true);
        setLoading(false);
        return;
      }
      if (msg.includes("obligatoire")) {
        setError("Le nom de votre entreprise est obligatoire.");
        setLoading(false);
        return;
      }
      if (msg.includes("100 caractères")) {
        setError("Le nom ne doit pas dépasser 100 caractères.");
        setLoading(false);
        return;
      }
      if (msg.includes("compte introuvable")) {
        setError(GENERIC);
        await heedupClient.auth.signOut();
        navigate({ to: "/connexion", replace: true });
        return;
      }

      setError(GENERIC);
      setLoading(false);
    } catch {
      setError(GENERIC);
      setLoading(false);
    }
  };

  if (closed) {
    return (
      <AuthShell
        title="L'accès n'est pas encore ouvert"
        subtitle="HeedUp ouvre début septembre 2026. La création d'espace est pour l'instant réservée aux premiers comptes."
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ ...mutedText, fontSize: "14px", margin: "0 0 24px" }}>
            Laissez-nous votre adresse pour être prévenu de l'ouverture.
          </p>
          <a
            href="https://tally.so/r/VLBY9E"
            target="_blank"
            rel="noopener noreferrer"
            className="heedup-auth-primary"
            style={{ ...authButtonStyle, display: "block", textDecoration: "none", textAlign: "center" }}
          >
            Rejoindre la liste d'attente
          </a>
          <a
            href="https://heedup.fr"
            style={{
              display: "inline-block",
              marginTop: "18px",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "var(--indigo)",
              textDecoration: "underline",
            }}
          >
            Retour au site
          </a>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Créons votre espace"
      subtitle="Trois étapes, moins de dix minutes."
      header={<StepBars step={1} />}
      footer={
        <>
          Une question ?{" "}
          <a href="mailto:contact@heedup.fr" style={{ color: "var(--indigo)", textDecoration: "underline" }}>
            contact@heedup.fr
          </a>
        </>
      }
    >
      <form onSubmit={submit}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="organization_name" style={authLabelStyle}>
            Nom de votre entreprise
          </label>
          <input
            id="organization_name"
            type="text"
            maxLength={MAX}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={authInputStyle}
          />
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "6px" }}>
            <span style={mutedText}>Il apparaîtra sur les questionnaires envoyés à votre équipe.</span>
            {name.length >= 80 && (
              <span style={{ ...mutedText, fontSize: "12px", whiteSpace: "nowrap" }}>
                {name.length} / {MAX}
              </span>
            )}
          </div>
        </div>

        {error && (
          <p role="alert" style={{ ...authErrorStyle, marginBottom: "14px" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={disabled} className="heedup-auth-primary" style={primaryStyle(disabled)}>
          {loading ? "Création en cours…" : "Continuer"}
        </button>
      </form>
      <SignOutRow />
    </AuthShell>
  );
}

/* ── Écran 2 ─────────────────────────────────────────────── */

/** Nettoie le domaine saisi : trim, minuscules, retire @, https://, www. et tout chemin. */
function nettoyerDomaine(raw: string): string {
  let d = raw.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/^@/, "");
  d = d.split("/")[0];
  return d;
}

function domaineValide(domaine: string): boolean {
  return domaine.includes(".");
}

/**
 * Résout une ligne en adresse complète.
 * Une valeur contenant déjà un @ est prise telle quelle ; sinon on compose avec le domaine.
 */
function resoudreAdresse(valeur: string, domaine: string): string | null {
  const v = valeur.trim().toLowerCase();
  if (v.length === 0) return null;
  if (v.includes("@")) return v;
  if (domaineValide(domaine)) return `${v}@${domaine}`;
  return v;
}

/** Garantit exactement un champ vide en fin de liste. */
function avecVideFinal(lignes: string[]): string[] {
  const out = [...lignes];
  while (out.length > 1 && out[out.length - 1].trim() === "" && out[out.length - 2].trim() === "") {
    out.pop();
  }
  if (out.length === 0 || out[out.length - 1].trim() !== "") out.push("");
  return out;
}

function EtapeEquipe({
  organizationId,
  onDone,
}: {
  organizationId: string | null;
  onDone: () => void;
}) {
  const [domaine, setDomaine] = useState("");
  const [lignes, setLignes] = useState<string[]>(["", "", ""]);
  const [touched, setTouched] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [doublons, setDoublons] = useState<number | null>(null);
  const [aideOuverte, setAideOuverte] = useState(false);
  const inseres = useRef(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const domaineNet = nettoyerDomaine(domaine);
  const afficherDomaine = domaineNet.length > 0;

  // Résolution de chaque ligne : adresse, validité, doublon interne.
  const lignesResolues = lignes.map((valeur) => {
    const remplie = valeur.trim().length > 0;
    if (!remplie) return { remplie: false, adresse: null as string | null, valide: false, doublon: false, complet: valeur.includes("@") };
    const adresse = resoudreAdresse(valeur, domaineNet);
    return {
      remplie: true,
      adresse,
      valide: adresse !== null && emailValide(adresse),
      doublon: false,
      complet: valeur.includes("@"),
    };
  });
  const vus = new Set<string>();
  for (const l of lignesResolues) {
    if (!l.remplie || !l.valide || !l.adresse) continue;
    if (vus.has(l.adresse)) l.doublon = true;
    else vus.add(l.adresse);
  }

  const valides = lignesResolues.filter((l) => l.remplie && l.valide && !l.doublon && l.adresse).map((l) => l.adresse as string);
  const disabled = saving;

  const updateLignes = (next: string[]) => {
    inseres.current = false;
    setDoublons(null);
    setLignes(avecVideFinal(next));
  };

  const onChangeLigne = (index: number, value: string) => {
    const next = [...lignes];
    next[index] = value;
    updateLignes(next);
  };

  const onKeyDownLigne = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const next = avecVideFinal(lignes);
    if (next.length !== lignes.length) setLignes(next);
    const cible = Math.min(index + 1, next.length - 1);
    requestAnimationFrame(() => inputsRef.current[cible]?.focus());
  };

  const onPasteLigne = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const texte = e.clipboardData.getData("text");
    if (!/[\n,;]/.test(texte)) return;
    e.preventDefault();
    const parts = texte.split(/[\n,;]+/).map((p) => p.trim()).filter((p) => p.length > 0);
    if (parts.length === 0) return;
    const next = [...lignes];
    for (let i = 0; i < parts.length; i++) {
      if (index + i < next.length) next[index + i] = parts[i];
      else next.push(parts[i]);
    }
    updateLignes(next);
  };

  const retirerLigne = (index: number) => {
    const next = lignes.filter((_, i) => i !== index);
    updateLignes(next.length > 0 ? next : [""]);
    setTouched((prev) => {
      const s = new Set<number>();
      prev.forEach((i) => {
        if (i < index) s.add(i);
        else if (i > index) s.add(i - 1);
      });
      return s;
    });
  };

  const onBlurLigne = (index: number) => {
    setTouched((prev) => new Set(prev).add(index));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setError(null);
    setDoublons(null);

    if (inseres.current) {
      onDone();
      return;
    }

    if (valides.length === 0) {
      onDone();
      return;
    }
    if (!organizationId) {
      setError(GENERIC);
      return;
    }

    setSaving(true);
    let dupes = 0;
    let echec = false;
    for (const email of valides) {
      const { error: insertError } = await heedupClient
        .from("employees")
        .insert({ organization_id: organizationId, email, status: "active" });
      if (insertError) {
        if ((insertError as { code?: string }).code === "23505") dupes += 1;
        else echec = true;
      }
    }
    setSaving(false);
    if (echec) {
      setError(GENERIC);
      return;
    }
    if (dupes > 0) {
      // On informe, sans bloquer : un second clic passe à l'étape suivante.
      setDoublons(dupes);
      inseres.current = true;
      return;
    }
    onDone();
  };

  return (
    <AuthShell
      wide
      title="Qui reçoit le questionnaire ?"
      subtitle="Ajoutez les adresses email de vos salariés. Vous pourrez en ajouter ou en retirer à tout moment."
      header={<StepBars step={2} />}
    >
      <form onSubmit={submit}>
        <div>
          <label
            htmlFor="domaine_entreprise"
            style={{
              display: "block",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text-muted)",
              textTransform: "none",
              letterSpacing: "normal",
              marginBottom: "6px",
            }}
          >
            Domaine de votre entreprise (facultatif)
          </label>
          <input
            id="domaine_entreprise"
            type="text"
            placeholder="boulangerie-martin.fr"
            value={domaine}
            onChange={(e) => setDomaine(e.target.value)}
            style={{ ...authInputStyle, height: "40px" }}
          />
          <p style={{ ...mutedText, margin: "6px 0 0" }}>
            Vous n'aurez alors qu'à saisir ce qui précède l'arobase.
          </p>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid color-mix(in srgb, var(--text-muted) 10%, transparent)",
            margin: "24px 0",
          }}
        />

        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: "10px",
          }}
        >
          Adresses de vos salariés
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {lignes.map((valeur, index) => {
            const r = lignesResolues[index];
            const montrerEtat = touched.has(index) && r.remplie;
            const invalide = montrerEtat && !r.valide;
            const estDoublon = montrerEtat && r.valide && r.doublon;
            const montrerSuffixe = afficherDomaine && r.remplie && !r.complet;
            const suffixeLibre = afficherDomaine && !r.remplie;
            return (
              <div key={index}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      ...authInputStyle,
                      height: "44px",
                      padding: "0 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      flex: 1,
                      minWidth: 0,
                      borderColor: invalide
                        ? "color-mix(in srgb, var(--text-muted) 50%, transparent)"
                        : (authInputStyle as { border?: string }).border,
                    }}
                  >
                    <input
                      ref={(el) => {
                        inputsRef.current[index] = el;
                      }}
                      type="text"
                      value={valeur}
                      onChange={(e) => onChangeLigne(index, e.target.value)}
                      onKeyDown={(e) => onKeyDownLigne(index, e)}
                      onPaste={(e) => onPasteLigne(index, e)}
                      onBlur={() => onBlurLigne(index)}
                      placeholder={index === 0 ? "prenom ou prenom@exemple.fr" : ""}
                      aria-label={`Adresse ${index + 1}`}
style={{
                        flex: 1,
                        minWidth: 0,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontFamily: "var(--font-sans)",
                        fontSize: "15px",
                        color: estDoublon ? "var(--text-muted)" : "var(--text-primary)",
                        padding: 0,
                        height: "100%",
                      }}
                    />
                    {(montrerSuffixe || suffixeLibre) && (
                      <span
                        className="heedup-onb-suffix"
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "13px",
                          color: "var(--text-muted)",
                          whiteSpace: "nowrap",
                          userSelect: "none",
                          pointerEvents: "none",
                        }}
                      >
                        @{domaineNet}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => retirerLigne(index)}
                    aria-label={`Retirer l'adresse ${index + 1}`}
                    className="heedup-onb-remove"
                    style={{
                      visibility: valeur.trim().length > 0 ? "visible" : "hidden",
                      border: "none",
                      background: "transparent",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-sans)",
                      fontSize: "18px",
                      lineHeight: 1,
                      cursor: "pointer",
                      padding: "4px 6px",
                      flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
                {invalide && (
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      margin: "4px 0 0",
                    }}
                  >
                    Adresse invalide.
                  </p>
                )}
                {estDoublon && (
                  <p style={{ ...mutedText, margin: "4px 0 0" }}>Déjà saisie.</p>
                )}
              </div>
            );
          })}
        </div>

{valides.length > 0 && (
          <p style={{ ...mutedText, margin: "10px 0 0" }}>
            {valides.length === 1 ? "1 adresse valide" : `${valides.length} adresses valides`}
          </p>
        )}

        <div style={{ marginTop: "10px" }}>
          <button
            type="button"
            onClick={() => setAideOuverte((o) => !o)}
            aria-expanded={aideOuverte}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--indigo)",
            }}
          >
            {aideOuverte ? "▾ " : "▸ "}Comment saisir plus vite
          </button>
          <div
            style={{
              opacity: aideOuverte ? 1 : 0,
              transition: "opacity 0.22s ease",
              maxHeight: aideOuverte ? "240px" : "0",
              overflow: "hidden",
            }}
          >
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ ...mutedText, margin: 0 }}>
                Collez plusieurs adresses d'un coup depuis un tableur, elles se répartissent sur autant de lignes.
              </p>
              <p style={{ ...mutedText, margin: 0 }}>Appuyez sur Entrée pour passer à la ligne suivante.</p>
              <p style={{ ...mutedText, margin: 0 }}>
                Avec un domaine renseigné, saisissez seulement jean plutôt que jean@boite.fr.
              </p>
              <p style={{ ...mutedText, margin: 0 }}>
                Une adresse complète est toujours acceptée, même si elle n'est pas sur votre domaine.
              </p>
            </div>
          </div>
        </div>

        {valides.length < 5 && (
          <div
            style={{
              marginTop: "16px",
              borderLeft: "2px solid color-mix(in srgb, var(--text-muted) 30%, transparent)",
              padding: "2px 0 2px 12px",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              lineHeight: 1.65,
              color: "var(--text-muted)",
            }}
          >
            Un rapport a besoin d'au moins cinq réponses complètes. En dessous de cinq salariés, votre espace
            fonctionnera mais ne produira aucun rapport.
          </div>
        )}

        {doublons !== null && doublons > 0 && (
          <p style={{ ...mutedText, marginTop: "12px" }}>
            {doublons === 1
              ? "1 adresse était déjà dans votre équipe."
              : `${doublons} adresses étaient déjà dans votre équipe.`}
          </p>
        )}

        {error && (
          <p role="alert" style={{ ...authErrorStyle, margin: "14px 0 0" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={disabled}
          className="heedup-auth-primary"
          style={{ ...primaryStyle(disabled), marginTop: "20px" }}
        >
          {saving ? "Enregistrement en cours…" : "Continuer"}
        </button>
      </form>
      <SignOutRow />
    </AuthShell>
  );
}

/* ── Écran 3 ─────────────────────────────────────────────── */

const MESSAGE_DIRECT = `Bonjour à tous,

À partir de vendredi, vous recevrez chaque semaine cinq questions sur votre semaine de travail. Deux minutes, et c'est facultatif.

Vos réponses sont anonymes : le lien entre votre réponse et votre identité est supprimé au moment de l'envoi. Je ne reçois que des moyennes d'équipe, à partir de cinq réponses, et jamais un commentaire individuel.

Vous pouvez vous désinscrire à tout moment depuis l'email.

L'objectif est simple : savoir ce qui coince avant que ça devienne un problème.`;

const MESSAGE_CHALEUREUX = `Bonjour à tous,

J'ai mis en place un outil pour mieux savoir comment vous vivez vos semaines. Chaque vendredi, vous recevrez cinq questions. Deux minutes, et vous n'êtes pas obligés d'y répondre.

Vos réponses sont anonymes : le lien entre votre réponse et votre identité est supprimé au moment de l'envoi. Je ne vois que des moyennes d'équipe, à partir de cinq réponses, et jamais un commentaire individuel.

Vous pouvez vous désinscrire à tout moment depuis l'email.

Dites-moi ce qui va et ce qui ne va pas. C'est le seul moyen que je puisse agir dessus.`;

function EtapePrevenir({
  onRetourEquipe,
  onRetourEntreprise,
  onFin,
}: {
  onRetourEquipe: () => void;
  onRetourEntreprise: () => void;
  onFin: (fin: Fin) => void;
}) {
  const [onglet, setOnglet] = useState<"direct" | "chaleureux">("direct");
  const [copie, setCopie] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [equipeVide, setEquipeVide] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const texte = onglet === "direct" ? MESSAGE_DIRECT : MESSAGE_CHALEUREUX;

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopie(false), 2000);
    } catch {
      setCopie(false);
    }
  };

  const lancer = async () => {
    if (envoi) return;
    setError(null);
    setEquipeVide(false);
    setEnvoi(true);
    try {
      const { data, error: invokeError } = await heedupClient.functions.invoke("send-first-survey");
      const payload = (data ?? {}) as { status?: string; message?: string; emails_envoyes?: number };
      const msg = normalize(payload.message);

      if (!invokeError && payload.status === "ok") {
        onFin({ kind: "lance", envoyes: Number(payload.emails_envoyes ?? 0) });
        return;
      }
      if (msg.includes("aucune organisation n'est rattachée")) {
        onRetourEntreprise();
        return;
      }
      if (msg.includes("déjà été envoyée")) {
        onFin({ kind: "vendredi" });
        return;
      }
      if (msg.includes("n'est pas actif")) {
        setError(typeof payload.message === "string" ? payload.message : GENERIC);
        setEnvoi(false);
        return;
      }
      if (msg.includes("aucun salarié à solliciter")) {
        setError("Aucun salarié ne peut être sollicité pour le moment. Vérifiez la liste de votre équipe.");
        setEquipeVide(true);
        setEnvoi(false);
        return;
      }
      setError(GENERIC);
      setEnvoi(false);
    } catch {
      setError(GENERIC);
      setEnvoi(false);
    }
  };

  const tabStyle = (actif: boolean) => ({
    padding: "8px 16px",
    borderRadius: "8px",
    border: actif ? "1.5px solid var(--indigo)" : "1.5px solid rgba(13,27,62,0.12)",
    background: "transparent",
    color: actif ? "var(--indigo)" : "var(--text-muted)",
    fontFamily: "var(--font-sans)",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  });

  return (
    <AuthShell
      wide
      title="Prévenez votre équipe"
      subtitle="Vos salariés recevront un email d'une marque qu'ils ne connaissent pas. Sans un mot de votre part, beaucoup ne répondront pas, et un rapport a besoin de cinq réponses."
      header={<StepBars step={3} />}
    >
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
        <button type="button" onClick={() => setOnglet("direct")} style={tabStyle(onglet === "direct")}>
          Direct
        </button>
        <button type="button" onClick={() => setOnglet("chaleureux")} style={tabStyle(onglet === "chaleureux")}>
          Chaleureux
        </button>
      </div>

      <div
        style={{
          background: "var(--indigo-pale)",
          borderRadius: "12px",
          padding: "18px 18px",
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          lineHeight: 1.75,
          color: "var(--text-primary)",
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        }}
      >
        {texte}
      </div>

      <button
        type="button"
        onClick={copier}
        className="heedup-auth-primary"
        style={{ ...secondaryButtonStyle, marginTop: "14px" }}
      >
        {copie ? "Message copié" : "Copier le message"}
      </button>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid color-mix(in srgb, var(--text-muted) 12%, transparent)",
          margin: "28px 0 22px",
        }}
      />

      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "22px",
          color: "var(--midnight)",
          margin: "0 0 16px",
        }}
      >
        Quand lancer le premier questionnaire ?
      </h2>

      {error && (
        <p role="alert" style={{ ...authErrorStyle, marginBottom: "14px" }}>
          {error}
        </p>
      )}

      {equipeVide && (
        <button type="button" onClick={onRetourEquipe} style={{ ...secondaryButtonStyle, marginBottom: "16px" }}>
          Revenir à la liste de mon équipe
        </button>
      )}

      <button
        type="button"
        onClick={lancer}
        disabled={envoi}
        className="heedup-auth-primary"
        style={primaryStyle(envoi)}
      >
        {envoi ? "Envoi en cours…" : "Lancer maintenant"}
      </button>
      <p style={{ ...mutedText, margin: "8px 0 0" }}>
        Vos salariés ont 48 heures pour répondre. Votre premier rapport sera disponible dès que cinq réponses
        complètes seront arrivées.
      </p>
      <p style={{ ...mutedText, margin: "6px 0 0" }}>Prenez le temps de prévenir votre équipe avant de lancer.</p>

      <button
        type="button"
        onClick={() => onFin({ kind: "vendredi" })}
        style={{ ...secondaryButtonStyle, marginTop: "20px" }}
      >
        Attendre vendredi
      </button>
      <p style={{ ...mutedText, margin: "8px 0 0" }}>
        Le questionnaire partira vendredi à 9h, comme toutes les semaines suivantes. Votre rapport arrivera le lundi
        matin.
      </p>

      <SignOutRow />
    </AuthShell>
  );
}

/* ── Écran de fin ────────────────────────────────────────── */

function SignOutLink() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        type="button"
        onClick={async () => {
          await heedupClient.auth.signOut();
          navigate({ to: "/connexion", replace: true });
        }}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
          color: "var(--text-muted)",
          textDecoration: "underline",
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
}

function FinLayout({
  titre,
  premier,
  paragraphes,
  onGo,
}: {
  titre: string;
  premier: string;
  paragraphes: string[];
  onGo: () => void;
}) {
  return (
    <AuthShell title="">
      <div style={{ textAlign: "center" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="var(--indigo)" strokeWidth="1.8" />
          <path
            d="M7.5 12.4l3 3 6-6.4"
            stroke="var(--indigo)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            lineHeight: 1.15,
            letterSpacing: "-0.4px",
            color: "var(--midnight)",
            margin: "28px 0 0",
          }}
        >
          {titre}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: 1.6,
            color: "var(--text-primary)",
            margin: "20px 0 0",
          }}
        >
          {premier}
        </p>
        {paragraphes.map((p, i) => (
          <p
            key={i}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "var(--text-muted)",
              margin: "12px 0 0",
            }}
          >
            {p}
          </p>
        ))}
        <div style={{ marginTop: "32px" }}>
          <button type="button" onClick={onGo} className="heedup-auth-primary" style={authButtonStyle}>
            Voir mon espace
          </button>
        </div>
        <SignOutLink />
      </div>
    </AuthShell>
  );
}

function FinScreen({ fin, onGo }: { fin: NonNullable<Fin>; onGo: () => void }) {
  if (fin.kind === "lance") {
    return (
      <FinLayout
        titre="C'est parti."
        premier={
          fin.envoyes > 0
            ? `Le questionnaire est parti à ${fin.envoyes} ${fin.envoyes === 1 ? "salarié" : "salariés"}.`
            : "Le questionnaire est parti."
        }
        paragraphes={[
          "Votre premier rapport sera disponible dès que cinq réponses complètes seront arrivées, sous 48 heures environ. Vous le recevrez aussi par email.",
          "La campagne suivante partira le vendredi de la semaine prochaine, puis chaque vendredi.",
        ]}
        onGo={onGo}
      />
    );
  }

  return (
    <FinLayout
      titre="Votre espace est prêt."
      premier="Le premier questionnaire partira vendredi à 9h."
      paragraphes={["Votre rapport arrivera le lundi matin.", "D'ici là, vous pouvez ajuster la liste de votre équipe."]}
      onGo={onGo}
    />
  );
}
