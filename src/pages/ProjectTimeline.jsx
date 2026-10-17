
import { Clock3, Circle, CheckCircle2 } from "lucide-react";

export default function ProjectTimeline({ projects }) {
  const sorted = [...projects].reverse();
  return <section className="page-section">
    <p className="eyebrow"><Clock3 size={14} /> THE STORY SO FAR</p>
    <h1>Project timeline</h1>
    <p className="page-description">A chronological look at projects, pauses, and potential new beginnings.</p>
    <div className="timeline">
      {sorted.map((p, i) => <article className="timeline-item" key={p.id}>
        <div className="timeline-marker">{p.status === "almost" ? <CheckCircle2 size={17} /> : <Circle size={17} />}</div>
        <div className="timeline-content">
          <span className="timeline-date">{p.date}</span>
          <h3>{p.title}</h3>
          <p>{p.note}</p>
          <div className="timeline-meta"><span>{p.category}</span><span>{p.progress}% progress</span></div>
        </div>
      </article>)}
    </div>
    {!projects.length && <div className="empty-state">Your project timeline will appear here.</div>}
  </section>;
}
