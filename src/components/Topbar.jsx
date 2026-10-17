
import { CircleHelp, Search, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
export default function Topbar({ search, setSearch, onMenu }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Open menu">
        <Menu size={20} />
      </button>
      <div className="breadcrumbs">
        <span>Workspace</span>
        <span className="slash">/</span>
        <strong>All projects</strong>
      </div>
      <div className="topbar-right">
        <span className="saved-status"><i /> All changes saved</span>
        <button className="help-button"><CircleHelp size={18} /> Help</button>
        <span className="top-avatar">Y</span>
      </div>
      <label className="mobile-search">
        <Search size={17} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." />
      </label>
      <div className="topbar-actions">
        <ThemeToggle />
        {/* Keep your existing topbar buttons here */}
      </div>
    </header>
  );
}
