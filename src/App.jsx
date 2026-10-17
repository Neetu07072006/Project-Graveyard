
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { X, Clock3, Plus, CheckCircle2 } from "lucide-react";
import { initialProjects } from "./data/projects";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import AddProjectModal from "./components/AddProjectModal";
import AllProjects from "./pages/AllProjects";
import ReadyToRevive from "./pages/ReadyToRevive";
import AlmostThere from "./pages/AlmostThere";
import Archived from "./pages/Archived";
import ProjectTimeline from "./pages/ProjectTimeline";
import RevivalNotes from "./pages/RevivalNotes";
import Dashboard from "./pages/Dashboard";
function normalizeProject(project, index) {
  const item = project && typeof project === "object" ? project : {};

  return {
    ...item,
    id: item.id != null ? String(item.id) : String(index + 1),
    title: typeof item.title === "string" ? item.title : "Untitled project",
    description: typeof item.description === "string" ? item.description : "",
    category: typeof item.category === "string" ? item.category : "UNCATEGORIZED",
    tags: Array.isArray(item.tags)
      ? item.tags.filter((tag) => typeof tag === "string")
      : [],
    status: ["revive", "almost", "archived"].includes(item.status)
      ? item.status
      : "revive",
    progress: Number.isFinite(Number(item.progress))
      ? Math.max(0, Math.min(100, Number(item.progress)))
      : 0,
    note: typeof item.note === "string" ? item.note : "",
    date: typeof item.date === "string" ? item.date : "Recently added",
    icon: typeof item.icon === "string" ? item.icon : "✧",
    color: typeof item.color === "string" ? item.color : "yellow",
    owner: typeof item.owner === "string" ? item.owner : "You"
  };
}

function loadProjects() {
  try {
    const saved = localStorage.getItem("graveyard-projects");

    if (!saved) {
      return initialProjects.map(normalizeProject);
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return initialProjects.map(normalizeProject);
    }

    return parsed.map(normalizeProject);
  } catch (error) {
    console.error("Could not load saved projects:", error);
    return initialProjects.map(normalizeProject);
  }
}

function ProjectDetail({ project, onClose, onEditNote }) {
  if (!project) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        className="detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        <div className="detail-header">
          <div className={`project-symbol ${project.color}`}>
            {project.icon}
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close project details"
          >
            <X size={20} />
          </button>
        </div>

        <p className="category-label">{project.category}</p>
        <h2 id="detail-title">{project.title}</h2>
        <p className="detail-description">{project.description}</p>

        <div className="tag-list">
          {project.tags.map((tag, index) => (
            <span key={`${tag}-${index}`}>{tag}</span>
          ))}
        </div>

        <div className="detail-progress">
          <span>Last known progress</span>
          <strong>{project.progress}%</strong>
        </div>
        <div className="progress-track">
          <div style={{ width: `${project.progress}%` }} />
        </div>

        <div className="detail-note">
          <h3>Note to your future self</h3>
          <p>{project.note || "No revival note has been added yet."}</p>
        </div>

        <div className="detail-meta">
          <span><Clock3 size={14} /> {project.date}</span>
          <span>{project.owner}</span>
        </div>

        <button
          className="button-primary full-button"
          onClick={() => onEditNote(project)}
        >
          <Plus size={16} /> Edit revival note
        </button>
      </motion.div>
    </div>
  );
}

function NoteModal({ project, onClose, onSave }) {
  const [note, setNote] = useState(project?.note ?? "");

  useEffect(() => {
    setNote(project?.note ?? "");
  }, [project]);

  if (!project) return null;

  function submit(event) {
    event.preventDefault();
    onSave(project.id, note);
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form className="modal" onSubmit={submit}>
        <div className="modal-heading">
          <div>
            <p className="eyebrow">FUTURE YOU WILL THANK YOU</p>
            <h2>{project.title}</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close note editor"
          >
            <X size={20} />
          </button>
        </div>

        <label>
          Revival note
          <textarea
            rows={5}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="What should happen next?"
          />
        </label>

        <div className="modal-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="button-primary" type="submit">
            <CheckCircle2 size={16} /> Save note
          </button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [projects, setProjects] = useState(loadProjects);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    try {
      localStorage.setItem("graveyard-projects", JSON.stringify(projects));
    } catch (error) {
      console.error("Could not save projects:", error);
    }
  }, [projects]);

  useEffect(() => {
    setMobileMenu(false);
    setSelected(null);
    setEditingNote(null);
  }, [location.pathname]);

  const addProject = (project) => {
    setProjects((current) => [
      normalizeProject(project, current.length),
      ...current
    ]);
    setSearch("");
  };

  const saveNote = (id, note) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === String(id) ? { ...project, note } : project
      )
    );
  };

  const openNoteEditor = (project) => {
    const latest = projects.find((item) => item.id === String(project.id));
    setEditingNote(latest || normalizeProject(project, 0));
  };

  const sharedPageProps = {
    projects,
    onOpen: (project) => {
      const latest = projects.find((item) => item.id === String(project.id));
      setSelected(latest || normalizeProject(project, 0));
    },
    onNote: openNoteEditor
  };

  const filteredProjects = projects.filter((project) => {
    const text = [
      project.title,
      project.description,
      project.category,
      ...project.tags
    ].join(" ").toLowerCase();

    return text.includes(search.trim().toLowerCase());
  });

  return (
    <div className="app-shell">
      {mobileMenu && (
        <button
          className="mobile-overlay"
          onClick={() => setMobileMenu(false)}
          aria-label="Close navigation"
        />
      )}

      <Sidebar onAdd={() => setAdding(true)} />

      <div className="main-column">
        <Topbar
          search={search}
          setSearch={setSearch}
          onMenu={() => setMobileMenu((open) => !open)}
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <AllProjects
                  {...sharedPageProps}
                  projects={filteredProjects}
                  onAdd={() => setAdding(true)}
                />
              }
            />
            <Route
              path="/ready-to-revive"
              element={<ReadyToRevive {...sharedPageProps} />}
            />
            <Route
              path="/almost-there"
              element={<AlmostThere {...sharedPageProps} />}
            />
            <Route
              path="/archived"
              element={<Archived {...sharedPageProps} />}
            />
            <Route
              path="/timeline"
              element={<ProjectTimeline projects={projects} />}
            />
            <Route
              path="/revival-notes"
              element={
                <RevivalNotes
                  projects={projects}
                  onEditNote={openNoteEditor}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="app-footer">
          An unfinished idea is not a failed idea.
          <span>© {new Date().getFullYear()} graveyard.</span>
        </footer>
      </div>

      <AnimatePresence>
        {adding && (
          <AddProjectModal
            onClose={() => setAdding(false)}
            onAdd={addProject}
          />
        )}

        {selected && (
          <ProjectDetail
            project={selected}
            onClose={() => setSelected(null)}
            onEditNote={openNoteEditor}
          />
        )}

        {editingNote && (
          <NoteModal
            key={editingNote.id}
            project={editingNote}
            onClose={() => setEditingNote(null)}
            onSave={saveNote}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
