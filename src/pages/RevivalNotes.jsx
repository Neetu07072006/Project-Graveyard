
import { BookOpen, StickyNote } from "lucide-react";

export default function RevivalNotes({ projects, onEditNote }) {
  return <section className="page-section">
    <p className="eyebrow"><BookOpen size={14} /> THOUGHTS FOR LATER</p>
    <h1>Revival notes</h1>
    <p className="page-description">Small reminders and next steps for ideas that still have potential.</p>
    <div className="notes-grid">
      {projects.map(p => <article className="note-card" key={p.id}>
        <div className="note-icon"><StickyNote size={19} /></div>
        <div className="note-category">{p.category}</div>
        <h3>{p.title}</h3>
        <p>{p.note || "No note yet. Add a reminder for your future self."}</p>
        <button className="text-button" onClick={() => onEditNote(p)}>Edit note ↗</button>
      </article>)}
    </div>
    {!projects.length && <div className="empty-state">Add a project to start writing revival notes.</div>}
  </section>;
}
