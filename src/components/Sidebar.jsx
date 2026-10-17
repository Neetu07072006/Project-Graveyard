
import { NavLink } from "react-router-dom";
import {
  Sprout, LayoutGrid, Flame, Sprout as Seedling,
  Archive, Clock3, BookOpen, Plus, MoreHorizontal
} from "lucide-react";

const links = [
  { to: "/", label: "All projects", icon: LayoutGrid, end: true },
  { to: "/ready-to-revive", label: "Ready to revive", icon: Flame },
  { to: "/almost-there", label: "Almost there", icon: Seedling },
  { to: "/archived", label: "Archived", icon: Archive },
  { to: "/timeline", label: "Project timeline", icon: Clock3 },
  { to: "/revival-notes", label: "Revival notes", icon: BookOpen }
];

export default function Sidebar({ onAdd }) {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand">
        <span className="brand-icon"><Sprout size={23} /></span>
        <span>
          <strong>graveyard.</strong>
          <small>FOR UNFINISHED IDEAS</small>
        </span>
      </NavLink>

      <p className="side-label">YOUR WORKSPACE</p>
      <nav className="side-nav">
        {links.slice(0, 4).map(({ to, label, icon: Icon, end }, index) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}>
            <Icon size={19} />
            <span>{label}</span>
            <small>{[6, 2, 1, 1][index]}</small>
          </NavLink>
        ))}
      </nav>

      <div className="side-divider" />
      <p className="side-label">YOUR SPACE</p>
      <nav className="side-nav">
        {links.slice(4).map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}>
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="quote-card">
          <span className="quote-bulb">♧</span>
          <blockquote>“An unfinished idea is not a failed idea.”</blockquote>
          <small>— A NOTE TO YOUR FUTURE SELF</small>
        </div>
        <div className="profile-row">
          <span className="avatar">Y</span>
          <span className="profile-text">
            <strong>Your workspace</strong>
            <small>Personal archive</small>
          </span>
          <MoreHorizontal size={19} />
        </div>
      </div>
    </aside>
  );
}
