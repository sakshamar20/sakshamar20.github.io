"use client";

import { useEffect, useRef, useState } from "react";

export default function SectionDivider() {
  const ref = useRef<SVGSVGElement | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setDrawn(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8" aria-hidden="true">
      <svg
        ref={ref}
        width="100%"
        height="12"
        viewBox="0 0 1000 12"
        preserveAspectRatio="none"
        className="block text-border overflow-visible"
      >
        <line
          x1="0"
          y1="6"
          x2="1000"
          y2="6"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: drawn ? 0 : 1000,
            transition: "stroke-dashoffset 900ms ease-out",
          }}
        />
        {Array.from({ length: 22 }).map((_, i) => {
          const x = (i * 1000) / 21;
          return (
            <line
              key={i}
              x1={x}
              y1="2"
              x2={x}
              y2="10"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              style={{
                opacity: drawn ? 1 : 0,
                transition: `opacity 250ms ease ${300 + i * 25}ms`,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
