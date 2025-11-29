import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";

export function HeroBlob() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useMousePosition();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
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
    containerRef.current.appendChild(renderer.domElement);

    // Create blob geometry with more subdivisions
    const geometry = new THREE.IcosahedronGeometry(1, 6);

    // Create custom material with shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      },
      vertexShader: `
        uniform float u_time;
        uniform vec2 u_mouse;

        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;

          vec3 pos = position;
          pos += sin(pos.x * 3.0 + u_time) * 0.1;
          pos += sin(pos.y * 3.0 + u_time * 0.7) * 0.1;
          pos += sin(pos.z * 3.0 + u_time * 0.5) * 0.1;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_mouse;

        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(-vPosition);

          float fresnel = pow(1.0 - dot(normal, viewDir), 2.0);

          vec3 baseColor = mix(
            vec3(0.3, 0.5, 1.0),
            vec3(0.5, 0.7, 1.0),
            fresnel
          );

          float pulse = sin(u_time * 0.5) * 0.5 + 0.5;
          vec3 finalColor = baseColor * (0.8 + pulse * 0.2);

          gl_FragColor = vec4(finalColor, 0.9);
        }
      `,
    });

    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    // Add lighting
    const light1 = new THREE.PointLight(0x4f72ff, 1.5);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xff72f0, 0.8);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      blob.rotation.x += 0.002;
      blob.rotation.y += 0.003;

      // Mouse parallax
      const targetX = (mousePos.x / window.innerWidth - 0.5) * 0.3;
      const targetY = (mousePos.y / window.innerHeight - 0.5) * 0.3;

      blob.position.x += (targetX - blob.position.x) * 0.05;
      blob.position.y -= (targetY - blob.position.y) * 0.05;

      // Update shader uniform
      if (material instanceof THREE.ShaderMaterial) {
        material.uniforms.u_time.value += 0.016;
        material.uniforms.u_mouse.value.set(
          mousePos.x / window.innerWidth,
          mousePos.y / window.innerHeight
        );
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
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
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [mousePos]);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
}
