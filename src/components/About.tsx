const About = () => {
  return (
    <section className="min-h-screen flex items-center px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light mb-12 text-foreground">About</h2>
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-32 bg-primary rounded-full"></div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed pl-8">
            <p className="hover:text-foreground transition-colors duration-300">
              I'm a developer who believes that simplicity is the ultimate sophistication. 
              With a focus on clean, functional design, I create digital solutions that are 
              both beautiful and purposeful.
            </p>
            <p className="hover:text-foreground transition-colors duration-300">
              My approach combines technical expertise with a keen eye for design, ensuring 
              that every project not only works flawlessly but also provides an exceptional 
              user experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
