import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard, SignOutButton } from "@/components/auth/AuthGuard";

export const Route = createFileRoute("/admin/conversations")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Conversations · Admin HeedUp" },
      { name: "description", content: "Espace d'administration HeedUp : suivi des conversations." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Conversations · Admin HeedUp" },
      { property: "og:description", content: "Espace d'administration HeedUp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminConversationsPage,
});

function AdminConversationsPage() {
  return (
    <AuthGuard requireAdmin>
      <div style={{ minHeight: "100vh", background: "var(--bg-main)", padding: "40px 5%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", color: "var(--midnight)", letterSpacing: "-0.5px" }}>
            Conversations
          </h1>
          <SignOutButton />
        </div>
      </div>
    </AuthGuard>
  );
}
