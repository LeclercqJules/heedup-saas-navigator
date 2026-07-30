import { useEffect, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { StickyCTA } from "./StickyCTA";

export function SiteLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "-40px 0px" }
    );

    const scan = () => {
      document.querySelectorAll(".fade-up:not(.visible)").forEach((el) => {
        observer.observe(el);
      });
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col page-transition" style={{ backgroundColor: "var(--bg-main)" }}>
      <div
        className="heedup-announcement-bar"
        style={{
          backgroundColor: "var(--midnight)",
          padding: "10px 5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Lancement officiel prévu septembre 2026
        </span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          ·
        </span>
        <button
          type="button"
          {...{
            "data-tally-open": "VLBY9E",
            "data-tally-overlay": "1",
            "data-tally-emoji-text": "👋",
            "data-tally-emoji-animation": "wave",
            "data-tally-width": "500",
          }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            fontWeight: 700,
            color: "#FFFFFF",
            textDecoration: "none",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Accès bêta en avant-première →
        </button>
      </div>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
      <StickyCTA />
    </div>
  );
}
