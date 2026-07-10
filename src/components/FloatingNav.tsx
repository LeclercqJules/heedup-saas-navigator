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
  const [isHovered, setIsHovered] = useState(false);

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "fixed",
          right: "0px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
          background: "#0D1B3E",
          borderRadius: "12px 0 0 12px",
          padding: isHovered ? "14px 16px" : "14px 12px",
          boxShadow: "-4px 0 24px rgba(13,27,62,0.15)",
          width: isHovered ? "185px" : "fit-content",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          transition: "all 0.25s ease",
        }}
      >
        {items.map((it) => {
          const isActive = activeSection === it.id;
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              onClick={(e) => handleClick(e, it.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "6px 4px",
                borderRadius: "7px",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  height: "2px",
                  borderRadius: "2px",
                  flexShrink: 0,
                  transition: "all 0.25s ease",
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
                  overflow: "hidden",
                  maxWidth: isHovered ? "160px" : "0px",
                  opacity: isHovered ? 1 : 0,
                  transition: "all 0.25s ease",
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
