import { useEffect, useRef } from "react";
import * as THREE from "three";

export function BlobBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Create a much larger, more visible blob
    const geometry = new THREE.SphereGeometry(4, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      color: 0x6b5bff,
      roughness: 0.2,
      metalness: 0.4,
      transparent: true,
      opacity: 0.95,
      emissive: 0x4a3fbf,
      emissiveIntensity: 0.3,
    });

    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    // Add strong, multiple lights for visibility
    const light1 = new THREE.PointLight(0xff00ff, 2);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x00ffff, 2);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xffffff, 1.5);
    light3.position.set(0, 0, 5);
    scene.add(light3);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    let frame = 0;
    let rafId = 0;

    function animate() {
      frame += 0.01;
      blob.rotation.y += 0.002;
      blob.rotation.x += 0.0015;
      blob.position.y = Math.sin(frame * 0.5) * 0.5;
      blob.position.x = Math.cos(frame * 0.3) * 0.3;
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
