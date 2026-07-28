"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, stagger } from "animejs";

type Props = {
  children: ReactNode;
  className?: string;
  /** Animasiya başlamazdan əvvəl gecikmə (ms) */
  delay?: number;
  /** Başlanğıc şaquli sürüşmə (px) */
  y?: number;
  /** true olduqda birbaşa uşaq elementlər növbə ilə (stagger) animasiya olunur */
  staggerChildren?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  staggerChildren = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets: HTMLElement[] = staggerChildren
      ? (Array.from(el.children) as HTMLElement[])
      : [el];
    targets.forEach((n) => {
      n.style.opacity = "0";
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        animate(targets, {
          opacity: [0, 1],
          translateY: [y, 0],
          duration: 650,
          delay: staggerChildren ? stagger(110, { start: delay }) : delay,
          ease: "outCubic",
          onComplete: () => {
            // Tailwind-in hover/rotate transform-ları işləsin deyə inline stilləri təmizlə
            targets.forEach((n) => {
              n.style.opacity = "";
              n.style.transform = "";
            });
          },
        });
      },
      { threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay, y, staggerChildren]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
