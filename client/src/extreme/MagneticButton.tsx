import { useRef, useEffect, ReactNode, HTMLAttributes } from "react";
import gsap from "gsap";
import "./extreme.css";

interface MagneticButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function MagneticButton({ children, className = "", ...props }: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    const strength = 0.35;

    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);

      gsap.to(el, {
        x: relX * strength,
        y: relY * strength,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    const leave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1,0.6)",
      });
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);

    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <button ref={btnRef} className={`magnetic-btn ${className}`} {...props}>
      {children}
    </button>
  );
}
