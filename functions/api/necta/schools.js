// Cloudflare Pages Function: /api/necta/schools
export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const query = (searchParams.get('query') || '').trim();
  const examType = searchParams.get('examType') || 'CSEE';
  const year = searchParams.get('year') || new Date().getFullYear().toString();

  if (!examType || !year) {
    return new Response(JSON.stringify({ error: 'Exam type and year are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const schools = [];
    const isCode = /^[SP]\d{4}$/i.test(query);

    if (isCode) {
      // Direct fetch for school code
      const code = query.toLowerCase();
      const resultUrls = [
        `https://onlinesys.necta.go.tz/results/${year}/${examType.toLowerCase()}/results/${code}.htm`,
        `https://onlinesys.necta.go.tz/results/${year}/${examType.toLowerCase()}/results/${code}.html`,
        `http://results.necta.go.tz/${examType.toLowerCase()}${year}/results/${code}.htm`,
        `https://maktaba.tetea.org/exam-results/${examType.toUpperCase()}${year}/results/${code}.htm`
      ];

      for (const url of resultUrls) {
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; STEA/1.0)' } });
        if (response.ok) {
          const html = await response.text();
          const nameMatch = html.match(/<H3>[^<]*<P[^>]*>\s*([SP]\d{4}[^<]+)/i);
          if (nameMatch) {
            const fullName = nameMatch[1].trim();
            const cleanName = fullName.replace(/^[SP]\d{4}\s*-?\s*/i, '').trim();
            schools.push({ code: code.toUpperCase(), name: cleanName || code.toUpperCase(), href: `results/${code}.htm` });
          } else {
            schools.push({ code: code.toUpperCase(), name: code.toUpperCase(), href: `results/${code}.htm` });
          }
          break; // Found one
        }
      }
    } else {
      // Fetch index page with fallback
      const indexUrls = [
        `https://onlinesys.necta.go.tz/results/${year}/${examType.toLowerCase()}/indexfiles/index_${query.charAt(0).toLowerCase()}.htm`,
        `https://onlinesys.necta.go.tz/results/${year}/${examType.toLowerCase()}/index.htm`,
        `https://necta.go.tz/results/${year}/${examType.toLowerCase()}/index.htm`,
        `http://results.necta.go.tz/${examType.toLowerCase()}${year}/index.htm`,
        `https://maktaba.tetea.org/exam-results/${examType.toUpperCase()}${year}/index.htm`
      ];

      for (const url of indexUrls) {
        try {
          const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; STEA/1.0)' } });
          if (res.ok) {
            const html = await res.text();
            const found = parseSchoolsFromHTML(html, query);
            if (found.length > 0) {
              schools.push(...found);
              break; // Found results
            }
          }
        } catch (e) {}
      }
    }

    return new Response(JSON.stringify(schools), { headers: corsHeaders });
  } catch (err) {
    console.error('Error fetching schools:', err);
    return new Response(JSON.stringify([]), { headers: corsHeaders });
  }
}

function parseSchoolsFromHTML(html, query) {
  const schools = [];
  const seen = new Set();
  const q = query.toLowerCase().replace(/[-_]/g, ' ').trim();

  // Match links like <a href="results/s0155.htm">S0155 TABORA BOYS</a>
  // Also handle <A HREF="...">
  const linkRegex = /<a[^>]+href=["']([^"']*\.htm)["'][^>]*>([^<]+)<\/a>/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].trim();

    // Extract school code (S#### or P####)
    const codeMatch = text.match(/([SP]\d{4})/i) || href.match(/([sp]\d{4})/i);
    if (!codeMatch) continue;

    const code = codeMatch[1].toUpperCase();
    if (seen.has(code)) continue;

    const name = text.replace(code, '').replace(/[-_]/g, ' ').trim();
    if (!name && !code) continue;

    const searchTarget = `${code} ${name}`.toLowerCase();
    
    if (!q || searchTarget.includes(q)) {
      schools.push({ code, name: name || code, href });
      seen.add(code);
    }

    if (schools.length >= 100) break;
  }

  return schools;
}
