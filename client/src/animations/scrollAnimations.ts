import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // Staggered fade-in for cards
  gsap.utils.toArray<HTMLElement>(".animation-card").forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        markers: false,
        once: true,
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  });

  // Text reveals on scroll
  gsap.utils.toArray<HTMLElement>(".scroll-reveal").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        markers: false,
        once: true,
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  });

  // Parallax effect for images
  gsap.utils.toArray<HTMLElement>(".parallax-image").forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        scrub: true,
        markers: false,
      },
      y: (i: number) => Math.random() * 100 - 50,
      duration: 1,
    });
  });

  // Scale on scroll for featured cards
  gsap.utils.toArray<HTMLElement>(".scale-on-scroll").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        once: true,
      },
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
    });
  });
}

export function initHeroAnimations() {
  const tl = gsap.timeline();

  const title = document.querySelector(".hero-title");
  const subtitle = document.querySelector(".hero-subtitle");

  if (title) {
    tl.from(title, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
    });
  }

  if (subtitle) {
    tl.from(
      subtitle,
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.6"
    );
  }

  return tl;
}
