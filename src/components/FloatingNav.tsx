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
    const sectionIds = [
      'hero',
      'impact',
      'comment-ca-marche',
      'simplicite',
      'pourquoi',
      'temoignages',
      'faq',
      'rejoindre'
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const viewportCenter = scrollY + windowHeight * 0.4;

      function getPageTop(el: HTMLElement): number {
        let top = 0;
        let element: HTMLElement | null = el;
        while (element) {
          top += element.offsetTop;
          element = element.offsetParent as HTMLElement | null;
        }
        return top;
      }

      let activeId = sectionIds[0];
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (!el) continue;

        const top = getPageTop(el);
        if (viewportCenter >= top) {
          activeId = sectionIds[i];
          break;
        }
      }

      setActiveSection(activeId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
