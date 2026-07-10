import { useEffect, useState } from "react";

const items = [
  { id: "hero", label: "Accueil" },
  { id: "impact", label: "Impact" },
  { id: "comment-ca-marche", label: "Comment ça marche" },
  { id: "simplicite", label: "Simplicité" },
  { id: "pourquoi", label: "Pourquoi HeedUp" },
  { id: "temoignages", label: "Témoignages" },
  { id: "faq", label: "FAQ" },
  { id: "rejoindre", label: "Rejoindre" },
];

export function FloatingNav() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-84px 0px -40% 0px" }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @media (max-width: 1024px) {
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
          background: "#0D1B3E",
          borderRadius: "16px",
          padding: "14px 16px",
          boxShadow: "0 8px 32px rgba(13,27,62,0.25)",
          minWidth: "180px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {items.map((it) => {
          const isActive = activeSection === it.id;
          const isHovered = hovered === it.id;
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              onClick={(e) => handleClick(e, it.id)}
              onMouseEnter={() => setHovered(it.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "6px 4px",
                borderRadius: "7px",
                cursor: "pointer",
                transition: "background 0.15s",
                textDecoration: "none",
                background: isActive
                  ? "rgba(67,56,202,0.25)"
                  : isHovered
                  ? "rgba(255,255,255,0.06)"
                  : "transparent",
              }}
            >
              <span
                style={{
                  height: "2px",
                  borderRadius: "2px",
                  flexShrink: 0,
                  transition: "all 0.2s",
                  width: isActive ? "20px" : "12px",
                  background: isActive ? "#4338CA" : "rgba(255,255,255,0.2)",
                  boxShadow: isActive ? "0 0 6px rgba(67,56,202,0.7)" : "none",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11.5px",
                  whiteSpace: "nowrap",
                  transition: "color 0.15s",
                  color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                  fontWeight: isActive ? 600 : 500,
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
