const fs = require('fs');
const path = './src/pages/HomePage.jsx';
let content = fs.readFileSync(path, 'utf8');
const marker = '/* GOOD_CTA_HEADER_MARKER */';
const lines = content.split('\n');
const markerIndex = lines.findIndex(l => l.includes(marker));
if (markerIndex > 0) {
  // Remove the line above the marker (which is the junk line 3073)
  // and the empty line above that (3072) if it exists and we want to clean it up.
  // Actually, let's just remove the junk line specifically.
  // Looking at the diff:
  // line 3071: </section>
  // line 3072: (empty)
  // line 3073: junk
  // line 3074: marker
  lines.splice(markerIndex - 2, 2); 
  // Wait, let's just match the marker and look back.
  // We want to remove line 3073 and 3072.
  // Indices are 0-based, so for 3074 markerIndex is 3073.
  // We want to remove 3072 (index 3071) and 3073 (index 3072).
  
  // Actually, I'll just find the marker and replace the whole block of 3 lines including the empty one.
  lines[markerIndex] = '      {/* ── 11. FINAL CTA ─────────────────────────── */}';
}
fs.writeFileSync(path, lines.join('\n'));
