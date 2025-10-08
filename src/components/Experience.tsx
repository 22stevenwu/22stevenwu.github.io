import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const projects = [
  {
    key: "sunfire",
    title:
    <>
      SWE Intern @ <span className="text-[#FB8218] font-medium">SunFire</span>
    </>,
    description: "Support SunFire's core platforms (TRANZACT, Apollo), streamlining Medicare plan quoting & enrollment for agents and consumers",
    tags: ["React", "TypeScript", "Node.js", "Playwright", "Agile"],
    date: "May 2025 – Present",
    location: "Remote",
    url: "https://www.sunfireinc.com/",
  },
  {
    key: "ricoh",
    title: 
    <>
      QA Intern @ <span className="text-[#D61B3E] font-medium">Ricoh USA</span>
    </>,
    description: "Automated regression testing for Ricoh’s Delivery CTRL Service, boosting efficiency for a global leader in digital services",
    tags: ["JavaScript", "Python", "REST API", "Apache JMeter", "Postman"],
    date: "Jul 2024 - Aug 2024",
    location: "Parsippany, NJ",
    url: "https://www.ricoh-usa.com/en",
  },
  {
    key: "bc",
    title: 
    <>
      Technology Consultant @ <span className="text-[#BDA06A] font-medium">BC</span>
    </>,
    description: "Provide hardware and software support to 100+ faculty members and staff at BC's School of Social Work",
    tags: ["Customer IT Support", "Problem Solving", "Troubleshooting"],
    date: "Aug 2023 - Present",
    location: "Chestnut Hill, MA",
    url: "https://www.bc.edu/content/bc-web/offices/its/about/ocio.html",
  },
  {
    key: "portfolio",
    title: "Portfolio Website",
    description: "Personal portfolio website built with React, TypeScript, and Tailwind, showcasing projects and work experience",
    tags: ["React", "TypeScript", "Tailwind", "Radix UI"],
    date: "Last Updated Oct 2025",
    url: "https://github.com/22stevenwu/portfolio",
  },
  {
    key: "greenup",
    title: <>
        <span className="text-[#388E3C] font-medium">GreenUp!</span>
    </>,
    description: "App that gamifies BC's sustainability initiatives, enabling students to track actions, earn points, and compete on leaderboards",
    tags: ["Django", "Figma", "PostgreSQL", "Bootstrap", "Google OAuth"],
    date: "Dec 2024 - Jan 2025",
    url: "https://github.com/22stevenwu/GreenUp",
  },
  {
    key: "fairshare",
     title: <>
        <span className="text-[#FFD700] font-medium">FairShare</span>
    </>,
    description: "Full-stack web app for bill creation and real-time splitting calculations for multiple participants",
    tags: ["Django", "Figma", "GoogleOAuth"],
    date: "Sep 2024 - Dec 2024",
    url: "https://github.com/22stevenwu/FairShare",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="min-h-screen flex items-center px-6 py-24">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-semi-bold mb-12 text-foreground">Work & Project Experience</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {projects.map((project, index) => (
            <Card
              key={project.key}
              className="group cursor-pointer hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 w-[320px] md:w-[360px]"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-1 bg-primary rounded-full group-hover:w-12 transition-all duration-300"></div>
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </a>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <div className="flex justify-center mt-2">
                    {project.location && (
                    <Badge variant="secondary" className="text-xs">
                        {project.location}
                    </Badge>)}

                    <Badge variant="secondary" className="text-xs">
                        {project.date}
                    </Badge>
                </div>
                <CardDescription className="leading-relaxed">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
