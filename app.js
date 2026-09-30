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
