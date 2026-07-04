import { Link } from "@tanstack/react-router";

const footerLinks = [
  { to: "/fonctionnalites", label: "Fonctionnalités" },
  { to: "/tarifs", label: "Tarifs" },
  { to: "/rgpd", label: "RGPD" },
  { to: "/mentions-legales", label: "Mentions légales" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--midnight)" }}>
      <div className="mx-auto flex flex-col gap-8 px-[5%] py-14 md:flex-row md:items-start md:justify-between">
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.75)",
              fontSize: "24px",
              lineHeight: 1,
            }}
          >
            HeedUp
          </div>
          <p
            style={{
              marginTop: "12px",
              fontFamily: "var(--font-sans)",
              fontSize: "10.5px",
              color: "rgba(255,255,255,0.35)",
              lineHeight: 1.5,
            }}
          >
            Système d'alerte précoce contre le turnover. Fait en France.
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
          {footerLinks.map((l) => (
            <li key={l.to}>
              <a
                href={l.to}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
