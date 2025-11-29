import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.left = mouseX + "px";
        cursorRef.current.style.top = mouseY + "px";
      }
    };

    const updateDot = () => {
      dotX += (mouseX - dotX) * 0.15;
      dotY += (mouseY - dotY) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.left = dotX + "px";
        dotRef.current.style.top = dotY + "px";
      }

      requestAnimationFrame(updateDot);
    };

    window.addEventListener("mousemove", handleMouseMove);
    updateDot();

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-6 h-6 border-2 border-blue-500 rounded-full"></div>
      </div>
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9998] transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      </div>
    </>
  );
}
