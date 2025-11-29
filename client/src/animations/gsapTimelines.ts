import gsap from "gsap";

export function initHeroAnimation() {
  const tl = gsap.timeline();

  // Split text reveal
  const heroTitle = document.querySelector(".hero-title");
  const heroSubtitle = document.querySelector(".hero-subtitle");
  const heroButton = document.querySelector(".hero-button");

  if (heroTitle) {
    tl.from(heroTitle, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
    });
  }

  if (heroSubtitle) {
    tl.from(
      heroSubtitle,
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.6"
    );
  }

  if (heroButton) {
    tl.from(
      heroButton,
      {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: "back.out",
      },
      "-=0.6"
    );
  }

  return tl;
}

export function initCardAnimations() {
  const cards = document.querySelectorAll(".animation-card");

  gsap.from(cards, {
    opacity: 0,
    y: 50,
    stagger: 0.15,
    duration: 0.8,
    ease: "power3.out",
  });
}
