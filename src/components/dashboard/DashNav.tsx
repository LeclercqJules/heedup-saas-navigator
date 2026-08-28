import { Link, useRouterState } from "@tanstack/react-router";

const items = [
  { to: "/dashboard", label: "Rapports" },
  { to: "/dashboard/equipe", label: "Équipe" },
] as const;

export function DashNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav style={{ display: "flex", alignItems: "center", gap: "18px" }}>
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
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: current ? 600 : 500,
              color: current ? "var(--text-primary)" : "var(--indigo)",
              textDecoration: "none",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
