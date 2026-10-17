
import { CheckCircle2 } from "lucide-react";
import ProjectCard from "../components/ProjectCard";

export default function AlmostThere({ projects, onOpen, onNote }) {
  const items = projects.filter(p => p.status === "almost");
  return <section className="page-section">
    <p className="eyebrow"><CheckCircle2 size={14} /> SO CLOSE</p>
    <h1>Almost there</h1>
    <p className="page-description">These projects have made it most of the way. A final push could make all the difference.</p>
    <div className="projects-grid">{items.map(p => <ProjectCard key={p.id} project={p} onOpen={onOpen} onNote={onNote} />)}</div>
    {!items.length && <div className="empty-state">No nearly finished projects yet.</div>}
  </section>;
}
