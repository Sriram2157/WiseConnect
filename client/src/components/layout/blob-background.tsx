import { useEffect, useRef } from "react";
import * as THREE from "three";

export function BlobBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1.2, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4f75f0,
      roughness: 0.3,
      metalness: 0.6,
      transparent: true,
      opacity: 0.8,
    });

    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    scene.add(light);

    let frame = 0;
    let rafId = 0;

    function animate() {
      frame += 0.01;
      blob.rotation.y += 0.003;
      blob.rotation.x += 0.002;
      blob.position.y = Math.sin(frame) * 0.2;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }
    animate();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
