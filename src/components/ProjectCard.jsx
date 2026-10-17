
import { MoreHorizontal, ArrowUpRight, Clock3 } from "lucide-react";

export default function ProjectCard({ project, onOpen, onNote }) {
  return (
    <article className="project-card">
      <div className="card-top">
        <div className={`project-symbol ${project.color}`}>{project.icon}</div>
        <button className="icon-button" onClick={() => onNote(project)} aria-label="Add revival note">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <p className="category-label">{project.category}</p>
      <h3>{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <div className="tag-list">
        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <div className="progress-label">
        <span>Last known progress</span>
        <strong>{project.progress}%</strong>
      </div>
      <div className="progress-track">
        <div style={{ width: `${project.progress}%` }} />
      </div>
      <div className="card-footer">
        <span><Clock3 size={13} /> {project.date}</span>
        <button onClick={() => onOpen(project)}>Open project <ArrowUpRight size={15} /></button>
      </div>
    </article>
  );
}
