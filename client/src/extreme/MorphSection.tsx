import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as flubber from "flubber";
import "./extreme.css";

gsap.registerPlugin(ScrollTrigger);

export function MorphSection() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;

    const startPath = "M10,80 Q80,10 150,80 T290,80";
    const endPath = "M10,50 Q80,120 150,50 T290,50";

    const interpolator = flubber.interpolate(startPath, endPath, {
      maxSegmentLength: 2,
    });

    ScrollTrigger.create({
      trigger: pathRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const t = self.progress;
        pathRef.current?.setAttribute("d", interpolator(t));
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="morph-section reveal">
      <svg
        viewBox="0 0 300 100"
        preserveAspectRatio="xMidYMid meet"
        className="morph-svg"
      >
        <path
          ref={pathRef}
          d="M10,80 Q80,10 150,80 T290,80"
          fill="none"
          stroke="#4f72ff"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </section>
  );
}
