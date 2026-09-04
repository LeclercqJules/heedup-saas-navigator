import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Copy } from "lucide-react";

const CONTACT_EMAIL = "contact@heedup.fr";

const productLinks = [
  { to: "/fonctionnalites", label: "Fonctionnalités" },
  { to: "/tarifs", label: "Tarifs" },
  { to: "/estimer-cout", label: "Estimateur de coût" },
] as const;

const legalLinks = [
  { to: "/cgu", label: "CGU" },
  { to: "/confidentialite", label: "Confidentialité" },
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

function ContactBlock() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <FooterLink to={`mailto:${CONTACT_EMAIL}`} label="Nous écrire" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "var(--text-muted)",
            userSelect: "text",
          }}
        >
          {CONTACT_EMAIL}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copier l'adresse email"
          className="heedup-footer-copy"
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            color: "var(--text-muted)",
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            lineHeight: 1,
            transition: "opacity 0.2s ease, color 0.2s ease",
          }}
        >
          {copied ? <span>Copié</span> : <Copy size={14} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

function LinkColumn({
  title,
  links,
  children,
}: {
  title: string;
  links: readonly { to: string; label: string }[];
  children?: React.ReactNode;
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
        {children}
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
              fontSize: "28px",
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
        <LinkColumn title="Légal" links={legalLinks}>
          <ContactBlock />
        </LinkColumn>
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
          justifyContent: "flex-start",
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
          © 2026 HeedUp
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
        .heedup-footer-copy:hover,
        .heedup-footer-copy:focus-visible {
          color: var(--midnight) !important;
        }
      `}</style>
    </footer>
  );
}
