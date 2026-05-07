import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0D1017', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 40px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '48px',
          marginBottom: '48px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <img src="/clerk-logo-light.png" alt="Clerk" style={{ height: '44px', width: 'auto', display: 'block' }} />
            </div>
            <p style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
              color: '#4A5160',
              lineHeight: 1.8,
              maxWidth: '240px',
            }}>
              Orbital debris removal.<br />
              Contactless. Scalable. Now.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: '#4A5160',
              marginBottom: '20px',
              textTransform: 'uppercase',
            }}>
              Navigation
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '12px',
                    color: '#8A909C',
                    textDecoration: 'none',
                    transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#3B7BFF')}
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
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: '#4A5160',
              marginBottom: '20px',
              textTransform: 'uppercase',
            }}>
              Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href="https://clerk.space"
                style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '12px',
                  color: '#8A909C',
                  textDecoration: 'none',
                }}
              >
                clerk.space
              </a>
              <a
                href="mailto:hello@clerk.space"
                style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '12px',
                  color: '#8A909C',
                  textDecoration: 'none',
                }}
              >
                hello@clerk.space
              </a>
              <div style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '12px',
                color: '#4A5160',
                marginTop: '8px',
              }}>
                @clerk_space
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px',
            color: '#4A5160',
          }}>
            © 2026 Clerk. Named for James Clerk Maxwell.
          </span>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px',
            color: '#4A5160',
          }}>
            KEPLER 13 // PHASE 1 TARGET: 2027
          </span>
        </div>
      </div>
    </footer>
  );
}
