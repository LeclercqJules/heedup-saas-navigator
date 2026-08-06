import type { CSSProperties, ReactNode } from "react";

export const authInputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid rgba(13,27,62,0.15)",
  fontFamily: "var(--font-sans)",
  fontSize: "15px",
  color: "var(--text-primary)",
  background: "var(--bg-card)",
  outline: "none",
};

export const authButtonStyle: CSSProperties = {
  width: "100%",
  padding: "13px 24px",
  borderRadius: "8px",
  border: "none",
  background: "var(--indigo)",
  color: "#FFFFFF",
  fontFamily: "var(--font-sans)",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
};

export const authLabelStyle: CSSProperties = {
  display: "block",
  fontFamily: "var(--font-sans)",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  marginBottom: "6px",
};

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-main)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 5%",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "var(--bg-card)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(13,27,62,0.08)",
          padding: "36px 32px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            color: "var(--midnight)",
            marginBottom: "20px",
          }}
        >
          HeedUp
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            letterSpacing: "-0.3px",
            color: "var(--midnight)",
            marginBottom: subtitle ? "8px" : "20px",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: "20px",
            }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

export function AuthLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-main)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans)",
        fontSize: "14px",
        color: "var(--text-muted)",
      }}
    >
      Vérification de votre session...
    </div>
  );
}
