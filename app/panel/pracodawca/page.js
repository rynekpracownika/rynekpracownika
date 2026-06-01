"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
  white:"#FFFFFF", g100:"#E8ECF0", g200:"#CBD5E1",
  g400:"#94A3B8", g600:"#475569", g800:"#1E293B",
  green:"#16A34A", orange:"#EA580C", red:"#DC2626", yellow:"#F59E0B",
};

const REGIONS = [
  "Cała Polska","Dolnośląskie","Kujawsko-Pomorskie","Lubelskie","Lubuskie","Łódź i okolice",
  "Małopolskie","Mazowieckie","Opolskie","Podkarpackie","Podlaskie",
  "Pomorskie","Śląskie","Świętokrzyskie","Warmińsko-Mazurskie","Wielkopolskie","Zachodniopomorskie",
];

const CATEGORIES = [
  { id:"all",        label:"Wszystkie" },
  { id:"budowlanka", label:"🏗️ Budowlanka" },
  { id:"produkcja",  label:"🏭 Produkcja" },
  { id:"logistyka",  label:"🚚 Transport" },
  { id:"handel",     label:"🛒 Handel" },
  { id:"uslugi",     label:"🔧 Usługi" },
  { id:"it",         label:"💻 IT" },
  { id:"biuro",      label:"📋 Biuro" },
];

export default function PanelPracodawcy() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [ads, setAds] = useState([]);
  const [unlocked, setUnlocked] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("search");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Cała Polska");
  const [cat, setCat] = useState("all");
  const [showUnlock, setShowUnlock] = useState(null);
  const [page, setPage] = useState(0);
  const PER_PAGE = 10;
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/logowanie"); return; }
      setUser(user);

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);
      if (prof?.type === "worker") {
        router.push("/panel/pracownik");
        return;
      }

      const { data: allAds } = await supabase.from("ads").select("*, profiles(name, phone, email)").eq("status","active").order("created_at", { ascending: false });
      setAds(allAds || []);

      const { data: unlocksData } = await supabase.from("unlocks").select("ad_id").eq("employer_id", user.id);
      if (unlocksData) {
        const map = {};
        unlocksData.forEach(u => { map[u.ad_id] = true; });
        setUnlocked(map);
      }

      setLoading(false);
    }
    load();
  }, []);

  const filtered = ads.filter(a => {
    const q = search.toLowerCase();
    return (
      (!search || a.role?.toLowerCase().includes(q) || a.skills?.some(s=>s.toLowerCase().includes(q)) || a.city?.toLowerCase().includes(q)) &&
      (region === "Cała Polska" || a.region === region) &&
      (cat === "all" || a.category === cat)
    );
  });

  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  function handleUnlock(ad) {
    setShowUnlock(ad);
  }

  async function confirmUnlock(ad) {
    const { error } = await supabase.from("unlocks").upsert({
      employer_id: user.id,
      ad_id: ad.id,
    }, { onConflict: "employer_id,ad_id" });
    console.log("unlock error:", error);
    setUnlocked(u => ({...u, [ad.id]: true}));
    setShowUnlock(null);
    setView("contacts");
  }

  if (loading) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontSize:14, color:C.g600 }}>Ładowanie...</div>
    </div>
  );

  const inputStyle = { padding:"9px 14px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.bg, color:C.g800 };
  const selectStyle = { padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", cursor:"pointer", color:C.g800 };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"DM Sans,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* Unlock modal */}
      {showUnlock && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
          onClick={()=>setShowUnlock(null)}>
          <div style={{ background:C.white, borderRadius:18, padding:32, maxWidth:380, width:"100%" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:40, textAlign:"center", marginBottom:14 }}>🔓</div>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:19, color:C.g800, textAlign:"center", marginBottom:8 }}>Odblokuj dane kontaktowe</h3>
            <p style={{ fontSize:13, color:C.g600, textAlign:"center", marginBottom:22, lineHeight:1.6 }}>
              Uzyskaj dostęp do danych: <strong>{showUnlock.role}</strong> z {showUnlock.city}.
            </p>
            <div style={{ background:C.bg, borderRadius:10, padding:14, marginBottom:18, border:`1px solid ${C.g100}` }}>
              {[["Pojedyncze odblokowanie","9 zł"],["Pakiet 10 kontaktów","79 zł"]].map(([t,p])=>(
                <div key={t} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.g100}`, fontSize:13 }}>
                  <span style={{ color:C.g800 }}>{t}</span>
                  <span style={{ fontWeight:700, color:C.blue }}>{p}</span>
                </div>
              ))}
            </div>
            <button onClick={()=>confirmUnlock(showUnlock)} style={{ width:"100%", background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"12px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", marginBottom:8 }}>
              Odblokuj (demo) →
            </button>
            <button onClick={()=>setShowUnlock(null)} style={{ width:"100%", background:"transparent", border:"none", color:C.g400, fontSize:12, cursor:"pointer", padding:6 }}>Anuluj</button>
          </div>
        </div>
      )}

      {/* TOPBAR */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.g100}`, padding:"0 20px", height:56, display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
        <div onClick={()=>router.push("/")} style={{ cursor:"pointer", fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:C.navy }}>
          rynek<span style={{ color:C.blue }}>pracownika</span>
        </div>
        <div style={{ flex:1 }} />
        <div style={{ fontSize:13, color:C.g600 }}>🏢 {profile?.name || user?.email}</div>
        <button onClick={handleLogout} style={{ background:C.g100, border:"none", padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", color:C.g600 }}>Wyloguj</button>
      </div>

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"32px 20px" }}>

        {/* TABS */}
        <div style={{ display:"flex", gap:8, marginBottom:28 }}>
          {[["search","🔍 Szukaj pracowników"],["contacts","📞 Moje kontakty"]].map(([id,label])=>(
            <button key={id} onClick={()=>setView(id)} style={{ padding:"9px 18px", borderRadius:10, border:`1.5px solid ${view===id?C.blue:C.g200}`, background:view===id?C.blue:C.white, color:view===id?"#fff":C.g600, fontSize:13, fontWeight:600, cursor:"pointer" }}>{label}</button>
          ))}
        </div>

        {/* SEARCH */}
        {view==="search" && (
          <div>
            <div style={{ background:C.white, borderRadius:14, padding:"16px 20px", border:`1px solid ${C.g100}`, marginBottom:20, boxShadow:"0 2px 10px rgba(26,115,232,0.05)" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 180px 180px", gap:10, marginBottom:12 }}>
                <input
                  placeholder="🔍 Zawód, umiejętność, miasto..."
                  value={search}
                  onChange={e=>{ setSearch(e.target.value); setPage(0); }}
                  style={inputStyle}
                />
                <select value={region} onChange={e=>{ setRegion(e.target.value); setPage(0); }} style={selectStyle}>
                  {REGIONS.map(r=><option key={r}>{r}</option>)}
                </select>
                <select value={cat} onChange={e=>{ setCat(e.target.value); setPage(0); }} style={selectStyle}>
                  {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div style={{ fontSize:13, color:C.g400 }}>Znaleziono: <strong style={{ color:C.g800 }}>{filtered.length}</strong> ogłoszeń</div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:C.g400 }}>
                <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.g600, marginBottom:8 }}>Brak wyników</div>
                <div style={{ fontSize:13 }}>Zmień filtry lub wróć później.</div>
              </div>
            ) : (
              <div>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {paginated.map(ad=>(
                    <div key={ad.id} style={{ background:C.white, borderRadius:14, padding:"20px", border:`1px solid ${C.g100}`, boxShadow:"0 2px 10px rgba(26,115,232,0.04)" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                        <div>
                          <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:16, color:C.g800, marginBottom:3 }}>{ad.role}</div>
                          <div style={{ fontSize:12, color:C.g400 }}>{ad.city}, {ad.region} · {ad.experience} dośw. · {ad.available}</div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:C.navy }}>
                            {ad.rate_from}{ad.rate_to ? `–${ad.rate_to}` : ''} zł/h netto (na rękę)
                          </div>
                          {ad.remote && <div style={{ fontSize:11, color:C.green, fontWeight:600 }}>🏠 Zdalnie</div>}
                        </div>
                      </div>

                      {ad.skills?.length > 0 && (
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                          {ad.skills.map(s=><span key={s} style={{ background:C.blue+"12", color:C.blue, padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600 }}>{s}</span>)}
                        </div>
                      )}

                      {ad.description && (
                        <p style={{ fontSize:13, color:C.g600, lineHeight:1.6, marginBottom:12 }}>{ad.description}</p>
                      )}

                      {unlocked[ad.id] ? (
                        <div style={{ background:C.green+"0a", borderRadius:10, padding:"14px 16px", border:`1px solid ${C.green}30` }}>
                          <div style={{ fontSize:11, fontWeight:700, color:C.green, marginBottom:8 }}>✅ Dane kontaktowe odblokowane</div>
                          <div style={{ fontSize:14, fontWeight:700, color:C.g800 }}>{ad.profiles?.name}</div>
                          <div style={{ fontSize:13, color:C.blue, fontWeight:600 }}>☎ {ad.profiles?.phone}</div>
                          <div style={{ fontSize:12, color:C.g600 }}>✉ {ad.profiles?.email}</div>
                        </div>
                      ) : (
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:C.bg, borderRadius:10, padding:"12px 16px", border:`1px dashed ${C.g200}` }}>
                          <div style={{ fontSize:12, color:C.g400 }}>
                            🔒 <span style={{ fontFamily:"monospace", letterSpacing:2, color:C.g200 }}>Jan K***** · +48 5** *** ***</span>
                          </div>
                          <button onClick={()=>handleUnlock(ad)} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"8px 16px", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                            🔓 Odblokuj kontakt
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* PAGINACJA */}
                {filtered.length > PER_PAGE && (
                  <div style={{ display:"flex", gap:8, justifyContent:"center", alignItems:"center", marginTop:24 }}>
                    <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{ padding:"8px 18px", borderRadius:8, border:`1px solid ${C.g200}`, background:C.white, fontSize:13, cursor:"pointer", color:C.g600, opacity:page===0?0.4:1 }}>← Poprzednia</button>
                    <span style={{ padding:"8px 16px", fontSize:13, color:C.g600, fontWeight:600 }}>Strona {page+1} z {Math.ceil(filtered.length/PER_PAGE)}</span>
                    <button onClick={()=>setPage(p=>p+1)} disabled={(page+1)*PER_PAGE>=filtered.length} style={{ padding:"8px 18px", borderRadius:8, border:`1px solid ${C.g200}`, background:C.white, fontSize:13, cursor:"pointer", color:C.g600, opacity:(page+1)*PER_PAGE>=filtered.length?0.4:1 }}>Następna →</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CONTACTS */}
        {view==="contacts" && (
          <div>
            {Object.keys(unlocked).length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:C.g400 }}>
                <div style={{ fontSize:48, marginBottom:16 }}>📞</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.g600, marginBottom:8 }}>Brak odblokowanych kontaktów</div>
                <div style={{ fontSize:13 }}>Przejdź do wyszukiwarki i odblokuj kontakty pracowników.</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {ads.filter(a=>unlocked[a.id]).map(ad=>(
                  <div key={ad.id} style={{ background:C.white, borderRadius:14, padding:"18px 20px", border:`1px solid ${C.g100}`, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, paddingBottom:12, borderBottom:`1px solid ${C.g100}` }}>
                      <div>
                        <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:15, color:C.g800, marginBottom:3 }}>{ad.role}</div>
                        <div style={{ fontSize:12, color:C.g400 }}>{ad.city}, {ad.region}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:14, color:C.navy }}>{ad.rate_from}{ad.rate_to ? `–${ad.rate_to}` : ''} zł/h netto (na rękę)</div>
                        <div style={{ fontSize:11, color:C.g400 }}>{ad.experience} dośw.</div>
                      </div>
                    </div>
                    {ad.skills?.length > 0 && (
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                        {ad.skills.map(s=><span key={s} style={{ background:C.blue+"12", color:C.blue, padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600 }}>{s}</span>)}
                      </div>
                    )}
                    <div style={{ background:C.green+"0a", borderRadius:8, padding:"12px 14px", border:`1px solid ${C.green}30` }}>
                      <div style={{ fontSize:11, fontWeight:700, color:C.green, marginBottom:8 }}>✅ Dane kontaktowe</div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.g800 }}>{ad.profiles?.name}</div>
                      <div style={{ fontSize:13, color:C.blue, fontWeight:600 }}>☎ {ad.profiles?.phone}</div>
                      <div style={{ fontSize:12, color:C.g600 }}>✉ {ad.profiles?.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}