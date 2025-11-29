import { useState, useEffect } from "react";

export function useParallax(multiplier = 0.03) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * multiplier);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [multiplier]);

  return offset;
}
