'use client';

import { useEffect, useRef, useState } from 'react';

type Mode = 'gas' | 'magnetic' | 'laser';

/* ─── seeded pseudo-random (stable across renders) ─────────────────────────── */
function sr(n: number): number {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/* ─── perspective tilt – orbit ellipse squish factor ───────────────────────── */
const TILT = 0.30;

/* ─── pre-generate stars ────────────────────────────────────────────────────── */
const STARS = Array.from({ length: 220 }, (_, i) => ({
  xf: sr(i * 1.13),
  yf: sr(i * 2.47),
  r: 0.35 + sr(i * 3.81) * 1.5,
  a: 0.15 + sr(i * 5.23) * 0.55,
  twinkle: sr(i * 7.11) * Math.PI * 2,
}));

/* ─── orbit ring configs ────────────────────────────────────────────────────── */
const RINGS = [
  { rf: 1.38, n: 26, col: '#D45050', label: '500 KM' }, // gas drag band
  { rf: 1.52, n: 20, col: '#E06030', label: '550 KM' },
  { rf: 1.68, n: 16, col: '#CC8833', label: '600 KM' },
  { rf: 2.05, n: 15, col: '#5B8FFF', label: '700 KM' }, // mag braking band
  { rf: 2.35, n: 12, col: '#4A7BE8', label: '800 KM' },
  { rf: 2.65, n: 10, col: '#3B6CC0', label: '900 KM' },
];

/* ─── debris objects per ring (seeded, stable) ─────────────────────────────── */
const DEBRIS = RINGS.map((ring, ri) =>
  Array.from({ length: ring.n }, (_, i) => ({
    phi0: (i / ring.n) * Math.PI * 2 + sr(ri * 100 + i + 1) * 0.5,
    spd: 0.10 + sr(ri * 200 + i + 2) * 0.07,
    rf: ring.rf + (sr(ri * 300 + i + 3) - 0.5) * 0.06,
    sz: 1.8 + sr(ri * 400 + i + 4) * 2.2,
  }))
);

/* ─── 3-D orbit position helper ─────────────────────────────────────────────── */
function op(cx: number, cy: number, r: number, phi: number) {
  return {
    x: cx + r * Math.cos(phi),
    y: cy + r * TILT * Math.sin(phi),
    z: Math.sin(phi), // >0 = front (drawn after earth)
  };
}

/* ─── Earth renderer ────────────────────────────────────────────────────────── */
function drawEarth(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number) {
  // Outer atmosphere haze
  const ag = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.65);
  ag.addColorStop(0, 'rgba(40,110,255,0.13)');
  ag.addColorStop(0.5, 'rgba(20,60,200,0.05)');
  ag.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath(); ctx.arc(cx, cy, R * 1.65, 0, Math.PI * 2);
  ctx.fillStyle = ag; ctx.fill();

  // Planet body
  const eg = ctx.createRadialGradient(cx - R * 0.30, cy - R * 0.30, 0, cx, cy, R);
  eg.addColorStop(0, '#2e68d4');
  eg.addColorStop(0.35, '#163c96');
  eg.addColorStop(0.68, '#0c2460');
  eg.addColorStop(1, '#040e20');
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = eg; ctx.fill();

  // Landmasses
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = 'rgba(22,108,52,0.50)';
  ctx.beginPath(); ctx.ellipse(cx - R*0.27, cy - R*0.16, R*0.21, R*0.25, -0.18, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + R*0.10, cy + R*0.05, R*0.10, R*0.27, 0.08, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + R*0.34, cy - R*0.07, R*0.23, R*0.19, -0.12, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  // Night shadow
  const ns = ctx.createRadialGradient(cx + R*0.52, cy + R*0.12, 0, cx, cy, R);
  ns.addColorStop(0.35, 'rgba(0,0,0,0)');
  ns.addColorStop(0.65, 'rgba(0,2,18,0.60)');
  ns.addColorStop(1, 'rgba(0,0,12,0.90)');
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = ns; ctx.fill();

  // Atmosphere rim
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(65,140,255,0.40)';
  ctx.lineWidth = R * 0.038; ctx.stroke();
}

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function OrbitalDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>('gas');
  const modeRef = useRef<Mode>('gas');
  const rafRef = useRef<number>(0);

  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cw = 0, ch = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = canvas.offsetWidth;
      ch = canvas.offsetHeight;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ── Gas drag state ── */
    interface GasParticle { x: number; y: number; vx: number; vy: number; life: number; r: number; }
    interface DeorbitObj { ri: number; oi: number; prog: number; burnA: number; done: boolean; }
    const gasParticles: GasParticle[] = [];
    const deorbitObjs: DeorbitObj[] = [];
    let nextDeorbit = 2.5;

    /* ── Magnetic state ── */
    const TETHER_SATS = [
      { phi0: 0.7,  spd: 0.105, ri: 3 },
      { phi0: 2.5,  spd: 0.090, ri: 4 },
      { phi0: 4.4,  spd: 0.098, ri: 3 },
    ];
    interface CurrParticle { satIdx: number; t: number; spd: number; }
    const currParticles: CurrParticle[] = Array.from({ length: 18 }, (_, i) => ({
      satIdx: i % 3,
      t: sr(i * 17.3),
      spd: 0.25 + sr(i * 33.1) * 0.35,
    }));
    // Magnetic field arcs
    const FIELD_ARCS = Array.from({ length: 7 }, (_, i) => ({
      r: 0, tilt: (i - 3) * 0.22,
    }));

    /* ── Laser state ── */
    const LASER_TARGET = { ri: 2, oi: 3 }; // specific debris piece
    let laserFlash = 0;
    let laserActive = false;
    interface AblationP { x: number; y: number; vx: number; vy: number; life: number; }
    const ablation: AblationP[] = [];
    let deflect = 0;
    let reticleRot = 0;

    /* ─────────────────────────────────────────────────────────────────────── */
    const draw = (now: number) => {
      const t = now * 0.001;
      const m = modeRef.current;
      if (cw <= 0 || ch <= 0) { rafRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, cw, ch);

      const cx = cw * 0.5;
      const cy = ch * 0.50;
      const R = Math.min(cw, ch) * 0.155;

      /* ── Stars ── */
      STARS.forEach(s => {
        const twinkA = s.a * (0.75 + 0.25 * Math.sin(t * 1.3 + s.twinkle));
        ctx.beginPath();
        ctx.arc(s.xf * cw, s.yf * ch, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,215,255,${twinkA.toFixed(2)})`;
        ctx.fill();
      });

      /* ── Orbit guide rings (mode-specific) ── */
      const guideRings = m === 'gas'
        ? [0, 1, 2].map(i => ({ r: R * RINGS[i].rf, col: RINGS[i].col + '22', label: RINGS[i].label }))
        : m === 'magnetic'
        ? [3, 4, 5].map(i => ({ r: R * RINGS[i].rf, col: RINGS[i].col + '22', label: RINGS[i].label }))
        : [0, 2, 3, 5].map(i => ({ r: R * RINGS[i].rf, col: 'rgba(255,255,255,0.06)', label: RINGS[i].label }));

      guideRings.forEach(gr => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, gr.r, gr.r * TILT, 0, 0, Math.PI * 2);
        ctx.strokeStyle = gr.col;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      /* ── BACK-HALF debris (behind Earth, drawn first) ── */
      const activeRings = m === 'gas' ? [0, 1, 2] : m === 'magnetic' ? [3, 4, 5] : [0, 1, 2, 3, 4];
      activeRings.forEach(ri => {
        DEBRIS[ri].forEach((obj, oi) => {
          const phi = obj.phi0 + t * obj.spd;
          const pos = op(cx, cy, R * obj.rf, phi);
          if (pos.z >= -0.05) return; // only back-half
          if (m === 'laser' && ri === LASER_TARGET.ri && oi === LASER_TARGET.oi) return;
          const alpha = Math.max(0.08, 0.25 + pos.z * 0.15);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, obj.sz * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = RINGS[ri].col + Math.round(alpha * 255).toString(16).padStart(2, '0');
          ctx.fill();
        });
      });

      /* ── EARTH ── */
      drawEarth(ctx, cx, cy, R);

      /* ══════════════════ MODE-SPECIFIC RENDERING ══════════════════ */

      if (m === 'gas') {
        /* ── Dispenser satellite ── */
        const dispPhi = t * 0.12;
        const dispR = R * 1.52;
        const dispPos = op(cx, cy, dispR, dispPhi);

        // Xenon gas cloud
        const cloudR = R * 0.95;
        const cloudA = 0.055 + 0.02 * Math.sin(t * 0.8);
        const cg = ctx.createRadialGradient(dispPos.x, dispPos.y, 0, dispPos.x, dispPos.y, cloudR);
        cg.addColorStop(0, `rgba(42,232,164,${cloudA * 3})`);
        cg.addColorStop(0.35, `rgba(42,232,164,${cloudA})`);
        cg.addColorStop(1, 'rgba(42,232,164,0)');
        ctx.beginPath(); ctx.arc(dispPos.x, dispPos.y, cloudR, 0, Math.PI * 2);
        ctx.fillStyle = cg; ctx.fill();

        // Emit gas particles
        if (Math.random() < 0.35) {
          const ang = Math.random() * Math.PI * 2;
          gasParticles.push({
            x: dispPos.x, y: dispPos.y,
            vx: Math.cos(ang) * (0.4 + Math.random()),
            vy: Math.sin(ang) * (0.2 + Math.random() * 0.5),
            life: 1.0,
            r: 0.8 + Math.random() * 2,
          });
        }
        for (let i = gasParticles.length - 1; i >= 0; i--) {
          const p = gasParticles[i];
          p.x += p.vx; p.y += p.vy; p.life -= 0.007;
          if (p.life <= 0) { gasParticles.splice(i, 1); continue; }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(42,232,164,${(p.life * 0.45).toFixed(2)})`; ctx.fill();
        }

        // Schedule deorbit events
        if (t >= nextDeorbit && deorbitObjs.length < 4) {
          const ri = Math.floor(Math.random() * 3);
          const oi = Math.floor(Math.random() * RINGS[ri].n);
          if (!deorbitObjs.some(d => d.ri === ri && d.oi === oi)) {
            deorbitObjs.push({ ri, oi, prog: 0, burnA: 0, done: false });
          }
          nextDeorbit = t + 3.5 + Math.random() * 2.5;
        }

        // Draw deorbit spirals
        for (let i = deorbitObjs.length - 1; i >= 0; i--) {
          const d = deorbitObjs[i];
          if (d.done) { deorbitObjs.splice(i, 1); continue; }
          d.prog += 0.0015;
          const obj = DEBRIS[d.ri][d.oi];
          const phi = obj.phi0 + t * obj.spd;
          const startR = R * obj.rf;
          const curR = Math.max(startR * (1 - d.prog * 0.92), R * 0.22);

          // Spiral trail
          ctx.beginPath();
          for (let j = 0; j <= 40; j++) {
            const sp = phi - j * 0.13;
            const sr2 = Math.max(startR * (1 - (d.prog - j * 0.0008) * 0.92), R * 0.22);
            const p = op(cx, cy, sr2, sp);
            j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
          }
          ctx.strokeStyle = `rgba(212,80,80,${(0.45 * (1 - d.prog)).toFixed(2)})`;
          ctx.lineWidth = 1.2; ctx.stroke();

          const pos = op(cx, cy, curR, phi);
          if (curR <= R * 0.26) {
            d.burnA = Math.min(1, d.burnA + 0.03);
            const bg = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, R * 0.28);
            bg.addColorStop(0, `rgba(255,210,60,${d.burnA})`);
            bg.addColorStop(0.4, `rgba(255,110,20,${d.burnA * 0.55})`);
            bg.addColorStop(1, 'rgba(255,40,0,0)');
            ctx.beginPath(); ctx.arc(pos.x, pos.y, R * 0.28, 0, Math.PI * 2);
            ctx.fillStyle = bg; ctx.fill();
            if (d.burnA >= 0.99) d.done = true;
          } else {
            ctx.beginPath(); ctx.arc(pos.x, pos.y, obj.sz * 1.3, 0, Math.PI * 2);
            ctx.fillStyle = '#FF5533'; ctx.fill();
          }
        }

        // Draw dispenser
        if (dispPos.z > -0.15) {
          ctx.save(); ctx.translate(dispPos.x, dispPos.y);
          ctx.fillStyle = '#1AE89A'; ctx.fillRect(-7, -4, 14, 8);
          ctx.fillStyle = '#0E9E66';
          ctx.fillRect(-19, -2.5, 10, 5);
          ctx.fillRect(9, -2.5, 10, 5);
          // nozzle glow
          const ng = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
          ng.addColorStop(0, 'rgba(42,232,164,0.6)'); ng.addColorStop(1, 'rgba(42,232,164,0)');
          ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          // label
          ctx.font = '9px IBM Plex Mono, monospace';
          ctx.fillStyle = 'rgba(42,232,164,0.75)';
          ctx.fillText('GAS DISPENSER', dispPos.x + 18, dispPos.y - 9);
          ctx.fillStyle = 'rgba(42,232,164,0.45)';
          ctx.fillText('Xe // VENTING', dispPos.x + 18, dispPos.y + 3);
        }

      } else if (m === 'magnetic') {

        /* ── Field lines (behind Earth layer) ── */
        ctx.save(); ctx.globalAlpha = 0.10;
        for (let fi = 0; fi < 5; fi++) {
          const arcR = R * (1.5 + fi * 0.45);
          ctx.beginPath();
          ctx.ellipse(cx, cy, arcR, arcR * 0.55, 0, 0, Math.PI * 2);
          ctx.strokeStyle = '#5B8FFF'; ctx.lineWidth = 1;
          ctx.setLineDash([2, 7]); ctx.stroke(); ctx.setLineDash([]);
        }
        ctx.restore();

        /* ── Tether satellites + current particles ── */
        TETHER_SATS.forEach((sat, si) => {
          const phi = sat.phi0 + t * sat.spd;
          const orbitR = R * RINGS[sat.ri].rf;
          const satPos = op(cx, cy, orbitR, phi);
          if (satPos.z < -0.25) return;

          // Tether line
          const tetherLen = R * 0.72;
          const innerPos = op(cx, cy, orbitR - tetherLen, phi);
          const tg = ctx.createLinearGradient(satPos.x, satPos.y, innerPos.x, innerPos.y);
          tg.addColorStop(0, 'rgba(91,143,255,0.85)');
          tg.addColorStop(1, 'rgba(91,143,255,0.06)');
          ctx.beginPath(); ctx.moveTo(satPos.x, satPos.y); ctx.lineTo(innerPos.x, innerPos.y);
          ctx.strokeStyle = tg; ctx.lineWidth = 1.5; ctx.stroke();

          // Current particles along tether
          currParticles.filter(p => p.satIdx === si).forEach(p => {
            const pt = ((p.t + t * p.spd) % 1);
            const px = satPos.x + (innerPos.x - satPos.x) * pt;
            const py = satPos.y + (innerPos.y - satPos.y) * pt;
            ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(160,210,255,${(0.7 * (1 - pt * 0.6)).toFixed(2)})`; ctx.fill();
          });

          // EM field glow around tether node
          const eg = ctx.createRadialGradient(satPos.x, satPos.y, 0, satPos.x, satPos.y, R * 0.55);
          eg.addColorStop(0, 'rgba(91,143,255,0.10)'); eg.addColorStop(1, 'rgba(91,143,255,0)');
          ctx.beginPath(); ctx.arc(satPos.x, satPos.y, R * 0.55, 0, Math.PI * 2);
          ctx.fillStyle = eg; ctx.fill();

          // Satellite body
          ctx.save(); ctx.translate(satPos.x, satPos.y);
          ctx.fillStyle = '#5B8FFF'; ctx.fillRect(-6, -3.5, 12, 7);
          ctx.fillStyle = '#2A4DA8';
          ctx.fillRect(-16, -2, 9, 4);
          ctx.fillRect(7, -2, 9, 4);
          ctx.restore();

          if (si === 1) {
            ctx.font = '9px IBM Plex Mono, monospace';
            ctx.fillStyle = 'rgba(91,143,255,0.72)';
            ctx.fillText('EDT NODE', satPos.x + 15, satPos.y - 7);
            ctx.fillStyle = 'rgba(91,143,255,0.42)';
            ctx.fillText('CURRENT ACTIVE', satPos.x + 15, satPos.y + 4);
          }
        });

        /* ── Slow-down indicators on nearby debris ── */
        [3, 4].forEach(ri => {
          DEBRIS[ri].slice(0, 4).forEach(obj => {
            const phi = obj.phi0 + t * obj.spd;
            const pos = op(cx, cy, R * obj.rf, phi);
            if (pos.z < 0) return;
            // velocity arrow (shortened to show braking)
            const arrowLen = 12 + 4 * Math.sin(t * 1.5 + obj.phi0);
            const ang = Math.atan2(
              TILT * obj.spd * Math.cos(phi),
              -obj.spd * Math.sin(phi)
            );
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(pos.x + Math.cos(ang) * arrowLen, pos.y + Math.sin(ang) * arrowLen);
            ctx.strokeStyle = 'rgba(91,143,255,0.50)'; ctx.lineWidth = 1; ctx.stroke();
            // arrowhead
            ctx.beginPath();
            ctx.moveTo(pos.x + Math.cos(ang) * arrowLen, pos.y + Math.sin(ang) * arrowLen);
            ctx.lineTo(
              pos.x + Math.cos(ang - 0.45) * (arrowLen - 5),
              pos.y + Math.sin(ang - 0.45) * (arrowLen - 5)
            );
            ctx.moveTo(pos.x + Math.cos(ang) * arrowLen, pos.y + Math.sin(ang) * arrowLen);
            ctx.lineTo(
              pos.x + Math.cos(ang + 0.45) * (arrowLen - 5),
              pos.y + Math.sin(ang + 0.45) * (arrowLen - 5)
            );
            ctx.stroke();
          });
        });

      } else {
        /* ── LASER MODE ── */

        // Ground station position (surface of Earth, bottom-left)
        const gsAngle = Math.PI * 0.62; // slightly past bottom
        const gx = cx + R * 0.92 * Math.cos(gsAngle);
        const gy = cy + R * 0.92 * Math.sin(gsAngle);

        // Target debris object
        const tObj = DEBRIS[LASER_TARGET.ri][LASER_TARGET.oi];
        const tPhi = tObj.phi0 + t * tObj.spd;
        const tPos = op(cx, cy, R * tObj.rf * (1 + deflect * 0.06), tPhi + deflect * 0.04);

        // Targeting reticle
        reticleRot = t * 0.6;
        const rSize = 18 + 4 * Math.sin(t * 3.5);
        const rAlpha = 0.55 + 0.35 * Math.sin(t * 4.2);
        ctx.save(); ctx.translate(tPos.x, tPos.y); ctx.rotate(reticleRot);
        ctx.beginPath(); ctx.arc(0, 0, rSize, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,80,80,${rAlpha.toFixed(2)})`; ctx.lineWidth = 1;
        ctx.setLineDash([4, 5]); ctx.stroke(); ctx.setLineDash([]);
        // crosshairs
        [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(a => {
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * (rSize + 4), Math.sin(a) * (rSize + 4));
          ctx.lineTo(Math.cos(a) * (rSize + 11), Math.sin(a) * (rSize + 11));
          ctx.strokeStyle = `rgba(212,80,80,${(rAlpha * 0.7).toFixed(2)})`; ctx.lineWidth = 1;
          ctx.setLineDash([]); ctx.stroke();
        });
        ctx.restore();

        // Laser pulse logic
        const pulse = Math.sin(t * 2.8);
        if (pulse > 0.65) {
          laserActive = true;
          laserFlash = Math.min(1, laserFlash + 0.12);
          deflect = Math.min(deflect + 0.00025, 0.12);
          if (Math.random() < 0.55) {
            ablation.push({
              x: tPos.x, y: tPos.y,
              vx: (Math.random() - 0.5) * 3.5,
              vy: (Math.random() - 0.75) * 3.5,
              life: 0.6 + Math.random() * 0.5,
            });
          }
        } else {
          laserActive = false;
          laserFlash = Math.max(0, laserFlash - 0.08);
        }

        if (laserActive && laserFlash > 0.08) {
          // Laser beam
          const lAlpha = laserFlash;
          const lg = ctx.createLinearGradient(gx, gy, tPos.x, tPos.y);
          lg.addColorStop(0, 'rgba(212,80,80,0)');
          lg.addColorStop(0.08, `rgba(212,80,80,${lAlpha * 0.88})`);
          lg.addColorStop(0.92, `rgba(220,100,40,${lAlpha * 0.65})`);
          lg.addColorStop(1, `rgba(255,180,60,${lAlpha})`);
          ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(tPos.x, tPos.y);
          ctx.strokeStyle = lg; ctx.lineWidth = 2 * lAlpha; ctx.stroke();
          // Outer glow beam
          const og = ctx.createLinearGradient(gx, gy, tPos.x, tPos.y);
          og.addColorStop(0, 'rgba(212,80,80,0)');
          og.addColorStop(0.1, `rgba(212,80,80,${lAlpha * 0.10})`);
          og.addColorStop(1, 'rgba(212,80,80,0)');
          ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(tPos.x, tPos.y);
          ctx.strokeStyle = og; ctx.lineWidth = 10; ctx.stroke();

          // Hit flash
          const hg = ctx.createRadialGradient(tPos.x, tPos.y, 0, tPos.x, tPos.y, 22 * lAlpha);
          hg.addColorStop(0, `rgba(255,240,160,${lAlpha})`);
          hg.addColorStop(0.3, `rgba(255,140,40,${lAlpha * 0.65})`);
          hg.addColorStop(1, 'rgba(212,80,80,0)');
          ctx.beginPath(); ctx.arc(tPos.x, tPos.y, 22 * lAlpha, 0, Math.PI * 2);
          ctx.fillStyle = hg; ctx.fill();
        }

        // Ablation particles
        for (let i = ablation.length - 1; i >= 0; i--) {
          const p = ablation[i];
          p.x += p.vx; p.y += p.vy; p.life -= 0.018;
          if (p.life <= 0) { ablation.splice(i, 1); continue; }
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,200,80,${p.life.toFixed(2)})`; ctx.fill();
        }

        // Target debris (box-shaped satellite)
        ctx.save(); ctx.translate(tPos.x, tPos.y);
        ctx.fillStyle = '#8A909C'; ctx.fillRect(-10, -6, 20, 12);
        ctx.fillStyle = '#6A7080'; ctx.fillRect(-15, -3, 4, 6); ctx.fillRect(11, -3, 4, 6);
        ctx.fillStyle = '#4A5060'; ctx.fillRect(-8, -2, 16, 4); // detail line
        ctx.restore();

        // Original trajectory ring (red dashed)
        ctx.beginPath();
        ctx.ellipse(cx, cy, R * tObj.rf, R * tObj.rf * TILT, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(212,80,80,0.18)'; ctx.lineWidth = 1;
        ctx.setLineDash([2, 7]); ctx.stroke(); ctx.setLineDash([]);

        // Deflected trajectory ring (green, grows with deflect)
        if (deflect > 0.02) {
          const newR = R * tObj.rf * (1 + deflect * 0.06);
          ctx.beginPath();
          ctx.ellipse(cx, cy, newR, newR * TILT, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(42,232,164,${Math.min(deflect * 12, 0.45).toFixed(2)})`;
          ctx.lineWidth = 1; ctx.setLineDash([3, 5]); ctx.stroke(); ctx.setLineDash([]);
        }

        // Ground station
        ctx.save(); ctx.translate(gx, gy);
        ctx.fillStyle = laserActive ? '#FF5555' : '#D45050';
        ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(6, 4); ctx.lineTo(-6, 4); ctx.closePath(); ctx.fill();
        if (laserActive) {
          const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, 18);
          gg.addColorStop(0, 'rgba(212,80,80,0.35)'); gg.addColorStop(1, 'rgba(212,80,80,0)');
          ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fillStyle = gg; ctx.fill();
        }
        ctx.restore();
        ctx.font = '9px IBM Plex Mono, monospace';
        ctx.fillStyle = 'rgba(212,80,80,0.72)';
        ctx.fillText('GROUND STATION', gx + 12, gy - 8);
        ctx.fillStyle = 'rgba(212,80,80,0.42)';
        ctx.fillText(laserActive ? '● FIRING' : '○ TRACKING', gx + 12, gy + 3);

        // Trajectory change label
        if (deflect > 0.03) {
          const lx = tPos.x + 22, ly = tPos.y - 18;
          ctx.font = '9px IBM Plex Mono, monospace';
          ctx.fillStyle = 'rgba(42,232,164,0.80)';
          ctx.fillText(`Δv = ${(deflect * 8.5).toFixed(1)} mm/s`, lx, ly);
        }
      }

      /* ── FRONT-HALF debris ── */
      activeRings.forEach(ri => {
        const ring = RINGS[ri];
        DEBRIS[ri].forEach((obj, oi) => {
          if (m === 'laser' && ri === LASER_TARGET.ri && oi === LASER_TARGET.oi) return;
          if (m === 'gas' && deorbitObjs.some(d => d.ri === ri && d.oi === oi)) return;
          const phi = obj.phi0 + t * obj.spd;
          const pos = op(cx, cy, R * obj.rf, phi);
          if (pos.z < -0.05) return; // only front-half here

          // Motion trail
          const tPhi2 = phi - 0.14;
          const tPos2 = op(cx, cy, R * obj.rf, tPhi2);
          ctx.beginPath(); ctx.moveTo(pos.x, pos.y); ctx.lineTo(tPos2.x, tPos2.y);
          ctx.strokeStyle = ring.col + '40'; ctx.lineWidth = obj.sz * 0.65; ctx.stroke();

          // Dot
          ctx.beginPath(); ctx.arc(pos.x, pos.y, obj.sz, 0, Math.PI * 2);
          ctx.fillStyle = ring.col; ctx.fill();
        });
      });

      /* ── Altitude labels (right edge) ── */
      ctx.font = '8px IBM Plex Mono, monospace';
      guideRings.slice(0, 3).forEach((gr, i) => {
        const labelX = cx + gr.r + 6;
        const labelY = cy - 3;
        ctx.fillStyle = gr.col.startsWith('rgba') ? 'rgba(100,120,160,0.6)' : gr.col + 'AA';
        ctx.fillText(RINGS[activeRings[i]]?.label ?? '', labelX, labelY);
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  /* ─── Static config for tabs/stats ── */
  const MODES: Record<Mode, { col: string; label: string; desc: string; stats: { k: string; v: string }[] }> = {
    gas: {
      col: '#2AE8A4',
      label: 'GAS DRAG',
      desc: 'Xenon gas injection thickens the upper atmosphere, passively slowing thousands of fragments simultaneously.',
      stats: [
        { k: 'ALTITUDE BAND', v: '500–600 KM' },
        { k: 'AGENT', v: 'XENON / ARGON' },
        { k: 'CONTACT', v: 'NONE' },
        { k: 'OBJECTS/RELEASE', v: '1,000+' },
      ],
    },
    magnetic: {
      col: '#5B8FFF',
      label: 'MAGNETIC BRAKING',
      desc: 'Conducting tethers convert orbital kinetic energy into electrical current, producing drag with zero propellant.',
      stats: [
        { k: 'ALTITUDE BAND', v: '700–900 KM' },
        { k: 'METHOD', v: 'ELECTRODYNAMIC TETHER' },
        { k: 'PROPELLANT', v: 'ZERO' },
        { k: 'DEORBIT RATE', v: '10–20× FASTER' },
      ],
    },
    laser: {
      col: '#D45050',
      label: 'LASER NUDGE',
      desc: 'Pulsed laser ablation applies micro-thrust to high-risk tracked objects, pushing them toward re-entry.',
      stats: [
        { k: 'COVERAGE', v: 'ALL ALTITUDES' },
        { k: 'METHOD', v: 'PULSED ABLATION' },
        { k: 'CONTACT', v: 'NONE' },
        { k: 'Δv / PASS', v: '~1 MM/S' },
      ],
    },
  };

  const cfg = MODES[mode];
  const mono2 = 'IBM Plex Mono, monospace';

  return (
    <div style={{ backgroundColor: '#090c12', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>

      {/* ── Tab bar ── */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {(Object.keys(MODES) as Mode[]).map(m => {
          const mc = MODES[m];
          const active = mode === m;
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: '13px 10px',
                fontFamily: mono2, fontSize: '10px', letterSpacing: '0.10em',
                background: active ? 'rgba(255,255,255,0.03)' : 'transparent',
                color: active ? mc.col : '#4E5868',
                border: 'none',
                borderBottom: active ? `2px solid ${mc.col}` : '2px solid transparent',
                cursor: 'pointer', transition: 'color 180ms ease, border-color 180ms ease',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = '#8A909C'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = '#4E5868'; }}
            >
              {mc.label}
            </button>
          );
        })}
      </div>

      {/* ── Canvas ── */}
      <canvas ref={canvasRef} style={{ width: '100%', height: '460px', display: 'block' }} />

      {/* ── Description + stats footer ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(0,0,0,0.25)' }}>
        <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <p style={{ fontFamily: mono2, fontSize: '12px', color: '#7E8898', lineHeight: 1.75, margin: 0 }}>
            <span style={{ color: cfg.col }}>▶ </span>{cfg.desc}
          </p>
        </div>
        <div style={{ padding: '14px 24px', display: 'flex', gap: '36px', flexWrap: 'wrap' }}>
          {cfg.stats.map(s => (
            <div key={s.k}>
              <div style={{ fontFamily: mono2, fontSize: '9px', letterSpacing: '0.12em', color: '#4E5868', marginBottom: '4px' }}>
                {s.k}
              </div>
              <div style={{ fontFamily: mono2, fontSize: '12px', color: cfg.col }}>
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
