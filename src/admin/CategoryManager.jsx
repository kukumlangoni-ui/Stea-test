/**
 * CategoryManager — Phase 2+3
 * Reusable panel for admin to create/edit/delete custom categories + subcategories.
 * Used by WebsitesManager, CoursesManager, PromptsManager.
 */
import React, { useState, useEffect } from "react";
import {
  getFirebaseDb, collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp, query, orderBy, limit,
} from "../firebase.js";

const G = "#F5A623";
const BORDER = "rgba(255,255,255,.08)";
const iSt = {
  height: 40, borderRadius: 9, background: "rgba(255,255,255,.05)",
  border: `1px solid ${BORDER}`, color: "#fff", padding: "0 12px",
  fontFamily: "inherit", fontSize: 13, outline: "none",
  width: "100%", boxSizing: "border-box",
};
const lSt = {
  fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,.4)",
  textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5, display: "block",
};

function CategoryRow({ cat, onEdit, onDelete }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(255,255,255,.03)", borderRadius: 8, border: `1px solid ${BORDER}` }}>
      <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#fff" }}>{cat.name}</span>
      {cat.description && <span style={{ fontSize: 11, color: "rgba(255,255,255,.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{cat.description}</span>}
      <button onClick={() => onEdit(cat)} style={{ background: "none", border: "none", color: "#60a5fa", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Edit</button>
      <button onClick={() => onDelete(cat)} style={{ background: "none", border: "none", color: "#ef4444", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Del</button>
    </div>
  );
}

function CategoryForm({ initial, onSave, onCancel, parentOptions = [] }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [parentCategory, setParentCategory] = useState(initial?.parentCategory || "");

  const save = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim(), parentCategory: parentCategory || null });
  };

  return (
    <div style={{ background: "rgba(255,255,255,.04)", border: `1px solid ${G}30`, borderRadius: 12, padding: 14, display: "grid", gap: 10 }}>
      <div>
        <label style={lSt}>Name *</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Movies, Coding, AI Tools" style={iSt} autoFocus />
      </div>
      <div>
        <label style={lSt}>Description (optional)</label>
        <input value={description} onChange={e => setDescription(e.target.value)} style={iSt} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={save} disabled={!name.trim()} style={{ flex: 1, height: 36, borderRadius: 8, border: "none", background: G, color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer", opacity: !name.trim() ? 0.5 : 1 }}>
          {initial ? "Update" : "Add"}
        </button>
        <button onClick={onCancel} style={{ height: 36, padding: "0 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: "rgba(255,255,255,.6)", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

export default function CategoryManager({ categoryCollection, label = "Categories" }) {
  const [cats, setCats] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const db = getFirebaseDb();

  useEffect(() => {
    if (!db || !categoryCollection) return;
    const unsub = onSnapshot(
      query(collection(db, categoryCollection), orderBy("name", "asc"), limit(300)),
      snap => setCats(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      err => console.warn("CategoryManager:", err.message)
    );
    return () => unsub();
  }, [db, categoryCollection]);

  const topLevel = cats.filter(c => !c.parentCategory);
  const subCats  = cats.filter(c => !!c.parentCategory);

  const handleSave = async (data) => {
    if (!db) return;
    try {
      if (editing) {
        await updateDoc(doc(db, categoryCollection, editing.id), { ...data, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, categoryCollection), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
    } catch (e) { console.error(e); }
    setShowForm(false); setEditing(null);
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}"? This won't delete existing posts using it.`)) return;
    try { await deleteDoc(doc(db, categoryCollection, cat.id)); } catch (e) { console.error(e); }
  };

  return (
    <div style={{ background: "rgba(255,255,255,.02)", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{label}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginLeft: 8 }}>{cats.length} total</span>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); }} style={{ background: `${G}18`, border: `1px solid ${G}30`, color: G, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
          + Add
        </button>
      </div>

      {(showForm || editing) && (
        <div style={{ marginBottom: 12 }}>
          <CategoryForm
            initial={editing}
            parentOptions={topLevel}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      {cats.length === 0 && !showForm && (
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", margin: "12px 0" }}>No categories yet. Click "+ Add" to create one.</p>
      )}

      {cats.length > 0 && (
        <div style={{ display: "grid", gap: 6 }}>
          {cats.map(cat => (
            <CategoryRow key={cat.id} cat={cat} onEdit={c => { setEditing(c); setShowForm(false); }} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
