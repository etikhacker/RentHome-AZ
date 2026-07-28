"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";

type Props = {
  /** Göstəriləcək son dəyər, məs: "1200+", "100%", "7/24" */
  value: string;
  className?: string;
  duration?: number;
};

/** Dəyərin əvvəlindəki rəqəmi 0-dan başlayaraq sayaraq animasiya edir */
export function AnimatedCounter({ value, className, duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/^(\d+)(.*)$/);
    if (!match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(value);
      return;
    }

    const target = parseInt(match[1], 10);
    const suffix = match[2] ?? "";
    const counter = { n: 0 };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        animate(counter, {
          n: target,
          duration,
          ease: "outExpo",
          onUpdate: () => setText(`${Math.round(counter.n)}${suffix}`),
        });
      },
      { threshold: 0.4 }
    );

    setText(`0${suffix}`);
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
