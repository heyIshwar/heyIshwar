// Tiny hash router: home + spear are static HTML; blog views are rendered here.

const VIEW_IDS = ["home", "spear", "blog", "post"];
const HOME_ANCHORS = new Set(["about", "work", "experience", "opensource", "writing", "contact"]);
const LEGACY_TO_HOME = new Set(["readme.md", "now.md", "work.yaml", "resume.md", "projects", "projects/", "github", "github/"]);

const fmtDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });

function postRow(p) {
  return `<a class="post-row" href="#/blog/${p.file}">
    <span class="post-date">${fmtDate(p.date)}</span>
    <span class="post-main"><span class="post-title">${p.title}</span><span class="post-sub">${p.sub}</span></span>
    <span class="post-meta">${p.read}</span>
  </a>`;
}

function renderHomeWriting() {
  document.getElementById("home-posts").innerHTML = POSTS.filter((p) => p.home).map(postRow).join("");
}

function renderBlogIndex() {
  const eng = POSTS.filter((p) => p.group === "eng");
  const essays = POSTS.filter((p) => p.group === "essay");
  document.getElementById("blog-eng").innerHTML = eng.map(postRow).join("");
  document.getElementById("blog-essays").innerHTML = essays.map(postRow).join("");
}

function renderPost(post) {
  const html = window.BLOG_CONTENT?.[post.file] || "<p>Content missing.</p>";
  document.getElementById("post-body").innerHTML = `
    <a class="back" href="#/blog">← All writing</a>
    <div class="post-eyebrow">${fmtDate(post.date)} · ${post.read} · ${post.tags.join(", ")}</div>
    <h1 class="post-h1">${post.title}</h1>
    <p class="post-lede">${post.sub}</p>
    ${post.image ? `<img class="post-cover" src="${post.image}" alt="${post.title}" decoding="async">` : ""}
    <div class="prose">${html}</div>
    <a class="back back-bottom" href="#/blog">← All writing</a>`;
}

function show(view) {
  VIEW_IDS.forEach((id) => {
    document.getElementById("view-" + id).hidden = id !== view;
  });
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const target = a.dataset.nav;
    a.classList.toggle("active", target === view || (view === "post" && target === "blog"));
  });
}

function route() {
  const raw = decodeURIComponent(location.hash.replace(/^#\/?/, "")).replace(/\/$/, "");
  let view = "home";
  let post = null;
  let anchor = null;

  if (raw === "spear") view = "spear";
  else if (raw === "blog") view = "blog";
  else if (raw.startsWith("blog/")) {
    post = POSTS.find((p) => p.file === raw.slice(5));
    view = post ? "post" : "blog";
  } else if (HOME_ANCHORS.has(raw)) anchor = raw;
  else if (raw && !LEGACY_TO_HOME.has(raw)) view = "home";

  show(view);
  if (view === "blog") renderBlogIndex();
  if (view === "post") renderPost(post);
  updateSeo(view === "post" ? `blog/${post.file}` : view, post);

  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.hash,
      page_title: document.title,
      page_location: location.href,
    });
  }

  if (anchor) {
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo(0, 0);
  }
}

renderHomeWriting();
window.addEventListener("hashchange", route);
route();

// ---------- motion ----------
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Split hero headline into words for a staggered entrance.
const h1 = document.querySelector(".hero h1");
if (h1 && !reduceMotion) {
  h1.innerHTML = h1.textContent
    .trim()
    .split(/\s+/)
    .map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`)
    .join(" ");
}

const io = "IntersectionObserver" in window && !reduceMotion
  ? new IntersectionObserver(
      (entries) => {
        // Reveal everything that just came into view one after another, in reading order.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((x, y) => {
            const a = x.target.getBoundingClientRect(), b = y.target.getBoundingClientRect();
            return a.top - b.top || a.left - b.left;
          });
        visible.forEach((e, i) => {
          const step = e.target.classList.contains("sm") ? 55 : 95;
          e.target.style.setProperty("--d", Math.min(i * step, 900) + "ms");
          e.target.classList.add("in");
          setTimeout(() => e.target.classList.add("done"), 1300 + i * step);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )
  : null;

function initReveal() {
  const targets = document.querySelectorAll(
    ".block > h2, .feature, .pillar, .job, .edu, .repo, .post-row, .more-link, .page .lead, .doc > h2, .doc > p, .doc > ul, .doc > .tags, .note, figure.diagram, .list-h, .prose > *, .pillar li, .feature .tag"
  );
  targets.forEach((el) => {
    if (el.dataset.rv) return;
    el.dataset.rv = "1";
    if (!io) return;
    if (!el.matches("figure.diagram")) el.classList.add("reveal");
    if (el.matches(".pillar li, .feature .tag")) el.classList.add("sm");
    io.observe(el);
  });
}

// Scroll progress bar.
const bar = document.getElementById("progress");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
}
let ticking = false;
addEventListener("scroll", () => {
  onScroll();
  if (ticking || !io) return;
  ticking = true;
  requestAnimationFrame(() => {
    // Safety net: anything already scrolled past (fast scroll, anchor jump) must never stay hidden.
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
      if (el.offsetParent !== null && el.getBoundingClientRect().bottom < 0) {
        el.classList.add("in", "done");
        io.unobserve(el);
      }
    });
    ticking = false;
  });
}, { passive: true });

initReveal();
window.addEventListener("hashchange", () => requestAnimationFrame(initReveal));

// Soft spotlight that follows the cursor on the featured card.
document.querySelectorAll(".feature").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  });
});
