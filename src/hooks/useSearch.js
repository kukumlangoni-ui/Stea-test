/**
 * useSearch — Fast debounced client-side search hook
 * Phase 1: Used by WebsitesPage, CoursesPage, PromptLabPage
 */
import { useState, useEffect, useMemo, useRef } from "react";

/**
 * Normalise any value to a searchable lowercase string
 */
function norm(v) {
  if (!v) return "";
  if (Array.isArray(v)) return v.join(" ").toLowerCase();
  return String(v).toLowerCase();
}

/**
 * Score a document against a query — returns true/false (fast path)
 */
export function matchesQuery(doc, query) {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  if (!q) return true;
  // Build one searchable string from all relevant fields
  const searchable = [
    doc.title, doc.name, doc.titleEn, doc.titleSw,
    doc.description, doc.descriptionEn, doc.descriptionSw,
    doc.summary, doc.prompt,
    doc.category, doc.subCategory, doc.subcategory,
    doc.categorySlug, doc.subCategorySlug,
    doc.searchTitle, doc.searchKeywords,
    doc.url, doc.slug,
    ...(Array.isArray(doc.tags) ? doc.tags : []),
    ...(Array.isArray(doc.keywords) ? doc.keywords : []),
  ].map(norm).join(" ");
  return searchable.includes(q);
}

/**
 * useSearch hook
 * @param {Array} docs - full array of documents
 * @param {number} debounceMs - debounce delay (default 180ms)
 * @returns {{ query, setQuery, filtered, isSearching }}
 */
export function useSearch(docs, debounceMs = 180) {
  const [rawQuery, setRawQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQ(rawQuery), debounceMs);
    return () => clearTimeout(timerRef.current);
  }, [rawQuery, debounceMs]);

  const filtered = useMemo(() => {
    if (!docs?.length) return [];
    if (!debouncedQ.trim()) return docs;
    return docs.filter(d => matchesQuery(d, debouncedQ));
  }, [docs, debouncedQ]);

  return {
    query: rawQuery,
    setQuery: setRawQuery,
    filtered,
    isSearching: rawQuery !== debouncedQ, // true while debouncing
  };
}

/**
 * useCategories — extracts unique categories/subcategories from docs
 */
export function useCategories(docs, customCats = []) {
  return useMemo(() => {
    const cats = new Set(customCats.map(c => c.name || c).filter(Boolean));
    (docs || []).forEach(d => {
      if (d.category) cats.add(d.category);
      if (d.subCategory) cats.add(d.subCategory);
      if (d.subcategory) cats.add(d.subcategory);
    });
    return ["All", ...Array.from(cats).sort()];
  }, [docs, customCats]);
}

/**
 * Build normalized search fields to store alongside a document
 */
export function buildSearchFields(data) {
  const title = data.title || data.name || data.titleEn || "";
  const tags = [
    data.category, data.subCategory, data.subcategory,
    ...(Array.isArray(data.tags) ? data.tags : []),
    ...(Array.isArray(data.keywords) ? data.keywords : []),
  ].filter(Boolean);

  return {
    searchTitle: title.toLowerCase(),
    searchKeywords: tags.map(t => t.toLowerCase()).join(" "),
    categorySlug: (data.category || "").toLowerCase().replace(/\s+/g, "-"),
    subCategorySlug: (data.subCategory || data.subcategory || "").toLowerCase().replace(/\s+/g, "-"),
  };
}
