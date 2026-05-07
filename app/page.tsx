'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import CountUp from '@/components/CountUp';
import Footer from '@/components/Footer';

const mono = 'IBM Plex Mono, monospace';
const syne = 'Syne, sans-serif';

const solutionCards = [
  {
    tag: 'STAGE 01 // ALL ALTITUDES',
    headline: 'Laser Nudge',
    body: 'A ground-based pulsed laser vaporises a tiny amount of debris surface — enough to push it into a lower orbit. Precision targeting without any physical contact, nudging objects into the gas drag zone.',
    stat: '~1 mm/s Δv per pass',
    color: '#D45050',
  },
  {
    tag: 'STAGE 02 // 500–600 KM',
    headline: 'Gas Drag',
    body: 'Xenon gas maintained at 500–600 km passively slows every piece of debris that enters the corridor. Once nudged in, objects spiral inward and burn up in the atmosphere. No contact. Thousands at once.',
    stat: '1,000+ objects per release',
    color: '#2AE8A4',
  },
];

const stats = [
  { node: <>130M+</>, label: 'fragments smaller than 1cm', big: true },
  { node: <>9,000t</>, label: 'total debris mass in LEO', big: true },
  { node: <>$280B</>, label: 'annual satellite economy at risk', big: true },
  { node: <>94/100</>, label: 'Kessler index in 700–1,000 km band', big: true },
];

export default function Home() {
  return (
    <main style={{ backgroundColor: '#080A0F' }}>

      {/* ── 1. HERO — full-bleed Earth photo ── */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '720px', overflow: 'hidden' }}>

        {/* Earth photo */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/earth-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
        }} />

        {/* Gradient left-to-right: dark left for text, transparent right to show photo */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(105deg, rgba(8,10,15,0.96) 0%, rgba(8,10,15,0.78) 38%, rgba(8,10,15,0.30) 70%, rgba(8,10,15,0.10) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Bottom fade into page */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '280px',
          background: 'linear-gradient(to top, #080A0F 0%, rgba(8,10,15,0.7) 50%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Content — left-aligned, lower third like SpaceX */}
        <div style={{
          position: 'absolute',
          bottom: '13%', left: '7%',
          maxWidth: '640px',
        }}>
          <div style={{
            fontFamily: mono, fontSize: '10px', letterSpacing: '0.16em',
            color: '#5B8FFF', marginBottom: '22px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <div style={{ width: '28px', height: '1px', backgroundColor: '#5B8FFF' }} />
            KEPLER 13 // CONTACTLESS DEORBIT SYSTEM
          </div>

          <h1 style={{
            fontFamily: syne, fontWeight: 800,
            fontSize: 'clamp(52px, 8vw, 96px)',
            lineHeight: 0.95, color: '#FFFFFF',
            marginBottom: '28px', letterSpacing: '-0.02em',
          }}>
            The orbit is<br />already broken.
          </h1>

          <p style={{
            fontFamily: mono, fontSize: '15px', color: 'rgba(220,225,235,0.70)',
            lineHeight: 1.75, marginBottom: '40px', maxWidth: '440px',
          }}>
            9,000 tonnes. 130 million fragments.<br />
            The Kessler threshold is not a future event.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              href="/solution"
              style={{
                fontFamily: mono, fontSize: '12px', letterSpacing: '0.08em',
                color: '#fff', textDecoration: 'none',
                padding: '13px 30px',
                background: '#5B8FFF',
                border: '1px solid #5B8FFF',
                transition: 'all 200ms ease',
                display: 'inline-block',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#4A7AEE'; e.currentTarget.style.boxShadow = '0 0 28px rgba(91,143,255,0.40)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#5B8FFF'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              VIEW THE PLAN →
            </Link>
            <Link
              href="/solution#technology"
              style={{
                fontFamily: mono, fontSize: '12px', letterSpacing: '0.08em',
                color: 'rgba(220,225,235,0.85)', textDecoration: 'none',
                padding: '13px 30px',
                border: '1px solid rgba(255,255,255,0.22)',
                transition: 'all 200ms ease',
                display: 'inline-block',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#5B8FFF'; e.currentTarget.style.color = '#5B8FFF'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = 'rgba(220,225,235,0.85)'; }}
            >
              READ THE PHYSICS
            </Link>
          </div>
        </div>

        {/* Scroll indicator — bottom right */}
        <div style={{
          position: 'absolute', bottom: '4%', right: '6%',
          fontFamily: mono, fontSize: '9px', letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.28)',
          display: 'flex', alignItems: 'center', gap: '8px',
          writingMode: 'vertical-rl',
        }}>
          SCROLL
        </div>
      </section>

      {/* ── Ticker ── */}
      <div style={{
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '11px 0',
        backgroundColor: '#0A0D13',
      }}>
        <div className="ticker-inner" style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.12em', color: '#4E5868' }}>
          {'DEBRIS DENSITY: CRITICAL // ALTITUDE BAND: 500–1000KM // KESSLER INDEX: 0.94 // COLLISION PROBABILITY: RISING // KEPLER 13: PHASE 1 TARGET 2027 // LASER ABLATION: DEMONSTRATED // GAS DRAG: PASSIVE // CONTACT REQUIRED: NONE // DEBRIS DENSITY: CRITICAL // ALTITUDE BAND: 500–1000KM // KESSLER INDEX: 0.94 // COLLISION PROBABILITY: RISING // KEPLER 13: PHASE 1 TARGET 2027 // LASER ABLATION: DEMONSTRATED // GAS DRAG: PASSIVE // CONTACT REQUIRED: NONE //'}
        </div>
      </div>

      {/* ── 2. THE PROBLEM — split: dark text left / Earth photo right ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '90vh' }}>

        {/* Left: dark panel with text */}
        <div style={{
          backgroundColor: '#0A0D13',
          padding: 'clamp(60px, 8vw, 120px) clamp(40px, 6vw, 100px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.16em', color: '#5B8FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '22px', height: '1px', backgroundColor: '#5B8FFF' }} />
              THE PROBLEM
            </div>
            <h2 style={{ fontFamily: syne, fontWeight: 800, fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1.0, color: '#DDE1EC', marginBottom: '48px' }}>
              Nobody owns<br />this problem.
            </h2>
          </ScrollReveal>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '48px' }}>
            {[
              { value: '130M+', label: 'fragments under 1cm' },
              { value: '9,000t', label: 'total debris in LEO' },
              { value: '$280B', label: 'satellite economy at risk/yr' },
              { value: '94/100', label: 'Kessler index 700–1000km' },
            ].map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 60}>
                <div style={{
                  backgroundColor: '#0D1018',
                  borderLeft: '3px solid #D45050',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  padding: '22px 18px',
                }}>
                  <div style={{ fontFamily: syne, fontWeight: 800, fontSize: 'clamp(20px, 2.2vw, 28px)', color: '#DDE1EC', lineHeight: 1.1, marginBottom: '8px' }}>
                    {s.value}
                  </div>
                  <div style={{ fontFamily: mono, fontSize: '10px', color: '#4E5868', letterSpacing: '0.04em', lineHeight: 1.5 }}>
                    {s.label}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={200}>
            <p style={{ fontFamily: mono, fontSize: '13px', color: '#7E8898', lineHeight: 2.0, marginBottom: '18px' }}>
              Right now, approximately <span style={{ color: '#5B8FFF' }}>9,000 tonnes</span> of human-made debris hurtles around Earth at <span style={{ color: '#5B8FFF' }}>7.8 km/s</span>. Every hypervelocity collision generates a debris cloud. Each fragment is now its own collision risk.
            </p>
            <p style={{ fontFamily: mono, fontSize: '13px', color: '#7E8898', lineHeight: 2.0 }}>
              The 1967 Outer Space Treaty assigns ownership to the launching nation. No actor can touch another nation&apos;s debris without bilateral permission. The incentive to grant that permission is <span style={{ color: '#5B8FFF' }}>vanishingly weak</span>.
            </p>
          </ScrollReveal>
        </div>

        {/* Right: Earth limb photo */}
        <div style={{
          backgroundImage: 'url(/earth-limb.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '500px',
          position: 'relative',
        }}>
          {/* Subtle left-edge fade to dark */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(10,13,19,0.55) 0%, transparent 40%)',
          }} />
        </div>
      </section>

      {/* ── 3. SOLUTION — full-bleed space photo with cards on top ── */}
      <section style={{
        position: 'relative',
        backgroundImage: 'url(/space-dark.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '140px clamp(24px, 5vw, 80px)',
      }}>
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(8,10,15,0.82)' }} />
        {/* Top/bottom edge fade */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(#080A0F, transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(transparent, #080A0F)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.16em', color: '#5B8FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '22px', height: '1px', backgroundColor: '#5B8FFF' }} />
              THE SOLUTION
            </div>
            <h2 style={{ fontFamily: syne, fontWeight: 800, fontSize: 'clamp(34px, 4.5vw, 54px)', color: '#DDE1EC', marginBottom: '16px', lineHeight: 1.05 }}>
              Kepler 13 // Two-stage deorbit system
            </h2>
            <p style={{ fontFamily: mono, fontSize: '13px', color: '#7E8898', marginBottom: '64px', maxWidth: '520px', lineHeight: 1.85 }}>
              Laser nudge pushes debris into the gas drag zone. Gas drag handles the mass removal. Two proven physics principles, working as one.
            </p>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2px' }}>
            {solutionCards.map((card, i) => (
              <ScrollReveal key={card.headline} delay={i * 120}>
                <div style={{
                  backgroundColor: 'rgba(10,13,20,0.90)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderTop: `3px solid ${card.color}`,
                  padding: '44px 36px',
                  height: '100%',
                  display: 'flex', flexDirection: 'column', gap: '16px',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 200ms ease',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(14,18,28,0.96)'; (e.currentTarget as HTMLDivElement).style.borderColor = card.color + '50'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(10,13,20,0.90)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.10)'; }}
                >
                  <div style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '0.14em', color: card.color }}>
                    {card.tag}
                  </div>
                  <div style={{ fontFamily: syne, fontWeight: 700, fontSize: '26px', color: '#DDE1EC' }}>
                    {card.headline}
                  </div>
                  <p style={{ fontFamily: mono, fontSize: '13px', color: '#7E8898', lineHeight: 1.95, flex: 1 }}>
                    {card.body}
                  </p>
                  <div style={{
                    fontFamily: mono, fontSize: '11px', color: card.color,
                    paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.07)',
                  }}>
                    {card.stat}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={280}>
            <div style={{ marginTop: '52px' }}>
              <Link
                href="/solution"
                style={{
                  fontFamily: mono, fontSize: '12px', letterSpacing: '0.10em',
                  color: '#5B8FFF', textDecoration: 'none', transition: 'opacity 200ms ease',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.65'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                FULL TECHNICAL BREAKDOWN →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 4. ECONOMICS — dark strip ── */}
      <section style={{
        backgroundColor: '#0A0D13',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '100px clamp(24px, 5vw, 80px)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.16em', color: '#5B8FFF', marginBottom: '56px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '22px', height: '1px', backgroundColor: '#5B8FFF' }} />
              THE ECONOMICS
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px' }}>
            {[
              { value: '$2–4B', label: 'Total Kepler 13 system cost over 15 years' },
              { value: '$280B', label: 'Annual satellite economy protected' },
              { value: '100×', label: 'Economic return vs system cost' },
              { value: '2027', label: 'Kepler 13 Phase 1 deployment target' },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 80}>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '28px' }}>
                  <div style={{ fontFamily: syne, fontWeight: 800, fontSize: 'clamp(34px, 3.5vw, 52px)', color: '#DDE1EC', lineHeight: 1.0, marginBottom: '14px' }}>
                    {item.value}
                  </div>
                  <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.05em', color: '#4E5868', lineHeight: 1.7 }}>
                    {item.label}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. MISSION — full-bleed ISS Earth photo ── */}
      <section style={{
        position: 'relative',
        backgroundImage: 'url(/earth-iss.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '200px clamp(24px, 5vw, 80px)',
        textAlign: 'center',
      }}>
        {/* Heavy dark overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(8,10,15,0.78)' }} />
        {/* Edge fades */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(#080A0F, transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(transparent, #080A0F)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '680px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.18em', color: '#5B8FFF', marginBottom: '40px' }}>
              CLERK // MISSION
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 style={{ fontFamily: syne, fontWeight: 800, fontSize: 'clamp(38px, 5.5vw, 68px)', lineHeight: 1.0, color: '#FFFFFF', marginBottom: '32px', letterSpacing: '-0.01em' }}>
              We are not inventing<br />a solution.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p style={{ fontFamily: mono, fontSize: '16px', color: 'rgba(220,225,235,0.68)', lineHeight: 1.85 }}>
              We are finally choosing to use<br />
              the one the planet already built.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={320}>
            <div style={{ marginTop: '52px' }}>
              <Link
                href="/about"
                style={{
                  fontFamily: mono, fontSize: '12px', letterSpacing: '0.10em',
                  color: '#fff', textDecoration: 'none',
                  padding: '13px 32px',
                  border: '1px solid rgba(255,255,255,0.28)',
                  display: 'inline-block',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#5B8FFF'; e.currentTarget.style.color = '#5B8FFF'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = '#fff'; }}
              >
                MEET THE TEAM →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
