import { Link } from "@tanstack/react-router";

const productLinks = [
  { to: "/fonctionnalites", label: "Fonctionnalités" },
  { to: "/tarifs", label: "Tarifs" },
  { to: "/estimer-cout", label: "Estimateur de coût" },
] as const;

const legalLinks = [
  { to: "/cgu", label: "CGU" },
  { to: "/confidentialite", label: "Confidentialité" },
  { to: "mailto:contact@heedup.fr", label: "Contact" },
] as const;

function FooterLink({ to, label }: { to: string; label: string }) {
  const baseStyle = {
    fontFamily: "var(--font-sans)",
    fontSize: "13.5px",
    color: "rgba(255,255,255,0.6)",
    textDecoration: "none",
    fontWeight: 400,
    transition: "color 0.2s ease",
  } as const;

  if (to.startsWith("mailto:")) {
    return (
      <a href={to} style={baseStyle}>
        {label}
      </a>
    );
  }

  return (
    <Link to={to} style={baseStyle}>
      {label}
    </Link>
  );
}

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { to: string; label: string }[];
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.8px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          marginBottom: "14px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {links.map((l) => (
          <FooterLink key={l.to} to={l.to} label={l.label} />
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      className="heedup-footer"
      style={{
        backgroundColor: "var(--midnight)",
        padding: "48px 5% 28px",
      }}
    >
      <div
        className="heedup-footer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr",
          gap: "48px",
          marginBottom: "40px",
          alignItems: "flex-start",
        }}
      >
        <div className="heedup-footer-brand">
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              color: "#FFFFFF",
              fontStyle: "italic",
              marginBottom: "8px",
              lineHeight: 1,
            }}
          >
            HeedUp
          </div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.6,
              maxWidth: "220px",
              margin: 0,
            }}
          >
            Système d'alerte précoce contre le turnover. Fait en France.
          </p>
        </div>

        <LinkColumn title="Produit" links={productLinks} />
        <LinkColumn title="Légal" links={legalLinks} />
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "20px",
        }}
      />

      <div
        className="heedup-footer-bottom"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          © 2025 HeedUp · Jules Leclercq
        </div>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          Fait en France 🇫🇷
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .heedup-footer-grid {
            grid-template-columns: 1fr !important;
          }
          .heedup-footer-brand {
            margin-bottom: 28px;
          }
          .heedup-footer-bottom {
            flex-direction: column !important;
            gap: 8px !important;
            text-align: center !important;
          }
        }
        .heedup-footer a:hover,
        .heedup-footer [href]:hover {
          color: #FFFFFF !important;
        }
      `}</style>
    </footer>
  );
}
