import { useEffect, useRef, useState } from "react";
import { Mail, Github, Linkedin, FileText } from "lucide-react";

const Contact = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [footerVisible, setFooterVisible] = useState(false);
  // Mounted + active states for fade animation
  const [footerMounted, setFooterMounted] = useState(false);
  const [footerActive, setFooterActive] = useState(false);
  const footerTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setFooterVisible(entry.intersectionRatio > 0.2));
      },
      { threshold: [0, 0.2, 0.5] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Handle mounting/unmounting with fade animation
  useEffect(() => {
    // Clear any running timers
    if (footerTimeoutRef.current) {
      clearTimeout(footerTimeoutRef.current);
      footerTimeoutRef.current = null;
    }

    if (footerVisible) {
      // mount then activate (fade in)
      setFooterMounted(true);
      // small delay to allow DOM mount before adding active class
      footerTimeoutRef.current = window.setTimeout(() => {
        setFooterActive(true);
      }, 20);
    } else if (footerMounted) {
      // deactivate (fade out) then unmount
      setFooterActive(false);
      footerTimeoutRef.current = window.setTimeout(() => {
        setFooterMounted(false);
      }, 250); // match transition duration
    }

    return () => {
      if (footerTimeoutRef.current) {
        clearTimeout(footerTimeoutRef.current);
        footerTimeoutRef.current = null;
      }
    };
  }, [footerVisible]);

  return (
    <section ref={sectionRef} id="contact" className="min-h-screen flex items-center px-6 py-24">
      <div className="max-w-4xl mx-auto w-full text-center space-y-12">
        <h2 className="text-4xl md:text-5xl font-semi-bold text-foreground">Let's Connect</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          I'm always eager to share more about my experiences or learn more about yours!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="mailto:wuaye@bc.edu"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Mail className="h-4 w-4" />
            Email Me
          </a>
          <div className="flex gap-4">
            <a
              href="https://github.com/22stevenwu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex size-11 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/stevenwu-/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex size-11 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://drive.google.com/file/d/1OnoY7UYerBEjsOr8SX4oF0W72tgtrwPF/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Resume"
              className="inline-flex size-11 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <FileText className="h-5 w-5" />
            </a>
          </div>
        </div>
      {footerMounted && (
        <>
          <div className="h-16" aria-hidden="true" />
          <footer
            role="contentinfo"
            className={
              "fixed bottom-0 left-0 w-full bg-secondary/30 border-t border-border/50 py-3 text-sm text-muted-foreground z-50 transition-all duration-200 " +
              (footerActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none")
            }
          >
            <div className="w-full px-6 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-left">Created by Steven Wu · Last updated Nov 2025</p>
              </div>
              <div className="flex items-center gap-4">
                <a href="https://github.com/22stevenwu" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
                <a href="https://www.linkedin.com/in/stevenwu-/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="https://drive.google.com/file/d/1OnoY7UYerBEjsOr8SX4oF0W72tgtrwPF/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="Resume">
                  <FileText className="h-4 w-4" />
                </a>
              </div>
            </div>
          </footer>
        </>
      )}
      </div>
    </section>
  );
};

export default Contact;
