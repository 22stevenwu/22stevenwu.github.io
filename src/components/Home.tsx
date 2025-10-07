import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-6 animate-fade-in overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl text-center space-y-8 relative z-10">
        <div className="inline-block">
          <div className="w-16 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
        </div>
        <h1 className="text-5xl md:text-7xl font-semi-bold tracking-tight text-foreground hover:text-[#454545] transition-all duration-300 hover:animate-bounce">
          Steven Wu
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
          Senior @{" "}
          <span
            className="font-medium text-[#8A100B] hover:text-[#BDA06A] transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Boston College
          </span>{" "}
          | CS, Finance, & Data Science | Software Engineering Intern @{" "}
          <span
            className="font-medium text-[#FB8218] hover:text-[#d65a00] transition-all duration-300 transform hover:scale-110 inline-block"
          >
            SunFire
          </span>
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button 
            onClick={scrollToProjects}
            variant="default"
            size="lg"
            className="group shadow-lg hover:shadow-xl transition-all"
          >
            View Work
            <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
          </Button>
          <Button 
            variant="outline"
            size="lg"
            asChild
            className="hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <a href="#contact">Get in Touch</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
