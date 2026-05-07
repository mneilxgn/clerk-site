import Link from 'next/link';

const mono = 'IBM Plex Mono, monospace';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0A0D13', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '72px 40px 40px' }}>

        {/* POV tagline — brand anchor line */}
        <div style={{ marginBottom: '64px', paddingBottom: '48px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(22px, 3vw, 36px)',
            color: '#DDE1EC', lineHeight: 1.15, margin: 0,
          }}>
            We don&apos;t catch debris.<br />We convince it to fall.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '48px',
          marginBottom: '48px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <img src="/clerk-logo-light.png" alt="Clerk" style={{ height: '62px', width: 'auto', display: 'block' }} />
            </div>
            <p style={{
              fontFamily: mono, fontSize: '12px', color: '#4A5160',
              lineHeight: 1.9, maxWidth: '240px',
            }}>
              Clearing the path forward<br />for Humanity&apos;s next steps.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div style={{
              fontFamily: mono, fontSize: '9px', letterSpacing: '0.14em',
              color: '#4A5160', marginBottom: '20px', textTransform: 'uppercase' as const,
            }}>
              Navigation
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { href: '/', label: 'Home' },
                { href: '/solution', label: 'Solution' },
                { href: '/solution#technology', label: 'Technology' },
                { href: '/about', label: 'About' },
                { href: '/about#contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: mono, fontSize: '12px', color: '#8A909C',
                    textDecoration: 'none', transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#5B8FFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8A909C')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{
              fontFamily: mono, fontSize: '9px', letterSpacing: '0.14em',
              color: '#4A5160', marginBottom: '20px', textTransform: 'uppercase' as const,
            }}>
              Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <a href="https://clerk.space" style={{ fontFamily: mono, fontSize: '12px', color: '#8A909C', textDecoration: 'none' }}>
                clerk.space
              </a>
              <a href="mailto:hello@clerk.space" style={{ fontFamily: mono, fontSize: '12px', color: '#8A909C', textDecoration: 'none' }}>
                hello@clerk.space
              </a>
              <div style={{ fontFamily: mono, fontSize: '12px', color: '#4A5160', marginTop: '4px' }}>
                @clerk_space
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <span style={{ fontFamily: mono, fontSize: '11px', color: '#4A5160' }}>
            © 2026 Clerk. Named for James Clerk Maxwell.
          </span>
          <span style={{ fontFamily: mono, fontSize: '11px', color: '#4A5160' }}>
            KEPLER 13 // PHASE 1 TARGET: 2027
          </span>
        </div>
      </div>
    </footer>
  );
}
