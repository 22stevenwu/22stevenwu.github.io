import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Moon, Search, Sun } from "lucide-react";
import { CommandPalette } from "@/components/command-palette";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" },
] as const;

function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      const nextIsDark = savedTheme ? savedTheme === "dark" : systemTheme.matches;
      document.documentElement.classList.toggle("dark", nextIsDark);
      setIsDark(nextIsDark);
    };

    syncTheme();
    systemTheme.addEventListener("change", syncTheme);
    return () => systemTheme.removeEventListener("change", syncTheme);
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        isDark === null
          ? "Toggle color theme"
          : isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
      className="motion-button rounded-md p-2 text-muted-foreground transition-[color,background-color,transform] duration-500 ease-out hover:bg-secondary hover:text-foreground"
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </button>
  );
}

export function SiteNav({ onOpenCommand }: { onOpenCommand: () => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-3 py-4 sm:px-6">
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
                  className="motion-button rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-[color,background-color,transform] duration-500 ease-out hover:text-foreground sm:px-3 sm:text-sm"
                  activeProps={{ className: "bg-secondary text-foreground" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onOpenCommand}
            aria-label="Open command palette"
            title="Open command palette (Command or Control + K)"
            className="motion-button rounded-md p-2 text-muted-foreground transition-[color,background-color,transform] duration-500 ease-out hover:bg-secondary hover:text-foreground"
          >
            <Search className="size-4" />
          </button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <SiteNav onOpenCommand={() => setCommandOpen(true)} />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <main className="page-enter mx-auto max-w-3xl px-6 py-16 sm:py-24">{children}</main>
      <footer className="mx-auto max-w-3xl px-6 pb-12">
        <p className="label-mono">© {new Date().getFullYear()} Steven Wu</p>
      </footer>
    </div>
  );
}
