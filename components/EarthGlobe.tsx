'use client';

export default function EarthGlobe() {
  const size = 'min(90vh, 90vw)';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>

      {/* Outer atmosphere glow */}
      <div style={{
        position: 'absolute',
        inset: '-4%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, transparent 55%, rgba(40,100,255,0.12) 75%, rgba(20,60,180,0.07) 88%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* The sphere */}
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: `
          0 0 80px rgba(30, 90, 255, 0.30),
          0 0 200px rgba(20, 60, 200, 0.12)
        `,
      }}>

        {/* Scrolling Earth texture — creates rotation illusion */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '300%',
          height: '100%',
          backgroundImage: 'url(/earth-texture.jpg)',
          backgroundSize: '33.334% 100%',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: '0 50%',
          animation: 'spinEarth 32s linear infinite',
          willChange: 'transform',
        }} />

        {/* Night-side shadow — makes it look like a sphere lit from the left */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(
            circle at 32% 38%,
            rgba(255,255,255,0.03) 0%,
            transparent 28%,
            rgba(0,0,0,0.18) 52%,
            rgba(0,0,0,0.62) 72%,
            rgba(0,0,0,0.92) 100%
          )`,
          pointerEvents: 'none',
        }} />

        {/* Atmosphere rim — blue halo at the edges */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          boxShadow: 'inset 0 0 60px rgba(60, 130, 255, 0.22)',
          pointerEvents: 'none',
        }} />

        {/* Subtle cloud shimmer */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 28% 32%, rgba(255,255,255,0.04) 0%, transparent 35%)',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}
