import React, { useEffect, useRef, useState } from 'react';

const GlobalBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const rafRef = useRef<number | null>(null);
  const latest = useRef({ x: 50, y: 50 });
  const [isDark, setIsDark] = useState(false);

    useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains('dark'));
    update();

    // Watch for class changes so toggling the theme updates instantly
    const obs = new MutationObserver(update);
    obs.observe(root, { attributes: true, attributeFilter: ['class'] });
   return () => obs.disconnect();
  }, []);
  

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
        className="absolute inset-0"
        style={{
            background: `radial-gradient(
            circle at ${mousePosition.x}% ${mousePosition.y}%,
            ${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)'} 0%,
            transparent 52%
            )`,
            mixBlendMode: isDark ? 'screen' as const : 'normal' as const,
            transition: 'background 0.18s ease-out'
        }}
        />

      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default GlobalBackground;
