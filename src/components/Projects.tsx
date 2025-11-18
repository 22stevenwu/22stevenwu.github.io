import { FC } from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import portfolio from "../assets/portfolio.png";
import greenup from "../assets/greenup.png";
import fairshare from "../assets/fairshare.png";

const projectCards = [
  {
    key: "portfolio",
    title: "Portfolio Website",
    image: portfolio,
    description:
      "Personal portfolio built with React, TypeScript, and Tailwind, showcasing my work experience and projects.",
    tags: ["React", "TypeScript", "Tailwind", "Radix UI"],
    date: "Last Updated Nov 2025",
    url: "https://github.com/22stevenwu/portfolio",
  },
  {
    key: "greenup",
    title: "GreenUp!",
    image: greenup,
    description:
      "Gamified sustainability app for Boston College students, letting users track actions, earn points, and compete on leaderboards to promote eco-friendly behavior.",
    tags: ["Django", "PostgreSQL", "Bootstrap", "Figma"],
    date: "Dec 2024 – Jan 2025",
    url: "https://github.com/22stevenwu/GreenUp",
  },
  {
    key: "fairshare",
    title: "FairShare",
    image: fairshare,
    description:
      "Full-stack web app for creating bills and splitting costs across multiple participants with real-time updates and a clean, intuitive interface.",
    tags: ["Django", "Bootstrap", "Google OAuth", "Figma"],
    date: "Sep 2024 – Dec 2024",
    url: "https://github.com/22stevenwu/FairShare",
  },
];

const Projects: FC = () => {
  return (
    <section
      id="projects-grid"
      className="min-h-screen flex items-center py-24"
    >
      <div className="w-full px-6 md:px-12 lg:px-24">
        <h2 className="text-4xl md:text-5xl font-semi-bold mb-4 text-foreground text-center md:text-left">
          Projects
        </h2>
        <p className="mb-8 text-muted-foreground max-w-2xl text-center md:text-left">
          A few of the things I've built recently, from full-stack web apps to this portfolio itself.
        </p>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projectCards.map((project) => (
            <Card key={project.key} className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-full h-56 flex items-center justify-center bg-gradient-to-r from-primary/10 via-background to-purple-500/10 rounded-t-md overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="max-h-56 w-auto object-contain"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-xl">
                    {project.title}
                  </CardTitle>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary/80 hover:text-primary"
                    >
                      View
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                {project.date && (
                  <Badge variant="secondary" className="text-xs">
                    {project.date}
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="pt-0 pb-4 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <CardDescription className="leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;