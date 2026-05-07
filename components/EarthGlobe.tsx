'use client';

export default function EarthGlobe() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
    }}>
      {/* Outer atmospheric halo */}
      <div style={{
        position: 'absolute',
        inset: '-5%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, transparent 52%, rgba(50,120,255,0.13) 72%, rgba(30,80,200,0.06) 88%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Video sphere */}
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: `
          0 0 100px rgba(30, 90, 255, 0.35),
          0 0 260px rgba(20, 60, 200, 0.15)
        `,
      }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        >
          <source src="/earth-rotation-480.webm" type="video/webm" />
          <source src="/earth-rotation.webm" type="video/webm" />
          <source src="/earth-rotation.mov" type="video/quicktime" />
        </video>

        {/* Night-side shadow overlay — makes it feel like a lit sphere */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(
            circle at 34% 38%,
            rgba(255,255,255,0.02) 0%,
            transparent 30%,
            rgba(0,0,0,0.15) 55%,
            rgba(0,0,0,0.55) 75%,
            rgba(0,0,0,0.88) 100%
          )`,
          pointerEvents: 'none',
        }} />

        {/* Atmosphere rim glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          boxShadow: 'inset 0 0 60px rgba(60, 140, 255, 0.20)',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}
