import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const projects = [
  {
    key: "sunfire",
    title: "Software Engineering Intern @ SunFire",
    description: "SunFire is a leading, mission-driven healthcare technology company delivering digital solutions that streamline Medicare plan quoting and enrollment for agents and consumers. As a Software Engineering Intern, I contributed to the development and enhancement of SunFire's core platforms, TRANZACT and Apollo, building and refining React/TypeScript components and supporting workflows that help seniors navigate complex Medicare options. I also led the migration of the end-to-end testing suite from Cypress to Playwright, reducing test flakiness, improving execution speed, and establishing more scalable testing patterns for engineering and QA teams.",
    tags: ["React", "TypeScript", "Node.js", "Playwright", "Agile"],
    date: "May 2025 – Present",
    location: "Remote",
    url: "https://www.sunfireinc.com/",
  },
  {
    key: "ricoh",
    title: "Quality Assurance Intern @ Ricoh USA",
    description: "Ricoh is a global leader in digital services, workplace technology, and intelligent automation. As a QA Intern, I helped improve the reliability and performance of Ricoh’s Delivery CTRL Service by automating regression testing, evaluating API scalability with Apache JMeter and Postman, and building GET endpoints using Python and JavaScript. I also reduced manual QA workload by 15 hours per month through LeapWork automation and created detailed system design documentation used across engineering and QA teams.",
    tags: ["JavaScript", "Python", "REST API", "Apache JMeter", "Postman"],
    date: "July 2024 - August 2024",
    location: "Parsippany, NJ",
    url: "https://www.ricoh-usa.com/en",
  },
  {
    key: "bc",
    title: "Technology Consultant @ Boston College",
    description: "BC EagleTech is Boston College’s primary technical support organization, delivering hardware, software, and network services to faculty, staff, and students across campus. As a Technology Consultant for the School of Social Work, I support 100+ faculty and staff by diagnosing system configuration issues, resolving software problems, and maintaining device reliability. I also help monitor a database of over 10,000 digital service tickets to detect anomalies and security risks, and assemble and configure hardware tailored to individual users’ needs.",
    tags: ["Customer IT Support", "Problem Solving", "Troubleshooting"],
    date: "August 2023 - Present",
    location: "Chestnut Hill, MA",
    url: "https://www.bc.edu/content/bc-web/offices/its/about/student-staff.html",
  },
];

const Projects = () => {
  const [activeKey, setActiveKey] = useState(projects[0].key);
  const activeProject = projects.find((project) => project.key === activeKey)!;

  return (
    <section
      id="projects"
      className="min-h-screen flex items-center py-24"
    >
      <div className="w-full px-6 md:px-12 lg:px-24">
        <h2 className="text-4xl md:text-5xl font-semi-bold mb-4 text-foreground text-center md:text-left">
          Work Experience
        </h2>
        <p className="mb-8 text-muted-foreground max-w-2xl text-center md:text-left">
          Click between roles to learn more about my experiences and contributions.
        </p>

        <Card className="w-full group relative overflow-hidden min-h-[400px]">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar inside card */}
            <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-border bg-muted/40 min-h-[400px]">
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible p-4">
                {/* Work Section */}
                <div className="min-w-[200px] md:min-w-0">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 px-1">
                    Work
                  </h3>
                  <div className="flex md:flex-col gap-2">
                    {projects
                      .filter((p) => ["sunfire", "ricoh", "bc"].includes(p.key))
                      .map((project) => {
                        const isActive = project.key === activeKey;
                        return (
                          <button
                            key={project.key}
                            type="button"
                            onClick={() => setActiveKey(project.key)}
                            className={`relative flex-shrink-0 rounded-md px-3 py-2 text-sm md:text-base text-left transition-all duration-200 whitespace-nowrap w-full text-foreground
                              ${isActive ? "bg-background" : "hover:bg-muted"}
                            `}
                          >
                            <div
                              className={`absolute left-0 top-0 h-full w-1 rounded-r-md transition-all duration-200
                                ${isActive ? "bg-primary" : "bg-transparent"}
                              `}
                            />
                            <span className="font-medium block">
                              {project.title}
                            </span>
                            {project.location && (
                              <span className="text-xs opacity-75">
                                {project.date}
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
                
              </div>
              
            </div>
            

            {/* Detail pane */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeKey}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-1 bg-primary rounded-full group-hover:w-14 transition-all duration-300" />
                      {activeProject.url && (
                        <a
                          href={activeProject.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary/80 hover:text-primary"
                        >
                          View
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      {activeProject.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {activeProject.location && (
                        <Badge variant="secondary" className="text-xs">
                          {activeProject.location}
                        </Badge>
                      )}
                      {activeProject.date && (
                        <Badge variant="secondary" className="text-xs">
                          {activeProject.date}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {activeProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <CardDescription className="leading-relaxed mt-4">
                      {activeProject.description}
                    </CardDescription>
                  </CardContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Projects;
