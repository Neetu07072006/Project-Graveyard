import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  FolderOpen,
  CalendarDays,
  Tag,
  Eye,
} from "lucide-react";

const STORAGE_KEY = "graveyard-archive-items";

const SAMPLE_ARCHIVED_ITEMS = [
  {
    id: "archive-1",
    title: "Old Portfolio Website",
    category: "Web Development",
    description: "A personal portfolio built with an outdated design and layout.",
    reason: "The design no longer represents my current skills.",
    archivedDate: "2026-01-12",
    notes: "Redesign it with a modern, responsive layout.",
  },
  {
    id: "archive-2",
    title: "StudyBuddy AI",
    category: "AI / ML",
    description: "An AI-powered study assistant for students.",
    reason: "The AI integration and development timeline became too complex.",
    archivedDate: "2026-02-05",
    notes: "Start with a simple question-answering feature.",
  },
  {
    id: "archive-3",
    title: "LocalLoop",
    category: "Mobile App",
    description: "A platform connecting people with local events and communities.",
    reason: "There was not enough time to finish the application.",
    archivedDate: "2026-02-18",
    notes: "Validate the idea with a small group of users first.",
  },
  {
    id: "archive-4",
    title: "PixelGarden",
    category: "Game Development",
    description: "A relaxing pixel-art gardening game.",
    reason: "Game mechanics and asset creation took longer than expected.",
    archivedDate: "2026-03-03",
    notes: "Build one playable level before adding more features.",
  },
  {
    id: "archive-5",
    title: "FocusFlow",
    category: "Web Development",
    description: "A productivity dashboard with tasks and focus sessions.",
    reason: "The project overlapped with other productivity tools.",
    archivedDate: "2026-03-21",
    notes: "Simplify it into a minimal focus timer.",
  },
  {
    id: "archive-6",
    title: "OpenAtlas",
    category: "Research",
    description: "An open knowledge map for exploring connected topics.",
    reason: "Data collection and graph implementation were too demanding.",
    archivedDate: "2026-04-09",
    notes: "Start with a small dataset and a simple graph visualization.",
  },
  {
    id: "archive-7",
    title: "TinyTasks",
    category: "Mobile App",
    description: "A lightweight mobile app for tracking daily tasks.",
    reason: "The original concept lacked a distinctive feature.",
    archivedDate: "2026-04-24",
    notes: "Focus on quick task capture and a distraction-free interface.",
  },
  {
    id: "archive-8",
    title: "CodeQuest",
    category: "Game Development",
    description: "A game that teaches programming through interactive challenges.",
    reason: "Creating enough coding challenges was difficult.",
    archivedDate: "2026-05-16",
    notes: "Begin with a small set of beginner-level C++ challenges.",
  },
  {
    id: "archive-9",
    title: "EcoTrack",
    category: "Mobile App",
    description: "A sustainability tracker for everyday environmental habits.",
    reason: "Reliable activity tracking required more work than planned.",
    archivedDate: "2026-06-02",
    notes: "Start with manual entries and weekly summaries.",
  },
  {
    id: "archive-10",
    title: "NoteSphere",
    category: "Web Development",
    description: "A note-taking app with linked notes and tags.",
    reason: "The feature list grew beyond the original scope.",
    archivedDate: "2026-07-11",
    notes: "Prioritize creating, editing, searching, and tagging notes.",
  },
  {
    id: "archive-11",
    title: "VisionBoard AI",
    category: "AI / ML",
    description: "An AI-assisted vision board for organizing personal goals.",
    reason: "The image-generation workflow needed further research.",
    archivedDate: "2026-08-19",
    notes: "Prototype the board using manually uploaded images first.",
  },
];

const CATEGORIES = [
  "Web Development",
  "AI / ML",
  "Mobile App",
  "Game Development",
  "Research",
  "Other",
];

function getInitialItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }

      // Initialize the examples automatically when the saved archive is empty.
      if (Array.isArray(parsed) && parsed.length === 0) {
        return SAMPLE_ARCHIVED_ITEMS.map(item => ({ ...item }));
      }
    }
  } catch (error) {
    console.error("Could not read the archived projects:", error);
  }

  return SAMPLE_ARCHIVED_ITEMS.map(item => ({ ...item }));
}

function formatDate(dateString) {
  if (!dateString) return "No date";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const EMPTY_FORM = {
  title: "",
  category: "Web Development",
  description: "",
  reason: "",
  archivedDate: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function Archived() {
  const [items, setItems] = useState(getInitialItems);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // Persist the archive independently of the active projects list.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Could not save archived projects:", error);
    }
  }, [items]);

  const categoriesInUse = useMemo(
    () => [...new Set(items.map(item => item.category).filter(Boolean))].sort(),
    [items]
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter(item => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const searchableText = [
        item.title,
        item.category,
        item.description,
        item.reason,
        item.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [items, search, selectedCategory]);

  const openAddForm = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      archivedDate: new Date().toISOString().slice(0, 10),
    });
    setShowForm(true);
    setSelectedItem(null);
  };

  const openEditForm = item => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      category: item.category || "Other",
      description: item.description || "",
      reason: item.reason || "",
      archivedDate: item.archivedDate || "",
      notes: item.notes || "",
    });
    setShowForm(true);
    setSelectedItem(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = event => {
    event.preventDefault();

    const title = form.title.trim();
    if (!title) return;

    if (editingId) {
      setItems(current =>
        current.map(item =>
          item.id === editingId ? { ...item, ...form, title } : item
        )
      );
    } else {
      const newItem = {
        ...form,
        title,
        id: `archive-${Date.now()}`,
      };

      setItems(current => [newItem, ...current]);
    }

    closeForm();
  };

  const deleteItem = id => {
    const item = items.find(project => project.id === id);
    if (!item) return;

    if (window.confirm(`Delete "${item.title}" from the archive?`)) {
      setItems(current => current.filter(project => project.id !== id));
      setSelectedItem(current => current?.id === id ? null : current);
    }
  };

  return (
    <div className="archive-page">
      <div className="archive-header">
        <div className="archive-heading">
          <div className="archive-heading-icon">
            <Archive size={23} />
          </div>
          <div>
            <h1>Archived Projects</h1>
            <p>Keep unfinished ideas safe, organized, and ready for another day.</p>
          </div>
        </div>

        <button
          type="button"
          className="archive-primary-button"
          onClick={openAddForm}
        >
          <Plus size={17} />
          Add to archive
        </button>
      </div>

      <div className="archive-stats">
        <div className="archive-stat-card">
          <div className="archive-stat-icon">
            <Archive size={19} />
          </div>
          <div>
            <span>Total archived</span>
            <strong>{items.length}</strong>
          </div>
        </div>

        <div className="archive-stat-card">
          <div className="archive-stat-icon">
            <FolderOpen size={19} />
          </div>
          <div>
            <span>Categories</span>
            <strong>{categoriesInUse.length}</strong>
          </div>
        </div>

        <div className="archive-stat-card">
          <div className="archive-stat-icon">
            <CalendarDays size={19} />
          </div>
          <div>
            <span>Archived this year</span>
            <strong>
              {items.filter(item => item.archivedDate?.startsWith("2026")).length}
            </strong>
          </div>
        </div>
      </div>

      <div className="archive-toolbar">
        <div className="archive-search">
          <Search size={18} />
          <input
            type="text"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search archived projects..."
            aria-label="Search archived projects"
          />
          {search && (
            <button
              type="button"
              className="archive-clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="archive-filter">
          <Tag size={17} />
          <select
            value={selectedCategory}
            onChange={event => setSelectedCategory(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="All">All categories</option>
            {categoriesInUse.map(category => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="archive-results-line">
        <span>
          Showing <strong>{filteredItems.length}</strong> of{" "}
          <strong>{items.length}</strong> projects
        </span>

        {(search || selectedCategory !== "All") && (
          <button
            type="button"
            className="archive-text-button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredItems.length > 0 ? (
        <div className="archive-grid">
          {filteredItems.map(item => (
            <article className="archive-card" key={item.id}>
              <div className="archive-card-top">
                <span className="archive-category">{item.category}</span>
                <button
                  type="button"
                  className="archive-icon-button"
                  title="Edit project"
                  aria-label={`Edit ${item.title}`}
                  onClick={() => openEditForm(item)}
                >
                  <Pencil size={16} />
                </button>
              </div>

              <h3>{item.title}</h3>

              <p className="archive-card-description">
                {item.description || "No description added yet."}
              </p>

              <div className="archive-reason">
                <span>Why it was archived</span>
                <p>{item.reason || "No reason provided."}</p>
              </div>

              <div className="archive-card-footer">
                <span className="archive-date">
                  <CalendarDays size={14} />
                  {formatDate(item.archivedDate)}
                </span>

                <div className="archive-card-actions">
                  <button
                    type="button"
                    className="archive-icon-button"
                    title="View details"
                    aria-label={`View ${item.title}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    type="button"
                    className="archive-icon-button archive-delete-button"
                    title="Delete project"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="archive-empty">
          <div className="archive-empty-icon">
            <FolderOpen size={30} />
          </div>
          <h3>No archived projects found</h3>
          <p>
            Try another search term or clear the selected category.
          </p>
          <button
            type="button"
            className="archive-primary-button"
            onClick={openAddForm}
          >
            <Plus size={16} />
            Add a project
          </button>
        </div>
      )}

      {showForm && (
        <div
          className="archive-modal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div
            className="archive-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-form-title"
          >
            <div className="archive-modal-header">
              <div>
                <span className="archive-modal-eyebrow">
                  {editingId ? "UPDATE PROJECT" : "SAVE AN IDEA"}
                </span>
                <h2 id="archive-form-title">
                  {editingId ? "Edit archived project" : "Add to archive"}
                </h2>
              </div>

              <button
                type="button"
                className="archive-icon-button"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="archive-form">
              <label>
                Project name *
                <input
                  required
                  maxLength={100}
                  value={form.title}
                  onChange={event =>
                    setForm(current => ({ ...current, title: event.target.value }))
                  }
                  placeholder="e.g. My next big idea"
                />
              </label>

              <label>
                Category
                <select
                  value={form.category}
                  onChange={event =>
                    setForm(current => ({ ...current, category: event.target.value }))
                  }
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Description
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={form.description}
                  onChange={event =>
                    setForm(current => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="What was this project supposed to do?"
                />
              </label>

              <label>
                Why was it archived?
                <textarea
                  rows={2}
                  maxLength={1000}
                  value={form.reason}
                  onChange={event =>
                    setForm(current => ({ ...current, reason: event.target.value }))
                  }
                  placeholder="What made you put it on hold?"
                />
              </label>

              <label>
                Archive date
                <input
                  type="date"
                  value={form.archivedDate}
                  onChange={event =>
                    setForm(current => ({
                      ...current,
                      archivedDate: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Future notes
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={form.notes}
                  onChange={event =>
                    setForm(current => ({ ...current, notes: event.target.value }))
                  }
                  placeholder="Ideas, links, or next steps for the future..."
                />
              </label>

              <div className="archive-form-actions">
                <button
                  type="button"
                  className="archive-secondary-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button type="submit" className="archive-primary-button">
                  {editingId ? "Save changes" : "Save project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedItem && (
        <div
          className="archive-modal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setSelectedItem(null);
          }}
        >
          <div
            className="archive-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-detail-title"
          >
            <div className="archive-modal-header">
              <div>
                <span className="archive-modal-eyebrow">ARCHIVE DETAILS</span>
                <h2 id="archive-detail-title">{selectedItem.title}</h2>
              </div>

              <button
                type="button"
                className="archive-icon-button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="archive-detail-content">
              <span className="archive-category">{selectedItem.category}</span>

              <div className="archive-detail-section">
                <h4>Description</h4>
                <p>{selectedItem.description || "No description added."}</p>
              </div>

              <div className="archive-detail-section">
                <h4>Why it was archived</h4>
                <p>{selectedItem.reason || "No reason provided."}</p>
              </div>

              <div className="archive-detail-section">
                <h4>Future notes</h4>
                <p>{selectedItem.notes || "No future notes added."}</p>
              </div>

              <div className="archive-detail-date">
                <CalendarDays size={16} />
                Archived on {formatDate(selectedItem.archivedDate)}
              </div>
            </div>

            <div className="archive-form-actions">
              <button
                type="button"
                className="archive-secondary-button"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="archive-primary-button"
                onClick={() => openEditForm(selectedItem)}
              >
                <Pencil size={16} />
                Edit project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
