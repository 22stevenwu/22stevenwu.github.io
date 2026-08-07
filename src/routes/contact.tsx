import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site-nav";

const contacts = [
  { label: "Email", value: "22stevenwu@gmail.com", href: "mailto:22stevenwu@gmail.com" },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/stevenwu-",
    href: "https://www.linkedin.com/in/stevenwu-/",
  },
  { label: "GitHub", value: "github.com/22stevenwu", href: "https://github.com/22stevenwu" },
  {
    label: "Resume",
    value: "View my resume",
    href: "https://drive.google.com/file/d/1BBQLuoZ_9HQsFLDbRpA04mpk8hjJOCka/view?usp=sharing",
  },
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Steven Wu" },
      {
        name: "description",
        content: "Get in touch with Steven Wu by email, LinkedIn, or GitHub.",
      },
      { property: "og:title", content: "Contact — Steven Wu" },
      { property: "og:description", content: "Email, LinkedIn, and GitHub links." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <PageShell>
      <p className="label-mono">Contact</p>
      <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">Let's talk</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        I'm always willing to share more about my experiences or learn more about
        yours! The fastest way to reach me is email.
      </p>

      <ul className="mt-12 space-y-3">
        {contacts.map((c, index) => (
          <li
            key={c.label}
            className="stagger-in"
            style={{ animationDelay: `${200 + index * 130}ms` }}
          >
            <a
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="card-panel group flex items-center justify-between gap-4 px-6 py-5 transition-[border-color,transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:border-primary"
            >
              <span>
                <span className="label-mono block">{c.label}</span>
                <span className="mt-1 block font-mono text-sm text-foreground">
                  {c.value}
                </span>
              </span>
              <span className="text-lg text-muted-foreground transition-[color,transform] duration-500 ease-out group-hover:translate-x-1 group-hover:text-primary">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
