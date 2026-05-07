'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import ScrollReveal from '@/components/ScrollReveal';
import Footer from '@/components/Footer';

const OrbitalDemo = dynamic(() => import('@/components/OrbitalDemo'), { ssr: false });

const C = {
  bg: '#0F1219',
  surface: '#141A26',
  surfaceElevated: '#1A2232',
  borderSubtle: 'rgba(255,255,255,0.08)',
  borderDefault: 'rgba(255,255,255,0.14)',
  textPrimary: '#DDE1EC',
  textSecondary: '#7E8898',
  textTertiary: '#4E5868',
  accent: '#5B8FFF',
  danger: '#D45050',
  success: '#1AB88A',
};

const syne = 'Syne, sans-serif';
const mono = 'IBM Plex Mono, monospace';

const phases = [
  {
    num: '01',
    name: 'Laser Nudge',
    band: 'ALL ALTITUDES',
    feasibility: 'HIGH — ALREADY DEMONSTRATED',
    feasibilityPct: 88,
    equation: `Method: pulsed laser from ground station
Contact: none
Power: 100kW ground array
Effect per pass: ~1mm/s velocity change
Target: tracked debris 500–2,000 km`,
    body: `A ground-based laser fires short, high-power pulses at a tracked piece of debris as it passes overhead. Each pulse vaporises a tiny amount of surface material — that vapour jets outward, pushing the object in the opposite direction.

It's slow and deliberate. But it doesn't need to stop the debris entirely. It just needs to nudge it — lowering its orbit by a few kilometres until it enters the xenon gas cloud at 500–600 km.

Laser ablation is already demonstrated physics. Ground stations exist. The targeting is proven. This is the precision layer of Kepler 13.`,
    svgPath: 'M100,150 L350,50 L700,150',
    extra: {
      problemTitle: 'THE STRATEGIC ROLE',
      problem: `The laser is not trying to deorbit debris by itself. That would take years of passes and enormous power. Its only job is to push debris from higher orbits into the 500–600 km corridor where the gas cloud operates. A drop of just 50–200 km is enough. That is achievable in weeks, not years.`,
      methodTitle: 'METHOD // GROUND-BASED LASER ARRAY',
      methodTag: 'PROVEN PHYSICS',
      method: `A network of ground stations — ideally at multiple latitudes — track known debris objects and fire timed pulses during each overhead pass. Each pass delivers a small Δv. After enough passes, the debris orbit decays into the gas drag zone.

The transparency problem is real: firing lasers at objects in orbit is politically sensitive. Clerk publishes its full target list, firing schedule, and predicted trajectories publicly before every session. Full transparency is the political solution.

Ground-based laser ablation has been demonstrated in laboratory conditions. The hardware exists. The physics is settled. The remaining challenge is scale and political coordination — not feasibility.`,
    },
  },
  {
    num: '02',
    name: 'Gas Drag',
    band: '500–600 KM',
    feasibility: 'HIGH',
    feasibilityPct: 92,
    equation: `Altitude: 500–600km
Method: xenon gas injection
Contact: none
Coverage: thousands of objects at once
Replenishment: every few days`,
    body: `Once debris has been nudged into the 500–600 km corridor by the laser system, it enters the gas cloud. We maintain a persistent xenon gas density in this band — thin enough that it doesn't affect functioning satellites, thick enough to matter for debris.

Every fragment that passes through loses a little velocity. Not much — but enough. Over weeks and months, the drag accumulates. The orbit decays. The debris spirals inward and burns up in the atmosphere.

No tracking. No contact. No individual targeting. The laser does the precision work; the gas cloud does the scale work. They are designed for each other.`,
    svgPath: 'M100,100 Q250,60 400,100 Q550,140 700,100',
    extra: {
      problemTitle: 'THE CORE PROBLEM',
      problem: `To make gas drag work, you need to get 1,000 to 10,000 kg of inert gas — xenon, argon, or krypton — into a precise orbital corridor at 500 to 600 km altitude, release it in a controlled plume, and do it repeatedly and cheaply enough that the economics still work.`,
      methodTitle: 'METHOD // DEDICATED GAS PAYLOAD SATELLITES',
      methodTag: 'MOST FEASIBLE',
      method: `Small orbital platforms — roughly 200 to 400 kg each — carry pressurised gas tanks and a precision valve release system. They sit in the target orbital band permanently and release metered gas bursts timed to coincide with debris-dense corridor transits.

This is essentially the same hardware as an ion propulsion xenon tank, just much larger and venting outward rather than through a thruster nozzle.

A SpaceX Falcon 9 can put roughly 22,000 kg into LEO for about $67M. A single launch could carry multiple gas platforms. The gas itself — industrial xenon — costs roughly $800 to $1,200 per kg on Earth. Getting it to orbit is the expensive part. That is exactly why the economics of this approach are the biggest unresolved challenge.`,
    },
  },
];

const timelinePhases = [
  { num: '01', name: 'Laser Station Deployment', years: '2027–2028', desc: 'Ground-based laser array commissioned. Initial target list published. First precision nudge operations on tracked high-risk objects.', status: 'DEVELOPMENT' },
  { num: '02', name: 'Gas Cloud Deployment', years: '2027–2028', desc: 'Xenon injection platforms deployed to 500–600km corridor. Gas density brought to operational levels. Laser-nudged debris begins entering the drag zone.', status: 'DEVELOPMENT' },
  { num: '03', name: 'Combined Operations', years: '2028–2030', desc: 'Laser and gas systems operating in concert. Debris nudged into corridor; gas drag handles mass deorbit. First measurable reduction in fragment density.', status: 'DESIGN' },
  { num: '04', name: 'LEO Stabilisation', years: '2030+', desc: 'Sustained two-layer operations. New debris generation offset by removal rate. LEO debris density plateau broken for the first time.', status: 'ONGOING' },
];

const statusColors: Record<string, string> = {
  DEVELOPMENT: '#3B7BFF',
  DESIGN: '#8A909C',
  ONGOING: '#2AE8A4',
};

export default function Solution() {
  return (
    <main style={{ backgroundColor: C.bg, minHeight: '100vh' }}>

      {/* ── HERO — full-bleed Earth limb ── */}
      <section style={{ position: 'relative', height: '65vh', minHeight: '480px', overflow: 'hidden' }}>
        <div className="ken-burns" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/earth-globe.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(8,10,15,0.94) 0%, rgba(8,10,15,0.70) 45%, rgba(8,10,15,0.25) 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px',
          background: 'linear-gradient(transparent, #0F1219)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'absolute', bottom: '12%', left: '7%', maxWidth: '700px' }}>
          <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.16em', color: C.accent, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '22px', height: '1px', backgroundColor: C.accent }} />
            KEPLER 13 // CONTACTLESS DEORBIT SYSTEM
          </div>
          <h1 style={{ fontFamily: syne, fontWeight: 800, fontSize: 'clamp(40px, 6vw, 76px)', lineHeight: 1.0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            We don&apos;t catch debris.<br />We convince it to fall.
          </h1>
        </div>
      </section>

      {/* ── WHY CAPTURE IS WRONG ── */}
      <section style={{ backgroundColor: C.surface, padding: '100px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '64px', alignItems: 'start' }}>
            <ScrollReveal>
              <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.12em', color: C.accent, marginBottom: '16px' }}>
                WHY CAPTURE IS THE WRONG FRAME
              </div>
              <h2 style={{ fontFamily: syne, fontWeight: 700, fontSize: 'clamp(28px, 3.5vw, 44px)', lineHeight: 1.15, color: C.textPrimary, marginBottom: '28px' }}>
                The problem isn&apos;t<br />technical. It&apos;s economic.
              </h2>
              <p style={{ fontFamily: mono, fontSize: '14px', color: C.textSecondary, lineHeight: 2, marginBottom: '20px' }}>
                Robotic capture and harpoon systems approach debris removal as an individual object problem. Each piece of debris becomes a separate mission, a separate cost centre, a separate liability.
              </p>
              <p style={{ fontFamily: mono, fontSize: '14px', color: C.textSecondary, lineHeight: 2 }}>
                With <span style={{ color: C.accent }}>130 million fragments</span> in LEO, this framing makes the problem permanently unsolvable. Kepler 13 uses laser precision to feed a passive gas drag system — handling millions of objects at a cost per fragment orders of magnitude lower than any capture approach.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="terminal-table">
                {`METHOD              COST/OBJECT    SCALABILITY    CONTACT
─────────────────────────────────────────────────────────
Robotic capture     $100–300M      LINEAR         YES
Harpoon             $50–150M       LINEAR         YES
Net capture         $75–200M       LIMITED        YES
Ion beam shepherd   $30–80M        MODERATE       NO
Laser ablation      $0.5–2M        HIGH           NO
Kepler 13           $0.02–0.1M     UNLIMITED      NO`}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="section-separator" />

      {/* ── THREE MECHANISMS ── */}
      <section id="technology" style={{ backgroundColor: C.bg, padding: '100px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.12em', color: C.accent, marginBottom: '16px' }}>
              THE THREE MECHANISMS
            </div>
            <h2 style={{ fontFamily: syne, fontWeight: 700, fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1, color: C.textPrimary, marginBottom: '12px' }}>
              Physics, applied.
            </h2>
            <p style={{ fontFamily: mono, fontSize: '13px', color: C.textTertiary, marginBottom: '48px', maxWidth: '560px', lineHeight: 1.8 }}>
              Live simulation — select a stage to see how the two-layer system works together.
            </p>
          </ScrollReveal>

          {/* ── Interactive 3D orbital demo ── */}
          <ScrollReveal delay={100}>
            <div style={{ marginBottom: '80px' }}>
              <OrbitalDemo />
            </div>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
            {phases.map((phase, i) => (
              <ScrollReveal key={phase.num} delay={80}>
                <div>
                  {/* Phase header */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: syne, fontWeight: 800, fontSize: '64px', color: 'rgba(59,123,255,0.15)', lineHeight: 1 }}>
                      {phase.num}
                    </span>
                    <div>
                      <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.12em', color: C.accent, marginBottom: '6px' }}>
                        ALTITUDE BAND: {phase.band}
                      </div>
                      <h3 style={{ fontFamily: syne, fontWeight: 700, fontSize: 'clamp(20px, 2.5vw, 28px)', color: C.textPrimary }}>
                        {phase.name}
                      </h3>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '40px', alignItems: 'start' }}>
                    {/* Equation + feasibility */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div className="code-block">{phase.equation}</div>

                      {/* Feasibility bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.1em', color: C.textTertiary }}>
                            FEASIBILITY
                          </span>
                          <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: C.accent }}>
                            {phase.feasibility}
                          </span>
                        </div>
                        <div style={{ height: '3px', backgroundColor: C.borderSubtle, width: '100%' }}>
                          <div style={{ height: '100%', width: `${phase.feasibilityPct}%`, backgroundColor: C.accent, transition: 'width 1s ease' }} />
                        </div>
                      </div>

                      {/* Simple SVG diagram */}
                      <svg viewBox="0 0 700 180" fill="none" style={{ width: '100%', height: '80px', opacity: 0.5 }}>
                        <path d={phase.svgPath} stroke={C.accent} strokeWidth="1.5" strokeDasharray={i === 2 ? '0' : '4 4'} strokeLinecap="round" />
                        {i === 0 && (
                          <>
                            {[150, 300, 450, 550].map((x) => (
                              <circle key={x} cx={x} cy={100 + Math.sin(x * 0.02) * 30} r="3" fill="rgba(255,255,255,0.4)" />
                            ))}
                          </>
                        )}
                        {i === 1 && (
                          <>
                            <line x1="300" y1="30" x2="300" y2="150" stroke="rgba(59,123,255,0.4)" strokeWidth="1" strokeDasharray="3 3" />
                            <circle cx="300" cy="90" r="5" fill={C.accent} />
                          </>
                        )}
                        {i === 2 && (
                          <>
                            <path d="M100,150 L200,50 L210,50" stroke="rgba(255,68,68,0.6)" strokeWidth="1" />
                            <circle cx="350" cy="50" r="8" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                          </>
                        )}
                      </svg>
                    </div>

                    {/* Body text */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {phase.body.split('\n\n').map((para, j) => (
                        <p key={j} style={{ fontFamily: mono, fontSize: '14px', color: C.textSecondary, lineHeight: 2 }}>
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Extra: Core Problem + Method (Phase 01 only) */}
                  {'extra' in phase && phase.extra && (
                    <div style={{ marginTop: '64px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
                      {/* Core Problem */}
                      <div style={{
                        borderLeft: `3px solid ${C.danger}`,
                        paddingLeft: '28px',
                      }}>
                        <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.12em', color: C.danger, marginBottom: '16px' }}>
                          {phase.extra.problemTitle}
                        </div>
                        <p style={{ fontFamily: mono, fontSize: '14px', color: C.textSecondary, lineHeight: 2 }}>
                          {phase.extra.problem}
                        </p>
                      </div>

                      {/* Method 01 */}
                      <div style={{
                        backgroundColor: C.surfaceElevated,
                        border: `1px solid ${C.borderSubtle}`,
                        padding: '36px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                          <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.12em', color: C.accent }}>
                            {phase.extra.methodTitle}
                          </div>
                          <span style={{
                            fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em',
                            color: C.success, border: `1px solid ${C.success}`,
                            padding: '3px 10px',
                          }}>
                            {phase.extra.methodTag}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {phase.extra.method.split('\n\n').map((para, j) => (
                            <p key={j} style={{ fontFamily: mono, fontSize: '14px', color: C.textSecondary, lineHeight: 2 }}>
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {i < phases.length - 1 && <div className="section-separator" style={{ marginTop: '100px' }} />}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-separator" />

      {/* ── TIMELINE ── */}
      <section style={{ backgroundColor: C.surface, padding: '100px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.12em', color: C.accent, marginBottom: '16px' }}>
              DEPLOYMENT TIMELINE
            </div>
            <h2 style={{ fontFamily: syne, fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: C.textPrimary, marginBottom: '64px' }}>
              Two systems. One mission.
            </h2>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2px' }}>
            {timelinePhases.map((phase, i) => (
              <ScrollReveal key={phase.num} delay={i * 100}>
                <div className="card-hover" style={{
                  backgroundColor: C.surfaceElevated, border: `1px solid ${C.borderSubtle}`,
                  padding: '32px 28px', height: '100%',
                }}>
                  <div style={{ fontFamily: syne, fontWeight: 800, fontSize: '40px', color: 'rgba(59,123,255,0.12)', lineHeight: 1, marginBottom: '16px' }}>
                    {phase.num}
                  </div>
                  <div style={{ fontFamily: syne, fontWeight: 700, fontSize: '17px', color: C.textPrimary, marginBottom: '8px' }}>
                    {phase.name}
                  </div>
                  <div style={{ fontFamily: mono, fontSize: '11px', color: C.accent, marginBottom: '16px' }}>
                    {phase.years}
                  </div>
                  <p style={{ fontFamily: mono, fontSize: '12px', color: C.textSecondary, lineHeight: 1.8, marginBottom: '20px' }}>
                    {phase.desc}
                  </p>
                  <div style={{
                    display: 'inline-block',
                    fontFamily: mono, fontSize: '10px', letterSpacing: '0.1em',
                    color: statusColors[phase.status] || C.textTertiary,
                    border: `1px solid ${statusColors[phase.status] || C.borderSubtle}`,
                    padding: '4px 10px',
                  }}>
                    {phase.status}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: C.bg, padding: '80px 40px', textAlign: 'center' }}>
        <ScrollReveal>
          <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.12em', color: C.textTertiary, marginBottom: '24px' }}>
            READY TO GO DEEPER?
          </div>
          <h2 style={{ fontFamily: syne, fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: C.textPrimary, marginBottom: '32px' }}>
            The physics are public.<br />The mission is clear.
          </h2>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/about" style={{
              display: 'inline-block', fontFamily: mono, fontSize: '13px',
              letterSpacing: '0.06em', color: '#fff', textDecoration: 'none',
              padding: '13px 28px', background: C.accent, transition: 'all 200ms ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#5590FF'; e.currentTarget.style.boxShadow = '0 0 32px rgba(59,123,255,0.35)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; e.currentTarget.style.boxShadow = 'none'; }}
            >
              MEET THE TEAM →
            </Link>
            <Link href="/about#contact" style={{
              display: 'inline-block', fontFamily: mono, fontSize: '13px',
              letterSpacing: '0.06em', color: C.textPrimary, textDecoration: 'none',
              padding: '13px 28px', border: `1px solid ${C.borderDefault}`, transition: 'all 200ms ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderDefault; e.currentTarget.style.color = C.textPrimary; }}
            >
              PARTNER WITH CLERK
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </main>
  );
}
