import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { SignOutButton } from "@/components/auth/AuthGuard";
import { DashNav } from "@/components/dashboard/DashNav";
import {
  emailValide,
  estActif,
  estInactif,
  nettoyerEmail,
  useEquipeData,
  type Salarie,
} from "@/lib/equipeData";
import { heedupClient } from "@/config/heedupClient";

const cardStyle: CSSProperties = {
  background: "var(--bg-card)",
  borderRadius: "16px",
  boxShadow: "0 4px 24px rgba(13,27,62,0.06), 0 1px 3px rgba(13,27,62,0.04)",
  padding: "26px",
};

const mutedStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "13.5px",
  lineHeight: 1.6,
  color: "var(--text-muted)",
};

const secondaryButton: CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(13,27,62,0.18)",
  color: "var(--midnight)",
  borderRadius: "8px",
  padding: "8px 14px",
  fontFamily: "var(--font-sans)",
  fontSize: "13.5px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "border-color 0.2s ease, background 0.2s ease, opacity 0.2s ease",
};

function Shell({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      <div className="heedup-dash-wrap">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "22px",
            flexWrap: "wrap",
          }}
        >
          <DashNav />
          <SignOutButton />
        </div>
        {children}
      </div>
    </div>
  );
}

function SecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ ...secondaryButton, opacity: disabled ? 0.5 : 1, cursor: disabled ? "default" : "pointer" }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.borderColor = "var(--midnight)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(13,27,62,0.18)";
      }}
    >
      {children}
    </button>
  );
}

export function EquipeSkeleton() {
  return (
    <Shell>
      <div className="heedup-dash-skeleton" style={{ ...cardStyle }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: "18px",
              borderRadius: "6px",
              background: "rgba(13,27,62,0.06)",
              marginBottom: "18px",
              width: i % 2 === 0 ? "70%" : "52%",
            }}
          />
        ))}
      </div>
    </Shell>
  );
}

function ConfirmModal({
  email,
  onCancel,
  onConfirm,
  busy,
}: {
  email: string;
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(13,27,62,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          ...cardStyle,
          maxWidth: "460px",
          width: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            color: "var(--midnight)",
            marginBottom: "12px",
            wordBreak: "break-word",
          }}
        >
          Désactiver {email} ?
        </h2>
        <p style={{ ...mutedStyle, marginBottom: "20px" }}>
          Cette personne ne recevra plus le questionnaire du vendredi. Ses réponses passées restent comptées dans les
          rapports déjà produits. Vous pourrez la réactiver à tout moment.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
          <SecondaryButton onClick={onCancel} disabled={busy}>
            Annuler
          </SecondaryButton>
          <SecondaryButton onClick={onConfirm} disabled={busy}>
            Désactiver
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}

function LigneSalarie({
  salarie,
  onDesactiver,
  onActiver,
  busy,
}: {
  salarie: Salarie;
  onDesactiver: (s: Salarie) => void;
  onActiver: (s: Salarie) => void;
  busy: boolean;
}) {
  const actif = estActif(salarie.status);
  const inactif = estInactif(salarie.status);
  const jamaisActive = !actif && !inactif;

  return (
    <div className="heedup-equipe-row">
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "15px",
          color: "var(--text-primary)",
          wordBreak: "break-word",
        }}
      >
        {salarie.email}
      </div>
      <div className="heedup-equipe-row-end">
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              color: actif ? "var(--text-primary)" : "var(--text-muted)",
            }}
          >
            {actif ? "Reçoit le questionnaire" : "Ne reçoit pas le questionnaire"}
          </div>
          {jamaisActive && (
            <div style={{ ...mutedStyle, fontSize: "12.5px", marginTop: "3px" }}>
              Ce salarié n'a jamais été activé et ne reçoit rien.
            </div>
          )}
        </div>
        <SecondaryButton
          onClick={() => (actif ? onDesactiver(salarie) : onActiver(salarie))}
          disabled={busy}
        >
          {actif ? "Désactiver" : inactif ? "Réactiver" : "Activer"}
        </SecondaryButton>
      </div>
    </div>
  );
}

export function EquipeContent() {
  const { loading, salaries, effectif, organizationId, refresh } = useEquipeData();
  const [email, setEmail] = useState("");
  const [ajoutMessage, setAjoutMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [aDesactiver, setADesactiver] = useState<Salarie | null>(null);
  const [ligneMessage, setLigneMessage] = useState<string | null>(null);

  if (loading) return <EquipeSkeleton />;

  const actifs = effectif?.salaries_actifs ?? null;
  const desinscrits = effectif?.desinscrits ?? 0;
  const sousLeSeuil = effectif?.sous_le_seuil === true;

  const ajouter = async () => {
    const clean = nettoyerEmail(email);
    if (!clean) return;
    if (!emailValide(clean)) {
      setAjoutMessage("Cette adresse email n'est pas valide.");
      return;
    }
    if (!organizationId) {
      setAjoutMessage("Une erreur est survenue. Réessayez dans quelques instants.");
      return;
    }
    setBusy(true);
    setAjoutMessage(null);
    const { error } = await heedupClient.from("employees").insert({
      organization_id: organizationId,
      email: clean,
      status: "active",
    });
    if (error) {
      setAjoutMessage(
        error.code === "23505"
          ? "Cette adresse est déjà dans votre équipe."
          : "Une erreur est survenue. Réessayez dans quelques instants.",
      );
      setBusy(false);
      return;
    }
    setEmail("");
    await refresh();
    setBusy(false);
  };

  const changerStatut = async (salarie: Salarie, status: "active" | "inactive") => {
    setBusy(true);
    setLigneMessage(null);
    const { error } = await heedupClient.from("employees").update({ status }).eq("id", salarie.id);
    if (error) {
      setLigneMessage("Une erreur est survenue. Réessayez dans quelques instants.");
      setBusy(false);
      return;
    }
    await refresh();
    setBusy(false);
  };

  return (
    <Shell>
      <header style={{ marginBottom: "22px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "30px", color: "var(--midnight)" }}>
          Votre équipe
        </h1>
        {actifs !== null && (
          <p style={{ ...mutedStyle, marginTop: "6px" }}>
            {actifs} {actifs > 1 ? "salariés actifs" : "salarié actif"}
          </p>
        )}
        {desinscrits > 0 && (
          <p style={{ ...mutedStyle, marginTop: "4px" }}>
            {desinscrits} {desinscrits > 1 ? "personnes ont" : "personne a"} choisi de ne plus recevoir le
            questionnaire.
          </p>
        )}
      </header>

      {sousLeSeuil && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1.5px solid color-mix(in srgb, var(--text-muted) 30%, transparent)",
            borderRadius: "12px",
            padding: "16px 18px",
            marginBottom: "18px",
            ...mutedStyle,
          }}
        >
          Votre effectif sollicité est passé sous cinq personnes. En dessous de ce seuil, aucun rapport ne peut être
          produit.
        </div>
      )}

      <div style={{ ...cardStyle }}>
        <div className="heedup-equipe-add">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setAjoutMessage(null);
            }}
            placeholder="adresse@exemple.fr"
            style={{
              flex: 1,
              minWidth: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "var(--text-primary)",
              background: "var(--bg-main)",
              border: "1px solid rgba(13,27,62,0.12)",
              borderRadius: "8px",
              padding: "11px 14px",
              outline: "none",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--indigo)";
              e.currentTarget.style.boxShadow = "0 0 0 3px var(--indigo-pale)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(13,27,62,0.12)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <button
            type="button"
            onClick={() => void ajouter()}
            disabled={busy || email.trim().length === 0}
            style={{
              background: email.trim().length === 0 ? "var(--bg-card)" : "var(--indigo)",
              color: email.trim().length === 0 ? "var(--text-muted)" : "#FFFFFF",
              border: email.trim().length === 0 ? "1px solid color-mix(in srgb, var(--text-muted) 25%, transparent)" : "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              fontWeight: 700,
              cursor: email.trim().length === 0 ? "not-allowed" : busy ? "default" : "pointer",
              opacity: busy ? 0.6 : 1,
              transition: "opacity 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
            }}
          >
            Ajouter
          </button>
        </div>
        <div style={{ ...mutedStyle, marginTop: "10px", fontSize: "12.5px" }}>
          Les salariés ajoutés ici ne sont rattachés à aucune équipe.
        </div>
        {ajoutMessage && <div style={{ ...mutedStyle, marginTop: "10px" }}>{ajoutMessage}</div>}
        {ligneMessage && <div style={{ ...mutedStyle, marginTop: "10px" }}>{ligneMessage}</div>}

        {salaries.length === 0 ? (
          <div style={{ marginTop: "26px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--midnight)" }}>
              Ajoutez votre équipe
            </h2>
            <p style={{ ...mutedStyle, marginTop: "10px" }}>
              Ajoutez les adresses email de vos salariés. Ils recevront le questionnaire chaque vendredi matin, et vous
              recevrez votre rapport le lundi.
            </p>
            <p style={{ ...mutedStyle, marginTop: "10px" }}>
              Il faut au moins cinq réponses complètes sur une même semaine pour qu'un rapport soit produit.
            </p>
          </div>
        ) : (
          <div style={{ marginTop: "22px" }}>
            {salaries.map((s) => (
              <LigneSalarie
                key={s.id}
                salarie={s}
                busy={busy}
                onDesactiver={(x) => setADesactiver(x)}
                onActiver={(x) => void changerStatut(x, "active")}
              />
            ))}
          </div>
        )}
      </div>

      {aDesactiver && (
        <ConfirmModal
          email={aDesactiver.email}
          busy={busy}
          onCancel={() => setADesactiver(null)}
          onConfirm={async () => {
            const target = aDesactiver;
            setADesactiver(null);
            await changerStatut(target, "inactive");
          }}
        />
      )}
    </Shell>
  );
}
