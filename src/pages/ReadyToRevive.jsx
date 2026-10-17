
import { Flame } from "lucide-react";
import ProjectCard from "../components/ProjectCard";

export default function ReadyToRevive({ projects, onOpen, onNote }) {
  const items = projects.filter(p => p.status === "revive");
  return <section className="page-section">
    <p className="eyebrow"><Flame size={14} /> THE COMEBACK LIST</p>
    <h1>Ready to revive</h1>
    <p className="page-description">Projects with unfinished potential and room for a fresh start.</p>
    <div className="page-summary"><strong>{items.length}</strong><span>projects are waiting for their next chapter.</span></div>
    <div className="projects-grid">{items.map(p => <ProjectCard key={p.id} project={p} onOpen={onOpen} onNote={onNote} />)}</div>
    {!items.length && <div className="empty-state">No projects in this section yet.</div>}
  </section>;
}
