import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Sun, Moon } from 'lucide-react';

const NavLink: React.FC<{ href: string; children: React.ReactNode; onClick?: () => void }> = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="block px-4 py-2 text-foreground hover:text-primary transition-colors"
  >
    {children}
  </a>
);

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  // Smooth progress using RAF + time-based exponential smoothing (frame-rate independent)
  const scrollTargetRef = useRef(0);
  const scrollCurrentRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  useEffect(() => {
    let rafId = 0;
    const SPEED = 25; // larger = faster (try 8..30)

    const step = (now: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = now;
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000); // cap dt to avoid big jumps
      lastTimeRef.current = now;

      const scrollTop = window.scrollY;
      const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const target = (scrollTop / docHeight) * 100;
      scrollTargetRef.current = target;

      // time-based exponential smoothing: alpha = 1 - e^{-SPEED * dt}
      const alpha = 1 - Math.exp(-SPEED * dt);
      scrollCurrentRef.current += (scrollTargetRef.current - scrollCurrentRef.current) * alpha;

      // snap if extremely close
      if (Math.abs(scrollTargetRef.current - scrollCurrentRef.current) < 0.02) {
        scrollCurrentRef.current = scrollTargetRef.current;
      }

      const value = Math.max(0, Math.min(100, scrollCurrentRef.current));
      setScrollProgress(Math.round(value * 100) / 100);

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    const onResize = () => {
      const scrollTop = window.scrollY;
      const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollTargetRef.current = (scrollTop / docHeight) * 100;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  type Theme = 'light' | 'dark';
  const [theme, setTheme] = useState<Theme>(() => {
    // initial theme from localStorage or default to light mode
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') as Theme | null : null;
    if (stored === 'light' || stored === 'dark') return stored;
    // Default to light mode instead of following system preference
    return 'light';
  });
  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));


  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 w-full z-50 bg-background/60 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="#" className="text-xl text-primary font-medium text-foreground italic">Steven Wu</a>

        {/* Hamburger (visible on all sizes) */}
        <div className="flex items-center gap-2">
          {/* Light/Dark mode toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-md border border-border/50 text-foreground hover:bg-accent/20 transition"
            >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Hamburger */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={toggle}
            className="p-2 rounded-md text-primary hover:text-primary/80 transition-colors"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu panel (expands/collapses) visible on all sizes when open */}
      <div>
        {/* backdrop */}
        <div className={`${open ? 'fixed inset-0 z-30' : 'hidden'}`} onClick={() => setOpen(false)} />
        <div
          ref={panelRef}
          className={`origin-top-right absolute top-full left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-border/50 z-40 transform transition-all duration-200 ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
        >
          <nav className="px-4 pb-6 pt-2">
            <div className="flex flex-col gap-1">
              <NavLink href="#" onClick={close}>Home</NavLink>
              <NavLink href="#about" onClick={close}>About</NavLink>
              <NavLink href="#projects" onClick={close}>Projects</NavLink>
              <NavLink href="#contact" onClick={close}>Contact</NavLink>
            </div>
          </nav>
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-150" style={{ width: scrollProgress + "%" }} />
    </header>
  );
};

export default Navbar;
