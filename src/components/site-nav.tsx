import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" },
] as const;

function ThemeToggle() {
  // Matches the default the inline theme-init script applies before hydration,
  // so the icon doesn't flip on mount for the common (dark) case.
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="motion-button rounded-md p-2 text-muted-foreground transition-[color,background-color,transform] duration-500 ease-out hover:bg-secondary hover:text-foreground"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-mono text-sm tracking-tight text-foreground">
          sw<span className="text-primary">.</span>
        </Link>
        <div className="flex items-center gap-2">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  className="motion-button rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-[color,background-color,transform] duration-500 ease-out hover:text-foreground"
                  activeProps={{ className: "bg-secondary text-foreground" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="page-enter mx-auto max-w-3xl px-6 py-16 sm:py-24">{children}</main>
      <footer className="mx-auto max-w-3xl px-6 pb-12">
        <p className="label-mono">© {new Date().getFullYear()} Steven Wu</p>
      </footer>
    </div>
  );
}
