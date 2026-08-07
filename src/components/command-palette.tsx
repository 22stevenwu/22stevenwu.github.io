import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  ExternalLink,
  FileText,
  Github,
  Home,
  Mail,
  Search,
  UserRound,
  type LucideIcon,
} from "lucide-react";

const resumeUrl =
  "https://drive.google.com/file/d/1OnoY7UYerBEjsOr8SX4oF0W72tgtrwPF/view?usp=sharing";

type CommandItem = {
  label: string;
  description: string;
  keywords: string;
  icon: LucideIcon;
  external?: boolean;
  action: () => void;
};

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const commands = useMemo<CommandItem[]>(
    () => [
      {
        label: "Home",
        description: "Return to the portfolio homepage",
        keywords: "home portfolio start",
        icon: Home,
        action: () => void navigate({ to: "/" }),
      },
      {
        label: "About",
        description: "Learn more about me",
        keywords: "about bio travel photos interests",
        icon: UserRound,
        action: () => void navigate({ to: "/about" }),
      },
      {
        label: "Experience",
        description: "Browse my work and projects",
        keywords: "experience work projects career skills",
        icon: BriefcaseBusiness,
        action: () => void navigate({ to: "/experience" }),
      },
      {
        label: "Contact",
        description: "Find ways to get in touch",
        keywords: "contact email linkedin connect",
        icon: Mail,
        action: () => void navigate({ to: "/contact" }),
      },
      {
        label: "Résumé",
        description: "Open my résumé in a new tab",
        keywords: "resume cv pdf work education",
        icon: FileText,
        external: true,
        action: () => window.open(resumeUrl, "_blank", "noopener,noreferrer"),
      },
      {
        label: "GitHub",
        description: "View my code and repositories",
        keywords: "github code repositories source",
        icon: Github,
        external: true,
        action: () =>
          window.open("https://github.com/22stevenwu", "_blank", "noopener,noreferrer"),
      },
    ],
    [navigate],
  );

  const filteredCommands = commands.filter((command) => {
    const searchValue = `${command.label} ${command.description} ${command.keywords}`.toLowerCase();
    return searchValue.includes(query.trim().toLowerCase());
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }

      if (event.key === "Escape" && open) {
        event.preventDefault();
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setQuery("");
    setSelectedIndex(0);

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const runCommand = (command: CommandItem) => {
    command.action();
    onOpenChange(false);
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((current) =>
        Math.min(current + 1, Math.max(filteredCommands.length - 1, 0)),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((current) => Math.max(current - 1, 0));
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selectedCommand = filteredCommands[selectedIndex];
      if (selectedCommand) runCommand(selectedCommand);
    }
  };

  const trapFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'input, button, [href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="command-backdrop fixed inset-0 z-[100] flex items-start justify-center bg-black/55 px-4 pt-[12vh] backdrop-blur-sm sm:pt-[16vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false);
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={trapFocus}
        className="command-panel w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search pages and links…"
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={
              filteredCommands[selectedIndex] ? `command-${selectedIndex}` : undefined
            }
            className="h-14 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded-md border border-border bg-secondary px-2 py-1 font-mono text-[0.65rem] text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div id="command-results" role="listbox" className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length ? (
            filteredCommands.map((command, index) => {
              const Icon = command.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={command.label}
                  id={`command-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => runCommand(command)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-200 ${
                    isSelected ? "bg-secondary text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">{command.label}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {command.description}
                    </span>
                  </span>
                  {command.external ? (
                    <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                  ) : null}
                </button>
              );
            })
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-foreground">No results found</p>
              <p className="mt-1 text-xs text-muted-foreground">Try another page or link.</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 font-mono text-[0.65rem] text-muted-foreground">
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span className="ml-auto">⌘/Ctrl K Toggle</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
