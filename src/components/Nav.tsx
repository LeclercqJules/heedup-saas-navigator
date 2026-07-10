import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/fonctionnalites", label: "Fonctionnalités" },
  { to: "/tarifs", label: "Tarifs" },
  { to: "/rgpd", label: "RGPD" },
  { to: "/blog", label: "Blog" },
] as const;

export function Nav() {
  return (
    <header
      className="heedup-nav w-full"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "3px solid var(--midnight)",
        height: "84px",
      }}
    >
      <div className="mx-auto flex h-full items-center justify-between px-[5%]">
        <Link
          to="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            color: "var(--midnight)",
            fontWeight: 400,
          }}
        >
          HeedUp
        </Link>

        <nav className="heedup-nav-links hidden items-center md:flex" style={{ gap: "40px" }}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "16px",
                color: "var(--text-primary)",
                fontWeight: 600,
                opacity: 0.6,
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

        <button
          type="button"
          className="heedup-nav-cta"
          {...{
            "data-tally-open": "obpYab",
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
          Rejoindre la liste d'attente
        </button>

      </div>
    </header>
  );
}
