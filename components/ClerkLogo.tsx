'use client';

export default function ClerkLogo({ height = 52, variant = 'dark' }: { height?: number; variant?: 'dark' | 'light' }) {
  const aspect = 370 / 210;
  const width = height * aspect;
  const letterFill = variant === 'dark' ? '#DDE1EC' : '#0F1219';

  return (
    <svg
      viewBox="0 0 370 210"
      width={width}
      height={height}
      style={{ display: 'block', overflow: 'visible' }}
      aria-label="Clerk"
    >
      {/* CL — left side */}
      <text
        fontFamily="Syne, sans-serif"
        fontWeight="800"
        fontSize="115"
        fill={letterFill}
        x="4"
        y="168"
        letterSpacing="-2"
      >
        CL
      </text>

      {/* Blue "e" circle — the moon/centre piece */}
      <circle cx="185" cy="108" r="56" fill="#5B8FFF" />
      <text
        fontFamily="Syne, sans-serif"
        fontWeight="800"
        fontSize="88"
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        x="185"
        y="112"
      >
        e
      </text>

      {/* RK — right side */}
      <text
        fontFamily="Syne, sans-serif"
        fontWeight="800"
        fontSize="115"
        fill={letterFill}
        x="232"
        y="168"
        letterSpacing="-2"
      >
        RK
      </text>

      {/* Orbit ellipse — tilted, red dashed */}
      <ellipse
        cx="185" cy="108"
        rx="182" ry="54"
        fill="none"
        stroke="#FF4444"
        strokeWidth="4"
        strokeDasharray="10 9"
        strokeLinecap="round"
        transform="rotate(-28, 185, 108)"
      />
    </svg>
  );
}
