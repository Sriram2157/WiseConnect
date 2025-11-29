import { useRef, useEffect, ReactNode } from "react";
import "./extreme.css";

interface FloatingCardProps {
  children: ReactNode;
}

export function FloatingCard({ children }: FloatingCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ rotX: 0, rotY: 0, scale: 1, shadowX: 0, shadowY: 0, rafId: 0, targetRotX: 0, targetRotY: 0, targetScale: 1, targetShadowX: 0, targetShadowY: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const state = stateRef.current;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      state.targetRotX = (y - 0.5) * 10;
      state.targetRotY = (x - 0.5) * -10;
      state.targetScale = 1.03;
      state.targetShadowX = (x - 0.5) * 20;
      state.targetShadowY = (y - 0.5) * 20;
    };

    const onLeave = () => {
      state.targetRotX = 0;
      state.targetRotY = 0;
      state.targetScale = 1;
      state.targetShadowX = 0;
      state.targetShadowY = 0;
    };

    const updateTransforms = () => {
      state.rotX += (state.targetRotX - state.rotX) * 0.15;
      state.rotY += (state.targetRotY - state.rotY) * 0.15;
      state.scale += (state.targetScale - state.scale) * 0.15;
      state.shadowX += (state.targetShadowX - state.shadowX) * 0.15;
      state.shadowY += (state.targetShadowY - state.shadowY) * 0.15;

      el.style.transform = `perspective(1000px) rotateX(${state.rotX}deg) rotateY(${state.rotY}deg) scale3d(${state.scale}, ${state.scale}, 1)`;

      const shadow = el.querySelector(".card-shadow") as HTMLElement;
      if (shadow) {
        shadow.style.transform = `translate3d(${state.shadowX}px, ${state.shadowY}px, 0)`;
      }

      state.rafId = requestAnimationFrame(updateTransforms);
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });
    updateTransforms();

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(state.rafId);
    };
  }, []);

  return (
    <div
      className="floating-card will-change-transform"
      ref={ref}
      style={{ transformStyle: "preserve-3d" } as React.CSSProperties}
    >
      <div className="card-shadow will-change-transform" />
      <div className="card-inner">{children}</div>
    </div>
  );
}
