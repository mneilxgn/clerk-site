'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

export default function CountUp({ target, prefix = '', suffix = '', decimals = 0, duration = 1500 }: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            setValue(Math.floor(easedProgress * target));

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setValue(target);
            }
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  const formatted = decimals > 0
    ? value.toFixed(decimals)
    : value.toLocaleString();

  return (
    <span ref={ref}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
