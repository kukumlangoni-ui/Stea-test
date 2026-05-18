import React, { useEffect } from "react";

/**
 * SEOHead - Updates `<head>` tags dynamically for SEO.
 * @param {Object} props
 * @param {string} props.title - Title of the page
 * @param {string} props.description - Custom description
 * @param {string[]|string} props.keywords - Tags / keywords
 * @param {string} props.ogImage - OpenGraph Image URL
 * @param {string} props.canonicalUrl - Canonical URL
 * @param {Object} props.structuredData - JSON-LD object
 * @param {boolean} props.noIndex - If true, adds noindex meta tag
 */
export default function SEOHead({ title, description, keywords = [], ogImage, canonicalUrl, structuredData, noIndex = false, type = "website" }) {
  useEffect(() => {
    if (!title) return;

    // update document title
    document.title = title;

    const setMeta = (name, content, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    setMeta("description", description);
    setMeta("keywords", Array.isArray(keywords) ? keywords.join(", ") : keywords);

    // Open Graph
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", type, true);
    setMeta("og:site_name", "STEA Africa", true);
    if (ogImage) {
      setMeta("og:image", ogImage, true);
      setMeta("twitter:image", ogImage);
    }
    setMeta("twitter:card", ogImage ? "summary_large_image" : "summary");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    // Canonical url
    const finalUrl = canonicalUrl || window.location.href;
    setMeta("og:url", finalUrl, true);
    
    let linkCanon = document.querySelector('link[rel="canonical"]');
    if (canonicalUrl) {
      if (!linkCanon) {
        linkCanon = document.createElement("link");
        linkCanon.rel = "canonical";
        document.head.appendChild(linkCanon);
      }
      linkCanon.href = canonicalUrl;
    }

    // noIndex
    if (noIndex) {
      setMeta("robots", "noindex,nofollow");
    } else {
      setMeta("robots", "index,follow");
    }

    // JSON-LD structured data script
    let scriptSchema = document.querySelector('#seo-json-ld');
    if (structuredData) {
      if (!scriptSchema) {
        scriptSchema = document.createElement('script');
        scriptSchema.type = 'application/ld+json';
        scriptSchema.id = 'seo-json-ld';
        document.head.appendChild(scriptSchema);
      }
      scriptSchema.textContent = JSON.stringify(Array.isArray(structuredData) ? structuredData : structuredData);
    } else if (scriptSchema) {
      scriptSchema.remove();
    }

    return () => {
      // cleanup
      document.title = "STEA — Kila Kitu Mahali Pamoja";
    };
  }, [title, description, keywords, ogImage, canonicalUrl, structuredData, noIndex]);

  return null;
}
