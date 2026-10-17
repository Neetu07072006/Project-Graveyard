
import { useState } from "react";
import { X, Plus } from "lucide-react";

export default function AddProjectModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("COMMUNITY");
  const [tags, setTags] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      category,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      status: "revive",
      date: "Just now",
      icon: "✧",
      color: "yellow",
      progress: 0,
      note: "Newly added project. Write down the next step to help it move forward.",
      owner: "You"
    });
    onClose();
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-heading">
          <div><p className="eyebrow">A SECOND CHANCE</p><h2>Add a project</h2></div>
          <button type="button" className="icon-button" onClick={onClose}><X size={20} /></button>
        </div>
        <label>Project name
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. StudyBuddy AI" required />
        </label>
        <label>Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What did you build, and what remains?" rows={4} required />
        </label>
        <label>Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>COMMUNITY</option><option>AI / MACHINE LEARNING</option>
            <option>CREATIVE TOOLS</option><option>PRODUCTIVITY</option>
            <option>OPEN SOURCE</option><option>DEVELOPER TOOLS</option>
          </select>
        </label>
        <label>Technology tags <span className="muted">(comma-separated)</span>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="React, Python, AI" />
        </label>
        <div className="modal-actions">
          <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="button-primary"><Plus size={16} /> Add project</button>
        </div>
      </form>
    </div>
  );
}
