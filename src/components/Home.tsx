import { ArrowDown, Linkedin, Github, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useMemo, useState } from "react";

// Simple reusable typewriter hook
function useTypewriter(
  items: string[],
  {
    typeSpeed = 60,
    deleteSpeed = 40,
    pauseOnComplete = 1400,
    pauseBetweenItems = 800,
    loop = true,
    startDelay = 200
  }: {
    typeSpeed?: number;
    deleteSpeed?: number;
    pauseOnComplete?: number;
    pauseBetweenItems?: number;
    loop?: boolean;
    startDelay?: number;
  } = {}
) {
  const [index, setIndex] = useState(0);       // which string
  const [subIndex, setSubIndex] = useState(0); // char position
  const [deleting, setDeleting] = useState(false);
  const [started, setStarted] = useState(false);
  const current = items[index] ?? "";

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    // Completed typing current item
    if (!deleting && subIndex === current.length) {
      const t = setTimeout(() => {
        if (loop || index < items.length - 1) setDeleting(true);
      }, pauseOnComplete);
      return () => clearTimeout(t);
    }
    // Completed deleting, move to next
    if (deleting && subIndex === 0) {
      const next = (index + 1) % items.length;
      const t = setTimeout(() => {
        setDeleting(false);
        setIndex(next);
      }, pauseBetweenItems);
      return () => clearTimeout(t);
    }
    const timeout = setTimeout(() => {
      setSubIndex((v) => v + (deleting ? -1 : 1));
    }, deleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(timeout);
  }, [started, subIndex, deleting, current.length, typeSpeed, deleteSpeed, pauseOnComplete, pauseBetweenItems, loop, index, items.length]);

  return {
    text: current.substring(0, subIndex),
    deleting,
    isComplete: !deleting && subIndex === current.length
  };
}

// Caret component
const Caret = ({ active = true }: { active?: boolean }) => (
  <span className={`inline-block w-[2px] h-[1em] align-[-0.1em] ${active ? 'animate-pulse' : ''} bg-foreground ml-0.5`} />
);

const Hero = () => {

  // Typewriter for roles (loops through items)
  const rolesItems = useMemo(
    () => ["Computer Science", "Finance", "Data Science"],
    []
  );
  const rolesTW = useTypewriter(rolesItems, { loop: true, typeSpeed: 55, deleteSpeed: 40, pauseOnComplete: 900 });

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-6 animate-fade-in overflow-hidden">
      <div className="max-w-4xl text-center space-y-8 relative z-10">
        <div className="inline-block">
          <div className="w-16 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
        </div>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground transition-transform duration-300 hover:-translate-y-2">
          Steven Wu
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
          Senior @{" "}
          <span className="font-medium text-[#FF0000]">
            Boston College
          </span>{" "}
          | <span className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">{rolesTW.text}</span>
          <Caret active={rolesTW.deleting} />
          {" "}
          <p>Software Engineering Intern @ <span className="font-medium text-[#FB8218]">SunFire</span></p>
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button 
            onClick={scrollToProjects}
            variant="default"
            size="lg"
            className="group cursor-pointer hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
          >
            View Work
            <ArrowDown className="ml-2 h-4 w-4 group-hover:shadow-xl hover:-translate-y-2 transition-transform" />
          </Button>
          <Button 
            onClick={scrollToContact}
            variant="outline"
            size="lg"
            className="group cursor-pointer hover:border-primary hover:bg-transparent text-foreground hover:text-foreground transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
          >
            Get in Touch
          </Button>
        </div>
        <div className="flex gap-4 justify-center pt-4">
         <a href="https://github.com/22stevenwu" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
          <Github className="h-5 w-5" />
         </a>
         <a href="https://www.linkedin.com/in/stevenwu-/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
          <Linkedin className="h-5 w-5" />
         </a>
         <a href="https://drive.google.com/file/d/1OnoY7UYerBEjsOr8SX4oF0W72tgtrwPF/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:shadow-xl hover:-translate-y-2" aria-label="Resume">
          <FileText className="h-5 w-5" />
         </a>
         </div>
      </div>
    </section>
  );
};

export default Hero;
