'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import CountUp from '@/components/CountUp';
import Footer from '@/components/Footer';

const ParticleCanvas = dynamic(() => import('@/components/ParticleCanvas'), { ssr: false });

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

const solutionCards = [
  {
    tag: 'STAGE 01 // ALL ALTITUDES',
    headline: 'Laser Nudge',
    body: 'A ground-based pulsed laser vaporises a tiny amount of debris surface — enough to push it into a lower orbit. Precision targeting without any physical contact, nudging objects into the gas drag zone.',
    stat: '~1 mm/s Δv per pass',
  },
  {
    tag: 'STAGE 02 // 500–600KM',
    headline: 'Gas Drag',
    body: 'Xenon gas maintained at 500–600 km passively slows every piece of debris that enters the corridor. Once nudged into the zone, objects spiral inward and burn up in the atmosphere. No contact. Thousands at once.',
    stat: 'Thousands of objects per release',
  },
];

const economics = [
  { value: '$2–4B', label: 'Total Kepler 13 system cost over 15 years' },
  { value: '$280B', label: 'Annual satellite economy protected' },
  { value: '100×', label: 'Economic benefit vs cost ratio (NASA analysis)' },
  { value: '2027', label: 'Kepler 13 Phase 1 deployment target' },
];

export default function Home() {
  return (
    <main style={{ backgroundColor: C.bg, minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        height: '100vh',
        minHeight: '700px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <ParticleCanvas />
        <div className="scanlines" />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(8,10,15,0.85) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(transparent, #080A0F)',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: '800px', padding: '0 24px' }}>
          <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.12em', color: C.accent, marginBottom: '24px' }}>
            ORBITAL DEBRIS REMOVAL SYSTEM // KEPLER 13
          </div>
          <h1 style={{
            fontFamily: syne, fontWeight: 800,
            fontSize: 'clamp(52px, 8vw, 88px)',
            lineHeight: 1.05, color: C.textPrimary,
            marginBottom: '28px', letterSpacing: '-0.01em',
          }}>
            The orbit is<br />already broken.
          </h1>
          <p style={{ fontFamily: mono, fontSize: '17px', color: C.textSecondary, marginBottom: '40px', lineHeight: 1.7 }}>
            9,000 tonnes. 130 million fragments.<br />
            The Kessler threshold is not a future event.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/solution" style={{
              display: 'inline-block', fontFamily: mono, fontSize: '13px',
              letterSpacing: '0.06em', color: '#fff', textDecoration: 'none',
              padding: '13px 28px', background: C.accent, transition: 'all 200ms ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#5590FF'; e.currentTarget.style.boxShadow = '0 0 32px rgba(59,123,255,0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; e.currentTarget.style.boxShadow = 'none'; }}
            >
              VIEW THE PLAN →
            </Link>
            <Link href="/solution#technology" style={{
              display: 'inline-block', fontFamily: mono, fontSize: '13px',
              letterSpacing: '0.06em', color: C.textPrimary, textDecoration: 'none',
              padding: '13px 28px', border: `1px solid ${C.borderDefault}`, transition: 'all 200ms ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderDefault; e.currentTarget.style.color = C.textPrimary; }}
            >
              READ THE PHYSICS
            </Link>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div style={{
        overflow: 'hidden', backgroundColor: C.surface,
        borderTop: `1px solid ${C.borderSubtle}`, borderBottom: `1px solid ${C.borderSubtle}`,
        padding: '12px 0',
      }}>
        <div className="ticker-inner" style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.1em', color: C.textTertiary }}>
          {'DEBRIS DENSITY: CRITICAL // ALTITUDE BAND: 700–1000KM // KESSLER INDEX: 0.94 // COLLISION PROBABILITY: RISING // KEPLER 13: ONLINE 2027 // DEBRIS DENSITY: CRITICAL // ALTITUDE BAND: 700–1000KM // KESSLER INDEX: 0.94 // COLLISION PROBABILITY: RISING // KEPLER 13: ONLINE 2027 // DEBRIS DENSITY: CRITICAL // ALTITUDE BAND: 700–1000KM // KESSLER INDEX: 0.94 // COLLISION PROBABILITY: RISING // KEPLER 13: ONLINE 2027 //'}
        </div>
      </div>

      {/* ── THE PROBLEM ── */}
      <section style={{ backgroundColor: C.surface, padding: '120px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.12em', color: C.accent, marginBottom: '16px', textTransform: 'uppercase' as const }}>
              THE PROBLEM
            </div>
            <h2 style={{ fontFamily: syne, fontWeight: 700, fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.1, color: C.textPrimary, marginBottom: '64px' }}>
              Nobody owns<br />this problem.
            </h2>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'start' }}>
            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                {
                  node: <><CountUp target={130000000} suffix="+" duration={1800} /></>,
                  label: 'fragments smaller than 1cm',
                },
                {
                  node: <><CountUp target={9000} duration={1400} /><span style={{ fontFamily: mono, fontSize: '0.5em' }}> t</span></>,
                  label: 'tonnes total debris mass in LEO',
                },
                {
                  node: <><span>$</span><CountUp target={280} duration={1200} /><span>B/yr</span></>,
                  label: 'annual satellite economy at risk',
                },
                {
                  node: <><CountUp target={94} duration={1000} /><span style={{ fontFamily: mono, fontSize: '0.55em' }}>/100</span></>,
                  label: 'estimated Kessler index, 700–1000km',
                },
              ].map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 80}>
                  <div className="card-hover" style={{
                    backgroundColor: C.surfaceElevated,
                    borderTop: `1px solid ${C.borderSubtle}`,
                    borderRight: `1px solid ${C.borderSubtle}`,
                    borderBottom: `1px solid ${C.borderSubtle}`,
                    borderLeft: `3px solid ${C.danger}`,
                    padding: '24px 20px',
                  }}>
                    <div style={{ fontFamily: syne, fontWeight: 800, fontSize: 'clamp(22px, 2.5vw, 34px)', color: C.textPrimary, lineHeight: 1.1, marginBottom: '10px' }}>
                      {stat.node}
                    </div>
                    <div style={{ fontFamily: mono, fontSize: '11px', color: C.textTertiary, letterSpacing: '0.04em', lineHeight: 1.5 }}>
                      {stat.label}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Body text */}
            <ScrollReveal delay={200}>
              <p style={{ fontFamily: mono, fontSize: '15px', color: C.textSecondary, lineHeight: 2, marginBottom: '24px' }}>
                Right now, approximately{' '}
                <span style={{ color: C.accent }}>9,000 tonnes</span>
                {' '}of human-made debris hurtles around Earth at{' '}
                <span style={{ color: C.accent }}>7.8 kilometres per second</span>.
                Every hypervelocity collision generates a debris cloud. Each fragment
                is now its own collision risk. At a critical debris spatial density —
                the <span style={{ color: C.accent }}>Kessler threshold</span> — the
                collision rate becomes self-sustaining regardless of whether humanity
                ever launches another rocket.
              </p>
              <p style={{ fontFamily: mono, fontSize: '15px', color: C.textSecondary, lineHeight: 2 }}>
                The cascade is autocatalytic. The 1967 Outer Space Treaty assigns
                sovereign ownership of debris to the nation that launched it. No actor
                can legally touch another nation&apos;s junk without bilateral permission.
                The incentive structure for granting that permission is{' '}
                <span style={{ color: C.accent }}>vanishingly weak</span>.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="section-separator" />

      {/* ── SOLUTION TEASER ── */}
      <section style={{ backgroundColor: C.bg, padding: '120px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.12em', color: C.accent, marginBottom: '16px' }}>
              THE SOLUTION
            </div>
            <h2 style={{ fontFamily: syne, fontWeight: 700, fontSize: 'clamp(32px, 4vw, 48px)', color: C.textPrimary, marginBottom: '64px' }}>
              Kepler 13 // Three-layer deorbit system
            </h2>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2px' }}>
            {solutionCards.map((card, i) => (
              <ScrollReveal key={card.headline} delay={i * 120}>
                <div className="card-hover" style={{
                  backgroundColor: C.surface, border: `1px solid ${C.borderSubtle}`,
                  padding: '40px 32px', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px',
                }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" stroke="rgba(59,123,255,0.35)" strokeWidth="1" />
                    <circle cx="16" cy="16" r="2" fill={C.accent} />
                    <path d="M16 2 A14 14 0 0 1 30 16" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.12em', color: C.accent }}>
                    {card.tag}
                  </div>
                  <div style={{ fontFamily: syne, fontWeight: 700, fontSize: '22px', color: C.textPrimary }}>
                    {card.headline}
                  </div>
                  <p style={{ fontFamily: mono, fontSize: '13px', color: C.textSecondary, lineHeight: 1.9, flex: 1 }}>
                    {card.body}
                  </p>
                  <div style={{ fontFamily: mono, fontSize: '12px', color: C.success, paddingTop: '16px', borderTop: `1px solid ${C.borderSubtle}` }}>
                    {card.stat}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={300}>
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link href="/solution" style={{
                fontFamily: mono, fontSize: '13px', letterSpacing: '0.08em',
                color: C.accent, textDecoration: 'none', transition: 'opacity 200ms ease',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                FULL TECHNICAL BREAKDOWN →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-separator" />

      {/* ── ECONOMICS STRIP ── */}
      <section style={{ backgroundColor: C.surface, padding: '80px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
            {economics.map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 80}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: syne, fontWeight: 800, fontSize: 'clamp(36px, 4vw, 52px)', color: C.textPrimary, lineHeight: 1.1, marginBottom: '12px' }}>
                    {item.value}
                  </div>
                  <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em', color: C.textTertiary, lineHeight: 1.6, maxWidth: '180px', margin: '0 auto' }}>
                    {item.label}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-separator" />

      {/* ── MISSION STATEMENT ── */}
      <section style={{ position: 'relative', backgroundColor: C.bg, padding: '140px 40px', textAlign: 'center', overflow: 'hidden' }}>
        <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '700px', opacity: 0.04, pointerEvents: 'none' }} viewBox="0 0 700 700" fill="none">
          <ellipse cx="350" cy="350" rx="300" ry="120" stroke="white" strokeWidth="1" />
          <ellipse cx="350" cy="350" rx="220" ry="88" stroke="white" strokeWidth="0.8" />
          <ellipse cx="350" cy="350" rx="140" ry="56" stroke="white" strokeWidth="0.6" />
        </svg>
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.14em', color: C.accent, marginBottom: '40px' }}>
              CLERK // MISSION STATEMENT
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 style={{ fontFamily: syne, fontWeight: 700, fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.1, color: C.textPrimary, marginBottom: '32px' }}>
              We are not inventing<br />a solution.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p style={{ fontFamily: mono, fontSize: '17px', color: C.textSecondary, lineHeight: 1.9, maxWidth: '560px', margin: '0 auto' }}>
              We are finally choosing to use<br />
              the one the planet already built.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
