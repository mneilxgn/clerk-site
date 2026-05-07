'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface EarthGlobeProps {
  size?: number;
  speed?: number;
  className?: string;
}

export default function EarthGlobe({ size = 520, speed = 0.0008 }: EarthGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 2.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Earth sphere
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    const loader = new THREE.TextureLoader();

    // Load Earth texture (local, public domain NASA Blue Marble)
    const earthTexture = loader.load(
      '/earth-texture.jpg',
      undefined,
      undefined,
      // Fallback if CDN fails
      () => {
        const canvas = document.createElement('canvas');
        canvas.width = 2;
        canvas.height = 1;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#1a3a6a';
        ctx.fillRect(0, 0, 2, 1);
        material.map = new THREE.CanvasTexture(canvas);
        material.needsUpdate = true;
      }
    );

    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      specular: new THREE.Color(0x333333),
      shininess: 15,
    });

    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Atmosphere glow (additive layer)
    const atmosGeo = new THREE.SphereGeometry(1.02, 64, 64);
    const atmosMat = new THREE.MeshPhongMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.06,
      side: THREE.FrontSide,
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosphere);

    // Outer glow ring
    const glowGeo = new THREE.SphereGeometry(1.08, 64, 64);
    const glowMat = new THREE.MeshPhongMaterial({
      color: 0x2255cc,
      transparent: true,
      opacity: 0.03,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // Lighting — sun from upper-left
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(-3, 2, 4);
    scene.add(sunLight);

    // Soft ambient fill
    const ambientLight = new THREE.AmbientLight(0x111133, 0.5);
    scene.add(ambientLight);

    // Stars (subtle background)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 80;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Slight tilt like real Earth (23.5°)
    earth.rotation.z = THREE.MathUtils.degToRad(23.5);
    atmosphere.rotation.z = THREE.MathUtils.degToRad(23.5);

    // Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      earth.rotation.y += speed;
      atmosphere.rotation.y += speed;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      earthTexture.dispose();
    };
  }, [size, speed]);

  return (
    <div
      ref={mountRef}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        // Outer atmospheric halo via CSS
        filter: 'drop-shadow(0 0 40px rgba(50, 120, 255, 0.25))',
      }}
    />
  );
}
