export const SEO_ROLES = [
  "Elektryk", "Hydraulik", "Murarz", "Spawacz", "Malarz", "Dekarz",
  "Kierowca C+E", "Kierowca B", "Magazynier", "Mechanik samochodowy",
  "Kucharz", "Sprzedawca", "Operator maszyn CNC", "Fryzjer",
  "Ochroniarz", "Recepcjonistka",
];

export const SEO_CITIES = [
  "Warszawa", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk",
  "Szczecin", "Bydgoszcz", "Lublin", "Katowice", "Białystok",
  "Rzeszów", "Kielce", "Olsztyn", "Opole", "Toruń", "Dębica",
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e")
    .replace(/ł/g, "l").replace(/ń/g, "n").replace(/ó/g, "o")
    .replace(/ś/g, "s").replace(/ź/g, "z").replace(/ż/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getAllSlugs() {
  const slugs = [];
  for (const role of SEO_ROLES) {
    for (const city of SEO_CITIES) {
      slugs.push({
        slug: `${slugify(role)}-${slugify(city)}`,
        role,
        city,
      });
    }
  }
  return slugs;
}

export function parseSlug(slug) {
  return getAllSlugs().find(s => s.slug === slug) || null;
}