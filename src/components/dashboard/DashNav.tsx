import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { heedupClient } from "@/config/heedupClient";

const items = [
  { to: "/dashboard", label: "Rapports" },
  { to: "/dashboard/equipe", label: "Équipe" },
] as const;

function truncate(value: string, max = 24) {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

function AccountMenu() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    void heedupClient.auth.getUser().then(({ data }) => {
      if (!cancelled) setEmail(data?.user?.email ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu du compte"
        onClick={() => setOpen((v) => !v)}
        className="heedup-dash-account-btn"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          background: "transparent",
          border: "1px solid transparent",
          borderRadius: "8px",
          padding: "7px 10px",
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          color: "var(--text-muted)",
          cursor: "pointer",
          transition: "border-color 0.2s ease, background 0.2s ease, color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(13,27,62,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "transparent";
        }}
      >
        <span className="heedup-dash-account-label">{email ? truncate(email) : ""}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
          <path
            d="M2.5 4.5 L6 8 L9.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: "190px",
            background: "var(--bg-card)",
            border: "1px solid rgba(13,27,62,0.10)",
            borderRadius: "12px",
            boxShadow: "0 4px 24px rgba(13,27,62,0.10), 0 1px 3px rgba(13,27,62,0.06)",
            padding: "6px",
            zIndex: 60,
          }}
        >
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await heedupClient.auth.signOut();
              navigate({ to: "/connexion", replace: true });
            }}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: "transparent",
              border: "none",
              borderRadius: "8px",
              padding: "10px 12px",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--text-primary)",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--indigo-pale)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Se déconnecter
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function DashNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="heedup-dash-links">
      {items.map((item) => {
        const current =
          item.to === "/dashboard"
            ? pathname === "/dashboard" || pathname.startsWith("/dashboard/rapport")
            : pathname === item.to || pathname.startsWith(`${item.to}/`);
        return (
          <Link
            key={item.to}
            to={item.to}
            style={{
              position: "relative",
              display: "inline-block",
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              fontWeight: current ? 600 : 500,
              color: current ? "var(--text-primary)" : "var(--text-muted)",
              textDecoration: "none",
              paddingBottom: "6px",
              borderBottom: current ? "2px solid var(--indigo)" : "2px solid transparent",
              transition: "color 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!current) e.currentTarget.style.color = "var(--midnight)";
            }}
            onMouseLeave={(e) => {
              if (!current) e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashTopBar({ orgName }: { orgName?: string | null }) {
  const [fallbackName, setFallbackName] = useState<string | null>(null);

  useEffect(() => {
    if (orgName) return;
    let cancelled = false;
    void heedupClient
      .from("organizations")
      .select("name")
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setFallbackName((data as { name?: string } | null)?.name ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [orgName]);

  const name = orgName ?? fallbackName ?? "";

  return (
    <header className="heedup-dash-topbar">
      <div className="heedup-dash-topbar-inner">
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            color: "var(--midnight)",
            justifySelf: "start",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </div>
        <DashNav />
        <div style={{ justifySelf: "end" }}>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
