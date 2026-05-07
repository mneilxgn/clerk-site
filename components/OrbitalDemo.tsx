'use client';

import { useEffect, useRef, useState } from 'react';

type Mode = 'laser' | 'gas';

/* ─── seeded pseudo-random ─────────────────────────────────────────────────── */
function sr(n: number): number {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/* ─── 3-D orbit tilt factor ─────────────────────────────────────────────────── */
const TILT = 0.30;

/* ─── stable star field ─────────────────────────────────────────────────────── */
const STARS = Array.from({ length: 240 }, (_, i) => ({
  xf: sr(i * 1.13),
  yf: sr(i * 2.47),
  r: 0.35 + sr(i * 3.81) * 1.6,
  a: 0.12 + sr(i * 5.23) * 0.55,
  tw: sr(i * 7.11) * Math.PI * 2,
}));

/* ─── ring configs ──────────────────────────────────────────────────────────── */
//  rf = orbit radius as multiple of earthR
const RINGS = [
  { rf: 1.38, n: 26, col: '#D45050', label: '500 KM' },
  { rf: 1.54, n: 20, col: '#E06030', label: '550 KM' },
  { rf: 1.70, n: 16, col: '#CC8833', label: '600 KM' },
  { rf: 2.10, n: 15, col: '#7B9FE8', label: '700 KM' },
  { rf: 2.42, n: 12, col: '#6082CC', label: '800 KM' },
  { rf: 2.72, n: 10, col: '#4E6CB0', label: '900 KM' },
];

/* ─── debris objects (seeded, stable) ─────────────────────────────────────── */
const DEBRIS = RINGS.map((ring, ri) =>
  Array.from({ length: ring.n }, (_, i) => ({
    phi0: (i / ring.n) * Math.PI * 2 + sr(ri * 100 + i + 1) * 0.5,
    spd:  0.09 + sr(ri * 200 + i + 2) * 0.07,
    rf:   ring.rf + (sr(ri * 300 + i + 3) - 0.5) * 0.06,
    sz:   1.8 + sr(ri * 400 + i + 4) * 2.2,
  }))
);

/* ─── 3-D orbit position ─────────────────────────────────────────────────── */
function op(cx: number, cy: number, r: number, phi: number) {
  return {
    x: cx + r * Math.cos(phi),
    y: cy + r * TILT * Math.sin(phi),
    z: Math.sin(phi),
  };
}

/* ─── Earth draw ─────────────────────────────────────────────────────────── */
function drawEarth(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number) {
  // Atmosphere haze
  const ag = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.7);
  ag.addColorStop(0, 'rgba(40,110,255,0.14)');
  ag.addColorStop(0.5, 'rgba(20,60,200,0.05)');
  ag.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath(); ctx.arc(cx, cy, R * 1.7, 0, Math.PI * 2);
  ctx.fillStyle = ag; ctx.fill();

  // Planet body
  const eg = ctx.createRadialGradient(cx - R * 0.30, cy - R * 0.30, 0, cx, cy, R);
  eg.addColorStop(0,    '#2e68d4');
  eg.addColorStop(0.35, '#163c96');
  eg.addColorStop(0.68, '#0c2460');
  eg.addColorStop(1,    '#040e20');
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
  ns.addColorStop(1,    'rgba(0,0,12,0.90)');
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
  const [mode, setMode]   = useState<Mode>('laser');
  const modeRef           = useRef<Mode>('laser');
  const rafRef            = useRef<number>(0);

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
      canvas.width  = cw * dpr;
      canvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ── Laser mode state ── */
    interface AblationP { x: number; y: number; vx: number; vy: number; life: number; }
    const ablation: AblationP[] = [];
    let laserFlash = 0;
    let laserActive = false;
    // Nudge targets: pick 3 specific debris from higher rings
    const NUDGE_TARGETS = [
      { ri: 4, oi: 2, progress: 0, inCloud: false, burnProg: 0 },
      { ri: 3, oi: 5, progress: 0, inCloud: false, burnProg: 0 },
      { ri: 5, oi: 1, progress: 0, inCloud: false, burnProg: 0 },
    ];
    let activeLaserTarget = 0; // which nudge target the laser is currently firing at
    let reticleRot = 0;
    let nextTargetSwitch = 6;

    /* ── Gas mode state ── */
    interface GasParticle { x: number; y: number; vx: number; vy: number; life: number; r: number; }
    const gasParticles: GasParticle[] = [];
    interface DeorbitObj { ri: number; oi: number; prog: number; burnA: number; done: boolean; }
    const deorbitObjs: DeorbitObj[] = [];
    let nextDeorbit = 2.0;

    /* ───────────────────────────────────────────── DRAW LOOP ───── */
    const draw = (now: number) => {
      const t   = now * 0.001;
      const m   = modeRef.current;
      if (cw <= 0 || ch <= 0) { rafRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, cw, ch);

      const cx = cw * 0.5;
      const cy = ch * 0.50;
      const R  = Math.min(cw, ch) * 0.145;

      /* ── Stars ── */
      STARS.forEach(s => {
        const a = s.a * (0.72 + 0.28 * Math.sin(t * 1.4 + s.tw));
        ctx.beginPath(); ctx.arc(s.xf * cw, s.yf * ch, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,215,255,${a.toFixed(2)})`; ctx.fill();
      });

      /* ── Determine which debris rings are visible ── */
      const activeRings = m === 'laser' ? [3, 4, 5, 0, 1] : [0, 1, 2];

      /* ── Orbit guide ellipses ── */
      const guideRings = m === 'laser'
        ? [
            { r: R * RINGS[3].rf, col: 'rgba(110,150,255,0.18)', label: '700 KM' },
            { r: R * RINGS[4].rf, col: 'rgba(110,150,255,0.13)', label: '800 KM' },
            { r: R * RINGS[5].rf, col: 'rgba(110,150,255,0.09)', label: '900 KM' },
            { r: R * RINGS[0].rf, col: 'rgba(42,232,164,0.20)', label: '500 KM  ← GAS ZONE' },
          ]
        : [
            { r: R * RINGS[0].rf, col: 'rgba(212,80,80,0.22)', label: '500 KM' },
            { r: R * RINGS[1].rf, col: 'rgba(212,80,80,0.15)', label: '550 KM' },
            { r: R * RINGS[2].rf, col: 'rgba(212,80,80,0.10)', label: '600 KM' },
          ];

      guideRings.forEach(gr => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, gr.r, gr.r * TILT, 0, 0, Math.PI * 2);
        ctx.strokeStyle = gr.col;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      /* ── Gas cloud (always shown faintly in laser mode as the target zone) ── */
      if (m === 'laser') {
        const gcR = R * RINGS[0].rf;
        const gcG = ctx.createRadialGradient(cx, cy, gcR * 0.78, cx, cy, gcR * 1.22);
        gcG.addColorStop(0, 'rgba(42,232,164,0)');
        gcG.addColorStop(0.35, 'rgba(42,232,164,0.04)');
        gcG.addColorStop(0.65, 'rgba(42,232,164,0.05)');
        gcG.addColorStop(1, 'rgba(42,232,164,0)');
        ctx.beginPath(); ctx.arc(cx, cy, gcR * 1.22, 0, Math.PI * 2);
        ctx.fillStyle = gcG; ctx.fill();
      }

      /* ── BACK-HALF debris ── */
      activeRings.forEach(ri => {
        DEBRIS[ri].forEach((obj, oi) => {
          const phi = obj.phi0 + t * obj.spd;
          const pos = op(cx, cy, R * obj.rf, phi);
          if (pos.z >= -0.05) return;
          // Hide nudge targets that have left their ring
          if (m === 'laser') {
            const nt = NUDGE_TARGETS.find(n => n.ri === ri && n.oi === oi);
            if (nt && nt.progress > 0.01) return;
          }
          const alpha = Math.max(0.07, 0.22 + pos.z * 0.12);
          ctx.beginPath(); ctx.arc(pos.x, pos.y, obj.sz * 0.75, 0, Math.PI * 2);
          ctx.fillStyle = RINGS[ri].col + Math.round(alpha * 255).toString(16).padStart(2, '0');
          ctx.fill();
        });
      });

      /* ── EARTH ── */
      drawEarth(ctx, cx, cy, R);

      /* ══════════════════ LASER MODE ══════════════════════════════ */
      if (m === 'laser') {

        // Ground station position
        const gsAngle = Math.PI * 0.63;
        const gx = cx + R * 0.93 * Math.cos(gsAngle);
        const gy = cy + R * 0.93 * Math.sin(gsAngle);

        // Switch active target periodically
        if (t >= nextTargetSwitch) {
          activeLaserTarget = (activeLaserTarget + 1) % NUDGE_TARGETS.length;
          nextTargetSwitch = t + 5 + sr(Math.floor(t)) * 3;
        }

        // Update nudge targets
        NUDGE_TARGETS.forEach((nt, ni) => {
          const obj = DEBRIS[nt.ri][nt.oi];
          const phi = obj.phi0 + t * obj.spd;

          if (!nt.inCloud) {
            // Gradually lower the orbit toward the gas zone
            nt.progress = Math.min(nt.progress + 0.00018, 1);
            const startR = R * RINGS[nt.ri].rf;
            const targetR = R * RINGS[0].rf * 1.02;
            const curR = startR + (targetR - startR) * nt.progress;
            const pos = op(cx, cy, curR, phi);

            // Spiral trail (deorbit path)
            if (nt.progress > 0.02) {
              ctx.beginPath();
              for (let j = 0; j <= 50; j++) {
                const sp = phi - j * 0.11;
                const fr = 1 - (nt.progress - j * 0.0006);
                const sr2 = Math.max(startR + (targetR - startR) * Math.max(fr, 0), targetR);
                const p = op(cx, cy, sr2, sp);
                j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
              }
              ctx.strokeStyle = `rgba(212,80,80,${(0.30 * (1 - nt.progress * 0.5)).toFixed(2)})`;
              ctx.lineWidth = 1; ctx.stroke();
            }

            // The debris dot
            if (pos.z > -0.1) {
              ctx.beginPath(); ctx.arc(pos.x, pos.y, obj.sz * 1.4, 0, Math.PI * 2);
              ctx.fillStyle = '#E86040'; ctx.fill();

              // Reticle on active target
              if (ni === activeLaserTarget) {
                reticleRot = t * 0.7;
                const rSz = 16 + 3 * Math.sin(t * 3.8);
                const rA  = 0.5 + 0.3 * Math.sin(t * 4.5);
                ctx.save(); ctx.translate(pos.x, pos.y); ctx.rotate(reticleRot);
                ctx.beginPath(); ctx.arc(0, 0, rSz, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(212,80,80,${rA.toFixed(2)})`; ctx.lineWidth = 1;
                ctx.setLineDash([4, 5]); ctx.stroke(); ctx.setLineDash([]);
                [0, Math.PI/2, Math.PI, Math.PI*1.5].forEach(a => {
                  ctx.beginPath();
                  ctx.moveTo(Math.cos(a)*(rSz+4), Math.sin(a)*(rSz+4));
                  ctx.lineTo(Math.cos(a)*(rSz+10), Math.sin(a)*(rSz+10));
                  ctx.strokeStyle = `rgba(212,80,80,${(rA*0.65).toFixed(2)})`; ctx.lineWidth=1;
                  ctx.setLineDash([]); ctx.stroke();
                });
                ctx.restore();
              }

              // Reached gas zone?
              if (nt.progress >= 0.99) nt.inCloud = true;
            }

            // Laser beam to active target
            if (ni === activeLaserTarget) {
              const pulse = Math.sin(t * 2.9 + ni);
              if (pulse > 0.62) {
                laserActive = true;
                laserFlash = Math.min(1, laserFlash + 0.14);
                if (Math.random() < 0.5) {
                  ablation.push({
                    x: pos.x, y: pos.y,
                    vx: (Math.random() - 0.5) * 3.5,
                    vy: (Math.random() - 0.75) * 3.2,
                    life: 0.6 + Math.random() * 0.5,
                  });
                }
              } else {
                laserActive = false;
                laserFlash = Math.max(0, laserFlash - 0.09);
              }

              if (laserFlash > 0.06) {
                const lA = laserFlash;
                const lg = ctx.createLinearGradient(gx, gy, pos.x, pos.y);
                lg.addColorStop(0,    'rgba(212,80,80,0)');
                lg.addColorStop(0.07, `rgba(212,80,80,${lA * 0.85})`);
                lg.addColorStop(0.93, `rgba(220,100,40,${lA * 0.6})`);
                lg.addColorStop(1,    `rgba(255,190,60,${lA})`);
                ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(pos.x, pos.y);
                ctx.strokeStyle = lg; ctx.lineWidth = 2.2 * lA; ctx.stroke();
                // Outer glow
                ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(pos.x, pos.y);
                ctx.strokeStyle = `rgba(212,80,80,${(lA * 0.09).toFixed(2)})`; ctx.lineWidth = 11; ctx.stroke();
                // Hit flash
                const hg = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 20 * lA);
                hg.addColorStop(0, `rgba(255,240,160,${lA})`);
                hg.addColorStop(0.3, `rgba(255,140,40,${lA * 0.6})`);
                hg.addColorStop(1, 'rgba(212,80,80,0)');
                ctx.beginPath(); ctx.arc(pos.x, pos.y, 20 * lA, 0, Math.PI * 2);
                ctx.fillStyle = hg; ctx.fill();
              }
            }

          } else {
            // Debris has entered gas cloud — hand off to a deorbit spiral
            if (!deorbitObjs.some(d => d.ri === nt.ri && d.oi === nt.oi)) {
              deorbitObjs.push({ ri: nt.ri, oi: nt.oi, prog: 0, burnA: 0, done: false });
            }
          }
        });

        // Ablation particles
        for (let i = ablation.length - 1; i >= 0; i--) {
          const p = ablation[i];
          p.x += p.vx; p.y += p.vy; p.life -= 0.016;
          if (p.life <= 0) { ablation.splice(i, 1); continue; }
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,200,80,${p.life.toFixed(2)})`; ctx.fill();
        }

        // Ground station
        ctx.save(); ctx.translate(gx, gy);
        ctx.fillStyle = laserActive ? '#FF5555' : '#D45050';
        ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(6, 4); ctx.lineTo(-6, 4); ctx.closePath(); ctx.fill();
        if (laserActive) {
          const gg = ctx.createRadialGradient(0,0,0,0,0,20);
          gg.addColorStop(0, 'rgba(212,80,80,0.35)'); gg.addColorStop(1, 'rgba(212,80,80,0)');
          ctx.beginPath(); ctx.arc(0,0,20,0,Math.PI*2); ctx.fillStyle = gg; ctx.fill();
        }
        ctx.restore();

        ctx.font = '9px IBM Plex Mono, monospace';
        ctx.fillStyle = 'rgba(212,80,80,0.75)';
        ctx.fillText('LASER STATION', gx + 12, gy - 8);
        ctx.fillStyle = 'rgba(212,80,80,0.42)';
        ctx.fillText(laserActive ? '● FIRING' : '○ TRACKING', gx + 12, gy + 3);

        // Gas cloud label
        const gcLabelR = R * RINGS[0].rf * 1.04;
        const gcLX = cx + gcLabelR + 5;
        ctx.font = '9px IBM Plex Mono, monospace';
        ctx.fillStyle = 'rgba(42,232,164,0.70)';
        ctx.fillText('← GAS DRAG ZONE', gcLX, cy - 3);

        // Draw deorbit spirals for debris that entered the gas zone
        for (let i = deorbitObjs.length - 1; i >= 0; i--) {
          const d = deorbitObjs[i];
          if (d.done) { deorbitObjs.splice(i, 1); continue; }
          d.prog += 0.0018;
          const obj = DEBRIS[d.ri][d.oi];
          const phi = obj.phi0 + t * obj.spd;
          const startR = R * RINGS[0].rf;
          const curR = Math.max(startR * (1 - d.prog * 0.94), R * 0.22);
          ctx.beginPath();
          for (let j = 0; j <= 35; j++) {
            const sp = phi - j * 0.13;
            const sr2 = Math.max(startR * (1 - (d.prog - j * 0.001) * 0.94), R * 0.22);
            const p = op(cx, cy, sr2, sp);
            j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
          }
          ctx.strokeStyle = `rgba(42,232,164,${(0.35 * (1 - d.prog)).toFixed(2)})`;
          ctx.lineWidth = 1; ctx.stroke();
          const pos = op(cx, cy, curR, phi);
          if (curR <= R * 0.26) {
            d.burnA = Math.min(1, d.burnA + 0.03);
            const bg = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, R * 0.25);
            bg.addColorStop(0, `rgba(255,210,60,${d.burnA})`);
            bg.addColorStop(0.4, `rgba(255,110,20,${d.burnA * 0.5})`);
            bg.addColorStop(1, 'rgba(255,40,0,0)');
            ctx.beginPath(); ctx.arc(pos.x, pos.y, R * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = bg; ctx.fill();
            if (d.burnA >= 0.99) d.done = true;
          } else if (pos.z > -0.1) {
            ctx.beginPath(); ctx.arc(pos.x, pos.y, obj.sz * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = '#2AE8A4'; ctx.fill();
          }
        }
      }

      /* ══════════════════ GAS DRAG MODE ════════════════════════════ */
      if (m === 'gas') {
        const dispPhi = t * 0.11;
        const dispR   = R * 1.54;
        const dispPos = op(cx, cy, dispR, dispPhi);

        // Xenon cloud
        const cloudR = R * 1.05;
        const cA = 0.05 + 0.018 * Math.sin(t * 0.85);
        const cg = ctx.createRadialGradient(dispPos.x, dispPos.y, 0, dispPos.x, dispPos.y, cloudR);
        cg.addColorStop(0, `rgba(42,232,164,${cA * 3.5})`);
        cg.addColorStop(0.35, `rgba(42,232,164,${cA})`);
        cg.addColorStop(1, 'rgba(42,232,164,0)');
        ctx.beginPath(); ctx.arc(dispPos.x, dispPos.y, cloudR, 0, Math.PI * 2);
        ctx.fillStyle = cg; ctx.fill();

        // Also draw a persistent torus-like cloud around the inner ring
        const torusR = R * RINGS[0].rf;
        const tg = ctx.createRadialGradient(cx, cy, torusR * 0.80, cx, cy, torusR * 1.25);
        tg.addColorStop(0, 'rgba(42,232,164,0)');
        tg.addColorStop(0.4, 'rgba(42,232,164,0.04)');
        tg.addColorStop(0.7, 'rgba(42,232,164,0.03)');
        tg.addColorStop(1, 'rgba(42,232,164,0)');
        ctx.beginPath(); ctx.arc(cx, cy, torusR * 1.25, 0, Math.PI * 2);
        ctx.fillStyle = tg; ctx.fill();

        // Emit gas particles
        if (Math.random() < 0.38) {
          const ang = Math.random() * Math.PI * 2;
          gasParticles.push({
            x: dispPos.x, y: dispPos.y,
            vx: Math.cos(ang) * (0.35 + Math.random() * 0.9),
            vy: Math.sin(ang) * (0.18 + Math.random() * 0.45),
            life: 1.0, r: 0.8 + Math.random() * 2.2,
          });
        }
        for (let i = gasParticles.length - 1; i >= 0; i--) {
          const p = gasParticles[i];
          p.x += p.vx; p.y += p.vy; p.life -= 0.007;
          if (p.life <= 0) { gasParticles.splice(i, 1); continue; }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(42,232,164,${(p.life * 0.40).toFixed(2)})`; ctx.fill();
        }

        // Deorbit events
        if (t >= nextDeorbit && deorbitObjs.length < 5) {
          const ri = Math.floor(Math.random() * 3);
          const oi = Math.floor(Math.random() * RINGS[ri].n);
          if (!deorbitObjs.some(d => d.ri === ri && d.oi === oi)) {
            deorbitObjs.push({ ri, oi, prog: 0, burnA: 0, done: false });
          }
          nextDeorbit = t + 3.0 + Math.random() * 2.5;
        }

        // Deorbit spirals
        for (let i = deorbitObjs.length - 1; i >= 0; i--) {
          const d = deorbitObjs[i];
          if (d.done) { deorbitObjs.splice(i, 1); continue; }
          d.prog += 0.0015;
          const obj = DEBRIS[d.ri][d.oi];
          const phi = obj.phi0 + t * obj.spd;
          const startR = R * obj.rf;
          const curR = Math.max(startR * (1 - d.prog * 0.93), R * 0.22);
          ctx.beginPath();
          for (let j = 0; j <= 40; j++) {
            const sp = phi - j * 0.13;
            const sr2 = Math.max(startR * (1 - (d.prog - j * 0.0007) * 0.93), R * 0.22);
            const p = op(cx, cy, sr2, sp);
            j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
          }
          ctx.strokeStyle = `rgba(212,80,80,${(0.42 * (1 - d.prog)).toFixed(2)})`;
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

        // Dispenser satellite
        if (dispPos.z > -0.15) {
          ctx.save(); ctx.translate(dispPos.x, dispPos.y);
          ctx.fillStyle = '#1AE89A'; ctx.fillRect(-7, -4, 14, 8);
          ctx.fillStyle = '#0E9E66'; ctx.fillRect(-19, -2.5, 10, 5); ctx.fillRect(9, -2.5, 10, 5);
          const ng = ctx.createRadialGradient(0,0,0,0,0,14);
          ng.addColorStop(0, 'rgba(42,232,164,0.55)'); ng.addColorStop(1, 'rgba(42,232,164,0)');
          ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(0,0,14,0,Math.PI*2); ctx.fill();
          ctx.restore();
          ctx.font = '9px IBM Plex Mono, monospace';
          ctx.fillStyle = 'rgba(42,232,164,0.78)';
          ctx.fillText('GAS DISPENSER', dispPos.x + 18, dispPos.y - 9);
          ctx.fillStyle = 'rgba(42,232,164,0.45)';
          ctx.fillText('Xe // VENTING', dispPos.x + 18, dispPos.y + 3);
        }
      }

      /* ── FRONT-HALF debris ── */
      activeRings.forEach(ri => {
        DEBRIS[ri].forEach((obj, oi) => {
          if (m === 'gas' && deorbitObjs.some(d => d.ri === ri && d.oi === oi)) return;
          if (m === 'laser') {
            const nt = NUDGE_TARGETS.find(n => n.ri === ri && n.oi === oi);
            if (nt) return; // handled separately
          }
          const phi = obj.phi0 + t * obj.spd;
          const pos = op(cx, cy, R * obj.rf, phi);
          if (pos.z < -0.05) return;
          // Trail
          const tp = op(cx, cy, R * obj.rf, phi - 0.13);
          ctx.beginPath(); ctx.moveTo(pos.x, pos.y); ctx.lineTo(tp.x, tp.y);
          ctx.strokeStyle = RINGS[ri].col + '3E'; ctx.lineWidth = obj.sz * 0.6; ctx.stroke();
          // Dot
          ctx.beginPath(); ctx.arc(pos.x, pos.y, obj.sz, 0, Math.PI * 2);
          ctx.fillStyle = RINGS[ri].col; ctx.fill();
        });
      });

      /* ── Altitude labels ── */
      ctx.font = '8px IBM Plex Mono, monospace';
      guideRings.slice(0, 3).forEach((gr) => {
        const lx = cx + gr.r + 6;
        ctx.fillStyle = 'rgba(90,110,160,0.60)';
        ctx.fillText(gr.label, lx, cy - 3);
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  /* ─── Tab / stats config ─── */
  const MODES: Record<Mode, { col: string; label: string; desc: string; stats: {k:string;v:string}[] }> = {
    laser: {
      col: '#D45050',
      label: 'STAGE 01 — LASER NUDGE',
      desc: 'Ground-based pulsed laser lowers the orbit of tracked debris into the 500–600 km gas drag zone. No contact. No capture.',
      stats: [
        { k: 'TECHNOLOGY', v: 'PULSED LASER ABLATION' },
        { k: 'STATUS', v: 'DEMONSTRATED IN LAB' },
        { k: 'Δv PER PASS', v: '~1 MM/S' },
        { k: 'TARGET DROP', v: '50–200 KM INTO GAS ZONE' },
      ],
    },
    gas: {
      col: '#2AE8A4',
      label: 'STAGE 02 — GAS DRAG',
      desc: 'Xenon gas maintained at 500–600 km passively slows laser-nudged debris. Thousands of objects affected per release. Zero contact.',
      stats: [
        { k: 'AGENT', v: 'XENON / ARGON / KRYPTON' },
        { k: 'ALTITUDE BAND', v: '500–600 KM' },
        { k: 'CONTACT', v: 'NONE' },
        { k: 'OBJECTS / RELEASE', v: '1,000+' },
      ],
    },
  };

  const cfg = MODES[mode];
  const mono2 = 'IBM Plex Mono, monospace';

  return (
    <div style={{ backgroundColor: '#080b11', border: '1px solid rgba(255,255,255,0.09)', overflow: 'hidden' }}>

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
                flex: 1, padding: '15px 12px',
                fontFamily: mono2, fontSize: '11px', letterSpacing: '0.10em',
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
      <canvas ref={canvasRef} style={{ width: '100%', height: '620px', display: 'block' }} />

      {/* ── Description + stats ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(0,0,0,0.22)' }}>
        <div style={{ padding: '14px 28px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <p style={{ fontFamily: mono2, fontSize: '12px', color: '#7E8898', lineHeight: 1.80, margin: 0 }}>
            <span style={{ color: cfg.col }}>▶ </span>{cfg.desc}
          </p>
        </div>
        <div style={{ padding: '14px 28px 16px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
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
