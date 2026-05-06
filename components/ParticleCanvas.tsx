'use client';

import { useEffect, useRef } from 'react';

interface Satellite {
  orbitIndex: number;   // which ring it's on
  angle: number;        // current angle around the orbit
  speed: number;        // radians per ms
  size: number;         // dot radius
  opacity: number;
  targetOpacity: number;
  fadeTimer: number;
  isDebris: boolean;    // debris = dimmer, irregular
}

// Orbital ring definitions — ellipses with different tilt/size
const ORBIT_CONFIGS = [
  { rx: 0.22, ry: 0.055, tilt: -0.15, count: 8,  baseSpeed: 0.00028 },
  { rx: 0.30, ry: 0.075, tilt:  0.10, count: 12, baseSpeed: 0.00022 },
  { rx: 0.38, ry: 0.098, tilt: -0.28, count: 16, baseSpeed: 0.00017 },
  { rx: 0.46, ry: 0.120, tilt:  0.22, count: 20, baseSpeed: 0.00013 },
  { rx: 0.54, ry: 0.142, tilt: -0.08, count: 26, baseSpeed: 0.00010 },
  { rx: 0.62, ry: 0.165, tilt:  0.32, count: 30, baseSpeed: 0.00008 },
  { rx: 0.70, ry: 0.188, tilt: -0.18, count: 34, baseSpeed: 0.00006 },
];

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let satellites: Satellite[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      resize();
      satellites = [];
      ORBIT_CONFIGS.forEach((orbit, orbitIndex) => {
        for (let i = 0; i < orbit.count; i++) {
          const isDebris = orbitIndex > 2 && Math.random() > 0.55;
          satellites.push({
            orbitIndex,
            angle: (i / orbit.count) * Math.PI * 2 + Math.random() * 0.4,
            speed: (orbit.baseSpeed + Math.random() * orbit.baseSpeed * 0.4)
              * (Math.random() > 0.15 ? 1 : -1), // most prograde
            size: isDebris ? 0.8 + Math.random() * 0.8 : 1.2 + Math.random() * 1.0,
            opacity: isDebris ? 0.2 + Math.random() * 0.3 : 0.5 + Math.random() * 0.4,
            targetOpacity: 0,
            fadeTimer: (4 + Math.random() * 10) * 1000,
            isDebris,
          });
        }
      });
      // stagger initial opacities
      satellites.forEach(s => { s.targetOpacity = s.opacity; });
    };

    let lastTime = performance.now();

    const drawEarth = (cx: number, cy: number, r: number) => {
      // Outer atmosphere glow
      const atmGlow = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 2.2);
      atmGlow.addColorStop(0, 'rgba(30,60,140,0.18)');
      atmGlow.addColorStop(0.4, 'rgba(20,40,100,0.07)');
      atmGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = atmGlow;
      ctx.fill();

      // Planet body
      const bodyGrad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.05, cx, cy, r);
      bodyGrad.addColorStop(0, 'rgba(40,80,180,0.9)');
      bodyGrad.addColorStop(0.45, 'rgba(20,50,120,0.85)');
      bodyGrad.addColorStop(0.8, 'rgba(10,20,60,0.9)');
      bodyGrad.addColorStop(1, 'rgba(5,10,30,0.95)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Atmosphere rim
      const rimGrad = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.08);
      rimGrad.addColorStop(0, 'rgba(0,0,0,0)');
      rimGrad.addColorStop(0.5, 'rgba(50,100,255,0.12)');
      rimGrad.addColorStop(1, 'rgba(80,140,255,0.25)');
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.08, 0, Math.PI * 2);
      ctx.fillStyle = rimGrad;
      ctx.fill();

      // Terminator shadow (night side)
      const shadowGrad = ctx.createRadialGradient(cx + r * 0.4, cy, 0, cx + r * 0.4, cy, r * 1.4);
      shadowGrad.addColorStop(0, 'rgba(0,0,0,0)');
      shadowGrad.addColorStop(0.6, 'rgba(0,0,10,0.5)');
      shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = shadowGrad;
      ctx.fill();
    };

    const drawOrbitRing = (cx: number, cy: number, w: number, h: number, rx: number, ry: number, tilt: number, alpha: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx * w, ry * h, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(59,123,255,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    };

    const drawSatellite = (x: number, y: number, size: number, opacity: number, isDebris: boolean) => {
      if (isDebris) {
        // debris: just a dim dot
        ctx.beginPath();
        ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,190,210,${opacity * 0.6})`;
        ctx.fill();
      } else {
        // satellite: bright dot with a subtle cross (solar panels)
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,235,255,${opacity})`;
        ctx.fill();

        // tiny solar panel lines
        const panelLen = size * 2.8;
        ctx.strokeStyle = `rgba(150,185,255,${opacity * 0.6})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(x - panelLen, y);
        ctx.lineTo(x + panelLen, y);
        ctx.stroke();
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(now - lastTime, 50); // cap dt to avoid big jumps
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h * 0.72; // push planet low so it reads as a semi-sphere from below

      // Planet radius — much larger, bleeds off bottom edge
      const planetR = Math.min(w, h) * 0.32;

      // Draw orbit rings first (behind planet)
      ORBIT_CONFIGS.forEach((orbit, i) => {
        const alpha = 0.06 + i * 0.012;
        drawOrbitRing(cx, cy, w, h, orbit.rx, orbit.ry, orbit.tilt, alpha);
      });

      // Draw Earth
      drawEarth(cx, cy, planetR);

      // Update & draw satellites
      satellites.forEach((s) => {
        s.angle += s.speed * dt;
        s.fadeTimer -= dt;

        if (s.fadeTimer <= 0) {
          s.targetOpacity = s.opacity > 0.05
            ? (s.isDebris ? 0 : Math.random() > 0.3 ? s.opacity : 0)
            : (s.isDebris ? 0.2 + Math.random() * 0.3 : 0.5 + Math.random() * 0.4);
          s.fadeTimer = (4 + Math.random() * 10) * 1000;
        }

        s.opacity += (s.targetOpacity - s.opacity) * (dt / 1800);

        const orbit = ORBIT_CONFIGS[s.orbitIndex];
        const rx = orbit.rx * w;
        const ry = orbit.ry * h;
        const tilt = orbit.tilt;

        // Ellipse point with tilt rotation
        const ex = Math.cos(s.angle) * rx;
        const ey = Math.sin(s.angle) * ry;
        const x = cx + ex * Math.cos(tilt) - ey * Math.sin(tilt);
        const y = cy + ex * Math.sin(tilt) + ey * Math.cos(tilt);

        // Depth cue: satellites "behind" the planet are dimmer
        const behindPlanet = ey > 0 && Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) < planetR * 1.1;
        if (behindPlanet) return;

        const depthFade = 0.5 + 0.5 * (1 - ey / (ry + 1));
        const finalOpacity = Math.max(0, s.opacity * depthFade);

        drawSatellite(x, y, s.size, finalOpacity, s.isDebris);
      });

      animFrame = requestAnimationFrame(draw);
    };

    init();
    window.addEventListener('resize', resize);
    animFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}
