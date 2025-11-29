import { useRef, useEffect } from "react";
import "./extreme.css";

interface TextTrailProps {
  text?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  char: string;
}

export function TextTrail({ text = "WiseConnect" }: TextTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const stateRef = useRef({ lastEmitTime: 0, rafId: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize, { passive: true });

    const letters = text.split("");
    const particles = particlesRef.current;
    const state = stateRef.current;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - state.lastEmitTime < 16) return;
      state.lastEmitTime = now;

      const x = e.clientX;
      const y = e.clientY;

      for (let i = 0; i < 2; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 2.5 - 1,
          life: 0,
          ttl: 60 + Math.random() * 20,
          char: letters[Math.floor(Math.random() * letters.length)],
        });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.life++;

        const alpha = Math.max(0, 1 - p.life / p.ttl);
        if (alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = alpha;
        ctx.font = `bold ${14 + (p.ttl - p.life) * 0.15}px system-ui`;
        ctx.fillStyle = `rgba(79,114,255,${alpha})`;
        ctx.fillText(p.char, p.x, p.y);
      }

      state.rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(state.rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [text]);

  return <canvas ref={canvasRef} className="texttrail-canvas" />;
}
