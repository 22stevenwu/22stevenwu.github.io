import React, { useEffect, useRef, useState } from 'react';

const GlobalBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const rafRef = useRef<number | null>(null);
  const latest = useRef({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      latest.current.x = (e.clientX / window.innerWidth) * 100;
      latest.current.y = (e.clientY / window.innerHeight) * 100;

      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        setMousePosition({ x: latest.current.x, y: latest.current.y });
        rafRef.current = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none -z-10">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,0.08) 0%, transparent 50%)`,
          transition: 'background 0.18s ease-out',
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            `url("data:image/svg+xml;utf8,` +
            encodeURIComponent(`
              <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>
                <path d='M32 0H0V32' fill='none' stroke='hsl(var(--primary))' stroke-width='1'/>
              </svg>
            `) +
            `")`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default GlobalBackground;
