import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ mouseX: 0, mouseY: 0, dotX: 0, dotY: 0, rafId: 0 });

  useEffect(() => {
    const state = stateRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${state.mouseX}px, ${state.mouseY}px, 0)`;
      }
    };

    const updateDot = () => {
      state.dotX += (state.mouseX - state.dotX) * 0.2;
      state.dotY += (state.mouseY - state.dotY) * 0.2;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${state.dotX}px, ${state.dotY}px, 0)`;
      }

      state.rafId = requestAnimationFrame(updateDot);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    updateDot();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(state.rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <div className="w-6 h-6 border-2 border-blue-500 rounded-full"></div>
      </div>
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      </div>
    </>
  );
}
