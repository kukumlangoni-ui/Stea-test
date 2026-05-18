const SEARCH_ROUTES = [
  {
    route: "websites",
    patterns: [
      /\bfree\s*movie\b/,
      /\bfreemovie\b/,
      /\bmovie(s)?\b/,
      /\bwebsite(s)?\b/,
      /\btool(s)?\b/,
    ],
  },
  {
    route: "tech/tips-resources",
    patterns: [
      /\bpost(s)?\b/,
      /\btip(s)?\b/,
      /\bsite\s*content\b/,
      /\bcontent\b/,
      /\barticle(s)?\b/,
      /\bguide(s)?\b/,
    ],
  },
  {
    route: "resources",
    patterns: [
      /\bresource(s)?\b/,
      /\bpdf(s)?\b/,
      /\btemplate(s)?\b/,
      /\bdownload(s)?\b/,
    ],
  },
  {
    route: "duka",
    patterns: [
      /\bmarket\s*place\b/,
      /\bmarketplace\b/,
      /\bshop\b/,
      /\bbuy\b/,
      /\bduka\b/,
      /\bphone(s)?\b/,
      /\bandroid\b/,
    ],
  },
  {
    route: "exams",
    patterns: [
      /\bexam(s)?\b/,
      /\bnecta\b/,
      /\bresult(s)?\b/,
      /\bpast\s*paper(s)?\b/,
      /\bpaper(s)?\b/,
      /\bcsee\b/,
      /\bacsee\b/,
    ],
  },
  {
    route: "courses",
    patterns: [
      /\bcourse(s)?\b/,
      /\blearn(ing)?\b/,
      /\bkozi\b/,
      /\bclass(es)?\b/,
    ],
  },
  {
    route: "prompts",
    patterns: [
      /\bprompt(s)?\b/,
      /\bai\b/,
      /\bgpt\b/,
      /\bchatgpt\b/,
    ],
  },
];

export function routeSearchQuery(query, fallback = "courses") {
  const normalized = String(query || "").trim().toLowerCase();
  if (!normalized) return fallback;

  const match = SEARCH_ROUTES.find(({ patterns }) =>
    patterns.some((pattern) => pattern.test(normalized)),
  );

  return match?.route || fallback;
}

export function searchRouteLabel(route) {
  const labels = {
    websites: "Websites/Tools/Solutions",
    "tech/tips-resources": "Tips/Site Content",
    resources: "Resources",
    duka: "Marketplace",
    exams: "Exams",
    courses: "Courses",
    prompts: "Prompt Lab",
  };
  return labels[route] || route;
}
