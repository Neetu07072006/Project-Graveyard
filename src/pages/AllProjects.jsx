
import { useMemo, useState } from "react";
import { Search, ListFilter, ArrowDownUp, Plus } from "lucide-react";
import ProjectCard from "../components/ProjectCard";

function safeText(value) {
  return typeof value === "string" ? value : "";
}

function safeTags(project) {
  return Array.isArray(project?.tags)
    ? project.tags.filter((tag) => typeof tag === "string")
    : [];
}

export default function AllProjects({ projects = [], onOpen, onNote, onAdd }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All projects");
  const [sort, setSort] = useState("recent");

  const safeProjects = Array.isArray(projects) ? projects : [];

  const categories = useMemo(
    () => [...new Set(safeProjects.map((p) => safeText(p?.category) || "UNCATEGORIZED"))],
    [safeProjects]
  );

  const visible = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return safeProjects
      .filter((p) => {
        const projectCategory = safeText(p?.category) || "UNCATEGORIZED";
        return category === "All projects" || projectCategory === category;
      })
      .filter((p) => {
        const searchableText = [
          safeText(p?.title),
          safeText(p?.description),
          safeText(p?.category),
          ...safeTags(p)
        ].join(" ").toLowerCase();

        return searchableText.includes(searchTerm);
      })
      .sort((a, b) => {
        if (sort === "progress") {
          return (Number(b?.progress) || 0) - (Number(a?.progress) || 0);
        }
        return 0;
      });
  }, [safeProjects, query, category, sort]);

  return (
    <>
      <section className="hero">
        <div className="eyebrow">
          <span />
          A SECOND CHANCE FOR YOUR IDEAS
        </div>

        <div className="hero-content">
          <div>
            <h1>
              Nothing here is
              <br />
              <em>truly</em> lost.
            </h1>
            <p>
              A home for the things you started, the things you learned,
              <br className="desktop-break" /> and the ideas that might still have a future.
            </p>
          </div>

          <div className="hero-orbit" aria-hidden="true">
            <div className="orbit-ring ring-one" />
            <div className="orbit-ring ring-two" />
            <div className="orbit-center">♧</div>
            <span className="orbit-star">✳</span>
            <span className="orbit-spark">✦</span>
            <small>GROW AGAIN, WHEN YOU'RE READY</small>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-heading">
            RESTING IDEAS <span>▱</span>
          </div>
          <div className="stat-number">
            {String(safeProjects.length).padStart(2, "0")}
            <small> projects</small>
          </div>
          <p>Every idea deserves a place</p>
        </div>

        <div className="stat-card">
          <div className="stat-heading">
            READY FOR A COMEBACK <span>♨</span>
          </div>
          <div className="stat-number">
            {String(safeProjects.filter((p) => p?.status === "revive").length).padStart(2, "0")}
            <small> waiting</small>
          </div>
          <p><i className="yellow-dot" /> A little spark is all it takes</p>
        </div>

        <div className="stat-card">
          <div className="stat-heading">
            ALMOST MADE IT <span>✓</span>
          </div>
          <div className="stat-number">
            {String(safeProjects.filter((p) => p?.status === "almost").length).padStart(2, "0")}
            <small> nearly done</small>
          </div>
          <p>Closer than you remember</p>
        </div>
      </section>

      <section className="collection">
        <div className="collection-heading">
          <div>
            <p className="eyebrow">THE COLLECTION</p>
            <h2>
              Your project graveyard{" "}
              <span className="count-badge">{safeProjects.length}</span>
            </h2>
            <p>Old sparks, unfinished chapters, and maybe your next big thing.</p>
          </div>

          <button className="button-primary add-button" onClick={onAdd}>
            <Plus size={18} />
            Add a project
          </button>
        </div>

        <div className="filters">
          <label className="search-box">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your projects..."
              aria-label="Search projects"
            />
            <kbd>⌘ K</kbd>
          </label>

          <label className="select-box">
            <ListFilter size={16} />
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
              <option>All projects</option>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <span>⌄</span>
          </label>

          <label className="select-box sort-select">
            <ArrowDownUp size={16} />
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort projects">
              <option value="recent">Recently added</option>
              <option value="progress">Most progress</option>
            </select>
          </label>
        </div>

        {visible.length > 0 ? (
          <div className="projects-grid">
            {visible.map((project, index) => (
              <ProjectCard
                key={project?.id ?? `${safeText(project?.title)}-${index}`}
                project={{
                  ...project,
                  id: project?.id ?? String(index),
                  title: safeText(project?.title) || "Untitled project",
                  description: safeText(project?.description),
                  category: safeText(project?.category) || "UNCATEGORIZED",
                  tags: safeTags(project),
                  progress: Number.isFinite(Number(project?.progress))
                    ? Math.max(0, Math.min(100, Number(project.progress)))
                    : 0,
                  date: safeText(project?.date) || "Recently added",
                  icon: safeText(project?.icon) || "✧",
                  color: safeText(project?.color) || "yellow"
                }}
                onOpen={onOpen}
                onNote={onNote}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No projects found. Try a different search or category.
          </div>
        )}
      </section>
    </>
  );
}
