import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";


const links = [
  { to: "/", label: "Accueil" },
  { to: "/fonctionnalites", label: "Fonctionnalités" },
  { to: "/tarifs", label: "Tarifs" },
] as const;

export function Nav() {
  const router = useRouter();
  const navLinks = links;
  const [open, setOpen] = useState(false);

  const currentPath = router.state.location.pathname;
  const hideAuthButton = useMemo(
    () =>
      currentPath === "/connexion" ||
      currentPath === "/reset-password" ||
      currentPath === "/dashboard" ||
      currentPath.startsWith("/admin"),
    [currentPath]
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);


  return (
    <header
      className="heedup-nav w-full"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "3px solid var(--midnight)",
        height: "84px",
      }}
    >
      <div className="mx-auto grid h-full items-center px-[5%]" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
        <Link
          to="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            color: "var(--midnight)",
            fontWeight: 400,
            justifySelf: "start",
          }}
        >
          HeedUp
        </Link>

        <nav className="heedup-nav-links hidden items-center md:flex" style={{ gap: "40px", justifySelf: "center" }}>
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "16px",
                color: "var(--midnight)",
                fontWeight: 600,
                opacity: 1,
              }}
              activeProps={{
                style: {
                  color: "var(--midnight)",
                  opacity: 1,
                  fontWeight: 700,
                },
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center md:flex" style={{ gap: "12px", justifySelf: "end" }}>
          {!hideAuthButton && (
            <Link
              to="/connexion"
              style={{
                backgroundColor: "transparent",
                color: "var(--indigo)",
                fontWeight: 700,
                fontSize: "16px",
                borderRadius: "8px",
                padding: "14px 20px",
                fontFamily: "var(--font-sans)",
                border: "1px solid var(--indigo)",
                textDecoration: "none",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--indigo-pale)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Connexion
            </Link>
          )}

          <button
            type="button"
            className="heedup-nav-cta"
            {...{
              "data-tally-open": "VLBY9E",
              "data-tally-overlay": "1",
              "data-tally-emoji-text": "👋",
              "data-tally-emoji-animation": "wave",
              "data-tally-width": "500",
            }}
            style={{
              backgroundColor: "var(--indigo)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "16px",
              borderRadius: "8px",
              padding: "14px 32px",
              fontFamily: "var(--font-sans)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Accéder au lancement
          </button>
        </div>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          className="heedup-nav-burger"
          onClick={() => setOpen(true)}
          style={{
            display: "none",
            flexDirection: "column",
            gap: "5px",
            width: "24px",
            padding: 0,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            gridColumn: "3 / 4",
            justifySelf: "end",
          }}
        >
          <span style={{ display: "block", height: "2px", background: "var(--midnight)", borderRadius: "2px" }} />
          <span style={{ display: "block", height: "2px", background: "var(--midnight)", borderRadius: "2px" }} />
          <span style={{ display: "block", height: "2px", background: "var(--midnight)", borderRadius: "2px" }} />
        </button>

      </div>

      {open && typeof document !== "undefined" && createPortal(
        <>

          <div
            role="presentation"
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1400,
              background: "rgba(13,27,62,0.35)",
            }}
          />
          <div
            className="heedup-nav-drawer"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1500,
              maxHeight: "100dvh",
              overflowY: "auto",
              background: "var(--bg-card)",
              boxShadow: "0 8px 32px rgba(13,27,62,0.12)",
              borderBottom: "1px solid rgba(13,27,62,0.10)",
              padding: "16px 20px 20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px",
                  color: "var(--midnight)",
                }}
              >
                HeedUp
              </span>
              <button
                type="button"
                aria-label="Fermer le menu"
                onClick={() => setOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--midnight)",
                  fontSize: "28px",
                  lineHeight: 1,
                  cursor: "pointer",
                  width: "44px",
                  height: "44px",
                }}
              >
                ×
              </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column" }}>
              {navLinks.map((l) => {
                const isCurrent = currentPath === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "16px",
                      fontWeight: isCurrent ? 600 : 500,
                      color: isCurrent ? "var(--midnight)" : "var(--text-primary)",
                      minHeight: "48px",
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid rgba(13,27,62,0.06)",
                      textDecoration: "none",
                    }}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
              {!hideAuthButton && (
                <Link
                  to="/connexion"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "48px",
                    backgroundColor: "transparent",
                    border: "1.5px solid var(--midnight)",
                    color: "var(--midnight)",
                    fontWeight: 700,
                    fontSize: "16px",
                    borderRadius: "8px",
                    fontFamily: "var(--font-sans)",
                    textDecoration: "none",
                  }}
                >
                  Connexion
                </Link>
              )}

              <button
                type="button"
                {...{
                  "data-tally-open": "VLBY9E",
                  "data-tally-overlay": "1",
                  "data-tally-emoji-text": "👋",
                  "data-tally-emoji-animation": "wave",
                  "data-tally-width": "500",
                }}
                onClick={() => setOpen(false)}
                style={{
                  width: "100%",
                  minHeight: "48px",
                  backgroundColor: "var(--indigo)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "16px",
                  borderRadius: "8px",
                  padding: "0 24px",
                  fontFamily: "var(--font-sans)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Accéder au lancement
              </button>
            </div>
          </div>
        </>,
        document.body
      )}


    </header>
  );
}
