import { useEffect, useRef } from "react";
import * as THREE from "three";

export function BlobBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a2e);

      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 2;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Create visible blob with BRIGHT CYAN color
      const geometry = new THREE.IcosahedronGeometry(1.2, 8);
      const material = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        shininess: 60,
        wireframe: false,
      });

      const blob = new THREE.Mesh(geometry, material);
      scene.add(blob);

      // Strong key light
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
      keyLight.position.set(5, 5, 5);
      scene.add(keyLight);

      // Fill light from opposite side
      const fillLight = new THREE.DirectionalLight(0xff00ff, 0.8);
      fillLight.position.set(-5, -5, 2);
      scene.add(fillLight);

      // Rim light
      const rimLight = new THREE.DirectionalLight(0x00ffff, 0.6);
      rimLight.position.set(0, 0, 5);
      scene.add(rimLight);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      let frameCount = 0;
      let rafId = 0;

      const animate = () => {
        frameCount++;
        blob.rotation.x += 0.004;
        blob.rotation.y += 0.006;
        blob.position.y = Math.sin(frameCount * 0.008) * 0.3;

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      };

      animate();

      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(rafId);
        try {
          container.removeChild(renderer.domElement);
        } catch (e) {
          // Already removed
        }
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    } catch (error) {
      console.error("Blob Background Error:", error);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
