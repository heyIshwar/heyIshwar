// IDE portfolio layout (ved1beta-style) — ishwar.dev content

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
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
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

  React.useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      } else if (e.key === "Escape") setPalette(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const files = [
    { id: "readme.md", label: "readme.md", group: "" },
    { id: "now.md", label: "now.md", group: "" },
    { id: "work.yaml", label: "work.yaml", group: "" },
    { id: "projects/", label: "projects/", group: "dir" },
    { id: "github/", label: "github/", group: "dir" },
    { id: "blog/", label: "blog/", group: "dir" },
    ...POSTS.map((p) => ({
      id: `blog/${p.file}`,
      label: `  ${p.file}`,
      group: "nested",
    })),
    { id: "contact", label: "contact", group: "" },
  ];

  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        fontFamily: "var(--sans)",
        minHeight: "100%",
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gridTemplateRows: "40px 1fr auto",
        height: "100%",
      }}
    >
      <CmdK open={palette} onClose={() => setPalette(false)} onNav={setActive} />

      <div
        style={{
          gridColumn: "1 / -1",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--muted)",
          letterSpacing: 0.5,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#2a2a2a" }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#2a2a2a" }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#2a2a2a" }} />
          </div>
          <span>~/{SITE.domain}</span>
          <span style={{ color: "var(--accent)" }}>· main</span>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <button
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
            ⌘K palette
          </button>
          <span>·</span>
          <span style={{ color: "var(--accent)" }}>
            <Dot /> online
          </span>
        </div>
      </div>

      <div
        style={{ borderRight: "1px solid var(--border)", padding: "18px 0", overflow: "auto" }}
      >
        <div
          style={{
            padding: "0 16px 10px",
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--muted)",
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          Explorer
        </div>
        {files.map((f) => (
          <div
            key={f.id}
            onClick={() => setActive(f.id)}
            style={{
              padding: f.group === "nested" ? "5px 16px 5px 32px" : "5px 16px",
              fontFamily: "var(--mono)",
              fontSize: 12.5,
              color: active === f.id ? "var(--accent)" : "var(--fg-dim)",
              background:
                active === f.id
                  ? "color-mix(in oklab, var(--accent) 7%, transparent)"
                  : "transparent",
              borderLeft:
                active === f.id ? "2px solid var(--accent)" : "2px solid transparent",
              cursor: "pointer",
            }}
          >
            {f.group === "dir" ? "▸ " : ""}
            {f.label}
          </div>
        ))}
        <div
          style={{
            padding: "24px 16px 10px",
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--muted)",
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          Links
        </div>
        <a
          href="https://ishwar.dev"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            padding: "5px 16px",
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--fg-dim)",
            textDecoration: "none",
          }}
        >
          {SITE.domain}
        </a>
        <a
          href={`https://github.com/${SITE.github}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            padding: "5px 16px",
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--fg-dim)",
            textDecoration: "none",
          }}
        >
          github/{SITE.github}
        </a>
        <a
          href="https://x.com/IshwarSarade"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            padding: "5px 16px",
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--fg-dim)",
            textDecoration: "none",
          }}
        >
          x/{SITE.x.slice(1)}
        </a>
        <a
          href="https://www.instagram.com/hey_ishwar/"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            padding: "5px 16px",
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--fg-dim)",
            textDecoration: "none",
          }}
        >
          ig/{SITE.instagram}
        </a>
      </div>

      <div style={{ overflow: "auto", padding: "40px 56px 80px" }}>
        <IDEContent active={active} onNav={setActive} />
      </div>

      <div
        style={{
          gridColumn: "1 / -1",
          borderTop: "1px solid var(--border)",
          padding: "6px 16px 8px",
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "var(--muted)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "6px 16px",
          letterSpacing: 0.5,
        }}
      >
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <span style={{ color: "var(--accent)" }}>● ready</span>
          <span>utf-8</span>
          <span>LF</span>
          <span>{active}</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "4px 6px",
            flex: "1 1 280px",
            justifyContent: "center",
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: "var(--fg-dim)" }}>
            homies answered crowdfunding ❤ thanks
          </span>
          {SPONSORS.map((s, i) => (
            <React.Fragment key={s.name}>
              {i > 0 && <span style={{ color: "var(--border)" }}>·</span>}
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--fg-dim)", textDecoration: "none" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--fg-dim)";
                }}
              >
                {s.name}
              </a>
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
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

  const wireRow = {
    display: "grid",
    gridTemplateColumns: "84px 1fr auto",
    gap: 16,
    padding: "12px 16px",
    fontFamily: "var(--mono)",
    fontSize: 12.5,
    alignItems: "center",
    color: "var(--fg-dim)",
    textDecoration: "none",
    cursor: "pointer",
  };
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

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 30 }}>
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

      <h1
        style={{
          fontSize: 56,
          fontWeight: 400,
          letterSpacing: -1.2,
          margin: 0,
          lineHeight: 1.05,
        }}
      >
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

      <div
        style={{
          marginTop: 36,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {[
          { k: "stack", v: "node · react · ts · mongodb" },
          { k: "across", v: "full stack · ai tooling · writing" },
          { k: "at", v: "ishwar.dev · open source" },
          { k: "github", v: SITE.github },
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
          <a href={latestPost.url} target="_blank" rel="noreferrer" className="readme-card" style={wireRow}>
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
            className="readme-card"
            style={wireRow}
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
          <div onClick={() => onNav && onNav("now.md")} className="readme-card" style={wireRow}>
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
      <h2 style={{ fontSize: 36, fontWeight: 400, letterSpacing: -0.6, margin: 0 }}>
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

function ProjectsDoc() {
  return (
    <div style={{ maxWidth: 820 }}>
      {docHeader("# projects/")}
      <h2 style={{ fontSize: 36, fontWeight: 400, letterSpacing: -0.6, margin: 0 }}>
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
      <h2 style={{ fontSize: 36, fontWeight: 400, letterSpacing: -0.6, margin: 0 }}>
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr 80px 60px 90px",
            padding: "10px 16px",
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--muted)",
            letterSpacing: 0.6,
            textTransform: "uppercase",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
          }}
        >
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
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr 80px 60px 90px",
                padding: "11px 16px",
                fontFamily: "var(--mono)",
                fontSize: 12,
                borderTop: i === 0 ? "none" : "1px solid var(--border)",
                background: isHover
                  ? "color-mix(in oklab, var(--accent) 6%, transparent)"
                  : "transparent",
                color: isHover ? "var(--fg)" : "var(--fg-dim)",
                textDecoration: "none",
                transition: "background 120ms",
              }}
            >
              <div style={{ color: "var(--fg)" }}>{r.name}</div>
              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {r.desc || "—"}
              </div>
              <div style={{ color: "var(--muted)" }}>{r.lang}</div>
              <div style={{ color: "var(--muted)" }}>{r.stars || "—"}</div>
              <div style={{ color: "var(--muted)" }}>{(r.updated || "").slice(0, 7)}</div>
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
      <h2 style={{ fontSize: 36, fontWeight: 400, letterSpacing: -0.6, margin: 0 }}>Writing</h2>
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
      <h2
        style={{
          fontSize: 40,
          fontWeight: 400,
          letterSpacing: -0.8,
          margin: "16px 0 0",
          lineHeight: 1.1,
        }}
      >
        {post.title}
      </h2>
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
      <h2 style={{ fontSize: 40, fontWeight: 400, letterSpacing: -0.8, margin: 0 }}>
        Say hi.
      </h2>
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
