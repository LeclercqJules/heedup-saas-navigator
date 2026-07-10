import { useEffect, useState } from "react";

const items = [
  { anchor: "hero", label: "Accueil" },
  { anchor: "impact", label: "Impact" },
  { anchor: "comment-ca-marche", label: "Comment ça marche" },
  { anchor: "simplicite", label: "Simplicité" },
  { anchor: "pourquoi", label: "Pourquoi HeedUp" },
  { anchor: "temoignages", label: "Témoignages" },
  { anchor: "faq", label: "FAQ" },
  { anchor: "rejoindre", label: "Rejoindre" },
];

export function FloatingNav() {
  const [active, setActive] = useState<string>("hero");
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-84px 0px -40% 0px" }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.anchor);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent, anchor: string) => {
    e.preventDefault();
    const el = document.getElementById(anchor);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @media (max-width: 1023px) {
          .heedup-floating-nav { display: none !important; }
        }
      `}</style>
      <nav
        className="heedup-floating-nav"
        style={{
          position: "fixed",
          right: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          borderRadius: "12px",
          border: "1px solid rgba(67,56,202,0.12)",
          padding: "10px 8px",
          boxShadow: "0 4px 24px rgba(13,27,62,0.08)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity 0.3s",
        }}
      >
        {items.map((it) => {
          const isActive = active === it.anchor;
          const isHovered = hovered === it.anchor && !isActive;
          const dotBg = isActive
            ? "var(--indigo)"
            : isHovered
            ? "rgba(13,27,62,0.4)"
            : "rgba(13,27,62,0.2)";
          const labelColor = isActive ? "var(--indigo)" : "rgba(13,27,62,0.4)";
          const labelMaxWidth = isActive || isHovered ? "140px" : "0px";
          const labelOpacity = isActive ? 1 : isHovered ? 0.7 : 0;
          return (
            <a
              key={it.anchor}
              href={`#${it.anchor}`}
              onClick={(e) => handleClick(e, it.anchor)}
              onMouseEnter={() => setHovered(it.anchor)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.15s",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: dotBg,
                  transform: isActive ? "scale(1.3)" : "scale(1)",
                  transition: "all 0.15s",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11.5px",
                  fontWeight: 500,
                  color: labelColor,
                  maxWidth: labelMaxWidth,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  opacity: labelOpacity,
                  transition: "all 0.2s",
                }}
              >
                {it.label}
              </span>
            </a>
          );
        })}
      </nav>
    </>
  );
}
