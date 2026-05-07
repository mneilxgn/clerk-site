'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface EarthGlobeProps {
  size?: number;
  speed?: number;
}

export default function EarthGlobe({ size = 520, speed = 0.0006 }: EarthGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // WebGL support check
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) { setWebglFailed(true); return; }
    } catch {
      setWebglFailed(true);
      return;
    }

    let animId: number;
    let renderer: THREE.WebGLRenderer;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.z = 2.2;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      // Earth
      const geo = new THREE.SphereGeometry(1, 64, 64);
      const texture = new THREE.TextureLoader().load('/earth-texture.jpg');
      const mat = new THREE.MeshPhongMaterial({ map: texture, specular: new THREE.Color(0x333333), shininess: 15 });
      const earth = new THREE.Mesh(geo, mat);
      earth.rotation.z = THREE.MathUtils.degToRad(23.5);
      scene.add(earth);

      // Atmosphere haze
      const atmosMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.025, 64, 64),
        new THREE.MeshPhongMaterial({ color: 0x4488ff, transparent: true, opacity: 0.07 })
      );
      atmosMesh.rotation.z = THREE.MathUtils.degToRad(23.5);
      scene.add(atmosMesh);

      // Stars
      const starPos = new Float32Array(1800 * 3);
      for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 80;
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.07, transparent: true, opacity: 0.55 })));

      // Lighting
      const sun = new THREE.DirectionalLight(0xffffff, 1.4);
      sun.position.set(-3, 2, 4);
      scene.add(sun);
      scene.add(new THREE.AmbientLight(0x111133, 0.5));

      const animate = () => {
        animId = requestAnimationFrame(animate);
        earth.rotation.y += speed;
        atmosMesh.rotation.y += speed;
        renderer.render(scene, camera);
      };
      animate();

    } catch (e) {
      console.warn('WebGL init failed:', e);
      setWebglFailed(true);
      return;
    }

    return () => {
      cancelAnimationFrame(animId);
      try {
        if (renderer && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
          renderer.dispose();
        }
      } catch { /* cleanup */ }
    };
  }, [size, speed]);

  // CSS fallback — spinning globe via background-position animation
  if (webglFailed) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', overflow: 'hidden',
        position: 'relative', boxShadow: '0 0 60px rgba(40,100,255,0.2)',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '-100%',
          width: '300%', height: '100%',
          backgroundImage: 'url(/earth-texture.jpg)',
          backgroundSize: '33.33% 100%',
          backgroundRepeat: 'repeat-x',
          animation: 'spinEarth 24s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.04) 0%, transparent 45%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.88) 100%)',
        }} />
        <style>{`@keyframes spinEarth { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }`}</style>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      style={{
        width: size, height: size,
        borderRadius: '50%', overflow: 'hidden',
        position: 'relative',
        filter: 'drop-shadow(0 0 50px rgba(40, 110, 255, 0.28))',
      }}
    />
  );
}
