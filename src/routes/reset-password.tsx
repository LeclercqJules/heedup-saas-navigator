import { useEffect, useState, type CSSProperties } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { heedupClient } from "@/config/heedupClient";
import {
  AuthShell,
  AuthLoading,
  authButtonStyle,
  authInputStyle,
  authLabelStyle,
  authErrorStyle,
} from "@/components/auth/AuthShell";
import { resolvePostLoginDestination, GENERIC_ERROR } from "@/lib/postLoginRoute";

type ResetSearch = {
  code?: string;
  error?: string;
  error_description?: string;
};

/** Verrou au niveau du module : StrictMode monte deux fois, le code ne doit
 *  être consommé qu'une seule fois. Posé de façon synchrone avant le await. */
let pendingExchange: {
  code: string;
  promise: ReturnType<typeof heedupClient.auth.exchangeCodeForSession>;
} | null = null;

function exchangeCodeOnce(code: string) {
  if (pendingExchange?.code === code) return pendingExchange.promise;
  const promise = heedupClient.auth.exchangeCodeForSession(code);
  pendingExchange = { code, promise };
  return promise;
}

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): ResetSearch => {
    const out: ResetSearch = {};
    if (typeof search["code"] === "string") out.code = search["code"];
    if (typeof search["error"] === "string") out.error = search["error"];
    if (typeof search["error_description"] === "string")
      out.error_description = search["error_description"];
    return out;
  },
  head: () => ({
    meta: [
      { title: "Réinitialiser votre mot de passe · HeedUp" },
      { name: "description", content: "Recevez un lien de réinitialisation pour votre compte HeedUp." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Réinitialiser votre mot de passe · HeedUp" },
      { property: "og:description", content: "Recevez un lien de réinitialisation pour votre compte HeedUp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

const MIN_LENGTH = 10;

const EXPIRED_MESSAGE = "Ce lien a expiré. Les liens sont valables une heure.";
const INVALID_MESSAGE = "Ce lien n'est plus valide.";

type ExchangeState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "wrong-device" }
  | { kind: "failed"; message: string };

function classifyExchangeError(raw: unknown): ExchangeState {
  const message =
    typeof raw === "string"
      ? raw
      : raw && typeof raw === "object" && "message" in raw
        ? String((raw as { message: unknown }).message ?? "")
        : "";
  const lower = message.toLowerCase();
  if (
    lower.includes("code verifier") ||
    lower.includes("invalid flow state") ||
    lower.includes("flow state") ||
    lower.includes("pkce")
  ) {
    return { kind: "wrong-device" };
  }
  if (lower.includes("expired") || lower.includes("already used") || lower.includes("invalid request")) {
    return { kind: "failed", message: EXPIRED_MESSAGE };
  }
  if (lower.includes("invalid") || lower.includes("not found")) {
    return { kind: "failed", message: INVALID_MESSAGE };
  }
  return { kind: "failed", message: GENERIC_ERROR };
}

const helperStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "13px",
  color: "var(--text-muted)",
  lineHeight: 1.5,
  marginTop: "7px",
};

const disabledButtonStyle: CSSProperties = {
  ...authButtonStyle,
  background: "var(--bg-card)",
  border: "1.5px solid color-mix(in srgb, var(--text-muted) 25%, transparent)",
  color: "var(--text-muted)",
  cursor: "not-allowed",
};

function BackToLogin() {
  return (
    <div style={{ marginTop: "18px", textAlign: "center" }}>
      <Link
        to="/connexion"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
          color: "var(--text-muted)",
          textDecoration: "underline",
        }}
      >
        Retour à la connexion
      </Link>
    </div>
  );
}

function ResetPasswordPage() {
  const search = Route.useSearch();
  const hasCode = typeof search.code === "string" && search.code.length > 0;

  const [exchange, setExchange] = useState<ExchangeState>(
    hasCode && !search.error ? { kind: "loading" } : { kind: "idle" },
  );

  useEffect(() => {
    if (!hasCode || search.error) return;
    let cancelled = false;
    void (async () => {
      try {
        const { data, error } = await exchangeCodeOnce(search.code as string);
        if (cancelled) return;
        if (error || !data?.session) {
          // La session peut déjà être établie par le premier montage.
          const { data: existing } = await heedupClient.auth.getSession();
          if (cancelled) return;
          if (existing.session) {
            setExchange({ kind: "ready" });
            return;
          }
          setExchange(classifyExchangeError(error));
          return;
        }
        setExchange({ kind: "ready" });
      } catch (err) {
        if (cancelled) return;
        setExchange(classifyExchangeError(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasCode, search.code, search.error]);

  if (exchange.kind === "loading") return <AuthLoading />;
  if (exchange.kind === "ready") return <DefinitionScreen />;

  if (exchange.kind === "wrong-device") {
    return (
      <RequestScreen
        title="Ce lien doit être ouvert sur le même appareil"
        intro={
          <>
            <p style={{ marginBottom: "10px" }}>
              Pour des raisons de sécurité, le lien ne fonctionne que dans le navigateur depuis
              lequel vous avez fait la demande.
            </p>
            <p>Ouvrez-le depuis cet appareil, ou refaites une demande ci-dessous.</p>
          </>
        }
      />
    );
  }

  if (exchange.kind === "failed") {
    return <RequestScreen notice={exchange.message} />;
  }

  if (search.error) {
    return <RequestScreen notice={INVALID_MESSAGE} />;
  }

  return <RequestScreen />;
}

function RequestScreen({
  notice,
  title,
  intro,
}: {
  notice?: string;
  title?: string;
  intro?: React.ReactNode;
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await heedupClient.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSent(true);
    } catch {
      setError(GENERIC_ERROR);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <AuthShell title="Vérifiez votre boîte mail">
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            color: "var(--text-primary)",
            lineHeight: 1.65,
            marginBottom: "12px",
          }}
        >
          Si un compte existe avec cette adresse, vous recevrez un lien pour définir un nouveau mot
          de passe. Le lien est valable une heure.
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            color: "var(--text-primary)",
            lineHeight: 1.65,
          }}
        >
          Ouvrez-le depuis ce même navigateur : le lien ne fonctionne pas sur un autre appareil.
        </p>
        <BackToLogin />
      </AuthShell>
    );
  }

  const disabled = loading || email.trim().length === 0;

  return (
    <AuthShell
      title={title ?? "Mot de passe oublié"}
      subtitle={
        intro
          ? undefined
          : "Saisissez votre adresse email, nous vous enverrons un lien de réinitialisation."
      }
    >
      {intro && (
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            color: "var(--text-primary)",
            lineHeight: 1.6,
            marginBottom: "22px",
          }}
        >
          {intro}
        </div>
      )}

      {notice && (
        <p role="alert" style={{ ...authErrorStyle, marginBottom: "18px" }}>
          {notice}
        </p>
      )}

      <form onSubmit={submit}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="reset-email" style={authLabelStyle}>
            Email
          </label>
          <input
            id="reset-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={authInputStyle}
          />
        </div>

        {error && (
          <p role="alert" style={{ ...authErrorStyle, marginBottom: "14px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={disabled}
          className="heedup-auth-primary"
          style={disabled ? disabledButtonStyle : authButtonStyle}
        >
          {loading ? "Envoi en cours..." : "Envoyer le lien"}
        </button>
      </form>

      <BackToLogin />
    </AuthShell>
  );
}

function DefinitionScreen() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [lengthError, setLengthError] = useState<string | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canSubmit = password.length >= MIN_LENGTH && password === confirm;
  const disabled = saving || !canSubmit;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    setError(null);

    setSaving(true);
    try {
      const { error: updateError } = await heedupClient.auth.updateUser({ password });
      if (updateError) {
        setError(GENERIC_ERROR);
        setSaving(false);
        return;
      }
      const dest = await resolvePostLoginDestination();
      if (dest.kind === "error") {
        setError(dest.message);
        setSaving(false);
        return;
      }
      toast("Mot de passe mis à jour.");
      navigate({ to: dest.to, replace: true });
    } catch {
      setError(GENERIC_ERROR);
      setSaving(false);
    }
  };

  return (
    <AuthShell title="Choisissez un nouveau mot de passe">
      <form onSubmit={submit}>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="new-password" style={authLabelStyle}>
            Nouveau mot de passe
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() =>
              setLengthError(
                password.length > 0 && password.length < MIN_LENGTH
                  ? `Le mot de passe doit contenir au moins ${MIN_LENGTH} caractères.`
                  : null,
              )
            }
            style={authInputStyle}
          />
          <p style={helperStyle}>10 caractères minimum.</p>
          {lengthError && (
            <p role="alert" style={{ ...authErrorStyle, marginTop: "10px" }}>
              {lengthError}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="confirm-password" style={authLabelStyle}>
            Confirmez le mot de passe
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onBlur={() =>
              setMatchError(
                confirm.length > 0 && confirm !== password
                  ? "Les deux mots de passe ne sont pas identiques."
                  : null,
              )
            }
            style={authInputStyle}
          />
          {matchError && (
            <p role="alert" style={{ ...authErrorStyle, marginTop: "10px" }}>
              {matchError}
            </p>
          )}
        </div>

        {error && (
          <p role="alert" style={{ ...authErrorStyle, marginBottom: "14px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={disabled}
          className="heedup-auth-primary"
          style={disabled ? disabledButtonStyle : authButtonStyle}
        >
          {saving ? "Enregistrement..." : "Enregistrer le mot de passe"}
        </button>
      </form>

      <BackToLogin />
    </AuthShell>
  );
}
