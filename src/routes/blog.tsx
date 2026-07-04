import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — HeedUp" },
      {
        name: "description",
        content: "Le blog HeedUp — bientôt disponible.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <section
        className="mx-auto px-[5%] py-28 text-center"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        <h1
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            lineHeight: 1.1,
            color: "var(--midnight)",
          }}
        >
          Blog
        </h1>
        <p
          className="mt-6"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            lineHeight: 1.6,
            color: "var(--text-muted)",
          }}
        >
          Bientôt : nos articles sur la détection du désengagement, les
          pratiques RH, et les coulisses de HeedUp.
        </p>
      </section>
    </SiteLayout>
  );
}
