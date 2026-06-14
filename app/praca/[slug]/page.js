import { supabase } from "../../../lib/supabase";
import { parseSlug, getAllSlugs } from "../../../lib/seo-pages";
import Link from "next/link";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllSlugs().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = parseSlug(slug);
  if (!data) return { title: "Praca - rynekpracownika.pl" };

  const { role, city } = data;
  return {
    title: `Praca: ${role} w ${city} | rynekpracownika.pl`,
    description: `Szukasz pracy jako ${role} w ${city}? Zobacz aktualne oferty pracowników i zatrudnij sprawdzonego kandydata przez rynekpracownika.pl — pierwszą polską platformę odwróconych ogłoszeń.`,
  };
}

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
  white:"#FFFFFF", g100:"#E8ECF0", g200:"#CBD5E1",
  g400:"#94A3B8", g600:"#475569", g800:"#1E293B",
  green:"#16A34A",
};

function rateLabel(ad) {
  const unit = ad.rate_type === "monthly" ? "zł/mies." : "zł/h";
  return `${ad.rate_from}${ad.rate_to ? `–${ad.rate_to}` : ""} ${unit} netto`;
}

export default async function SeoLandingPage({ params }) {
  const { slug } = await params;
  const data = parseSlug(slug);

  if (!data) {
    return (
      <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>😕</div>
          <div style={{ fontSize:16, color:C.g600 }}>Strona nie istnieje</div>
          <Link href="/" style={{ display:"inline-block", marginTop:20, background:C.blue, color:"#fff", border:"none", padding:"10px 24px", borderRadius:8, fontSize:14, fontWeight:600, textDecoration:"none" }}>Wróć do strony głównej</Link>
        </div>
      </div>
    );
  }

  const { role, city } = data;

  const { data: ads } = await supabase
    .from("ads")
    .select("*")
    .eq("status", "active")
    .ilike("role", `%${role}%`)
    .ilike("city", city)
    .order("created_at", { ascending: false })
    .limit(10);

  const adsCount = ads?.length || 0;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"DM Sans,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* TOPBAR */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.g100}`, padding:"0 20px", height:56, display:"flex", alignItems:"center", gap:12, boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
        <Link href="/" style={{ cursor:"pointer", fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:C.navy, textDecoration:"none" }}>
          rynek<span style={{ color:C.blue }}>pracownika</span>
        </Link>
        <div style={{ flex:1 }} />
        <Link href="/" style={{ background:C.g100, border:"none", padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:600, color:C.g600, textDecoration:"none" }}>← Strona główna</Link>
      </div>

      <div style={{ maxWidth:800, margin:"0 auto", padding:"40px 20px" }}>

        {/* Hero */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:28, fontWeight:900, color:C.g800, marginBottom:12 }}>
            Praca: {role} w {city}
          </h1>
          <p style={{ fontSize:15, color:C.g600, lineHeight:1.7, maxWidth:600, margin:"0 auto" }}>
            Szukasz pracy jako <strong>{role}</strong> w <strong>{city}</strong>? Przeglądaj ogłoszenia pracowników gotowych do podjęcia pracy — albo dodaj własne ogłoszenie ze swoją stawką i niech praca znajdzie Ciebie.
          </p>
        </div>

        {/* CTA dodaj ogłoszenie */}
        <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius:16, padding:"24px 28px", marginBottom:32, textAlign:"center" }}>
          <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:18, color:"#fff", marginBottom:8 }}>
            Jesteś {role.toLowerCase()}em w {city}?
          </div>
          <p style={{ color:"rgba(255,255,255,0.8)", fontSize:13, marginBottom:18 }}>
            Dodaj bezpłatne ogłoszenie ze swoją stawką — firmy zapłacą za kontakt do Ciebie.
          </p>
          <Link href="/rejestracja?type=worker" style={{ display:"inline-block", background:"#fff", color:C.navy, padding:"12px 28px", borderRadius:10, fontSize:14, fontWeight:800, textDecoration:"none", fontFamily:"Sora,sans-serif" }}>
            Dodaj ogłoszenie za darmo →
          </Link>
        </div>

        {/* Lista ogłoszeń */}
        <div style={{ marginBottom:24 }}>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:20, fontWeight:800, color:C.g800, marginBottom:16 }}>
            {adsCount > 0 ? `Aktualne ogłoszenia (${adsCount})` : "Brak aktualnych ogłoszeń"}
          </h2>

          {adsCount === 0 ? (
            <div style={{ background:C.white, borderRadius:14, padding:"40px 20px", textAlign:"center", border:`1px solid ${C.g100}` }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
              <p style={{ fontSize:14, color:C.g600, marginBottom:16 }}>
                Obecnie nie ma ogłoszeń dla "{role}" w {city}. Sprawdź pełną wyszukiwarkę lub bądź pierwszy — dodaj swoje ogłoszenie!
              </p>
              <Link href="/?view=ads" style={{ display:"inline-block", background:C.blue, color:"#fff", padding:"10px 22px", borderRadius:8, fontSize:13, fontWeight:700, textDecoration:"none" }}>
                Przeglądaj wszystkie ogłoszenia →
              </Link>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {ads.map(ad=>(
                <Link key={ad.id} href={`/ogloszenie/${ad.id}`} style={{ display:"block", background:C.white, borderRadius:14, padding:"18px 20px", border:`1px solid ${C.g100}`, textDecoration:"none", boxShadow:"0 2px 10px rgba(26,115,232,0.04)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div>
                      <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:15, color:C.g800, marginBottom:3 }}>{ad.role}</div>
                      <div style={{ fontSize:12, color:C.g400 }}>{ad.city}, {ad.region} · {ad.experience} dośw.</div>
                    </div>
                    <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:14, color:C.navy }}>{rateLabel(ad)}</div>
                  </div>
                  {ad.skills?.length > 0 && (
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {ad.skills.slice(0,3).map(s=><span key={s} style={{ background:C.blue+"12", color:C.blue, padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600 }}>{s}</span>)}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Link do pełnej wyszukiwarki */}
        <div style={{ textAlign:"center", padding:"24px 0" }}>
          <Link href="/?view=ads" style={{ color:C.blue, fontWeight:600, fontSize:13, textDecoration:"none" }}>
            🔍 Zobacz wszystkie ogłoszenia w {city} i okolicach →
          </Link>
        </div>

      </div>
    </div>
  );
}
