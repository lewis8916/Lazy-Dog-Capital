const SITE_URL = "https://lazydogcapital.com";

// Public marketing and borrower-facing pages. Keep in step with the routes in
// app/ — a page missing here simply will not be advertised to crawlers.
const ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/apply", priority: 0.9, changeFrequency: "monthly" },
  { path: "/loan", priority: 0.8, changeFrequency: "monthly" },
  { path: "/why", priority: 0.8, changeFrequency: "monthly" },
  { path: "/deal-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/submit-deal", priority: 0.8, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/resources/forms", priority: 0.5, changeFrequency: "yearly" },
  { path: "/resources/draw-request", priority: 0.5, changeFrequency: "yearly" },
  { path: "/resources/payoff-request", priority: 0.5, changeFrequency: "yearly" },
];

export default function sitemap() {
  const lastModified = new Date();

  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
