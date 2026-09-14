import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let animationFrame: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setCount(target);
            observer.unobserve(el);
            return;
          }
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) animationFrame = requestAnimationFrame(tick);
          };
          animationFrame = requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
    };
  }, [target, duration]);

  return { count, ref };
}
