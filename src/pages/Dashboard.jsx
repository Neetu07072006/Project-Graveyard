
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  Flame,
  Archive,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Clock3,
  Sparkles,
  CircleCheck,
  ChevronRight
} from "lucide-react";
import ProjectCard from "../components/ProjectCard";

export default function Dashboard({ projects = [], onOpen, onNote, onAdd }) {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const total = projects.length;
    const revive = projects.filter(p => p.status === "revive").length;
    const almost = projects.filter(p => p.status === "almost").length;
    const archived = projects.filter(p => p.status === "archived").length;
    const revived = projects.filter(p => p.status === "revived").length;
    const average = total
      ? Math.round(projects.reduce((sum, p) => sum + (Number(p.progress) || 0), 0) / total)
      : 0;

    return { total, revive, almost, archived, revived, average };
  }, [projects]);

  const recentProjects = projects.slice(0, 3);
  const revivalCandidates = projects
    .filter(p => p.status === "revive")
    .sort((a, b) => (b.progress || 0) - (a.progress || 0))
    .slice(0, 3);

  const activities = projects.slice(0, 4).map(project => ({
    id: project.id,
    title: project.title,
    status: project.status,
    date: project.date
  }));

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <p className="eyebrow">YOUR CREATIVE WORKSPACE</p>
          <h1>Welcome back, dreamer <span>✳</span></h1>
          <p className="dashboard-subtitle">
            Every unfinished idea is another chance to build something meaningful.
          </p>
        </div>
        <button className="button-primary" onClick={onAdd}>
          <Plus size={17} /> Add a project
        </button>
      </section>

      <section className="dashboard-stats">
        <article className="dashboard-stat">
          <div className="dashboard-stat-icon amber"><FolderKanban size={20} /></div>
          <p>Total projects</p>
          <strong>{stats.total}</strong>
          <span>Ideas in your collection</span>
        </article>
        <article className="dashboard-stat">
          <div className="dashboard-stat-icon coral"><Flame size={20} /></div>
          <p>Ready to revive</p>
          <strong>{stats.revive}</strong>
          <span>Waiting for another chance</span>
        </article>
        <article className="dashboard-stat">
          <div className="dashboard-stat-icon green"><CircleCheck size={20} /></div>
          <p>Almost there</p>
          <strong>{stats.almost}</strong>
          <span>Close to the finish line</span>
        </article>
        <article className="dashboard-stat">
          <div className="dashboard-stat-icon purple"><Archive size={20} /></div>
          <p>Archived</p>
          <strong>{stats.archived}</strong>
          <span>Saved for another day</span>
        </article>
      </section>

      <section className="dashboard-progress-panel">
        <div className="dashboard-progress-copy">
          <div className="dashboard-progress-icon"><TrendingUp size={21} /></div>
          <div>
            <p className="eyebrow">YOUR MOMENTUM</p>
            <h2>{stats.average}% average project progress</h2>
            <p>Small steps count. Keep moving your ideas forward.</p>
          </div>
        </div>
        <div className="dashboard-progress-track">
          <div style={{ width: `${stats.average}%` }} />
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">PICK UP WHERE YOU LEFT OFF</p>
            <h2>Recently added projects</h2>
          </div>
          <button className="dashboard-text-button" onClick={() => navigate("/projects")}>
            View all <ArrowUpRight size={16} />
          </button>
        </div>

        {recentProjects.length ? (
          <div className="dashboard-project-grid">
            {recentProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={onOpen}
                onNote={onNote}
              />
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            <Sparkles size={28} />
            <h3>Your next big idea starts here</h3>
            <p>Add a project to begin building your personal idea archive.</p>
            <button className="button-primary" onClick={onAdd}>
              <Plus size={16} /> Create your first project
            </button>
          </div>
        )}
      </section>

      <div className="dashboard-bottom-grid">
        <section className="dashboard-panel">
          <div className="dashboard-section-heading">
            <div>
              <p className="eyebrow">A SECOND CHANCE</p>
              <h2>Ready for revival</h2>
            </div>
            <button className="dashboard-icon-button" onClick={() => navigate("/ready-to-revive")} aria-label="View revival candidates">
              <ArrowUpRight size={18} />
            </button>
          </div>

          {revivalCandidates.length ? (
            <div className="revival-list">
              {revivalCandidates.map(project => (
                <button className="revival-item" key={project.id} onClick={() => onOpen(project)}>
                  <span className={`project-symbol ${project.color}`}>{project.icon}</span>
                  <span className="revival-item-copy">
                    <strong>{project.title}</strong>
                    <small>{project.progress}% complete · {project.category}</small>
                  </span>
                  <ChevronRight size={17} />
                </button>
              ))}
            </div>
          ) : (
            <p className="dashboard-muted">No projects are waiting for revival right now.</p>
          )}
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-section-heading">
            <div>
              <p className="eyebrow">YOUR WORKSPACE</p>
              <h2>Project activity</h2>
            </div>
            <Clock3 size={19} />
          </div>

          {activities.length ? (
            <div className="activity-list">
              {activities.map(activity => (
                <div className="activity-item" key={activity.id}>
                  <span className="activity-dot" />
                  <div>
                    <strong>{activity.title}</strong>
                    <p>
                      {activity.status === "almost"
                        ? "Almost there"
                        : activity.status === "archived"
                        ? "Moved to archive"
                        : "Ready for revival"}
                    </p>
                    <small>{activity.date}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="dashboard-muted">Your project activity will appear here.</p>
          )}
        </section>
      </div>
    </div>
  );
}
