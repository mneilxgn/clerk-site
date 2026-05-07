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
    name: 'Gas Drag',
    band: '500–600 KM',
    feasibility: 'HIGH',
    feasibilityPct: 92,
    equation: `Altitude: 500–600km
Method: xenon gas injection
Contact: none
Coverage: thousands of objects at once
Replenishment: every few days`,
    body: `At 500–600km, the upper atmosphere is almost nothing — but not quite. We release a controlled cloud of xenon gas into this region, temporarily thickening it.

Debris passing through slows down. Not much — but enough. Over time, small amounts of drag add up and objects gradually spiral inward, re-entering the atmosphere naturally.

No tracking. No targeting. No physical contact. One release affects thousands of fragments at once. It's the closest thing to a passive cleanup system that physics allows.`,
    svgPath: 'M100,100 Q250,60 400,100 Q550,140 700,100',
    extra: {
      problemTitle: 'THE CORE PROBLEM',
      problem: `To make gas drag work, you need to get 1,000 to 10,000 kg of inert gas — xenon, argon, or krypton — into a precise orbital corridor at 500 to 600 km altitude, release it in a controlled plume, and do it repeatedly and cheaply enough that the economics still work.`,
      methodTitle: 'METHOD 01 // DEDICATED GAS PAYLOAD SATELLITES',
      methodTag: 'MOST FEASIBLE',
      method: `The baseline approach. Small orbital platforms — roughly 200 to 400 kg each — carry pressurised gas tanks and a precision valve release system. They sit in the target orbital band permanently and release metered gas bursts timed to coincide with debris-dense corridor transits.

This is essentially the same hardware as an ion propulsion xenon tank, just much larger and venting outward rather than through a thruster nozzle.

A SpaceX Falcon 9 can put roughly 22,000 kg into LEO for about $67M. A single launch could carry multiple gas platforms. The gas itself — industrial xenon — costs roughly $800 to $1,200 per kg on Earth. Getting it to orbit is the expensive part. That is exactly why the economics of this approach are the biggest unresolved challenge.`,
    },
  },
  {
    num: '02',
    name: 'Magnetic Braking',
    band: '700–900 KM',
    feasibility: 'MEDIUM-HIGH',
    feasibilityPct: 74,
    equation: `Altitude: 700–900km
Method: conducting tether in Earth's magnetic field
Contact: none
Propellant used: zero
Speed: 10–20× faster than natural decay`,
    body: `Earth has a magnetic field. A wire moving through a magnetic field generates electricity. That electricity creates a braking force — the same principle behind regenerative braking in electric cars, just in orbit.

We deploy a constellation of satellites with long conducting tethers. As they move through Earth's magnetic field at orbital speed, they generate a drag force that slowly pulls debris down — using no fuel at all.

The planet does the work. We just give it the right tool.`,
    svgPath: 'M100,120 C200,60 500,180 700,80',
  },
  {
    num: '03',
    name: 'Laser Nudge',
    band: 'ALL BANDS',
    feasibility: 'HIGH (PHYSICS) / MEDIUM (GEOPOLITICS)',
    feasibilityPct: 80,
    equation: `Method: pulsed laser from ground or orbit
Contact: none
Power: 100kW
Effect per pass: ~1mm/s slowdown
After 200 passes: enough to re-enter`,
    body: `For the most dangerous objects — large, tracked, on a collision course — we need precision. A powerful laser fires short pulses at the debris as it passes overhead.

Each pulse vaporises a tiny amount of surface material, which acts like a micro-thruster pushing the object in the opposite direction. It's slow. It's deliberate. After months of passes, the object has slowed just enough to fall into the upper atmosphere on its own.

No fuel. No contact. Just light.

The one real complication is political: firing a laser at another country's satellite — even dead ones — is sensitive. We publish our target list and schedule publicly. Full transparency is the solution.`,
    svgPath: 'M100,150 L350,50 L700,150',
  },
];

const timelinePhases = [
  { num: '01', name: 'Gas Drag Deployment', years: '2027–2028', desc: 'Xenon injection platforms deployed to 500–600km. Initial density enhancement operations begin.', status: 'DEVELOPMENT' },
  { num: '02', name: 'Tether Constellation', years: '2028–2030', desc: 'Electrodynamic tether nodes deployed to 700–900km band. Ionospheric circuit validation.', status: 'DESIGN' },
  { num: '03', name: 'Laser Grid Activation', years: '2030–2032', desc: 'Ground and space-based laser assets activated. High-risk object targeting begins under international transparency framework.', status: 'DESIGN' },
  { num: '04', name: 'Ongoing Operations', years: '2032+', desc: 'Full-band coverage. Self-sustaining debris removal at scale. LEO stabilisation.', status: 'ONGOING' },
];

const statusColors: Record<string, string> = {
  DEVELOPMENT: '#3B7BFF',
  DESIGN: '#8A909C',
  ONGOING: '#2AE8A4',
};

export default function Solution() {
  return (
    <main style={{ backgroundColor: C.bg, minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        paddingTop: '160px',
        paddingBottom: '100px',
        paddingLeft: '40px',
        paddingRight: '40px',
        overflow: 'hidden',
      }}>
        {/* Background orbital SVG */}
        <svg style={{
          position: 'absolute', top: '50%', right: '-100px',
          transform: 'translateY(-50%)', width: '600px', height: '400px',
          opacity: 0.06, pointerEvents: 'none',
        }} viewBox="0 0 600 400" fill="none">
          <ellipse cx="300" cy="200" rx="280" ry="160" stroke="white" strokeWidth="1" strokeDasharray="4 6" />
          <ellipse cx="300" cy="200" rx="200" ry="110" stroke="white" strokeWidth="0.8" strokeDasharray="4 6" />
          <circle cx="300" cy="200" r="20" stroke="rgba(59,123,255,0.6)" strokeWidth="1" />
          <circle cx="300" cy="200" r="6" fill="rgba(59,123,255,0.5)" />
        </svg>

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.12em', color: C.accent, marginBottom: '20px' }}>
              KEPLER 13 // CONTACTLESS DEORBIT SYSTEM
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 style={{ fontFamily: syne, fontWeight: 800, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.05, color: C.textPrimary, maxWidth: '700px' }}>
              Three layers.<br />One physics problem.<br />Zero contact.
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-separator" />

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
                With <span style={{ color: C.accent }}>130 million fragments</span> in LEO, this framing makes the problem permanently unsolvable. The physics of Kepler 13 operate at population level, not object level.
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
Kepler 13 (Phase1)  $0.02–0.1M     UNLIMITED      NO`}
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
              Live simulation — select a mechanism to see how each removal method operates in orbit.
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
              Four phases. One mission.
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
