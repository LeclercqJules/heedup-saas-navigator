import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter, Link } from "@tanstack/react-router";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { StickyCTA } from "./StickyCTA";
import { ChatWidget } from "./ChatWidget";

export function SiteLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isHome = router.state.location.pathname === "/";
  const [visible, setVisible] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    let lastTop = 0;
    let initialized = false;
    const tick = () => {
      const el = sentinelRef.current;
      if (el) {
        const top = el.getBoundingClientRect().top;
        if (!initialized) {
          lastTop = top;
          initialized = true;
        }
        const delta = top - lastTop;
        if (top > -10) {
          setVisible(true);
        } else if (delta < -2) {
          setVisible(false);
        } else if (delta > 2) {
          setVisible(true);
        }
        lastTop = top;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

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
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        {isHome && (
          <div
            className="heedup-announcement-bar"
            style={{
              backgroundColor: "#F5F4FE",
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
                color: "var(--indigo)",
              }}
            >
              2 premiers rapports gratuits, sans carte bancaire
            </span>
            <Link
              to="/connexion"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--indigo)",
                textDecoration: "underline",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Commencer maintenant
            </Link>
          </div>
        )}
        <Nav />
      </div>
      <main className="flex-1" style={{ position: "relative", paddingTop: isHome ? "120px" : "84px" }}>
        <div
          ref={sentinelRef}
          style={{
            position: "absolute",
            top: 0,
            height: "1px",
            width: "1px",
            pointerEvents: "none",
          }}
        />
        {children}
      </main>
      <Footer />
      <ScrollToTop />
      <StickyCTA />
      <ChatWidget />
    </div>
  );
}
