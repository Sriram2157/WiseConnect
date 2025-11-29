import { useRef, useEffect } from "react";
import * as THREE from "three";
import dispFrag from "./shaders/displacement.frag?raw";
import dispVert from "./shaders/displacement.vert?raw";
import "./extreme.css";

interface LiquidTransitionProps {
  img1: string;
  img2: string;
  dispImg: string;
}

export function LiquidTransition({ img1, img2, dispImg }: LiquidTransitionProps) {
  const mount = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<any>(null);

  useEffect(() => {
    const container = mount.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const texture1 = loader.load(img1);
    const texture2 = loader.load(img2);
    const disp = loader.load(dispImg);

    const geometry = new THREE.PlaneGeometry(1.8, 1.0, 32, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture1: { value: texture1 },
        uTexture2: { value: texture2 },
        uDisp: { value: disp },
        uMix: { value: 0.0 },
        uDispFactor: { value: 0.15 },
      },
      vertexShader: dispVert,
      fragmentShader: dispFrag,
      transparent: true,
    });

    uniformsRef.current = material.uniforms;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [img1, img2, dispImg]);

  const setMix = (v: number) => {
    if (uniformsRef.current) {
      uniformsRef.current.uMix.value = v;
    }
  };

  return (
    <div
      className="liquid-wrap"
      ref={mount}
      onMouseEnter={() => setMix(1)}
      onMouseLeave={() => setMix(0)}
      role="img"
      aria-label="liquid transition"
    />
  );
}
