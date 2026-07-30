const SITE_URL = "https://lazydogcapital.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing useful for a crawler, and no reason to advertise the
        // submission endpoints.
        disallow: "/api/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
