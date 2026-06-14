import { getAllSlugs } from "../lib/seo-pages";

export default function sitemap() {
  const baseUrl = "https://rynekpracownika.pl";

  const staticPages = [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/kontakt`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/regulamin`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/polityka-prywatnosci`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/o-nas`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/dla-pracodawcy`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/howitworks`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/ranking`, changeFrequency: "weekly", priority: 0.5 },
  ];

  const seoPages = getAllSlugs().map(({ slug }) => ({
    url: `${baseUrl}/praca/${slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticPages, ...seoPages];
}