import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    function resizeCanvas() {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
      }
    }

    function initParticles() {
      particles.length = 0;
      if (canvas) {
        const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000));
        
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.5 + 0.3,
          });
        }
      }
    }

    function animate() {
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const style = getComputedStyle(document.documentElement);
        const primaryColor = style.getPropertyValue("--primary").trim();
        
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${primaryColor}, ${p.opacity})`;
          ctx.fill();

          p.x += p.speedX;
          p.y += p.speedY;
          p.opacity += (Math.random() - 0.5) * 0.02;
          p.opacity = Math.max(0.1, Math.min(0.6, p.opacity));

          if (p.x < 0 || p.x > canvas.width) p.speedX = -p.speedX;
          if (p.y < 0 || p.y > canvas.height) p.speedY = -p.speedY;
        });
      }

      animationId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 dark:opacity-10 z-0"
    />
  );
}
