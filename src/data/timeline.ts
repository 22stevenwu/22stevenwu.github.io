export type Position = {
  title: string;
  employmentType?: string; // e.g. "Full-time", "Internship"
  period: string;
  team?: string;
  bullets: string[];
};

export type ExperienceEntry = {
  org: string;
  period?: string; // overall span across all positions, shown in the sidebar
  location?: string;
  href?: string;
  // Ordered most-recent-first. More than one position means career
  // progression at the same company (e.g. intern -> full-time).
  positions: Position[];
};

export type ProjectEntry = {
  title: string;
  org: string;
  period?: string;
  stack: string[];
  bullets: string[];
  href?: string;
};

// Edit these lists — the About page's Experience and Projects sections render from here.
export const experience: ExperienceEntry[] = [
  {
    org: "SunFire",
    href: "https://www.sunfireinc.com/",
    positions: [
      {
        title: "Software Engineer I",
        period: "Jul 2026 — Present",
        team: "Internal Platform team",
        bullets: [
          "Converted to a full-time Software Engineer I role after the internship, continuing to build and ship features across Sunfire's Internal Platforms.",
        ],
      },
      {
        title: "Software Engineer Intern",
        period: "May 2025 — Jun 2026",
        team: "TRANZACT & Apollo teams",
        bullets: [
          "Built and refined React/TypeScript components across Sunfire's TRANZACT and Apollo platforms, supporting Medicare enrollment workflows.",
          "Led the migration of the end-to-end testing suite from Cypress to Playwright, reducing test flakiness and improving execution speed.",
        ],
      },
    ],
  },
  {
    org: "Boston College EagleTech",
    href: "https://www.bc.edu/content/bc-web/offices/its/about/student-staff.html",
    positions: [
      {
        title: "Technology Consultant",
        period: "Aug 2023 — May 2026",
        bullets: [
          "Support 100+ faculty and staff by diagnosing system configuration issues and resolving software and hardware problems.",
          "Monitor a database of 10,000+ digital service tickets to detect anomalies and security risks.",
        ],
      },
    ],
  },
  {
    org: "Ricoh USA",
    href: "https://www.ricoh-usa.com/en",
    positions: [
      {
        title: "Quality Assurance Intern",
        period: "Jul 2024 — Aug 2024",
        bullets: [
          "Automated regression testing and evaluated API scalability with Apache JMeter and Postman for Ricoh's Delivery CTRL Service.",
          "Reduced manual QA workload by 15 hours per month through LeapWork automation and authored system design documentation.",
        ],
      },
    ],
  },
];

export const projects: ProjectEntry[] = [
  {
    title: "Boston College TA Application Platform",
    org: "Research Project",
    period: "Jan 2026 — May 2026",
    stack: ["Python", "Django", "PostgreSQL", "TailwindCSS"],
    bullets: [
      "Developed a TA hiring platform for BC CS students, serving 430+ users across 55 courses, with automated workflows for 200+ applications.",
      "Advised by BC CS Program Director, Professor Maira Marques Samary.",
    ],
    href: "https://github.com/mairasamary/bc-tasystem-2024/tree/dev",
  },
  {
    title: "Crime in Boston Spillover Analysis",
    org: "Research Project",
    period: "Aug 2025 — Dec 2026",
    stack: ["Python", "Pandas", "NumPy", "Matplotlib"],
    bullets: [
      "Analyzing Boston crime data with a temporal Bivariate Hawkes Process to measure spillover, near-repeat patterns, and cross-district contagion.",
      "Advised by Dr. Youness Diouane on spatiotemporal modeling techniques.",
    ],
    href: "https://github.com/younesszs/O2O",
  },
  {
    title: "FairShare",
    org: "Personal Project",
    period: "Dec 2024 — Jan 2025",
    stack: ["Django", "Bootstrap", "Figma"],
    bullets: [
      "Full-stack web app for creating bills and splitting costs across multiple participants with real-time updates.",
    ],
    href: "https://github.com/22stevenwu/FairShare",
  },
  {
    title: "GreenUp!",
    org: "Personal Project",
    period: "Sep 2024 — Dec 2024",
    stack: ["Django", "PostgreSQL", "Google OAuth", "Figma"],
    bullets: [
      "Gamified sustainability app for BC students to track eco-friendly actions, earn points, and compete on leaderboards.",
    ],
    href: "https://github.com/22stevenwu/GreenUp",
  },
];
