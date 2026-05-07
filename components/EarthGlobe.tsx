'use client';

import { useEffect, useRef, useState } from 'react';

interface EarthGlobeProps {
  size?: number;
  speed?: number;
}

export default function EarthGlobe({ size = 520, speed = 0.0006 }: EarthGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Check WebGL support before loading Three.js
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setFailed(true);
      return;
    }

    let animId: number;
    let renderer: import('three').WebGLRenderer | null = null;

    const init = async () => {
      try {
        const THREE = await import('three');

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.z = 2.2;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(size, size);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        // Earth sphere
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        const loader = new THREE.TextureLoader();

        const earthTexture = loader.load('/earth-texture.jpg');

        const material = new THREE.MeshPhongMaterial({
          map: earthTexture,
          specular: new THREE.Color(0x333333),
          shininess: 15,
        });

        const earth = new THREE.Mesh(geometry, material);
        earth.rotation.z = THREE.MathUtils.degToRad(23.5);
        scene.add(earth);

        // Atmosphere
        const atmosGeo = new THREE.SphereGeometry(1.02, 64, 64);
        const atmosMat = new THREE.MeshPhongMaterial({
          color: 0x4488ff,
          transparent: true,
          opacity: 0.06,
        });
        const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
        atmosphere.rotation.z = THREE.MathUtils.degToRad(23.5);
        scene.add(atmosphere);

        // Stars
        const starGeo = new THREE.BufferGeometry();
        const starCount = 1500;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i++) positions[i] = (Math.random() - 0.5) * 80;
        starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.07, transparent: true, opacity: 0.5 });
        scene.add(new THREE.Points(starGeo, starMat));

        // Lighting
        const sun = new THREE.DirectionalLight(0xffffff, 1.4);
        sun.position.set(-3, 2, 4);
        scene.add(sun);
        scene.add(new THREE.AmbientLight(0x111133, 0.5));

        const animate = () => {
          animId = requestAnimationFrame(animate);
          earth.rotation.y += speed;
          atmosphere.rotation.y += speed;
          renderer!.render(scene, camera);
        };
        animate();

      } catch (e) {
        console.error('EarthGlobe failed:', e);
        setFailed(true);
      }
    };

    init();

    return () => {
      cancelAnimationFrame(animId);
      if (renderer && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [size, speed]);

  if (failed) return null;

  return (
    <div
      ref={mountRef}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        filter: 'drop-shadow(0 0 40px rgba(50, 120, 255, 0.25))',
      }}
    />
  );
}
