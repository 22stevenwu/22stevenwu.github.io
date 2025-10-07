import { Mail, Github, Linkedin } from "lucide-react";
import { Button } from "./ui/button";

const Contact = () => {
  return (
    <section id="contact" className="min-h-screen flex items-center px-6 py-24 bg-secondary/30">
      <div className="max-w-4xl mx-auto w-full text-center space-y-12">
        <h2 className="text-4xl md:text-5xl font-light text-foreground">Let's Connect</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          I'm always eager to share more about my experiences or learn more about yours!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="default" size="lg" asChild>
            <a href="mailto:hello@example.com" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Me
            </a>
          </Button>
          <div className="flex gap-4">
            <Button variant="outline" size="icon" asChild>
              <a href="https://github.com/22stevenwu" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href="https://www.linkedin.com/in/stevenwu-/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
        <footer className="pt-12 text-sm text-muted-foreground">
          <p>© 2025 All rights reserved.</p>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
