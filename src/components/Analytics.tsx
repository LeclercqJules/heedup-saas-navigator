import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const PLAUSIBLE_SRC = "https://plausible.io/js/pa-CIDeiK1v6ZROoW7xZv8u9.js";
const CLARITY_ID = "xr0pguqyur";

/** Routes applicatives : aucun analytics ne doit s'y charger. */
const BLOCKED_PREFIXES = [
  "/repondre",
  "/connexion",
  "/reset-password",
  "/dashboard",
  "/admin",
];

function isBlocked(pathname: string) {
  return BLOCKED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

declare global {
  interface Window {
    plausible?: ((...args: unknown[]) => void) & {
      q?: unknown[];
      o?: unknown;
      init?: (i?: unknown) => void;
    };
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

let injected = false;

function injectAnalytics() {
  if (injected) return;
  if (document.getElementById("heedup-plausible")) {
    injected = true;
    return;
  }
  injected = true;

  // Plausible
  const plausible = document.createElement("script");
  plausible.id = "heedup-plausible";
  plausible.src = PLAUSIBLE_SRC;
  plausible.async = true;
  document.head.appendChild(plausible);

  const plausibleInit = document.createElement("script");
  plausibleInit.id = "heedup-plausible-init";
  plausibleInit.text =
    "window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()";
  document.head.appendChild(plausibleInit);

  // Microsoft Clarity
  const clarity = document.createElement("script");
  clarity.id = "heedup-clarity";
  clarity.text = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${CLARITY_ID}");`;
  document.head.appendChild(clarity);
}

export function Analytics() {
  const routerPathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  useEffect(() => {
    const pathname =
      routerPathname ??
      (typeof window !== "undefined" ? window.location.pathname : "/");

    if (isBlocked(pathname)) {
      // Navigation interne : Clarity peut déjà tourner, on coupe l'enregistrement.
      if (typeof window !== "undefined" && typeof window.clarity === "function") {
        window.clarity("stop");
      }
      return;
    }

    injectAnalytics();
    if (typeof window !== "undefined" && typeof window.clarity === "function") {
      window.clarity("start");
    }
  }, [routerPathname]);

  return null;
}
