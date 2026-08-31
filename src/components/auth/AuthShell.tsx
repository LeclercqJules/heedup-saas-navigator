import type { CSSProperties, ReactNode } from "react";

export const authInputStyle: CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "8px",
  border: "1.5px solid rgba(13,27,62,0.12)",
  fontFamily: "var(--font-sans)",
  fontSize: "15px",
  color: "var(--text-primary)",
  background: "var(--bg-card)",
  outline: "none",
};

export const authButtonStyle: CSSProperties = {
  width: "100%",
  padding: "14px 24px",
  borderRadius: "8px",
  border: "none",
  background: "var(--indigo)",
  color: "#FFFFFF",
  fontFamily: "var(--font-sans)",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
};

export const authErrorStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "14px",
  lineHeight: 1.5,
  color: "var(--text-primary)",
  background: "var(--bg-card)",
  border: "1px solid color-mix(in srgb, var(--text-muted) 25%, transparent)",
  borderRadius: "8px",
  padding: "12px 14px",
};

export const authLabelStyle: CSSProperties = {
  display: "block",
  fontFamily: "var(--font-sans)",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "normal",
  textTransform: "none",
  color: "var(--text-primary)",
  marginBottom: "7px",
};

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "var(--bg-main)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: "clamp(48px, 12vh, 120px)",
  paddingBottom: "48px",
};

const logoStyle: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "22px",
  color: "var(--midnight)",
  opacity: 0.75,
  marginBottom: "24px",
  textAlign: "center",
};

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  wide = false,
  header,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  header?: ReactNode;
}) {
  return (
    <div style={pageStyle} className="heedup-auth-page">
      <div style={logoStyle}>HeedUp</div>
      <div className="heedup-auth-card" style={wide ? { maxWidth: "560px" } : undefined}>
        {header}
        {title ? (
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "30px",
              letterSpacing: "-0.4px",
              lineHeight: 1.15,
              color: "var(--midnight)",
              marginBottom: subtitle ? "8px" : "22px",
            }}
          >
            {title}
          </h1>
        ) : null}
        {subtitle && (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "var(--text-muted)",
              lineHeight: 1.55,
              marginBottom: "22px",
            }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {footer && (
        <div
          className="heedup-auth-footer"
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "var(--text-muted)",
            lineHeight: 1.55,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

export function AuthLoading() {
  const bar = (height: string): CSSProperties => ({
    height,
    borderRadius: "6px",
    background: "rgba(13,27,62,0.06)",
    marginBottom: "12px",
  });
  return (
    <div style={pageStyle} className="heedup-auth-page">
      <div style={logoStyle}>HeedUp</div>
      <div className="heedup-auth-card heedup-auth-skeleton" aria-hidden="true">
        <div style={bar("14px")} />
        <div style={bar("32px")} />
        <div style={{ ...bar("44px"), marginBottom: 0 }} />
      </div>
    </div>
  );
}
