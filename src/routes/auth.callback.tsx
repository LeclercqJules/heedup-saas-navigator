import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import type { EmailOtpType } from "@supabase/supabase-js";
import { heedupClient } from "@/config/heedupClient";
import { AuthLoading, AuthShell, authErrorStyle } from "@/components/auth/AuthShell";
import { resolvePostLoginDestination, GENERIC_ERROR } from "@/lib/postLoginRoute";

type CallbackSearch = {
  code?: string;
  token_hash?: string;
  type?: string;
  error?: string;
  error_description?: string;
};

/** Verrou de module : StrictMode monte deux fois, le jeton est à usage unique. */
let pendingExchange: { key: string; promise: Promise<{ error: unknown }> } | null = null;

function exchangeOnce(key: string, run: () => Promise<{ error: unknown }>) {
  if (pendingExchange?.key === key) return pendingExchange.promise;
  const promise = run();
  pendingExchange = { key, promise };
  return promise;
}

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): CallbackSearch => {
    const out: CallbackSearch = {};
    for (const key of ["code", "token_hash", "type", "error", "error_description"] as const) {
      const value = search[key];
      if (typeof value === "string") out[key] = value;
    }
    return out;
  },
  head: () => ({
    meta: [
      { title: "Connexion en cours · HeedUp" },
      { name: "description", content: "Validation de votre lien de connexion HeedUp." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Connexion en cours · HeedUp" },
      { property: "og:description", content: "Validation de votre lien de connexion HeedUp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CallbackPage,
});

function CallbackPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (search.error) {
        if (!cancelled) setFailed(true);
        return;
      }

      try {
        if (search.code) {
          const code = search.code;
          await exchangeOnce(`code:${code}`, () => heedupClient.auth.exchangeCodeForSession(code));
        } else if (search.token_hash && search.type) {
          const tokenHash = search.token_hash;
          const type = search.type as EmailOtpType;
          await exchangeOnce(`otp:${tokenHash}`, () =>
            heedupClient.auth.verifyOtp({ token_hash: tokenHash, type }),
          );
        } else {
          if (!cancelled) navigate({ to: "/connexion", replace: true });
          return;
        }

        const { data } = await heedupClient.auth.getSession();
        if (cancelled) return;
        if (!data.session) {
          setFailed(true);
          return;
        }

        const dest = await resolvePostLoginDestination();
        if (cancelled) return;
        if (dest.kind === "error") {
          setFailed(true);
          return;
        }
        navigate({ to: dest.to, replace: true });
      } catch {
        const { data } = await heedupClient.auth.getSession();
        if (cancelled) return;
        if (data.session) {
          const dest = await resolvePostLoginDestination();
          if (!cancelled && dest.kind === "redirect") {
            navigate({ to: dest.to, replace: true });
            return;
          }
        }
        setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate, search.code, search.error, search.token_hash, search.type]);

  if (!failed) return <AuthLoading />;

  return (
    <AuthShell title="Lien invalide" subtitle="Ce lien n'a pas permis d'ouvrir votre session.">
      <p role="alert" style={{ ...authErrorStyle, marginBottom: "16px" }}>
        {GENERIC_ERROR}
      </p>
      <Link
        to="/connexion"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          color: "var(--indigo)",
          textDecoration: "underline",
        }}
      >
        Retour à la connexion
      </Link>
    </AuthShell>
  );
}
