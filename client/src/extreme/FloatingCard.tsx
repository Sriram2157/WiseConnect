import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";
import "./extreme.css";

interface FloatingCardProps {
  children: ReactNode;
}

export function FloatingCard({ children }: FloatingCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotX = (y - 0.5) * 10;
      const rotY = (x - 0.5) * -10;

      gsap.to(el, {
        rotationX: rotX,
        rotationY: rotY,
        scale: 1.03,
        duration: 0.6,
        ease: "power3.out",
      });

      const shadow = el.querySelector(".card-shadow") as HTMLElement;
      if (shadow) {
        gsap.to(shadow, {
          x: (x - 0.5) * 20,
          y: (y - 0.5) * 20,
          duration: 0.6,
          ease: "power3.out",
        });
      }
    };

    const onLeave = () => {
      gsap.to(el, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1,0.4)",
      });

      const shadow = el.querySelector(".card-shadow") as HTMLElement;
      if (shadow) {
        gsap.to(shadow, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1,0.4)",
        });
      }
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      className="floating-card"
      ref={ref}
      style={{ transformStyle: "preserve-3d" } as React.CSSProperties}
    >
      <div className="card-shadow" />
      <div className="card-inner">{children}</div>
    </div>
  );
}
