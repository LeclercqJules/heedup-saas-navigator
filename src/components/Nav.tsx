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
      style={{ borderBottom: "3px solid #0F1B33", height: "72px" }}
    >
      <div className="mx-auto flex h-full items-center justify-between px-[5%]">
        <Link
          to="/"
          className="font-display italic"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "24px",
            color: "#0F1B33",
          }}
        >
          HeedUp
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                color: "rgba(15, 27, 51, 0.55)",
                fontWeight: 500,
              }}
              activeProps={{ style: { color: "#0F1B33", opacity: 1, fontWeight: 600 } }}
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
            fontSize: "14px",
            borderRadius: "6px",
            padding: "10px 22px",
            fontFamily: "var(--font-sans)",
          }}
        >
          Rejoindre la liste d'attente
        </a>
      </div>
    </header>
  );
}
