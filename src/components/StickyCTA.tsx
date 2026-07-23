import { useEffect, useState } from "react";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="heedup-sticky-cta"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 150,
        background: "var(--midnight)",
        padding: "12px 20px",
        boxShadow: "0 -4px 20px rgba(13,27,62,0.15)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.2s",
        display: "none",
      }}
    >
      <button
        type="button"
        data-tally-open="VLBY9E"
        data-tally-overlay="1"
        data-tally-emoji-text="👋"
        data-tally-emoji-animation="wave"
        style={{
          width: "100%",
          background: "var(--indigo)",
          color: "#FFFFFF",
          padding: "13px",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: 700,
          border: "none",
          cursor: "pointer",
          fontFamily: "Inter, var(--font-sans)",
        }}
      >
        Rejoindre la liste d'attente →
      </button>
    </div>
  );
}
