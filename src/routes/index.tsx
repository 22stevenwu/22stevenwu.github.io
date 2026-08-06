import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Steven Wu — Software Engineer I @ Sunfire" },
      {
        name: "description",
        content:
          "Steven Wu is a Software Engineer I at Sunfire building web products with TypeScript, React, and Node.js.",
      },
      { property: "og:title", content: "Steven Wu — Software Engineer I @ Sunfire" },
      {
        property: "og:description",
        content: "Software Engineer I at Sunfire. Experience, projects, and contact.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PageShell>
      <section>
        <p className="label-mono">Portfolio</p>
        <h1 className="mt-5 text-4xl font-semibold sm:text-6xl">Steven Wu</h1>
        <p className="mt-3 font-mono text-base text-primary sm:text-lg">
          Software Engineer I @ Sunfire
        </p>

        <div className="mt-10 card-panel space-y-4 p-6 sm:p-8">
          <p className="text-base leading-relaxed text-muted-foreground">
            Software engineer from the NYC Metropolitan area with experience in
            full-stack development, QA, and data analysis. I'm a recent graduate from Boston College's 
            Morrissey College of Arts and Sciences, with a B.A in Computer Science and minors in Finance and Data Science.
            
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            I currently work as a Software Engineer I at Sunfire, a health technology company that delivers digital 
            solutions to streamline Medicare plan quoting and enrollment for agents and consumers.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/experience"
            className="motion-button rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity duration-500 ease-out hover:opacity-90"
          >
            View experience
          </Link>
          <Link
            to="/contact"
            className="motion-button rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-500 ease-out hover:bg-secondary"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
