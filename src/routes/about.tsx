import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  GraduationCap,
  Headphones,
  MapPin,
  Plane,
  Trophy,
  Utensils,
  X,
} from "lucide-react";
import { PageShell } from "@/components/site-nav";
import { Reveal } from "@/components/motion";
import type { ExperienceEntry, ProjectEntry } from "@/data/timeline";
import { travelPhotos, type TravelPhoto } from "@/data/travel";
import headshot from "@/assets/steven_headshot.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Steven Wu" },
      {
        name: "description",
        content: "Meet Steven Wu, a software engineer based in the NYC metropolitan area.",
      },
      { property: "og:title", content: "About — Steven Wu" },
      {
        property: "og:description",
        content: "A little more about Steven Wu, his background, interests, and travels.",
      },
    ],
  }),
  component: About,
});

function TabButton({
  isActive,
  onClick,
  title,
  period,
}: {
  isActive: boolean;
  onClick: () => void;
  title: string;
  period?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`motion-button relative shrink-0 rounded-md px-4 py-3 text-left text-sm transition-[color,background-color,transform] duration-500 ease-out md:w-full ${
        isActive
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
      }`}
    >
      <span
        className={`absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary transition-[opacity,transform] duration-500 ease-out ${
          isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
        }`}
      />
      <span className="block whitespace-nowrap font-medium sm:whitespace-normal">{title}</span>
      {period ? (
        <span className="label-mono mt-1 block whitespace-nowrap">{period}</span>
      ) : null}
    </button>
  );
}

function StackBadges({ stack }: { stack: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {stack.map((tech) => (
        <span
          key={tech}
          className="rounded-md border border-border bg-secondary px-2.5 py-1 font-mono text-xs text-secondary-foreground"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

function Bullets({ bullets }: { bullets: string[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {bullets.map((bullet) => (
        <li
          key={bullet}
          className="relative pl-5 text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-2.5 before:size-1 before:rounded-full before:bg-accent"
        >
          {bullet}
        </li>
      ))}
    </ul>
  );
}

function TravelGallery({ photos }: { photos: TravelPhoto[] }) {
  const [start, setStart] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visibleCount = Math.min(3, photos.length);
  const canScroll = photos.length > visibleCount;

  const shiftWindow = (delta: number) => {
    setStart((current) => (current + delta + photos.length) % photos.length);
  };

  const close = () => setOpenIndex(null);
  const showPrev = () =>
    setOpenIndex((current) => (current === null ? null : (current - 1 + photos.length) % photos.length));
  const showNext = () =>
    setOpenIndex((current) => (current === null ? null : (current + 1) % photos.length));

  useEffect(() => {
    if (openIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex]);

  const active = openIndex !== null ? photos[openIndex] : null;
  const visible = Array.from({ length: visibleCount }, (_, i) => {
    const index = (start + i) % photos.length;
    return { photo: photos[index], index };
  });

  return (
    <>
      <div className="relative">
        <div key={start} className="gallery-strip grid grid-cols-3 gap-2 sm:gap-3">
          {visible.map(({ photo, index }) => (
            <button
              key={index}
              type="button"
              disabled={!photo.src}
              onClick={() => setOpenIndex(index)}
              className={`motion-button group relative aspect-square overflow-hidden rounded-2xl border border-border bg-secondary text-left transition-[transform,box-shadow,border-color] duration-500 ease-out ${
                photo.src ? "cursor-pointer" : "cursor-default"
              }`}
            >
              {photo.src ? (
                <>
                  <img
                    src={photo.src}
                    alt={photo.place}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
                    <p className="p-3 text-sm font-medium text-white">{photo.place}</p>
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted p-3 text-center">
                  <MapPin className="size-5 text-muted-foreground" />
                  <p className="label-mono">{photo.place}</p>
                </div>
              )}
            </button>
          ))}
        </div>

        {canScroll ? (
          <>
            <button
              type="button"
              onClick={() => shiftWindow(-1)}
              aria-label="Previous photos"
              className="gallery-arrow absolute left-0 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-[var(--shadow-lift)] transition-[color,background-color,transform] duration-500 ease-out hover:bg-secondary hover:text-foreground"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => shiftWindow(1)}
              aria-label="Next photos"
              className="gallery-arrow absolute right-0 top-1/2 flex size-9 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-[var(--shadow-lift)] transition-[color,background-color,transform] duration-500 ease-out hover:bg-secondary hover:text-foreground"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      {canScroll ? (
        <div className="mt-2 flex justify-center gap-1.5">
          {photos.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ease-out ${
                index === start ? "w-4 bg-primary" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      ) : null}

      {active?.src ? (
        <div
          className="lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-6" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrev();
            }}
            aria-label="Previous photo"
            className="absolute left-2 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:left-6"
          >
            <ChevronLeft className="size-7" />
          </button>

          <div
            className="flex max-h-full max-w-3xl flex-col items-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              key={openIndex}
              src={active.src}
              alt={active.place}
              className="lightbox-image max-h-[75vh] w-auto rounded-lg object-contain"
            />
            <p className="label-mono text-white/80">{active.place}</p>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next photo"
            className="absolute right-2 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-6"
          >
            <ChevronRight className="size-7" />
          </button>
        </div>
      ) : null}
    </>
  );
}

function positionKey(org: string, title: string) {
  return `${org}::${title}`;
}

function transitionContent(target: "experience" | "project", update: () => void) {
  const documentWithTransitions = document as Document & {
    startViewTransition?: (callback: () => void) => { finished: Promise<void> };
  };

  if (documentWithTransitions.startViewTransition) {
    const transitionClass = `switching-${target}`;
    document.documentElement.classList.add(transitionClass);
    documentWithTransitions
      .startViewTransition(update)
      .finished.finally(() => document.documentElement.classList.remove(transitionClass));
  } else {
    update();
  }
}

export function ExperienceSection({ items }: { items: ExperienceEntry[] }) {
  const [activeKey, setActiveKey] = useState(positionKey(items[0].org, items[0].positions[0].title));

  let active: { entry: ExperienceEntry; position: ExperienceEntry["positions"][number] } | null = null;
  for (const entry of items) {
    for (const position of entry.positions) {
      if (positionKey(entry.org, position.title) === activeKey) {
        active = { entry, position };
      }
    }
  }
  active ??= { entry: items[0], position: items[0].positions[0] };

  return (
    <div>
      <h2 className="text-2xl font-semibold sm:text-3xl">Experience</h2>
      <div className="mt-6 card-panel flex flex-col overflow-hidden md:min-h-[380px] md:flex-row">
        {/* Sidebar — companies with more than one position show a nested,
            LinkedIn-style career progression instead of a single tab. */}
        <div className="border-b border-border md:w-72 md:shrink-0 md:overflow-y-auto md:border-b-0 md:border-r">
          <div className="space-y-4 p-3">
            {items.map((entry) => (
              <div key={entry.org}>
                <div className="flex items-start gap-2 px-1">
                  <Building2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{entry.org}</p>
                    <p className="label-mono">
                      {entry.period}
                      {entry.location ? ` · ${entry.location}` : ""}
                    </p>
                  </div>
                </div>

                <div className="relative mt-3 ml-[0.6rem] space-y-1 border-l border-border pl-4">
                  {entry.positions.map((position) => {
                    const key = positionKey(entry.org, position.title);
                    const isActive = key === activeKey;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => transitionContent("experience", () => setActiveKey(key))}
                        className={`motion-button relative block w-full rounded-md px-2 py-2 text-left text-sm transition-[color,background-color,transform] duration-500 ease-out ${
                          isActive
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                        }`}
                      >
                        <span
                          className={`absolute -left-[1.15rem] top-3 size-2 rounded-full border-2 bg-background transition-[border-color,transform] duration-500 ease-out ${
                            isActive ? "border-primary" : "border-border"
                          }`}
                        />
                        <span className="block font-medium">{position.title}</span>
                        <span className="label-mono mt-0.5 block">{position.period}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail pane — the single selected position. */}
        <div key={activeKey} className="experience-detail detail-pane flex-1 p-6 sm:p-8">
          <p className="label-mono">
            {active.position.period}
            {active.position.employmentType ? ` · ${active.position.employmentType}` : ""}
          </p>
          <h3 className="mt-2 text-xl font-semibold">
            {active.position.title} <span className="text-muted-foreground">— {active.entry.org}</span>
          </h3>
          {active.position.team ? (
            <p className="mt-1 text-sm text-muted-foreground">{active.position.team}</p>
          ) : null}

          <Bullets bullets={active.position.bullets} />

          {active.entry.href ? (
            <a
              href={active.entry.href}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block font-mono text-xs text-primary underline underline-offset-4"
            >
              View →
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection({ items }: { items: ProjectEntry[] }) {
  const [activeTitle, setActiveTitle] = useState(items[0].title);
  const active = items.find((item) => item.title === activeTitle) ?? items[0];

  return (
    <div>
      <h2 className="text-2xl font-semibold sm:text-3xl">Projects</h2>
      <div className="mt-6 card-panel flex flex-col overflow-hidden md:min-h-[380px] md:flex-row">
        <div className="border-b border-border md:w-64 md:shrink-0 md:border-b-0 md:border-r">
          <div className="flex gap-2 overflow-x-auto p-3 md:flex-col md:overflow-visible">
            {items.map((item) => (
              <TabButton
                key={item.title}
                isActive={item.title === activeTitle}
                onClick={() => transitionContent("project", () => setActiveTitle(item.title))}
                title={item.title}
                period={item.period}
              />
            ))}
          </div>
        </div>

        <div key={activeTitle} className="project-detail detail-pane flex-1 p-6 sm:p-8">
          <p className="label-mono">{active.period}</p>
          <h3 className="mt-2 text-xl font-semibold">
            {active.title} <span className="text-muted-foreground">— {active.org}</span>
          </h3>

          <Bullets bullets={active.bullets} />
          <StackBadges stack={active.stack} />

          {active.href ? (
            <a
              href={active.href}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block font-mono text-xs text-primary underline underline-offset-4"
            >
              View →
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function About() {
  const interests = [
    { label: "Golf", icon: Trophy },
    { label: "Fitness", icon: Dumbbell },
    { label: "Basketball", icon: Trophy },
    { label: "Music", icon: Headphones },
    { label: "Food", icon: Utensils },
    { label: "Travel", icon: Plane },
  ];

  return (
    <PageShell>
      <p className="label-mono">About</p>
      <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">The person behind the code</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Software engineer, lifelong learner, and always planning the next place to explore.
      </p>

      <Reveal delay={100}>
      <section className="about-profile mt-10 card-panel overflow-hidden">
        <div className="grid md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.35fr)]">
          <div className="relative min-h-80 overflow-hidden bg-secondary md:min-h-full">
            <div className="absolute -left-14 -top-14 size-44 rounded-full bg-primary/20 blur-3xl" />
            <img
              src={headshot}
              alt="Steven Wu"
              className="relative h-full max-h-[32rem] min-h-80 w-full object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.025]"
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-10 left-5 text-white">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">Based near</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                <MapPin className="size-4" /> NYC Metropolitan Area
              </p>
            </div>
          </div>

          <div className="p-6 pb-2 sm:p-8 md:p-10 md:p-2">
            <p className="label-mono text-primary">Hello, I&apos;m Steven</p>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                I&apos;m a software engineer from the NYC metropolitan area with a background
                spanning full-stack development, quality assurance, and data analysis.
              </p>
              <p>
                I recently graduated from Boston College with a B.A. in Computer Science and minors in Finance and Data
                Science. That mix taught me to approach technology from both a technical and
                business perspective.
              </p>
              <p>
                Today, I work at Sunfire, a health technology company building digital tools
                that streamline Medicare plan quoting and enrollment for agents and consumers.
                Currently as a Software Engineer I, I am building and maintaining 
                applications that support millions of Medicare plan enrollments each year. 
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-secondary/60 p-4">
                <BriefcaseBusiness className="size-5 text-primary" />
                <p className="mt-3 text-sm font-medium">Software Engineer I</p>
                <p className="mt-1 text-xs text-muted-foreground">Sunfire</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/60 p-4">
                <GraduationCap className="size-5 text-primary" />
                <p className="mt-3 text-sm font-medium">Computer Science, B.A.</p>
                <p className="mt-1 text-xs text-muted-foreground">Boston College</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal delay={100}>
      <section className="mt-14">
        <p className="label-mono">Beyond the desk</p>
        <div className="mt-4 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">What keeps me moving</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              Away from work, you'll usually find me on the golf course, in the gym, or on the basketball court.
              I'm a lifelong Knicks fan and love both playing and watching basketball. Outside of sports, I'm enjoy 
              discovering new music, trying new foods, and traveling whenever I get the chance.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {interests.map(({ label, icon: Icon }) => (
            <span
              key={label}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-secondary-foreground shadow-sm transition-[transform,border-color,background-color] duration-500 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:bg-secondary"
            >
              <Icon className="size-3.5 text-primary" />
              {label}
            </span>
          ))}
        </div>
      </section>
      </Reveal>

      <Reveal delay={100}>
      <section className="mt-6 card-panel p-5 sm:p-7">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="label-mono">Postcards</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">A few places I&apos;ve been</h2>
          </div>
          <p className="hidden max-w-100 text-right text-sm text-muted-foreground sm:block">
            Select a photo to take a closer look.
          </p>
        </div>
        <TravelGallery photos={travelPhotos} />
      </section>
      </Reveal>

    </PageShell>
  );
}
