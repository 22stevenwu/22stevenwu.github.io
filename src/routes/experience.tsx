import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site-nav";
import { experience, projects } from "@/data/timeline";
import { ExperienceSection, ProjectsSection } from "@/routes/about";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience — Steven Wu" },
      {
        name: "description",
        content: "Steven Wu's engineering experience and software projects.",
      },
      { property: "og:title", content: "Experience — Steven Wu" },
      {
        property: "og:description",
        content: "Engineering experience, projects, and the technologies used for each.",
      },
    ],
  }),
  component: Experience,
});

function Experience() {
  return (
    <PageShell>
      <p className="label-mono">Experience</p>
      <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">Work & projects</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        A running timeline of the roles I've held, the products/projects I've helped build.
      </p>

      <div className="mt-12 space-y-12">
        <ExperienceSection items={experience} />
        <ProjectsSection items={projects} />
      </div>
    </PageShell>
  );
}
