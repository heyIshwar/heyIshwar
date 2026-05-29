// IDE portfolio layout (ved1beta-style) — ishwar.dev content

const EXPLORER_TREE = [
  { type: "file", id: "readme.md", label: "readme.md", ext: "md" },
  { type: "file", id: "now.md", label: "now.md", ext: "md" },
  { type: "file", id: "work.yaml", label: "work.yaml", ext: "yaml" },
  { type: "file", id: "resume.md", label: "resume.md", ext: "md" },
  { type: "folder", id: "projects/", label: "projects", leaf: true },
  { type: "folder", id: "github/", label: "github", leaf: true },
  {
    type: "folder",
    id: "blog",
    label: "blog",
    indexId: "blog/",
    children: [
      { type: "file", id: "blog/", label: "index.md", ext: "md" },
      ...POSTS.map((p) => ({
        type: "file",
        id: `blog/${p.file}`,
        label: p.file,
        ext: "md",
      })),
    ],
  },
  { type: "file", id: "contact", label: "contact.md", ext: "md" },
];

function IconChevron({ open, color = "var(--muted)" }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: open ? "rotate(90deg)" : "none",
        transition: "transform 0.15s ease",
        flexShrink: 0,
      }}
    >
      <path d="M3 2 L7 5 L3 8" />
    </svg>
  );
}

function IconFolder({ open, color = "currentColor" }) {
  return open ? (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="1.15"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M2 5.5h5l1.2 1.8H14V13H2V5.5z" />
      <path d="M2 5.5V4.5h5l1.2 1H14" />
    </svg>
  ) : (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="1.15"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M2 4h5.2l1.3 2H14v7.5H2V4z" />
    </svg>
  );
}

function IconFile({ ext = "file", color = "currentColor" }) {
  const tab =
    ext === "md" ? "#6cb6ff" : ext === "yaml" ? "#d4a574" : ext === "json" ? "#f0c674" : "#888";

  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="1.15"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M4.5 2.5h4.8l2.2 2.2v8.8H4.5V2.5z" />
      <path d="M9.3 2.5v2.2h2.2" />
      <path d="M4.5 2.5v11" stroke={tab} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function ExplorerRow({ depth, active, onSelect, node, open, onToggle }) {
  const isFolder = node.type === "folder";
  const hasChildren = isFolder && node.children?.length;
  const navId = isFolder && !node.leaf ? node.indexId || node.id : node.id;
  const isActive =
    active === node.id ||
    active === navId ||
    (isFolder && !node.leaf && active === node.indexId);

  const iconColor = isActive ? "var(--accent)" : "var(--muted)";

  function handleClick() {
    const target = isFolder ? node.indexId || node.id : node.id;
    if (hasChildren && !open) onToggle(node.id);
    onSelect(target);
  }

  function handleChevron(e) {
    e.stopPropagation();
    if (hasChildren) onToggle(node.id);
  }

  return (
    <div
      className="explorer-row"
      onClick={handleClick}
      style={{
        padding: "4px 10px 4px 0",
        paddingLeft: 8 + depth * 14,
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontFamily: "var(--mono)",
        fontSize: 12,
        color: isActive ? "var(--accent)" : "var(--fg-dim)",
        background: isActive
          ? "color-mix(in oklab, var(--accent) 7%, transparent)"
          : "transparent",
        borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <span
        onClick={hasChildren ? handleChevron : undefined}
        style={{
          width: 14,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: hasChildren ? 1 : 0,
          cursor: hasChildren ? "pointer" : "default",
        }}
      >
        {hasChildren ? <IconChevron open={open} color={iconColor} /> : null}
      </span>
      {isFolder ? (
        <IconFolder open={hasChildren && open} color={iconColor} />
      ) : (
        <IconFile ext={node.ext} color={iconColor} />
      )}
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {node.label}
        {node.leaf ? "/" : ""}
      </span>
    </div>
  );
}

function Explorer({ active, onSelect, onClose }) {
  const [openFolders, setOpenFolders] = React.useState({ blog: true, root: true });

  React.useEffect(() => {
    if (active.startsWith("blog")) {
      setOpenFolders((o) => ({ ...o, blog: true, root: true }));
    }
  }, [active]);

  function toggle(id) {
    setOpenFolders((o) => ({ ...o, [id]: !o[id] }));
  }

  function renderNode(node, depth) {
    const rows = [
      <ExplorerRow
        key={node.id}
        depth={depth}
        active={active}
        node={node}
        open={!!openFolders[node.id]}
        onToggle={toggle}
        onSelect={onSelect}
      />,
    ];
    if (node.type === "folder" && node.children?.length && openFolders[node.id]) {
      node.children.forEach((child) => {
        rows.push(...renderNode(child, depth + 1));
      });
    }
    return rows;
  }

  return (
    <div style={{ padding: "18px 0" }}>
      <div
        style={{
          padding: "0 16px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--muted)",
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          Explorer
        </div>
        {onClose && (
          <button type="button" className="show-sm ide-menu-btn" onClick={onClose}>
            ✕
          </button>
        )}
      </div>
      <ExplorerRow
        depth={0}
        active={active}
        node={{ type: "folder", id: "root", label: SITE.domain, indexId: "readme.md", children: EXPLORER_TREE }}
        open={!!openFolders.root}
        onToggle={toggle}
        onSelect={onSelect}
      />
      {openFolders.root &&
        EXPLORER_TREE.flatMap((node) => renderNode(node, 1))}
      <div
        style={{
          padding: "20px 16px 8px",
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "var(--muted)",
          letterSpacing: 0.8,
          textTransform: "uppercase",
        }}
      >
        Links
      </div>
      {[
        { label: SITE.domain, href: "https://ishwar.dev" },
        { label: `github/${SITE.github}`, href: `https://github.com/${SITE.github}` },
        { label: `x/${SITE.x.slice(1)}`, href: "https://x.com/IshwarSarade" },
        { label: `ig/${SITE.instagram}`, href: "https://www.instagram.com/hey_ishwar/" },
      ].map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="explorer-row"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 16px 4px 36px",
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--fg-dim)",
            textDecoration: "none",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="var(--muted)" strokeWidth="1.2">
            <path d="M6 3h7v7M13 3L5 11M9 11H3v6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {link.label}
        </a>
      ))}
    </div>
  );
}

function CmdK({ open, onClose, onNav }) {
  const [q, setQ] = React.useState("");
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 20);
    else setQ("");
  }, [open]);

  const items = [
    { id: "readme.md", label: "readme — intro", kind: "page" },
    { id: "now.md", label: "now — this week", kind: "page" },
    { id: "work.yaml", label: "work — experience", kind: "page" },
    { id: "resume.md", label: "resume — pdf + cv", kind: "page" },
    { id: "projects/", label: "projects", kind: "page" },
    { id: "github/", label: "github — all repos", kind: "page" },
    { id: "blog/", label: "blog — index", kind: "page" },
    ...POSTS.map((p) => ({
      id: `blog/${p.file}`,
      label: p.title.toLowerCase(),
      kind: "post",
    })),
    { id: "contact", label: "contact", kind: "page" },
    {
      id: "ext:site",
      label: "ishwar.dev (wordpress)",
      kind: "link",
      href: "https://ishwar.dev",
    },
    {
      id: "ext:github",
      label: "github.com/heyIshwar",
      kind: "link",
      href: "https://github.com/heyIshwar",
    },
    {
      id: "ext:x",
      label: "x / @IshwarSarade",
      kind: "link",
      href: "https://x.com/IshwarSarade",
    },
    {
      id: "ext:yt",
      label: "youtube / @ishwarsarade",
      kind: "link",
      href: "https://www.youtube.com/@ishwarsarade",
    },
  ];

  const filtered = items.filter((x) =>
    x.label.toLowerCase().includes(q.toLowerCase())
  );
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    setIdx(0);
  }, [q]);

  function runItem(it) {
    if (it.kind === "link") window.open(it.href, "_blank");
    else onNav(it.id);
    onClose();
  }

  if (!open) return null;
  return (
    <div
      className="cmdk-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
      }}
    >
      <div
        className="cmdk-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0d0d0d",
          border: "1px solid var(--border)",
          borderRadius: 6,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 18px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: 13 }}>
            ›
          </span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              else if (e.key === "ArrowDown") {
                e.preventDefault();
                setIdx((i) => Math.min(filtered.length - 1, i + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIdx((i) => Math.max(0, i - 1));
              } else if (e.key === "Enter" && filtered[idx]) runItem(filtered[idx]);
            }}
            placeholder="jump to…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--fg)",
              fontFamily: "var(--sans)",
              fontSize: 15,
            }}
          />
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--muted)",
              letterSpacing: 0.6,
              border: "1px solid var(--border)",
              padding: "3px 6px",
              borderRadius: 3,
            }}
          >
            esc
          </span>
        </div>
        <div style={{ maxHeight: 380, overflow: "auto", padding: "6px 0" }}>
          {filtered.length === 0 && (
            <div style={{ padding: "16px 18px", color: "var(--muted)", fontSize: 13 }}>
              No matches.
            </div>
          )}
          {filtered.map((it, i) => (
            <div
              key={it.id}
              onMouseEnter={() => setIdx(i)}
              onClick={() => runItem(it)}
              style={{
                padding: "10px 18px",
                display: "flex",
                justifyContent: "space-between",
                background:
                  i === idx
                    ? "color-mix(in oklab, var(--accent) 10%, transparent)"
                    : "transparent",
                borderLeft:
                  i === idx ? "2px solid var(--accent)" : "2px solid transparent",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              <span style={{ color: i === idx ? "var(--fg)" : "var(--fg-dim)" }}>
                {it.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "var(--muted)",
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                }}
              >
                {it.kind}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "9px 18px",
            display: "flex",
            gap: 18,
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--muted)",
            letterSpacing: 0.5,
          }}
        >
          <span>
            <span style={{ color: "var(--accent)" }}>↑↓</span> navigate
          </span>
          <span>
            <span style={{ color: "var(--accent)" }}>↵</span> open
          </span>
          <span>
            <span style={{ color: "var(--accent)" }}>esc</span> close
          </span>
        </div>
      </div>
    </div>
  );
}

function VariationIDE() {
  const [active, setActive] = React.useState("readme.md");
  const [palette, setPalette] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  function navigate(id) {
    setActive(id);
    setSidebarOpen(false);
  }

  React.useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      } else if (e.key === "Escape") {
        setPalette(false);
        setSidebarOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="ide-shell">
      <CmdK open={palette} onClose={() => setPalette(false)} onNav={navigate} />

      <div className="ide-topbar">
        <div className="ide-topbar-left">
          <button
            type="button"
            className="ide-menu-btn"
            aria-label="Open explorer"
            onClick={() => setSidebarOpen(true)}
          >
            ☰ files
          </button>
          <div className="hide-sm" style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#2a2a2a" }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#2a2a2a" }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#2a2a2a" }} />
          </div>
          <span className="ide-topbar-path">~/{SITE.domain}</span>
          <span className="hide-sm" style={{ color: "var(--accent)" }}>
            · main
          </span>
        </div>
        <div className="ide-topbar-right">
          <button
            type="button"
            className="ide-palette-btn"
            onClick={() => setPalette(true)}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--fg-dim)",
              fontFamily: "var(--mono)",
              fontSize: 10,
              padding: "4px 10px",
              borderRadius: 3,
              letterSpacing: 0.5,
              cursor: "pointer",
            }}
          >
            <span className="hide-sm">⌘K palette</span>
            <span className="show-sm">⌘K</span>
          </button>
          <span className="hide-sm">·</span>
          <span style={{ color: "var(--accent)", whiteSpace: "nowrap" }}>
            <Dot /> <span className="hide-sm">online</span>
          </span>
        </div>
      </div>

      <div
        className={`ide-backdrop${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      <div className={`ide-sidebar${sidebarOpen ? " open" : ""}`}>
        <Explorer active={active} onSelect={navigate} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="ide-main">
        <IDEContent active={active} onNav={navigate} />
      </div>

      <div className="ide-footer">
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <span style={{ color: "var(--accent)" }}>● ready</span>
          <span className="hide-sm">utf-8</span>
          <span className="hide-sm">LF</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "42vw" }}>
            {active}
          </span>
        </div>
        <div className="ide-footer-sponsors">
          <span style={{ color: "var(--fg-dim)" }}>homies answered crowdfunding ❤ thanks</span>
          {SPONSORS.map((s, i) => (
            <React.Fragment key={s.name}>
              {i > 0 && <span style={{ color: "var(--border)" }}>·</span>}
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--fg-dim)", textDecoration: "none" }}
              >
                {s.name}
              </a>
            </React.Fragment>
          ))}
        </div>
        <div className="hide-sm" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <span>press ⌘K to jump</span>
          <span>spaces: 2</span>
        </div>
      </div>
    </div>
  );
}

function IDEContent({ active, onNav }) {
  if (active === "now.md") return <NowDoc />;
  if (active === "work.yaml") return <WorkDoc />;
  if (active === "resume.md") return <ResumeDoc />;
  if (active === "projects/") return <ProjectsDoc />;
  if (active === "github/") return <GitHubDoc />;
  if (active === "blog/") return <BlogIndexDoc onNav={onNav} />;
  const post = POSTS.find((p) => `blog/${p.file}` === active);
  if (post) return <BlogPostDoc post={post} />;
  if (active === "contact") return <ContactDoc />;
  return <ReadmeDoc onNav={onNav} />;
}

function docHeader(name) {
  return (
    <div
      style={{
        fontFamily: "var(--mono)",
        fontSize: 10,
        color: "var(--muted)",
        letterSpacing: 0.8,
        marginBottom: 28,
        textTransform: "uppercase",
      }}
    >
      {name}
    </div>
  );
}

function useGitHubRepos(fallback) {
  const [repos, setRepos] = React.useState(fallback);
  const [status, setStatus] = React.useState("static");

  React.useEffect(() => {
    let cancelled = false;
    const CACHE_KEY = "ishwar:latest-repos";
    const TTL_MS = 10 * 60 * 1000;

    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached && Date.now() - cached.t < TTL_MS && Array.isArray(cached.repos)) {
          setRepos(cached.repos);
          setStatus("live");
          return;
        }
      }
    } catch {}

    fetch(
      `https://api.github.com/users/${SITE.github}/repos?sort=updated&per_page=30`
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        const items = data
          .filter((r) => !r.fork)
          .map((r) => ({
            name: r.name,
            desc: r.description || "",
            url: r.html_url,
            lang: r.language || "—",
            stars: r.stargazers_count,
            updated: (r.pushed_at || r.updated_at || "").slice(0, 10),
          }));
        setRepos(items);
        setStatus("live");
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), repos: items }));
        } catch {}
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return [repos, status];
}

function ReadmeDoc({ onNav }) {
  const latestPost = POSTS[0];
  const featured = PROJECTS.filter((p) => p.featured);
  const currentFocus = NOW[0];

  const wireKind = {
    color: "var(--accent)",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontSize: 10,
  };
  const wireMeta = { color: "var(--muted)", fontSize: 11 };

  return (
    <div style={{ maxWidth: 760 }}>
      {docHeader("# readme.md")}

      {SITE.openToWork && (
        <div
          style={{
            marginBottom: 28,
            padding: "14px 18px",
            border: "1px solid color-mix(in oklab, var(--accent) 40%, var(--border))",
            borderRadius: 6,
            background: "color-mix(in oklab, var(--accent) 9%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--accent)",
                letterSpacing: 0.6,
              }}
            >
              <Dot /> OPEN TO WORK
            </div>
            <div style={{ marginTop: 6, fontSize: 15, color: "var(--fg)", lineHeight: 1.45 }}>
              {SITE.openToWorkNote}
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--muted)",
              }}
            >
              {SITE.email} · {SITE.location}
            </div>
          </div>
          <span
            onClick={() => onNav("resume.md")}
            style={{
              color: "var(--accent)",
              fontFamily: "var(--mono)",
              fontSize: 12,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            resume.md →
          </span>
        </div>
      )}

      <div className="readme-hero-row" style={{ marginBottom: 30 }}>
        <img
          src={SITE.headshot}
          alt={SITE.name}
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            objectFit: "cover",
            border: "1px solid var(--border)",
            filter: "grayscale(0.1) contrast(1.02)",
          }}
        />
        <div>
          <div style={{ fontSize: 16, color: "var(--fg)" }}>{SITE.name}</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--muted)" }}>
            {SITE.role.toLowerCase()} · {SITE.github}
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: "var(--mono)",
              fontSize: 10.5,
              color: "var(--muted)",
              letterSpacing: 0.3,
            }}
          >
            <Dot /> latest post:{" "}
            <span
              onClick={() => onNav(`blog/${latestPost.file}`)}
              style={{ color: "var(--accent)", cursor: "pointer" }}
            >
              {latestPost.slug}
            </span>
            <span style={{ color: "#444" }}> · </span>
            <span>{latestPost.date}</span>
          </div>
        </div>
      </div>

      <h1 className="doc-hero">
        Web, AI,<br />
        and things that ship.
      </h1>
      <div
        style={{
          marginTop: 18,
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 17,
          color: "var(--muted)",
          lineHeight: 1.5,
        }}
      >
        — &ldquo;{SITE.quote}&rdquo;
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, marginLeft: 8 }}>
          {SITE.quoteAttribution}
        </span>
      </div>

      <p style={{ marginTop: 28, fontSize: 17, lineHeight: 1.65, color: "var(--fg-dim)" }}>
        {SITE.tagline} I write on{" "}
        <a
          href="https://ishwar.dev"
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          ishwar.dev
        </a>{" "}
        and open-source on{" "}
        <span style={{ color: "var(--accent)" }}>GitHub</span> — backends, agents, MCP tooling,
        and the occasional nostalgic React experiment.
      </p>

      <pre
        style={{
          marginTop: 36,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          padding: 20,
          fontFamily: "var(--mono)",
          fontSize: 12.5,
          color: "var(--fg-dim)",
          overflow: "auto",
          lineHeight: 1.6,
        }}
      >
        {`# build  →  ship  →  write.

web:    `}
        <span style={{ color: "var(--accent)" }}>node</span>
        {` · `}
        <span style={{ color: "var(--accent)" }}>react</span>
        {` · `}
        <span style={{ color: "var(--accent)" }}>apis</span>
        {` · `}
        <span style={{ color: "var(--accent)" }}>mongodb</span>
        {`
ai:     `}
        <span style={{ color: "var(--accent)" }}>agents</span>
        {` · `}
        <span style={{ color: "var(--accent)" }}>mcp</span>
        {` · `}
        <span style={{ color: "var(--accent)" }}>llm</span>
        {`
dx:     `}
        <span style={{ color: "var(--accent)" }}>terminal</span>
        {` · `}
        <span style={{ color: "var(--accent)" }}>blog</span>
        {` · `}
        <span style={{ color: "var(--accent)" }}>oss</span>
        {`

# Ishwar was here.`}
      </pre>

      <div className="readme-kv-grid">
        {[
          { k: "stack", v: "node · react · ts · mongodb" },
          { k: "status", v: "open to work" },
          { k: "across", v: "full stack · ai · enterprise" },
          { k: "at", v: "mumbai · remote ok" },
        ].map((row) => (
          <div
            key={row.k}
            style={{
              padding: "10px 14px",
              border: "1px solid var(--border)",
              borderRadius: 4,
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--mono)",
              fontSize: 12,
            }}
          >
            <span style={{ color: "var(--muted)" }}>{row.k}</span>
            <span>{row.v}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 48 }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--accent)",
            letterSpacing: 0.8,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          ↳ on the wire
        </div>
        <div style={{ border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden" }}>
          <a href={latestPost.url} target="_blank" rel="noreferrer" className="wire-row readme-card">
            <span style={wireKind}>
              <Dot /> essay
            </span>
            <span style={{ color: "var(--fg)" }}>
              {latestPost.title}{" "}
              <span style={{ color: "var(--muted)" }}>— {latestPost.sub.toLowerCase()}</span>
            </span>
            <span style={wireMeta}>{latestPost.read}</span>
          </a>
          <div style={{ borderTop: "1px solid var(--border)" }} />
          <a
            href={featured[0].url}
            target="_blank"
            rel="noreferrer"
            className="wire-row readme-card"
          >
            <span style={wireKind}>
              <Dot /> shipped
            </span>
            <span style={{ color: "var(--fg)" }}>
              {featured[0].name}{" "}
              <span style={{ color: "var(--muted)" }}>— {featured[0].sub.toLowerCase()}</span>
            </span>
            <span style={wireMeta}>github →</span>
          </a>
          <div style={{ borderTop: "1px solid var(--border)" }} />
          <div onClick={() => onNav && onNav("now.md")} className="wire-row readme-card">
            <span style={wireKind}>
              <Dot /> now
            </span>
            <span style={{ color: "var(--fg)" }}>{currentFocus}</span>
            <span style={wireMeta}>now.md →</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 56 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--accent)",
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            ↳ featured repos
          </div>
          <div
            onClick={() => onNav && onNav("projects/")}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10.5,
              color: "var(--muted)",
              cursor: "pointer",
              letterSpacing: 0.4,
            }}
          >
            full list — projects/ →
          </div>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {featured.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="readme-card"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                padding: "16px 18px",
                border: "1px solid var(--border)",
                borderRadius: 4,
                transition: "background 140ms, border-color 140ms",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 12,
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span
                    style={{
                      color: "var(--accent)",
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      fontSize: 10,
                    }}
                  >
                    <Dot /> repo
                  </span>
                  <span style={{ color: "var(--fg-dim)" }}>{p.repo}</span>
                </div>
                <span style={{ color: "var(--muted)" }}>{p.stack.split(" · ")[0]}</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 15, color: "var(--fg)", lineHeight: 1.4 }}>
                {p.name}
              </div>
              <div style={{ marginTop: 6, fontSize: 13.5, color: "var(--fg-dim)", lineHeight: 1.6 }}>
                {p.desc}
              </div>
            </a>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 36, fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
        press <span style={{ color: "var(--accent)" }}>⌘K</span> to jump anywhere
      </div>
    </div>
  );
}

function NowDoc() {
  return (
    <div style={{ maxWidth: 720 }}>
      {docHeader("# now.md")}
      <h2 className="doc-h2">
        What I&rsquo;m on this week
      </h2>
      <div style={{ marginTop: 8, fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
        updated {POSTS[0].date}
      </div>
      <ul style={{ marginTop: 28, padding: 0, listStyle: "none" }}>
        {NOW.map((n, i) => (
          <li
            key={i}
            style={{
              padding: "16px 0",
              borderTop: i === 0 ? "1px solid var(--border)" : "none",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              gap: 16,
              fontSize: 16,
              lineHeight: 1.55,
            }}
          >
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--accent)",
                paddingTop: 4,
                minWidth: 28,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ color: "var(--fg-dim)" }}>{n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorkDoc() {
  return (
    <div style={{ maxWidth: 760 }}>
      {docHeader("# work.yaml")}
      <pre
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          padding: 24,
          fontFamily: "var(--mono)",
          fontSize: 13,
          color: "var(--fg-dim)",
          lineHeight: 1.7,
          overflow: "auto",
        }}
      >
        {WORK.map(
          (w, i) =>
            `${i === 0 ? "" : "\n"}- who:   ${w.who}
  role:  ${w.role}
  when:  ${w.when}
  what: >
    ${w.what}
`
        ).join("")}
      </pre>
      <div style={{ marginTop: 36, fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
        More context on{" "}
        <a
          href="https://ishwar.dev/about/"
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          ishwar.dev/about ↗
        </a>
      </div>
    </div>
  );
}

function ResumeDoc() {
  const sectionTitle = {
    fontFamily: "var(--mono)",
    fontSize: 11,
    color: "var(--accent)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    margin: "32px 0 12px",
  };

  return (
    <div style={{ maxWidth: 820 }}>
      {docHeader("# resume.md")}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "baseline" }}>
        <h2 className="doc-h2">
          {RESUME.fullName}
        </h2>
        <Tag accent>{RESUME.version}</Tag>
        {SITE.openToWork && <Tag accent>open to work</Tag>}
      </div>

      <div style={{ marginTop: 10, fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.9 }}>
        <div>
          <span style={{ color: "var(--muted)" }}>role    </span> {RESUME.headline}
        </div>
        <div>
          <span style={{ color: "var(--muted)" }}>email   </span>{" "}
          <a href={`mailto:${SITE.email}`} style={{ color: "var(--accent)", textDecoration: "none" }}>
            {SITE.email}
          </a>
        </div>
        <div>
          <span style={{ color: "var(--muted)" }}>phone   </span> {SITE.phone}
        </div>
        <div>
          <span style={{ color: "var(--muted)" }}>loc     </span> {SITE.location}
        </div>
        <div>
          <span style={{ color: "var(--muted)" }}>linkedin</span>{" "}
          <a href={SITE.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>
            linkedin.com/in/heyIshwar
          </a>
        </div>
      </div>

      <p style={{ marginTop: 24, fontSize: 16, lineHeight: 1.7, color: "var(--fg-dim)" }}>
        {RESUME.summary}
      </p>

      <div style={sectionTitle}>skills</div>
      <div style={{ display: "grid", gap: 10 }}>
        {Object.entries(RESUME.skills).map(([k, v]) => (
          <div
            key={k}
            style={{
              padding: "12px 14px",
              border: "1px solid var(--border)",
              borderRadius: 4,
              fontFamily: "var(--mono)",
              fontSize: 12,
              lineHeight: 1.55,
            }}
          >
            <span style={{ color: "var(--accent)" }}>{k}: </span>
            <span style={{ color: "var(--fg-dim)" }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={sectionTitle}>experience</div>
      <div style={{ display: "grid", gap: 18 }}>
        {RESUME.experience.map((job) => (
          <div
            key={job.company + job.when}
            style={{ border: "1px solid var(--border)", borderRadius: 4, padding: "18px 20px" }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
              <div style={{ fontSize: 18 }}>{job.role}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
                {job.when}
              </div>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent)", marginTop: 4 }}>
              {job.company} · {job.location}
            </div>
            <ul style={{ margin: "14px 0 0", paddingLeft: 18, color: "var(--fg-dim)", lineHeight: 1.65 }}>
              {job.bullets.map((b) => (
                <li key={b.slice(0, 40)} style={{ marginBottom: 8 }}>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={sectionTitle}>education</div>
      <div style={{ display: "grid", gap: 10 }}>
        {RESUME.education.map((ed) => (
          <div
            key={ed.degree}
            style={{
              padding: "14px 16px",
              border: "1px solid var(--border)",
              borderRadius: 4,
            }}
          >
            <div style={{ fontSize: 15 }}>{ed.degree}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
              {ed.school} · {ed.location} · {ed.when}
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...sectionTitle, marginTop: 40 }}>pdf</div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <a
          href={RESUME.pdf}
          download
          style={{
            color: "var(--accent)",
            fontFamily: "var(--mono)",
            fontSize: 12,
            textDecoration: "none",
          }}
        >
          download Ishwar-Sarade-Resume-v2.1.1.pdf ↓
        </a>
        <a
          href={RESUME.pdf}
          target="_blank"
          rel="noreferrer"
          style={{
            color: "var(--fg-dim)",
            fontFamily: "var(--mono)",
            fontSize: 12,
            textDecoration: "none",
          }}
        >
          open in new tab ↗
        </a>
      </div>
      <iframe title="Ishwar Sarade Resume PDF" src={RESUME.pdf} className="resume-pdf" />
    </div>
  );
}

function ProjectsDoc() {
  return (
    <div style={{ maxWidth: 820 }}>
      {docHeader("# projects/")}
      <h2 className="doc-h2">
        Side of the desk
      </h2>
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
        {PROJECTS.length} repos · click a card to open on github
      </div>
      <div style={{ marginTop: 28, display: "grid", gap: 14 }}>
        {PROJECTS.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="project-card"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
              border: "1px solid var(--border)",
              padding: "22px 24px",
              borderRadius: 4,
              transition: "background 140ms, border-color 140ms",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 20, color: "var(--fg)" }}>{p.name}</div>
                <div style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 2 }}>{p.sub}</div>
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--accent)",
                  whiteSpace: "nowrap",
                }}
              >
                github/{p.repo} ↗
              </div>
            </div>
            <div style={{ marginTop: 16, fontSize: 14.5, lineHeight: 1.65, color: "var(--fg-dim)" }}>
              {p.desc}
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {p.stack.split(" · ").map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    border: "1px solid var(--border)",
                    padding: "2px 7px",
                    borderRadius: 3,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function GitHubDoc() {
  const fallback = PROJECTS.map((p) => ({
    name: p.name,
    desc: p.desc.slice(0, 80),
    url: p.url,
    lang: p.stack.split(" · ")[0],
    stars: 0,
    updated: "—",
  }));
  const [repos, status] = useGitHubRepos(fallback);
  const [hover, setHover] = React.useState(null);

  return (
    <div style={{ maxWidth: 960 }}>
      {docHeader("# github/  —  " + repos.length + " repos")}
      <h2 className="doc-h2">
        GitHub
      </h2>
      <div style={{ marginTop: 8, fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--muted)" }}>
        @{SITE.github}
        <span style={{ color: "#444" }}> · </span>
        {status === "live" && <span style={{ color: "var(--accent)" }}>● live from api</span>}
        {status === "static" && <span>loading…</span>}
        {status === "error" && (
          <span>api unreachable — showing static list</span>
        )}
      </div>
      <div
        style={{
          marginTop: 24,
          border: "1px solid var(--border)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div className="github-head">
          <div>repo</div>
          <div>description</div>
          <div>lang</div>
          <div>★</div>
          <div>updated</div>
        </div>
        {repos.map((r, i) => {
          const isHover = hover === i;
          return (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="github-row pr-row"
              style={{
                borderTop: i === 0 ? "none" : "1px solid var(--border)",
                background: isHover
                  ? "color-mix(in oklab, var(--accent) 6%, transparent)"
                  : "transparent",
                color: isHover ? "var(--fg)" : "var(--fg-dim)",
              }}
            >
              <div style={{ color: "var(--fg)", fontWeight: 500 }}>{r.name}</div>
              <div className="github-desc">{r.desc || "—"}</div>
              <div className="hide-sm" style={{ color: "var(--muted)" }}>
                {r.lang}
              </div>
              <div className="hide-sm" style={{ color: "var(--muted)" }}>
                {r.stars || "—"}
              </div>
              <div className="hide-sm" style={{ color: "var(--muted)" }}>
                {(r.updated || "").slice(0, 7)}
              </div>
              <div className="github-meta">
                <span>{r.lang}</span>
                <span>★ {r.stars || "—"}</span>
                <span>{(r.updated || "").slice(0, 7)}</span>
              </div>
            </a>
          );
        })}
      </div>
      <div style={{ marginTop: 14, fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--muted)" }}>
        <a
          href={`https://github.com/${SITE.github}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          github.com/{SITE.github} ↗
        </a>
      </div>
    </div>
  );
}

function BlogIndexDoc({ onNav }) {
  return (
    <div style={{ maxWidth: 760 }}>
      {docHeader("# blog/")}
      <h2 className="doc-h2">Writing</h2>
      <div style={{ marginTop: 8, fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
        {POSTS.length} essays · read in-panel
      </div>
      <div style={{ marginTop: 28 }}>
        {POSTS.map((p) => (
          <div
            key={p.slug}
            onClick={() => onNav(`blog/${p.file}`)}
            style={{ padding: "20px 0", borderTop: "1px solid var(--border)", cursor: "pointer" }}
            className="readme-card"
          >
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
              {p.date} · {p.read} · {p.tags.join(", ")}
            </div>
            <div style={{ fontSize: 20, marginTop: 8 }}>
              {p.title} {p.featured && <Tag accent>featured</Tag>}
            </div>
            <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{p.sub}</div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </div>
    </div>
  );
}

function BlogPostDoc({ post }) {
  const html = BLOG_CONTENT[post.file];

  return (
    <div style={{ maxWidth: 720 }}>
      {docHeader("# blog/" + post.file)}
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
        {post.date} · {post.read}
        {post.tags?.length ? ` · ${post.tags.join(", ")}` : ""}
      </div>
      <h2 className="doc-h2-post">{post.title}</h2>
      <div
        style={{
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 19,
          color: "var(--fg-dim)",
          marginTop: 10,
        }}
      >
        {post.sub}
      </div>
      {html ? (
        <div
          className="blog-prose"
          style={{ marginTop: 32 }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p style={{ marginTop: 24, color: "var(--muted)", fontSize: 14 }}>
          Content missing for this post.
        </p>
      )}
    </div>
  );
}

function ContactDoc() {
  return (
    <div style={{ maxWidth: 560 }}>
      {docHeader("# contact")}
      <h2 className="doc-h2">Say hi.</h2>
      <p style={{ marginTop: 18, color: "var(--fg-dim)", fontSize: 16, lineHeight: 1.65 }}>
        Happy to talk about full-stack work, VX Engine, MCP tooling, or anything you read on the
        blog.
      </p>
      <div style={{ marginTop: 28, fontFamily: "var(--mono)", fontSize: 13, lineHeight: 2 }}>
        <div>
          <span style={{ color: "var(--muted)" }}>site    </span>{" "}
          <a
            href="https://ishwar.dev"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            ishwar.dev
          </a>
        </div>
        <div>
          <span style={{ color: "var(--muted)" }}>x       </span>{" "}
          <a
            href="https://x.com/IshwarSarade"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            {SITE.x}
          </a>
        </div>
        <div>
          <span style={{ color: "var(--muted)" }}>github  </span>{" "}
          <a
            href={`https://github.com/${SITE.github}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            {SITE.github}
          </a>
        </div>
        <div>
          <span style={{ color: "var(--muted)" }}>ig      </span>{" "}
          <a
            href="https://www.instagram.com/hey_ishwar/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            @{SITE.instagram}
          </a>
        </div>
        <div>
          <span style={{ color: "var(--muted)" }}>youtube </span>{" "}
          <a
            href="https://www.youtube.com/@ishwarsarade"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            {SITE.youtube}
          </a>
        </div>
      </div>
    </div>
  );
}

window.VariationIDE = VariationIDE;
