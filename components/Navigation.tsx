'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/solution', label: 'SOLUTION' },
    { href: '/solution#technology', label: 'TECHNOLOGY' },
    { href: '/about', label: 'ABOUT' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 40px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 300ms ease',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        backgroundColor: scrolled ? 'rgba(8,10,15,0.85)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      {/* Wordmark */}
      <Link
        href="/"
        style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '18px',
          color: '#F0F2F5',
          textDecoration: 'none',
          letterSpacing: '0.15em',
          zIndex: 101,
        }}
      >
        CLERK
      </Link>

      {/* Desktop nav links */}
      <div
        style={{
          display: 'flex',
          gap: '32px',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        className="hide-mobile"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.08em',
              color: pathname === link.href ? '#F0F2F5' : '#4A5160',
              textDecoration: 'none',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#8A909C')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = pathname === link.href ? '#F0F2F5' : '#4A5160')
            }
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Request access button */}
      <div className="hide-mobile">
        <Link
          href="/about#contact"
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '12px',
            letterSpacing: '0.06em',
            color: '#F0F2F5',
            textDecoration: 'none',
            padding: '8px 18px',
            border: '1px solid rgba(255,255,255,0.18)',
            transition: 'all 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3B7BFF';
            e.currentTarget.style.color = '#3B7BFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
            e.currentTarget.style.color = '#F0F2F5';
          }}
        >
          REQUEST ACCESS →
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          zIndex: 101,
        }}
        className="show-mobile"
        aria-label="Toggle menu"
      >
        <div style={{ width: '22px', height: '1px', background: '#F0F2F5', marginBottom: '6px' }} />
        <div style={{ width: '22px', height: '1px', background: '#F0F2F5', marginBottom: '6px' }} />
        <div style={{ width: '22px', height: '1px', background: '#F0F2F5' }} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#080A0F',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
            zIndex: 100,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '16px',
                letterSpacing: '0.1em',
                color: '#F0F2F5',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/about#contact"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '13px',
              color: '#3B7BFF',
              textDecoration: 'none',
              marginTop: '16px',
            }}
          >
            REQUEST ACCESS →
          </Link>
        </div>
      )}
    </nav>
  );
}
