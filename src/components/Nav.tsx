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
      className="w-full bg-white"
      style={{ borderBottom: "3px solid #0F1B33", height: "84px" }}
    >
      <div className="mx-auto flex h-full items-center justify-between px-[5%]">
        <Link
          to="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            color: "#0F1B33",
            fontWeight: 400,
          }}
        >
          HeedUp
        </Link>

        <nav className="hidden items-center md:flex" style={{ gap: "40px" }}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "16px",
                color: "#0F1B33",
                fontWeight: 600,
                opacity: 0.6,
              }}
              activeProps={{ style: { opacity: 1 } }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <a
          href="#waitlist"
          style={{
            backgroundColor: "#C9A06A",
            color: "#0F1B33",
            fontWeight: 700,
            fontSize: "16px",
            borderRadius: "8px",
            padding: "14px 32px",
            fontFamily: "var(--font-sans)",
          }}
        >
          Rejoindre la liste d'attente
        </a>
      </div>
    </header>
  );
}
