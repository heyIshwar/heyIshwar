// Site data for ishwar.dev

const SITE = {
  name: "Ishwar Sarade",
  domain: "ishwar.dev",
  origin: "https://ishwar.dev",
  x: "@IshwarSarade",
  headshot: "assets/images/ishwar.jpg",
  defaultTitle: "Ishwar Sarade — Full-Stack & AI Engineer",
  defaultDescription:
    "Full-stack & AI engineer in Hyderabad, Telangana. Builds secure, multi-tenant platforms, RAG pipelines and MCP-based agents — most recently Spear, a law-enforcement intelligence platform.",
};

// group: "eng" = engineering posts (shown first), "essay" = opinion / personal (archive)
const POSTS = [
  {
    file: "inference-cyber-laws-india.md",
    title: "Inference Meets Cyber Laws in India",
    sub: "DPDP, CERT-In, IT Rules — and why frontier models still miss Mumbai",
    date: "2026-07-26",
    read: "11 min",
    tags: ["ai", "compliance", "india"],
    image: "assets/images/blog/inference-cyber-laws-india.jpg",
    group: "eng",
    home: true,
  },
  {
    file: "mcp-playbook.md",
    title: "From Network Tab to MCP: 4-Step Playbook",
    sub: "Build an MCP server that hits your site's APIs — clean and repeatable",
    date: "2025-09-25",
    read: "7 min",
    tags: ["mcp", "apis"],
    group: "eng",
    home: true,
  },
  {
    file: "sniffr.md",
    title: "Introducing Sniffr",
    sub: "Machine security audit CLI — leaked keys, weak permissions, host posture",
    date: "2026-06-10",
    read: "6 min",
    tags: ["security", "cli", "open-source"],
    group: "eng",
    home: true,
  },
  {
    file: "vx-engine.md",
    title: "Introducing VX Engine",
    sub: "A production-ready Node.js backend you can actually build on",
    date: "2025-12-12",
    read: "10 min",
    tags: ["node", "backend", "open-source"],
    group: "eng",
    home: true,
  },
  {
    file: "maccy-pet.md",
    title: "maccy-pet: A Desktop Pet That Holds Your Tasks",
    sub: "Always-on-top Neko for macOS, built with Tauri",
    date: "2026-07-24",
    read: "5 min",
    tags: ["tauri", "macos"],
    group: "eng",
  },
  {
    file: "folder-sort.md",
    title: "Desktop Zero: macOS LaunchAgent File Sorting",
    sub: "Screenshots, recordings and Downloads — just launchd, no AI",
    date: "2026-07-23",
    read: "7 min",
    tags: ["macos", "dx"],
    group: "eng",
  },
  {
    file: "terminal.md",
    title: "Setting Up My Terminal",
    sub: "Fast, pretty, muscle-memory friendly",
    date: "2025-09-25",
    read: "6 min",
    tags: ["terminal", "dx"],
    group: "eng",
  },
  {
    file: "agentic.md",
    title: "Let's Be More Agentic, Shall We?",
    sub: "#learnFromLLM as a mirror, not a subject",
    date: "2026-01-21",
    read: "8 min",
    tags: ["mindset"],
    group: "essay",
  },
  {
    file: "tech-gap.md",
    title: "India's Tech Gap: A Reality Check",
    sub: "Where we actually stand against the USA and China",
    date: "2025-11-17",
    read: "12 min",
    tags: ["india", "essay"],
    group: "essay",
  },
  {
    file: "learn-to-code.md",
    title: "We code to get things (done) (fast)",
    sub: "Why you should learn to code before the world outruns you",
    date: "2025-11-15",
    read: "9 min",
    tags: ["career"],
    group: "essay",
  },
  {
    file: "college-se.md",
    title: "Why don't they teach software engineering like this in college?",
    sub: "One meaningful project across three years",
    date: "2025-07-28",
    read: "8 min",
    tags: ["education"],
    group: "essay",
  },
];

const ROUTE_SEO = {
  home: { title: SITE.defaultTitle, description: SITE.defaultDescription },
  spear: {
    title: "Spear — Law-Enforcement Intelligence Platform | Ishwar Sarade",
    description:
      "Case study: a multi-tenant intelligence platform for police cyber units — Node.js, MongoDB, React, Flutter, multi-agent AI with human-in-the-loop, India-region compliance by design.",
  },
  blog: {
    title: "Writing — Ishwar Sarade",
    description:
      "Engineering notes on AI compliance in India, MCP servers, Node backends, security tooling and developer experience.",
  },
};

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

function updateSeo(route, post) {
  const seo = post
    ? { title: `${post.title} — ${SITE.name}`, description: `${post.sub}. By ${SITE.name}.` }
    : ROUTE_SEO[route] || ROUTE_SEO.home;
  const url = `${SITE.origin}/#/${route === "home" ? "" : route}`;
  const image = `${SITE.origin}/${post?.image || SITE.headshot}`;

  document.title = seo.title;
  setMeta("name", "description", seo.description);
  setMeta("property", "og:type", post ? "article" : "website");
  setMeta("property", "og:title", seo.title);
  setMeta("property", "og:description", seo.description);
  setMeta("property", "og:url", url);
  setMeta("property", "og:image", image);
  setMeta("name", "twitter:title", seo.title);
  setMeta("name", "twitter:description", seo.description);
  setMeta("name", "twitter:image", image);
  setCanonical(url);

  let ld = document.getElementById("ld-post");
  if (post) {
    if (!ld) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.id = "ld-post";
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: seo.description,
      datePublished: post.date,
      author: { "@id": `${SITE.origin}/#person` },
      image,
      url,
      keywords: post.tags.join(", "),
    });
  } else if (ld) {
    ld.remove();
  }
}
