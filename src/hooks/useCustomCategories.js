/**
 * useCustomCategories — Phase 2
 * Reads admin-created categories from Firestore.
 * Falls back to deriving from docs if collection is empty.
 */
import { useState, useEffect, useMemo } from "react";
import { getFirebaseDb, collection, onSnapshot, query, orderBy, limit } from "../firebase.js";

/**
 * @param {string} collectionName  e.g. "website_solution_categories"
 * @param {Array}  docs            fallback source docs
 */
export function useCustomCategories(collectionName, docs = []) {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db || !collectionName) { setLoading(false); return; }

    const unsub = onSnapshot(
      query(collection(db, collectionName), orderBy("name", "asc"), limit(200)),
      snap => {
        setCats(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      err => {
        console.warn(`useCustomCategories(${collectionName}):`, err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [collectionName]);

  // If no admin categories defined, derive from docs
  const derived = useMemo(() => {
    if (cats.length > 0) return cats;
    const seen = new Set();
    const out = [];
    (docs || []).forEach(d => {
      const c = d.category;
      if (c && !seen.has(c)) { seen.add(c); out.push({ id: c, name: c }); }
    });
    return out.sort((a, b) => a.name.localeCompare(b.name));
  }, [cats, docs]);

  return { categories: derived, loading };
}

export function useCustomSubCategories(collectionName, parentCategory = null, docs = []) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db || !collectionName) { setLoading(false); return; }

    const unsub = onSnapshot(
      query(collection(db, collectionName), orderBy("name", "asc"), limit(500)),
      snap => {
        let fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (parentCategory) {
          fetched = fetched.filter(s => s.parentCategory === parentCategory || s.category === parentCategory);
        }
        setSubs(fetched);
        setLoading(false);
      },
      err => {
        console.warn(`useCustomSubCategories:`, err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [collectionName, parentCategory]);

  const derived = useMemo(() => {
    if (subs.length > 0) return subs;
    const seen = new Set();
    const out = [];
    (docs || []).forEach(d => {
      const c = d.subCategory || d.subcategory;
      if (c && !seen.has(c)) { seen.add(c); out.push({ id: c, name: c }); }
    });
    return out.sort((a, b) => a.name.localeCompare(b.name));
  }, [subs, docs]);

  return { subCategories: derived, loading };
}
