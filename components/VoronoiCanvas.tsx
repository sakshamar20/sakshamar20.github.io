"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type Vec = { x: number; y: number };

function clipPolygon(poly: Vec[], a: Vec, b: Vec): Vec[] {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const n = { x: b.x - a.x, y: b.y - a.y };
  const inside = (p: Vec) => (p.x - mid.x) * n.x + (p.y - mid.y) * n.y <= 0;
  const intersect = (p: Vec, q: Vec): Vec => {
    const dp = { x: q.x - p.x, y: q.y - p.y };
    const denom = dp.x * n.x + dp.y * n.y;
    const t =
      ((mid.x - p.x) * n.x + (mid.y - p.y) * n.y) / (denom || 1e-12);
    return { x: p.x + t * dp.x, y: p.y + t * dp.y };
  };

  const out: Vec[] = [];
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const prev = poly[(i - 1 + poly.length) % poly.length];
    const curIn = inside(cur);
    const prevIn = inside(prev);
    if (curIn) {
      if (!prevIn) out.push(intersect(prev, cur));
      out.push(cur);
    } else if (prevIn) {
      out.push(intersect(prev, cur));
    }
  }
  return out;
}

const INFLUENCE_RADIUS = 320;
const REPEL_RADIUS = 110;
const MIN_SPEED = 0.2;
const MAX_SPEED = 1.2;

export default function VoronoiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const sizeRef = useRef<{ w: number; h: number; dpr: number }>({
    w: 0,
    h: 0,
    dpr: 1,
  });
  const visibleRef = useRef(true);
  const mouseRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    svx: number;
    svy: number;
    active: boolean;
  }>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    svx: 0,
    svy: 0,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const seedPoints = (w: number, h: number) => {
      const count = 40;
      const pts: Point[] = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 1.1;
        pts.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        });
      }
      pointsRef.current = pts;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h, dpr };
      seedPoints(w, h);
    };

    const draw = () => {
      const { w, h } = sizeRef.current;
      const pts = pointsRef.current;
      ctx.clearRect(0, 0, w, h);

      const bounds: Vec[] = [
        { x: 0, y: 0 },
        { x: w, y: 0 },
        { x: w, y: h },
        { x: 0, y: h },
      ];

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(204, 138, 61, 0.06)";
      ctx.lineJoin = "round";

      for (let i = 0; i < pts.length; i++) {
        let cell = bounds;
        for (let j = 0; j < pts.length; j++) {
          if (i === j) continue;
          cell = clipPolygon(cell, pts[i], pts[j]);
          if (cell.length === 0) break;
        }
        if (cell.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(cell[0].x, cell[0].y);
        for (let k = 1; k < cell.length; k++) {
          ctx.lineTo(cell[k].x, cell[k].y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    };

    const clampSpeed = (p: Point) => {
      const speed = Math.hypot(p.vx, p.vy);
      if (speed < MIN_SPEED) {
        const scale = MIN_SPEED / (speed || 0.001);
        p.vx *= scale;
        p.vy *= scale;
      } else if (speed > MAX_SPEED) {
        p.vx = (p.vx / speed) * MAX_SPEED;
        p.vy = (p.vy / speed) * MAX_SPEED;
      }
    };

    const step = () => {
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      const { w, h } = sizeRef.current;
      const pts = pointsRef.current;
      const m = mouseRef.current;

      m.svx += (m.vx - m.svx) * 0.28;
      m.svy += (m.vy - m.svy) * 0.28;
      m.vx *= 0.82;
      m.vy *= 0.82;

      const R = INFLUENCE_RADIUS;
      const R2 = R * R;
      const cursorSpeed = Math.hypot(m.svx, m.svy);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        p.vx += (Math.random() - 0.5) * 0.09;
        p.vy += (Math.random() - 0.5) * 0.09;

        if (m.active) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 1) {
            const d = Math.sqrt(d2);
            const falloff = (1 - d / R) ** 2;

            if (cursorSpeed > 0.15) {
              const coupling = falloff * 0.38;
              p.vx += m.svx * coupling;
              p.vy += m.svy * coupling;
            }

            if (d < REPEL_RADIUS) {
              const push = ((REPEL_RADIUS - d) / REPEL_RADIUS) * 0.55;
              p.vx -= (dx / d) * push;
              p.vy -= (dy / d) * push;
            }
          }
        }

        p.vx *= 0.988;
        p.vy *= 0.988;
        clampSpeed(p);

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) {
          p.x = 0;
          p.vx = Math.abs(p.vx) * 0.85;
        } else if (p.x > w) {
          p.x = w;
          p.vx = -Math.abs(p.vx) * 0.85;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy = Math.abs(p.vy) * 0.85;
        } else if (p.y > h) {
          p.y = h;
          p.vy = -Math.abs(p.vy) * 0.85;
        }
      }
      draw();
      rafRef.current = requestAnimationFrame(step);
    };

    const onVisibility = () => {
      visibleRef.current = document.visibilityState === "visible";
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        mouseRef.current.active = false;
        return;
      }
      const m = mouseRef.current;
      m.vx = x - m.x;
      m.vy = y - m.y;
      m.x = x;
      m.y = y;
      m.active = true;
    };
    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    resize();
    rafRef.current = requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
    />
  );
}
