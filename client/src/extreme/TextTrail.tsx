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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const letters = text.split("");
    const particles = particlesRef.current;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      for (let i = 0; i < Math.min(letters.length, 6); i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2 - 1,
          life: 0,
          ttl: 80 + Math.random() * 30,
          char: letters[Math.floor(Math.random() * letters.length)],
        });
      }
    };

    window.addEventListener("mousemove", onMove);

    let raf: number;
    const render = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life++;

        const alpha = 1 - p.life / p.ttl;
        ctx.globalAlpha = alpha;
        ctx.font = `${16 + (p.ttl - p.life) * 0.1}px system-ui, -apple-system`;
        ctx.fillStyle = `rgba(79,114,255, ${alpha})`;
        ctx.fillText(p.char, p.x, p.y);

        if (p.life > p.ttl) {
          particles.splice(i, 1);
        }
      }

      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [text]);

  return <canvas ref={canvasRef} className="texttrail-canvas" />;
}
