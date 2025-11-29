import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useAccessibility } from "@/lib/accessibility-context";

export function ParticlesBackground() {
  const { theme } = useAccessibility();

  const particlesInit = async (engine: any) => {
    await loadFull(engine);
  };

  const particlesOptions: any = {
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: 60,
        density: {
          enable: true,
          area: 1000,
        },
      },
      color: {
        value: theme === "dark" ? "#4F75F0" : "#5B8DEF",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.3,
        animation: {
          enable: true,
          speed: 0.3,
          minimumValue: 0.1,
          sync: false,
        },
      },
      size: {
        value: {
          min: 1,
          max: 3,
        },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.5,
          sync: false,
        },
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "bounce",
        },
      },
      links: {
        enable: true,
        distance: 120,
        color: theme === "dark" ? "#4F75F0" : "#5B8DEF",
        opacity: 0.15,
        width: 1,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        onClick: {
          enable: false,
        },
      },
      modes: {
        grab: {
          distance: 150,
          links: {
            opacity: 0.5,
          },
        },
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particlesOptions}
    />
  );
}
