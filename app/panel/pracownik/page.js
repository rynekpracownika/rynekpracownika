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

const CATEGORIES = [
  { id:"budowlanka", icon:"🏗️", label:"Budowlanka", sub:["Elektryk","Hydraulik","Murarz","Tynkarz","Malarz","Dekarz","Cieśla","Spawacz"] },
  { id:"produkcja",  icon:"🏭", label:"Produkcja",  sub:["Operator maszyn","Kontroler jakości","Magazynier","Pakowacz"] },
  { id:"logistyka",  icon:"🚚", label:"Transport",  sub:["Kierowca C+E","Kierowca B","Kurier","Spedytor","Magazynier"] },
  { id:"handel",     icon:"🛒", label:"Handel",     sub:["Sprzedawca","Kasjer","Doradca klienta","Handlowiec"] },
  { id:"uslugi",     icon:"🔧", label:"Usługi",     sub:["Mechanik","Fryzjer","Kucharz","Kelner","Ochroniarz"] },
  { id:"it",         icon:"💻", label:"IT",         sub:["Programista","Administrator IT","Helpdesk","Tester"] },
  { id:"biuro",      icon:"📋", label:"Biuro",      sub:["Księgowa","Asystentka","HR","Recepcjonistka"] },
];

const REGIONS = [
  "Dolnośląskie","Kujawsko-Pomorskie","Lubelskie","Lubuskie","Łódź i okolice",
  "Małopolskie","Mazowieckie","Opolskie","Podkarpackie","Podlaskie",
  "Pomorskie","Śląskie","Świętokrzyskie","Warmińsko-Mazurskie","Wielkopolskie","Zachodniopomorskie",
];

export default function PanelPracownika() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [ads, setAds] = useState([]);
  const [view, setView] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Form state
  const [form, setForm] = useState({
    cat:"", role:"", exp:"", rateFrom:"", rateTo:"",
    region:"", city:"", avail:"", contract:[], remote:false,
    skills:"", desc:"",
  });
  const [formStep, setFormStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const up = (k,v) => setForm(f=>({...f,[k]:v}));
  const selCat = CATEGORIES.find(c=>c.id===form.cat);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/logowanie"); return; }
      setUser(user);

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);
      if (prof?.type === "employer") {
  router.push("/panel/pracodawca");
  return;
}

      const { data: myAds } = await supabase.from("ads").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setAds(myAds || []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSaveAd() {
    if (!form.cat || !form.role || !form.region || !form.city) {
      alert("Wypełnij wymagane pola!"); return;
    }
    setSaving(true);
    const skillsArray = form.skills.split(",").map(s=>s.trim()).filter(Boolean);
    const { error } = await supabase.from("ads").insert({
      user_id: user.id,
      role: form.role,
      category: form.cat,
      city: form.city,
      region: form.region,
      experience: form.exp,
      rate_from: parseInt(form.rateFrom) || null,
      rate_to: parseInt(form.rateTo) || null,
      skills: skillsArray,
      description: form.desc,
      contract: form.contract,
      remote: form.remote,
      available: form.avail,
    });

    if (!error) {
      const { data: myAds } = await supabase.from("ads").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setAds(myAds || []);
      setSaved(true);
      setView("dashboard");
      setForm({ cat:"", role:"", exp:"", rateFrom:"", rateTo:"", region:"", city:"", avail:"", contract:[], remote:false, skills:"", desc:"" });
      setFormStep(1);
    }
    setSaving(false);
  }

  async function handleDeleteAd(id) {
    if (!confirm("Usunąć ogłoszenie?")) return;
    await supabase.from("ads").delete().eq("id", id);
    setAds(prev => prev.filter(a => a.id !== id));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontSize:14, color:C.g600 }}>Ładowanie...</div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"DM Sans,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* TOPBAR */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.g100}`, padding:"0 20px", height:56, display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
        <div onClick={()=>router.push("/")} style={{ cursor:"pointer", fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:C.navy }}>
          rynek<span style={{ color:C.blue }}>pracownika</span>
        </div>
        <div style={{ flex:1 }} />
        <div style={{ fontSize:13, color:C.g600 }}>👋 {profile?.name || user?.email}</div>
        <button onClick={handleLogout} style={{ background:C.g100, border:"none", padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", color:C.g600 }}>Wyloguj</button>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 20px" }}>

        {/* TABS */}
        <div style={{ display:"flex", gap:8, marginBottom:28 }}>
          {[["dashboard","📊 Dashboard"],["addad","➕ Dodaj ogłoszenie"],["myads","📋 Moje ogłoszenia"]].map(([id,label])=>(
            <button key={id} onClick={()=>{setView(id);setSaved(false);}} style={{
              padding:"9px 18px", borderRadius:10, border:`1.5px solid ${view===id?C.blue:C.g200}`,
              background:view===id?C.blue:C.white, color:view===id?"#fff":C.g600,
              fontSize:13, fontWeight:600, cursor:"pointer",
            }}>{label}</button>
          ))}
        </div>

        {/* DASHBOARD */}
        {view==="dashboard" && (
          <div>
            {saved && (
              <div style={{ background:C.green+"10", border:`1px solid ${C.green}30`, borderRadius:12, padding:"14px 18px", marginBottom:20, fontSize:14, color:C.green, fontWeight:600 }}>
                ✅ Ogłoszenie dodane! Firmy już mogą je zobaczyć.
              </div>
            )}
            <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:22, fontWeight:800, color:C.g800, marginBottom:6 }}>Witaj, {profile?.name?.split(" ")[0] || ""}! 👋</h2>
            <p style={{ color:C.g600, fontSize:14, marginBottom:28 }}>Zarządzaj swoimi ogłoszeniami i sprawdzaj zainteresowanie firm.</p>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:28 }}>
              {[
                { icon:"📋", label:"Aktywne ogłoszenia", value: ads.filter(a=>a.status==="active").length },
                { icon:"👁️", label:"Łącznie ogłoszeń", value: ads.length },
                { icon:"⭐", label:"Premium", value: ads.filter(a=>a.premium).length },
              ].map((s,i)=>(
                <div key={i} style={{ background:C.white, borderRadius:14, padding:"20px", border:`1px solid ${C.g100}`, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontFamily:"Sora,sans-serif", fontSize:28, fontWeight:800, color:C.blue }}>{s.value}</div>
                  <div style={{ fontSize:12, color:C.g400, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {ads.length === 0 ? (
              <div style={{ background:C.white, borderRadius:14, padding:40, textAlign:"center", border:`1px solid ${C.g100}` }}>
                <div style={{ fontSize:48, marginBottom:16 }}>📝</div>
                <h3 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800, marginBottom:8 }}>Nie masz jeszcze ogłoszeń</h3>
                <p style={{ fontSize:14, color:C.g600, marginBottom:20 }}>Dodaj pierwsze ogłoszenie — firmy zaczną się do Ciebie zgłaszać!</p>
                <button onClick={()=>setView("addad")} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"12px 24px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                  + Dodaj ogłoszenie
                </button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {ads.slice(0,3).map(ad=>(
                  <div key={ad.id} style={{ background:C.white, borderRadius:12, padding:"16px 20px", border:`1px solid ${C.g100}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:C.g800 }}>{ad.role}</div>
                      <div style={{ fontSize:12, color:C.g400, marginTop:2 }}>{ad.city}, {ad.region} · {ad.rate_from && `${ad.rate_from}${ad.rate_to ? `–${ad.rate_to}` : ''} zł/h`}</div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color:C.green, background:C.green+"12", padding:"4px 10px", borderRadius:20 }}>Aktywne</span>
                  </div>
                ))}
                {ads.length > 3 && <button onClick={()=>setView("myads")} style={{ background:"transparent", border:"none", color:C.blue, fontWeight:600, fontSize:13, cursor:"pointer" }}>Zobacz wszystkie ({ads.length}) →</button>}
              </div>
            )}
          </div>
        )}

        {/* ADD AD */}
        {view==="addad" && (
          <div style={{ background:C.white, borderRadius:16, padding:32, border:`1px solid ${C.g100}`, boxShadow:"0 4px 20px rgba(26,115,232,0.06)" }}>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:20, fontWeight:800, color:C.g800, marginBottom:6 }}>Dodaj ogłoszenie</h2>
            <p style={{ fontSize:13, color:C.g600, marginBottom:28 }}>Twoje dane kontaktowe są ukryte — firmy zobaczą je dopiero po wykupieniu dostępu.</p>

            {/* Steps */}
            <div style={{ display:"flex", gap:0, marginBottom:32 }}>
              {["Branża","Szczegóły","Warunki"].map((s,i)=>(
                <div key={s} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:formStep>i+1?C.green:formStep===i+1?C.blue:C.g200, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, marginBottom:4 }}>
                    {formStep>i+1?"✓":i+1}
                  </div>
                  <div style={{ fontSize:10, color:formStep===i+1?C.blue:C.g400, fontWeight:formStep===i+1?700:400 }}>{s}</div>
                </div>
              ))}
            </div>

            {/* Step 1 */}
            {formStep===1 && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:20 }}>
                  {CATEGORIES.map(cat=>(
                    <div key={cat.id} onClick={()=>up("cat",cat.id)} style={{ padding:"14px 16px", borderRadius:10, cursor:"pointer", border:`2px solid ${form.cat===cat.id?C.blue:C.g100}`, background:form.cat===cat.id?C.blue+"0a":C.bg, display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:22 }}>{cat.icon}</span>
                      <div style={{ fontSize:13, fontWeight:700, color:form.cat===cat.id?C.blue:C.g800 }}>{cat.label}</div>
                    </div>
                  ))}
                </div>
                {selCat && (
                  <div style={{ marginBottom:20 }}>
                    <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Stanowisko</label>
                    <select value={form.role} onChange={e=>up("role",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.bg }}>
                      <option value="">-- wybierz --</option>
                      {selCat.sub.map(s=><option key={s}>{s}</option>)}
                      <option value="Inne">Inne</option>
                    </select>
                  </div>
                )}
                <button onClick={()=>form.cat&&form.role&&setFormStep(2)} style={{ width:"100%", background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"12px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", opacity:form.cat&&form.role?1:0.5 }}>Dalej →</button>
              </div>
            )}

            {/* Step 2 */}
            {formStep===2 && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Doświadczenie</label>
                    <select value={form.exp} onChange={e=>up("exp",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none" }}>
                      <option value="">-- wybierz --</option>
                      {["Brak","do 1 roku","1–3 lata","3–5 lat","5–10 lat","ponad 10 lat"].map(e=><option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Dostępność</label>
                    <select value={form.avail} onChange={e=>up("avail",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none" }}>
                      <option value="">-- wybierz --</option>
                      {["Od zaraz","Za 1 tydzień","Za 2 tygodnie","Za 1 miesiąc"].map(e=><option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Stawka od (zł/h)</label>
                    <input type="number" placeholder="np. 30" value={form.rateFrom} onChange={e=>up("rateFrom",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none" }} />
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Stawka do (zł/h)</label>
                    <input type="number" placeholder="np. 50" value={form.rateTo} onChange={e=>up("rateTo",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none" }} />
                  </div>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Umiejętności (oddziel przecinkiem)</label>
                  <input placeholder="np. Uprawnienia SEP, Pomiary, Instalacje" value={form.skills} onChange={e=>up("skills",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none" }} />
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Opis (opcjonalnie)</label>
                  <textarea rows={3} placeholder="Krótko o sobie..." value={form.desc} onChange={e=>up("desc",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", resize:"none", lineHeight:1.6 }} />
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={()=>setFormStep(1)} style={{ padding:"11px 20px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, fontSize:13, fontWeight:600, cursor:"pointer", color:C.g600 }}>← Wstecz</button>
                  <button onClick={()=>setFormStep(3)} style={{ flex:1, background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"11px", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer" }}>Dalej →</button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {formStep===3 && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Województwo</label>
                    <select value={form.region} onChange={e=>up("region",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none" }}>
                      <option value="">-- wybierz --</option>
                      {REGIONS.map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Miasto</label>
                    <input placeholder="np. Katowice" value={form.city} onChange={e=>up("city",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none" }} />
                  </div>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Rodzaj umowy</label>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {["UoP","Zlecenie","B2B","Dzieło","Dowolna"].map(c=>(
                      <label key={c} style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:13, fontWeight:500, padding:"7px 14px", borderRadius:8, border:`1.5px solid ${form.contract.includes(c)?C.blue:C.g200}`, background:form.contract.includes(c)?C.blue+"0a":C.bg }}>
                        <input type="checkbox" checked={form.contract.includes(c)} onChange={e=>{ const nc=e.target.checked?[...form.contract,c]:form.contract.filter(x=>x!==c); up("contract",nc); }} style={{ accentColor:C.blue }} />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>
                <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, fontWeight:500, marginBottom:24 }}>
                  <input type="checkbox" checked={form.remote} onChange={e=>up("remote",e.target.checked)} style={{ accentColor:C.blue, width:16, height:16 }} />
                  Możliwa praca zdalna / hybrydowa
                </label>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={()=>setFormStep(2)} style={{ padding:"11px 20px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, fontSize:13, fontWeight:600, cursor:"pointer", color:C.g600 }}>← Wstecz</button>
                  <button onClick={handleSaveAd} disabled={saving} style={{ flex:1, background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"11px", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                    {saving ? "Zapisywanie..." : "✅ Opublikuj ogłoszenie"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MY ADS */}
        {view==="myads" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:20, fontWeight:800, color:C.g800 }}>Moje ogłoszenia</h2>
              <button onClick={()=>setView("addad")} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"9px 18px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>+ Nowe</button>
            </div>
            {ads.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:C.g400 }}>
                <div style={{ fontSize:48, marginBottom:16 }}>📋</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.g600 }}>Brak ogłoszeń</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {ads.map(ad=>(
                  <div key={ad.id} style={{ background:C.white, borderRadius:14, padding:"18px 20px", border:`1px solid ${C.g100}`, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <div>
                        <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:15, color:C.g800, marginBottom:2 }}>{ad.role}</div>
                        <div style={{ fontSize:12, color:C.g400 }}>{ad.city}, {ad.region} · {ad.rate_from && `${ad.rate_from}${ad.rate_to ? `–${ad.rate_to}` : ''} zł/h`}</div>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:C.green, background:C.green+"12", padding:"4px 10px", borderRadius:20 }}>Aktywne</span>
                    </div>
                    {ad.skills?.length > 0 && (
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                        {ad.skills.map(s=><span key={s} style={{ background:C.blue+"12", color:C.blue, padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600 }}>{s}</span>)}
                      </div>
                    )}
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={()=>handleDeleteAd(ad.id)} style={{ padding:"6px 14px", borderRadius:7, border:"none", background:C.red+"10", color:C.red, fontSize:12, fontWeight:600, cursor:"pointer" }}>🗑 Usuń</button>
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