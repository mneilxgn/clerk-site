'use client';

import { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import Footer from '@/components/Footer';

const C = {
  bg: '#080A0F',
  surface: '#0D1017',
  surfaceElevated: '#131820',
  borderSubtle: 'rgba(255,255,255,0.06)',
  borderDefault: 'rgba(255,255,255,0.12)',
  textPrimary: '#F0F2F5',
  textSecondary: '#8A909C',
  textTertiary: '#4A5160',
  accent: '#3B7BFF',
  danger: '#FF4444',
  success: '#2AE8A4',
};

const syne = 'Syne, sans-serif';
const mono = 'IBM Plex Mono, monospace';

const values = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" stroke="rgba(59,123,255,0.4)" strokeWidth="1" />
        <path d="M8 14 L12 18 L20 10" stroke="#3B7BFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    name: 'Physics first',
    desc: "Every decision traces back to a governing equation. If the math doesn't work, the product doesn't ship.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" stroke="rgba(59,123,255,0.4)" strokeWidth="1" />
        <circle cx="14" cy="14" r="5" stroke="#3B7BFF" strokeWidth="1.5" />
        <line x1="14" y1="2" x2="14" y2="7" stroke="#3B7BFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="21" x2="14" y2="26" stroke="#3B7BFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    name: 'Contactless by default',
    desc: "Grabbing things in orbit is expensive, dangerous, and doesn't scale. We build systems that act at a distance.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" stroke="rgba(59,123,255,0.4)" strokeWidth="1" />
        <path d="M8 18 Q14 8 20 18" stroke="#3B7BFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
    name: 'Civilisational timescale',
    desc: 'LEO is infrastructure for the next thousand years. We are not optimising for the next quarter.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" stroke="rgba(59,123,255,0.4)" strokeWidth="1" />
        <line x1="9" y1="14" x2="19" y2="14" stroke="#3B7BFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="9" y1="10" x2="19" y2="10" stroke="#3B7BFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="9" y1="18" x2="16" y2="18" stroke="#3B7BFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    name: 'Radical transparency',
    desc: 'Our target catalogues, operational parameters, and laser deployment schedules are public. We have nothing to hide and everything to explain.',
  },
];

function FounderPhoto() {
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{
      width: '180px',
      height: '180px',
      borderRadius: '2px',
      overflow: 'hidden',
      border: `1px solid ${C.borderDefault}`,
      position: 'relative',
      backgroundColor: C.surfaceElevated,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {!imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/varun-kapoor.jpg"
          alt="Varun Neil Kapoor"
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
          }}
        />
      ) : (
        <span style={{ fontFamily: mono, fontSize: '13px', letterSpacing: '0.1em', color: C.accent }}>
          VNK
        </span>
      )}
    </div>
  );
}

export default function About() {
  return (
    <main style={{ backgroundColor: C.bg, minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ paddingTop: '160px', paddingBottom: '100px', paddingLeft: '40px', paddingRight: '40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.12em', color: C.accent, marginBottom: '20px' }}>
              CLERK // WHO WE ARE
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 style={{ fontFamily: syne, fontWeight: 800, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.05, color: C.textPrimary, maxWidth: '700px' }}>
              Built by someone who<br />read the physics<br />and couldn&apos;t look away.
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-separator" />

      {/* ── MISSION ── */}
      <section style={{ backgroundColor: C.surface, padding: '100px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.12em', color: C.accent, marginBottom: '32px' }}>
              MISSION
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <blockquote style={{
              fontFamily: syne, fontWeight: 700, fontSize: 'clamp(20px, 2.5vw, 28px)',
              color: C.textPrimary, lineHeight: 1.5, borderLeft: `3px solid ${C.accent}`,
              paddingLeft: '28px', marginBottom: '48px',
            }}>
              &ldquo;The orbital kinetic energy of the debris population is approximately 270 terajoules.
              The energy to solve this problem is already there.&rdquo;
            </blockquote>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ fontFamily: mono, fontSize: '15px', color: C.textSecondary, lineHeight: 2 }}>
                Clerk exists because the debris problem passed its own Kessler threshold — the point where the complexity of the situation outpaces the institutional capacity to act through conventional channels.
              </p>
              <p style={{ fontFamily: mono, fontSize: '15px', color: C.textSecondary, lineHeight: 2 }}>
                We are a physics company. The Kepler 13 system is not a product. It is a permanent answer to a permanent problem, built from principles that Earth&apos;s own geophysics have validated over four billion years.
              </p>
              <p style={{ fontFamily: mono, fontSize: '15px', color: C.textSecondary, lineHeight: 2 }}>
                Our timeline is not a roadmap. It is a statement of what is physically necessary given the current debris growth rate and the lag between orbital insertion and atmospheric decay.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-separator" />

      {/* ── FOUNDER ── */}
      <section style={{ backgroundColor: C.bg, padding: '100px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.12em', color: C.accent, marginBottom: '16px' }}>
              FOUNDER
            </div>
            <h2 style={{ fontFamily: syne, fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: C.textPrimary, marginBottom: '64px' }}>
              The person behind it.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '56px',
              alignItems: 'start',
              maxWidth: '860px',
            }}>
              {/* Photo column */}
              <div style={{ width: '180px', flexShrink: 0 }}>
                <FounderPhoto />
                <div style={{
                  marginTop: '12px',
                  fontFamily: mono,
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  color: C.accent,
                  borderLeft: `2px solid ${C.accent}`,
                  paddingLeft: '10px',
                  lineHeight: 1.8,
                }}>
                  CLERK-01<br />
                  <span style={{ color: C.textTertiary }}>FOUNDER</span>
                </div>
              </div>

              {/* Details column */}
              <div>
                <div style={{ fontFamily: syne, fontWeight: 700, fontSize: '28px', color: C.textPrimary, marginBottom: '6px' }}>
                  Varun Neil Kapoor
                </div>
                <div style={{ fontFamily: mono, fontSize: '12px', color: C.textTertiary, marginBottom: '28px', letterSpacing: '0.05em' }}>
                  Founder & Chief Executive
                </div>
                <p style={{ fontFamily: mono, fontSize: '14px', color: C.textSecondary, lineHeight: 2, marginBottom: '20px' }}>
                  Grade 12 student and TKS Innovator. Encountered the Kessler problem and couldn&apos;t find a satisfying answer to why nothing serious was being done about it. Built Clerk to be that answer.
                </p>
                <p style={{ fontFamily: mono, fontSize: '14px', color: C.textSecondary, lineHeight: 2, marginBottom: '32px' }}>
                  The Kepler 13 system emerged from a simple observation: Earth&apos;s atmosphere, magnetic field, and ionosphere already do the physics. Nobody had committed to building the infrastructure to let them.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['TKS INNOVATOR', 'ORBITAL DEBRIS', 'SYSTEMS DESIGN', 'GRADE 12'].map((tag) => (
                    <span key={tag} style={{
                      fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em',
                      color: C.textTertiary, border: `1px solid ${C.borderSubtle}`,
                      padding: '4px 10px',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-separator" />

      {/* ── VALUES ── */}
      <section style={{ backgroundColor: C.surface, padding: '100px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.12em', color: C.accent, marginBottom: '16px' }}>
              VALUES
            </div>
            <h2 style={{ fontFamily: syne, fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: C.textPrimary, marginBottom: '64px' }}>
              What we believe.
            </h2>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2px' }}>
            {values.map((value, i) => (
              <ScrollReveal key={value.name} delay={i * 80}>
                <div className="card-hover" style={{
                  backgroundColor: C.surfaceElevated, border: `1px solid ${C.borderSubtle}`,
                  padding: '36px 30px',
                }}>
                  <div style={{ marginBottom: '20px' }}>{value.icon}</div>
                  <div style={{ fontFamily: syne, fontWeight: 700, fontSize: '18px', color: C.textPrimary, marginBottom: '12px' }}>
                    {value.name}
                  </div>
                  <p style={{ fontFamily: mono, fontSize: '13px', color: C.textSecondary, lineHeight: 1.8 }}>
                    {value.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-separator" />

      {/* ── CULTURE ── */}
      <section style={{ backgroundColor: C.bg, padding: '100px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.12em', color: C.accent, marginBottom: '32px' }}>
              CULTURE
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div style={{ fontFamily: mono, fontSize: '15px', color: C.textSecondary, lineHeight: 2.4 }}>
              <p>We work on a problem that most people don&apos;t know exists</p>
              <p>and that nobody has legal incentive to solve.</p>
              <br />
              <p style={{ color: C.textPrimary }}>That requires a specific kind of obsession.</p>
              <br />
              <p>We hire physicists who write code, engineers who read</p>
              <p>philosophy, and operators who understand that the window</p>
              <p>to act on this problem is measured in decades not centuries.</p>
              <br />
              <p>We do not move fast and break things.</p>
              <p style={{ color: C.textPrimary }}>We move carefully and fix things.</p>
              <p>The things we are fixing are in orbit.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-separator" />

      {/* ── CONTACT ── */}
      <section id="contact" style={{ backgroundColor: C.surface, padding: '100px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.12em', color: C.accent, marginBottom: '24px' }}>
              JOIN OR PARTNER
            </div>
            <h2 style={{ fontFamily: syne, fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.15, color: C.textPrimary, marginBottom: '20px' }}>
              If this problem keeps you<br />up at night, we should talk.
            </h2>
            <p style={{ fontFamily: mono, fontSize: '14px', color: C.textTertiary, marginBottom: '40px' }}>
              hello@clerk.space
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:hello@clerk.space?subject=Join the Team" style={{
                display: 'inline-block', fontFamily: mono, fontSize: '13px',
                letterSpacing: '0.06em', color: '#fff', textDecoration: 'none',
                padding: '13px 28px', background: C.accent, transition: 'all 200ms ease',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#5590FF'; e.currentTarget.style.boxShadow = '0 0 32px rgba(59,123,255,0.35)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; e.currentTarget.style.boxShadow = 'none'; }}
              >
                JOIN THE TEAM →
              </a>
              <a href="mailto:hello@clerk.space?subject=Partnership Inquiry" style={{
                display: 'inline-block', fontFamily: mono, fontSize: '13px',
                letterSpacing: '0.06em', color: C.textPrimary, textDecoration: 'none',
                padding: '13px 28px', border: `1px solid ${C.borderDefault}`, transition: 'all 200ms ease',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderDefault; e.currentTarget.style.color = C.textPrimary; }}
              >
                PARTNER WITH CLERK →
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
