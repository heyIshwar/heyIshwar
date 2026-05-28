// Site data — ishwar.dev content in ved1beta IDE layout

const SITE = {
  name: "Ishwar",
  handle: "heyIshwar",
  domain: "ishwar.dev",
  role: "Web & AI Engineer",
  tagline: "Full stack developer. Casual blogger.",
  blurb:
    "I build web apps and backends, poke at AI/agent tooling, and write about what I learn on ishwar.dev — from VX Engine to MCP playbooks and the occasional reality check on tech in India.",
  quote: "Stay Hungry, Stay Foolish!",
  quoteAttribution: "Steve Jobs",
  headshot:
    "https://ishwar.dev/wp-content/uploads/2025/11/IMG_20250906_170613692-edited-scaled.jpg",
  x: "@IshwarSarade",
  github: "heyIshwar",
  instagram: "hey_ishwar",
  youtube: "@ishwarsarade",
};

// Crowdfunding homies — from ishwar.dev footer
const SPONSORS = [
  { name: "Dhananjay", url: "https://www.instagram.com/__28dhananjay/" },
  { name: "Furqan", url: "https://www.instagram.com/furqan_ashaie/" },
  { name: "Stalin", url: "https://www.instagram.com/stalin___07/" },
  { name: "Tejas", url: "https://www.instagram.com/tejas.ikhe/" },
  { name: "Dishant", url: "https://www.linkedin.com/in/dishant-manhas-8b545b18b/" },
];

const WORK = [
  {
    who: "Independent",
    role: "Web & AI Engineer",
    when: "present",
    what:
      "Shipping full-stack products, open-source tools (VX Engine, MCP utilities), and long-form posts on engineering culture, agents, and developer experience.",
  },
  {
    who: "Writing",
    role: "Blogger @ ishwar.dev",
    when: "2025 — present",
    what:
      "Essays on agentic living, Node backends, India's tech gap, learning to code, terminal setup, and turning network tabs into MCP servers.",
  },
];

const PROJECTS = [
  {
    name: "VX Engine",
    sub: "production-ready Node.js backend you can build on",
    desc:
      "Consolidated years of repeated backend setup — auth, uploads, logging, email, cron, backups — into one reusable, scalable open-source foundation. The subject of my launch post on ishwar.dev.",
    repo: "heyIshwar/vx-engine",
    url: "https://github.com/heyIshwar/vx-engine",
    stack: "Node.js · Express · MongoDB",
    featured: true,
  },
  {
    name: "linkedin-bulk-unfollow",
    sub: "compliant LinkedIn network cleanup",
    desc:
      "Secure tool for bulk unfollowing connections — built with TypeScript and a focus on staying within platform boundaries.",
    repo: "heyIshwar/linkedin-bulk-unfollow",
    url: "https://github.com/heyIshwar/linkedin-bulk-unfollow",
    stack: "TypeScript",
    featured: true,
  },
  {
    name: "react-xp-clone",
    sub: "Windows XP desktop in the browser",
    desc:
      "Faithful recreation of the Windows XP desktop experience in React — boot sequence, taskbar, and nostalgic UI details.",
    repo: "heyIshwar/react-xp-clone",
    url: "https://github.com/heyIshwar/react-xp-clone",
    stack: "React · CSS",
    featured: true,
  },
  {
    name: "windows-mern-tools",
    sub: "PowerShell dev environment bootstrap",
    desc:
      "Automates installing essential developer tools and utilities on Windows for MERN-style workflows.",
    repo: "heyIshwar/windows-mern-tools",
    url: "https://github.com/heyIshwar/windows-mern-tools",
    stack: "PowerShell",
  },
  {
    name: "speed-reader",
    sub: "read faster in the browser",
    desc: "A small JavaScript experiment for speed-reading style text presentation.",
    repo: "heyIshwar/speed-reader",
    url: "https://github.com/heyIshwar/speed-reader",
    stack: "JavaScript",
  },
];

const POSTS = [
  {
    slug: "lets-be-more-agentic-shall-we",
    file: "agentic.md",
    title: "Let's Be More Agentic, Shall We?",
    sub: "To the self, not to an LLM — #learnFromLLM as mirror, not subject",
    date: "2026-01-21",
    read: "8 min",
    tags: ["life", "agents", "mindset"],
    url: "https://ishwar.dev/2026/01/21/lets-be-more-agentic-shall-we/",
    featured: true,
  },
  {
    slug: "introducing-vx-engine",
    file: "vx-engine.md",
    title: "Introducing VX Engine",
    sub: "A production-ready Node.js backend you can actually build on",
    date: "2025-12-12",
    read: "10 min",
    tags: ["node", "open-source", "backend"],
    url: "https://ishwar.dev/2025/12/12/introducing-vx-engine/",
    featured: true,
  },
  {
    slug: "indias-tech-gap",
    file: "tech-gap.md",
    title: "India's Tech Gap: A Reality Check",
    sub: "Where we actually stand against USA and China",
    date: "2025-11-17",
    read: "12 min",
    tags: ["india", "tech", "essay"],
    url: "https://ishwar.dev/2025/11/17/indias-tech-gap-a-reality-check-on-where-we-actually-stand-against-usa-and-china-%f0%9f%87%ae%f0%9f%87%b3-vs-%f0%9f%87%ba%f0%9f%87%b8-vs-%f0%9f%87%a8%f0%9f%87%b3/",
  },
  {
    slug: "we-code-to-get-things-done",
    file: "learn-to-code.md",
    title: "we code to get things (done) (fast)",
    sub: "Why you should learn to code before the world outruns you",
    date: "2025-11-15",
    read: "9 min",
    tags: ["career", "coding"],
    url: "https://ishwar.dev/2025/11/15/we-code-to-get-things-done/",
  },
  {
    slug: "from-network-tab-to-mcp",
    file: "mcp-playbook.md",
    title: "From Network Tab to MCP: 4-Step Playbook!",
    sub: "Build an MCP that hits your site's APIs — clean and repeatable",
    date: "2025-09-25",
    read: "7 min",
    tags: ["mcp", "apis", "tutorial"],
    url: "https://ishwar.dev/2025/09/25/from-network-tab-to-mcp-4-step-playbook/",
  },
  {
    slug: "setting-up-my-terminal",
    file: "terminal.md",
    title: "Setting Up My Terminal",
    sub: "Fast, pretty, muscle-memory friendly",
    date: "2025-09-25",
    read: "6 min",
    tags: ["terminal", "dx"],
    url: "https://ishwar.dev/2025/09/25/setting-up-my-terminal-%f0%9f%96%a5%ef%b8%8f%e2%9a%a1/",
  },
  {
    slug: "why-dont-they-teach-se",
    file: "college-se.md",
    title: "Why don't they teach software engineering like this in college?",
    sub: "One meaningful project across three years — without waiting for syllabus reform",
    date: "2025-07-28",
    read: "8 min",
    tags: ["education", "engineering"],
    url: "https://ishwar.dev/2025/07/28/why-dont-they-teach-software-engineering-like-this-in-college/",
  },
];

const NOW = [
  "Extending VX Engine and documenting patterns on ishwar.dev.",
  "Writing about agentic living — applied to humans, not just LLMs.",
  "Experimenting with MCP servers built from real site APIs.",
  "Keeping the terminal setup sharp (see latest post).",
];

function Tag({ children, accent }) {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        padding: "3px 7px",
        border: "1px solid var(--border)",
        borderRadius: 3,
        color: accent ? "var(--accent)" : "var(--muted)",
        borderColor: accent
          ? "color-mix(in oklab, var(--accent) 40%, transparent)"
          : "var(--border)",
        background: accent
          ? "color-mix(in oklab, var(--accent) 8%, transparent)"
          : "transparent",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Dot({ color = "var(--accent)" }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: 999,
        background: color,
        verticalAlign: "middle",
      }}
    />
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--border)", width: "100%" }} />;
}

Object.assign(window, { SITE, WORK, PROJECTS, POSTS, NOW, Tag, Dot, Divider });
