import { useRef, useEffect, ReactNode, HTMLAttributes } from "react";
import "./extreme.css";

interface MagneticButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function MagneticButton({ children, className = "", ...props }: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const stateRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, rafId: 0 });

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    const state = stateRef.current;
    const strength = 0.35;

    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      state.targetX = (e.clientX - (rect.left + rect.width / 2)) * strength;
      state.targetY = (e.clientY - (rect.top + rect.height / 2)) * strength;
    };

    const leave = () => {
      state.targetX = 0;
      state.targetY = 0;
    };

    const updatePosition = () => {
      state.x += (state.targetX - state.x) * 0.2;
      state.y += (state.targetY - state.y) * 0.2;

      el.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;

      if (Math.abs(state.targetX - state.x) > 0.5 || Math.abs(state.targetY - state.y) > 0.5) {
        state.rafId = requestAnimationFrame(updatePosition);
      }
    };

    el.addEventListener("mousemove", move, { passive: true });
    el.addEventListener("mouseleave", leave, { passive: true });

    const startRAF = () => {
      state.rafId = requestAnimationFrame(updatePosition);
    };

    el.addEventListener("mouseenter", startRAF);

    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("mouseenter", startRAF);
      cancelAnimationFrame(state.rafId);
    };
  }, []);

  return (
    <button ref={btnRef} className={`magnetic-btn will-change-transform ${className}`} {...props}>
      {children}
    </button>
  );
}
