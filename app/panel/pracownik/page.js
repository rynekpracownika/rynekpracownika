"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import CityAutocomplete from "@/app/components/CityAutocomplete";

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

function AdStatusBadge({ expiresAt }) {
  const daysLeft = Math.ceil((new Date(expiresAt) - new Date()) / 86400000);
  const color = daysLeft > 7 ? C.green : daysLeft > 3 ? C.orange : C.red;
  return (
    <div style={{ display:"flex", gap:6 }}>
      <span style={{ fontSize:11, fontWeight:700, color, background:color+"12", padding:"4px 10px", borderRadius:20 }}>
        {daysLeft > 0 ? "Aktywne" : "Wygasłe"}
      </span>
      <span style={{ fontSize:11, fontWeight:700, color, background:color+"12", padding:"4px 10px", borderRadius:20 }}>
        {daysLeft > 0 ? `${daysLeft} dni` : "0 dni"}
      </span>
    </div>
  );
}

function ProfileEdit({ user, profile, setProfile }) {
  const [phone, setPhone] = useState(profile?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [phoneMsg, setPhoneMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  async function handleSavePhone() {
    if (!phone) { setPhoneMsg("Podaj numer telefonu!"); return; }
    setSavingPhone(true);
    const { error } = await supabase.from("profiles").update({ phone }).eq("id", user.id);
    if (!error) {
      setProfile(p => ({ ...p, phone }));
      setPhoneMsg("✅ Telefon zaktualizowany!");
    } else {
      setPhoneMsg("❌ Błąd zapisu!");
    }
    setSavingPhone(false);
  }

  async function handleSavePassword() {
    if (!newPassword || !newPassword2) { setPasswordMsg("Wypełnij wszystkie pola!"); return; }
    if (newPassword !== newPassword2) { setPasswordMsg("Hasła nie są identyczne!"); return; }
    if (newPassword.length < 6) { setPasswordMsg("Hasło musi mieć min. 6 znaków!"); return; }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) {
      setPasswordMsg("✅ Hasło zmienione!");
      setCurrentPassword("");
      setNewPassword("");
      setNewPassword2("");
    } else {
      setPasswordMsg("❌ Błąd zmiany hasła!");
    }
    setSavingPassword(false);
  }

  const C2 = {
    blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
    white:"#FFFFFF", g200:"#CBD5E1", g600:"#475569",
    g800:"#1E293B", green:"#16A34A", red:"#DC2626",
  };

  return (
    <div>
      {/* Zmiana telefonu */}
      <div style={{ marginBottom:28, paddingBottom:28, borderBottom:`1px solid #E8ECF0` }}>
        <div style={{ fontSize:13, fontWeight:700, color:C2.g600, marginBottom:12, textTransform:"uppercase", letterSpacing:0.5 }}>Zmień numer telefonu</div>
        <input
          type="tel"
          placeholder="+48 500 000 000"
          value={phone}
          onChange={e=>{ setPhone(e.target.value); setPhoneMsg(""); }}
          style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C2.g200}`, fontSize:13, outline:"none", background:C2.bg, color:C2.g800, marginBottom:10 }}
        />
        {phoneMsg && <div style={{ fontSize:13, color:phoneMsg.includes("✅")?C2.green:C2.red, marginBottom:10 }}>{phoneMsg}</div>}
        <button onClick={handleSavePhone} disabled={savingPhone} style={{ background:`linear-gradient(135deg,${C2.blue},${C2.navy})`, color:"#fff", border:"none", padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>
          {savingPhone ? "Zapisywanie..." : "Zapisz telefon"}
        </button>
      </div>

      {/* Zmiana hasła */}
      <div>
        <div style={{ fontSize:13, fontWeight:700, color:C2.g600, marginBottom:12, textTransform:"uppercase", letterSpacing:0.5 }}>Zmień hasło</div>
        {[
          ["Nowe hasło", newPassword, setNewPassword],
          ["Powtórz nowe hasło", newPassword2, setNewPassword2],
        ].map(([label, val, setter])=>(
          <div key={label} style={{ marginBottom:10 }}>
            <label style={{ fontSize:11, fontWeight:700, color:C2.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
            <input
              type="password"
              value={val}
              onChange={e=>{ setter(e.target.value); setPasswordMsg(""); }}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C2.g200}`, fontSize:13, outline:"none", background:C2.bg, color:C2.g800 }}
            />
          </div>
        ))}
        {passwordMsg && <div style={{ fontSize:13, color:passwordMsg.includes("✅")?C2.green:C2.red, marginBottom:10 }}>{passwordMsg}</div>}
        <button onClick={handleSavePassword} disabled={savingPassword} style={{ background:`linear-gradient(135deg,${C2.blue},${C2.navy})`, color:"#fff", border:"none", padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>
          {savingPassword ? "Zapisywanie..." : "Zmień hasło"}
        </button>
      </div>
    </div>
  );
}

export default function PanelPracownika() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [ads, setAds] = useState([]);
  const [unlocks, setUnlocks] = useState([]);
  const [view, setView] = useState("myads");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();

  const [form, setForm] = useState({
    cat:"", role:"", exp:"", rateFrom:"", rateTo:"",
    region:"", city:"", avail:"", contract:[], remote:false,
    skills:"", desc:"",
  });
  const [formStep, setFormStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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

      const { data: unlocksData } = await supabase
        .from("unlocks")
        .select("ad_id, created_at, employer_id, profiles!unlocks_employer_id_fkey(name, email)")
        .order("created_at", { ascending: false });
      setUnlocks(unlocksData || []);

      setLoading(false);
    }
    load();
  }, []);

  function handleEditAd(ad) {
    setEditingId(ad.id);
    setForm({
      cat: ad.category || "",
      role: ad.role || "",
      exp: ad.experience || "",
      rateFrom: ad.rate_from || "",
      rateTo: ad.rate_to || "",
      region: ad.region || "",
      city: ad.city || "",
      avail: ad.available || "",
      contract: ad.contract || [],
      remote: ad.remote || false,
      skills: (ad.skills || []).join(", "),
      desc: ad.description || "",
    });
    setFormStep(1);
    setView("addad");
  }

  async function handleSaveAd() {
    if (!form.cat) { alert("Wybierz branżę!"); return; }
    if (!form.role) { alert("Wybierz stanowisko!"); return; }
    if (!form.exp) { alert("Wybierz doświadczenie!"); return; }
    if (!form.avail) { alert("Wybierz dostępność!"); return; }
    if (!form.rateFrom) { alert("Podaj stawkę minimalną!"); return; }
    if (!form.region) { alert("Wybierz województwo!"); return; }
    if (!form.city) { alert("Podaj miasto!"); return; }
    if (form.contract.length === 0) { alert("Wybierz co najmniej jeden rodzaj umowy!"); return; }
    setSaving(true);
    const skillsArray = form.skills.split(",").map(s=>s.trim()).filter(Boolean);
    const payload = {
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
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("ads").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("ads").insert({
        ...payload,
        user_id: user.id,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }));
    }

    if (!error) {
      const { data: myAds } = await supabase.from("ads").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setAds(myAds || []);
      setSaved(true);
      setEditingId(null);
      setView("myads");
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

  async function handleExtendAd(id) {
  if (!confirm("Przedłużyć ogłoszenie o 30 dni?")) return;
  const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await supabase.from("ads").update({ expires_at: newExpiry }).eq("id", id);
  if (!error) {
    setAds(prev => prev.map(a => a.id === id ? { ...a, expires_at: newExpiry } : a));
    alert("✅ Ogłoszenie przedłużone o 30 dni!");
  }
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

  const totalUnlocks = unlocks.length;
  const activeAds = ads.filter(a => new Date(a.expires_at) > new Date());

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"DM Sans,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {showPreview && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={()=>setShowPreview(false)}>
          <div style={{ background:C.white, borderRadius:18, padding:32, maxWidth:500, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", maxHeight:"90vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:18, color:C.g800 }}>👁 Podgląd ogłoszenia</h3>
              <button onClick={()=>setShowPreview(false)} style={{ background:"transparent", border:"none", fontSize:20, cursor:"pointer", color:C.g400 }}>✕</button>
            </div>
            <div style={{ background:C.bg, borderRadius:14, padding:"18px 20px", border:`1px solid ${C.g100}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div>
                  <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:16, color:C.g800, marginBottom:4 }}>{form.role || "Stanowisko"}</div>
                  <div style={{ fontSize:12, color:C.g400 }}>{form.city || "Miasto"}, {form.region || "Województwo"} · {form.exp} dośw. · {form.avail}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:C.navy }}>
                    {form.rateFrom}{form.rateTo ? `–${form.rateTo}` : ""} zł/h netto (na rękę)
                  </div>
                  {form.remote && <div style={{ fontSize:11, color:C.green, fontWeight:600 }}>🏠 Zdalnie</div>}
                </div>
              </div>
              {form.skills && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                  {form.skills.split(",").map(s=>s.trim()).filter(Boolean).map(s=>(
                    <span key={s} style={{ background:C.blue+"12", color:C.blue, padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600 }}>{s}</span>
                  ))}
                </div>
              )}
              {form.desc && <p style={{ fontSize:13, color:C.g600, lineHeight:1.6, marginBottom:12 }}>{form.desc}</p>}
              {form.contract?.length > 0 && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                  {form.contract.map(c=><span key={c} style={{ background:C.navy+"12", color:C.navy, padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600 }}>{c}</span>)}
                </div>
              )}
              <div style={{ background:C.bg, borderRadius:8, padding:"10px 14px", border:`1px dashed ${C.g200}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontSize:11, color:C.g400 }}>🔒 <span style={{ fontFamily:"monospace", letterSpacing:2 }}>Jan K***** · +48 5** *** ***</span></div>
                <span style={{ fontSize:11, color:C.g400 }}>Odblokuj kontakt</span>
              </div>
            </div>
            <div style={{ marginTop:20, display:"flex", gap:10 }}>
              <button onClick={()=>setShowPreview(false)} style={{ flex:1, padding:"11px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, fontSize:13, fontWeight:600, cursor:"pointer", color:C.g600 }}>← Wróć do edycji</button>
              <button onClick={()=>{ setShowPreview(false); handleSaveAd(); }} style={{ flex:1, background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"11px", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                ✅ Opublikuj ogłoszenie
              </button>
            </div>
          </div>
        </div>
      )}

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
        <div style={{ display:"flex", gap:8, marginBottom:28, flexWrap:"wrap" }}>
          {[["myads","📋 Moje ogłoszenia"],["addad", editingId?"✏️ Edytuj ogłoszenie":"➕ Dodaj ogłoszenie"],["stats","📈 Statystyki"],["profile","👤 Profil"]].map(([id,label])=>(
            <button key={id} onClick={()=>{setView(id);setSaved(false);if(id!=="addad"){setEditingId(null);setForm({cat:"",role:"",exp:"",rateFrom:"",rateTo:"",region:"",city:"",avail:"",contract:[],remote:false,skills:"",desc:""});setFormStep(1);}}} style={{
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
                ✅ Ogłoszenie zapisane! Firmy już mogą je zobaczyć.
              </div>
            )}
            <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:22, fontWeight:800, color:C.g800, marginBottom:6 }}>Witaj, {profile?.name?.split(" ")[0] || ""}! 👋</h2>
            <p style={{ color:C.g600, fontSize:14, marginBottom:28 }}>Zarządzaj swoimi ogłoszeniami i sprawdzaj zainteresowanie firm.</p>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:28 }}>
              {[
                { icon:"📋", label:"Aktywne ogłoszenia", value: activeAds.length },
                { icon:"🔓", label:"Firmy odblokowały", value: totalUnlocks },
                { icon:"📈", label:"Ostatnie odblokowanie", value: unlocks[0] ? new Date(unlocks[0].created_at).toLocaleDateString("pl-PL") : "—" },
              ].map((s,i)=>(
                <div key={i} style={{ background:C.white, borderRadius:14, padding:"20px", border:`1px solid ${C.g100}`, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontFamily:"Sora,sans-serif", fontSize:i===2?18:28, fontWeight:800, color:C.blue }}>{s.value}</div>
                  <div style={{ fontSize:12, color:C.g400, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {activeAds.length === 0 ? (
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
                {activeAds.slice(0,3).map(ad=>(
                  <div key={ad.id} style={{ background:C.white, borderRadius:12, padding:"16px 20px", border:`1px solid ${C.g100}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:C.g800 }}>{ad.role}</div>
                      <div style={{ fontSize:12, color:C.g400, marginTop:2 }}>{ad.city}, {ad.region} · {ad.rate_from && `${ad.rate_from}${ad.rate_to ? `–${ad.rate_to}` : ''} zł/h`}</div>
                    </div>
                    <AdStatusBadge expiresAt={ad.expires_at} />
                  </div>
                ))}
                {activeAds.length > 3 && <button onClick={()=>setView("myads")} style={{ background:"transparent", border:"none", color:C.blue, fontWeight:600, fontSize:13, cursor:"pointer" }}>Zobacz wszystkie ({ads.length}) →</button>}
              </div>
            )}
          </div>
        )}

        {/* ADD/EDIT AD */}
        {view==="addad" && (
          <div style={{ background:C.white, borderRadius:16, padding:32, border:`1px solid ${C.g100}`, boxShadow:"0 4px 20px rgba(26,115,232,0.06)" }}>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:20, fontWeight:800, color:C.g800, marginBottom:6 }}>
              {editingId ? "✏️ Edytuj ogłoszenie" : "➕ Dodaj ogłoszenie"}
            </h2>
            <p style={{ fontSize:13, color:C.g600, marginBottom:28 }}>Twoje dane kontaktowe są ukryte — firmy zobaczą je dopiero po wykupieniu dostępu.</p>

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
                    <select value={form.role} onChange={e=>up("role",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.bg, color:C.g800 }}>
                      <option value="">-- wybierz --</option>
                      {selCat.sub.map(s=><option key={s}>{s}</option>)}
                      <option value="Inne">Inne</option>
                    </select>
                  </div>
                )}
                <button onClick={()=>form.cat&&form.role&&setFormStep(2)} style={{ width:"100%", background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"12px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", opacity:form.cat&&form.role?1:0.5 }}>Dalej →</button>
              </div>
            )}

            {formStep===2 && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Doświadczenie</label>
                    <select value={form.exp} onChange={e=>up("exp",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", color:C.g800 }}>
                      <option value="">-- wybierz --</option>
                      {["Brak","do 1 roku","1–3 lata","3–5 lat","5–10 lat","ponad 10 lat"].map(e=><option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Dostępność</label>
                    <select value={form.avail} onChange={e=>up("avail",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", color:C.g800 }}>
                      <option value="">-- wybierz --</option>
                      {["Od zaraz","Za 1 tydzień","Za 2 tygodnie","Za 1 miesiąc"].map(e=><option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Stawka od (zł/h)</label>
                    <input type="number" placeholder="np. 30" value={form.rateFrom} onChange={e=>up("rateFrom",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", color:C.g800 }} />
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Stawka do (zł/h)</label>
                    <input type="number" placeholder="np. 50" value={form.rateTo} onChange={e=>up("rateTo",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", color:C.g800 }} />
                  </div>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Umiejętności (oddziel przecinkiem)</label>
                  <input placeholder="np. Uprawnienia SEP, Pomiary, Instalacje" value={form.skills} onChange={e=>up("skills",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", color:C.g800 }} />
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Opis (opcjonalnie)</label>
                  <textarea rows={3} placeholder="Krótko o sobie..." value={form.desc} onChange={e=>up("desc",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", resize:"none", lineHeight:1.6, color:C.g800 }} />
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={()=>setFormStep(1)} style={{ padding:"11px 20px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, fontSize:13, fontWeight:600, cursor:"pointer", color:C.g600 }}>← Wstecz</button>
                  <button onClick={()=>{
                     if(!form.exp) { alert("Wybierz doświadczenie!"); return; }
                     if(!form.avail) { alert("Wybierz dostępność!"); return; }
                     if(!form.rateFrom) { alert("Podaj stawkę minimalną!"); return; }
                     setFormStep(3);
                  }} style={{ flex:1, background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"11px", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer" }}>Dalej →</button>
                </div>
              </div>
            )}

            {formStep===3 && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Województwo</label>
                    <select value={form.region} onChange={e=>{ up("region",e.target.value); up("city",""); }} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", color:C.g800 }}>
                      <option value="">-- wybierz --</option>
                      {REGIONS.map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Miasto</label>
                    <CityAutocomplete value={form.city} onChange={v=>up("city",v)} region={form.region} />
                  </div>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Rodzaj umowy</label>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {["UoP","Zlecenie","B2B","Dzieło","Dowolna"].map(c=>(
                      <div key={c} onClick={()=>{ const nc=form.contract.includes(c)?form.contract.filter(x=>x!==c):[...form.contract,c]; up("contract",nc); }}
                        style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:13, fontWeight:500, padding:"7px 14px", borderRadius:8, border:`1.5px solid ${form.contract.includes(c)?C.blue:C.g200}`, background:form.contract.includes(c)?C.blue+"0a":C.bg, color:C.g800, userSelect:"none" }}>
                        <div style={{ width:16, height:16, borderRadius:4, border:`2px solid ${form.contract.includes(c)?C.blue:C.g400}`, background:form.contract.includes(c)?C.blue:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {form.contract.includes(c) && <span style={{ color:"#fff", fontSize:10, fontWeight:900 }}>✓</span>}
                        </div>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
                <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, fontWeight:500, marginBottom:24 }}>
                  <input type="checkbox" checked={form.remote} onChange={e=>up("remote",e.target.checked)} style={{ accentColor:C.blue, width:16, height:16 }} />
                  Możliwa praca zdalna / hybrydowa
                </label>
                <div style={{ display:"flex", gap:10 }}>
  <button onClick={()=>setFormStep(2)} style={{ padding:"11px 20px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, fontSize:13, fontWeight:600, cursor:"pointer", color:C.g600 }}>← Wstecz</button>
  <button onClick={()=>setShowPreview(true)} style={{ padding:"11px 20px", borderRadius:8, border:`1.5px solid ${C.blue}`, background:C.white, fontSize:13, fontWeight:600, cursor:"pointer", color:C.blue }}>👁 Podgląd</button>
  <button onClick={handleSaveAd} disabled={saving} style={{ flex:1, background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"11px", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer" }}>
    {saving ? "Zapisywanie..." : editingId ? "✅ Zapisz zmiany" : "✅ Opublikuj ogłoszenie"}
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
              <button onClick={()=>{ setEditingId(null); setForm({cat:"",role:"",exp:"",rateFrom:"",rateTo:"",region:"",city:"",avail:"",contract:[],remote:false,skills:"",desc:""}); setFormStep(1); setView("addad"); }} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"9px 18px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>+ Nowe</button>
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
                        <div style={{ fontSize:12, color:C.g400 }}>{ad.city}, {ad.region} · {ad.rate_from && `${ad.rate_from}${ad.rate_to ? `–${ad.rate_to}` : ''} zł/h`} · 👁 {ad.views || 0} wyświetleń</div>
                      </div>
                      <AdStatusBadge expiresAt={ad.expires_at} />
                    </div>
                    {ad.skills?.length > 0 && (
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                        {ad.skills.map(s=><span key={s} style={{ background:C.blue+"12", color:C.blue, padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600 }}>{s}</span>)}
                      </div>
                    )}
                    {unlocks.filter(u=>u.ad_id===ad.id).length > 0 && (
                      <div style={{ background:C.blue+"08", borderRadius:8, padding:"10px 14px", marginBottom:12, border:`1px solid ${C.blue}20` }}>
                        <div style={{ fontSize:11, fontWeight:700, color:C.blue, marginBottom:6 }}>🔓 Firmy które odblokowały Twój kontakt:</div>
                        {unlocks.filter(u=>u.ad_id===ad.id).map((u,i)=>(
                          <div key={i} style={{ fontSize:12, color:C.g600, marginBottom:3 }}>
                            • {u.profiles?.name || "Firma"} · {new Date(u.created_at).toLocaleDateString("pl-PL")}
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display:"flex", gap:8 }}>
                     <button onClick={()=>handleEditAd(ad)} style={{ padding:"6px 14px", borderRadius:7, border:"none", background:C.blue+"10", color:C.blue, fontSize:12, fontWeight:600, cursor:"pointer" }}>✏️ Edytuj</button>
                     <button onClick={()=>handleExtendAd(ad.id)} style={{ padding:"6px 14px", borderRadius:7, border:"none", background:C.green+"10", color:C.green, fontSize:12, fontWeight:600, cursor:"pointer" }}>🔄 Przedłuż 30 dni</button>
                     <button onClick={()=>handleDeleteAd(ad.id)} style={{ padding:"6px 14px", borderRadius:7, border:"none", background:C.red+"10", color:C.red, fontSize:12, fontWeight:600, cursor:"pointer" }}>🗑 Usuń</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STATS */}
        {view==="stats" && (
          <div>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:20, fontWeight:800, color:C.g800, marginBottom:20 }}>📈 Statystyki</h2>
            {unlocks.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:C.g400 }}>
                <div style={{ fontSize:48, marginBottom:16 }}>📊</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.g600, marginBottom:8 }}>Brak danych</div>
                <div style={{ fontSize:13 }}>Żadna firma nie odblokowała jeszcze Twojego kontaktu.</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {unlocks.map((u,i)=>(
                  <div key={i} style={{ background:C.white, borderRadius:14, padding:"18px 20px", border:`1px solid ${C.g100}`, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800, marginBottom:3 }}>
                          🏢 {u.profiles?.name || "Firma"}
                        </div>
                        <div style={{ fontSize:12, color:C.g400 }}>
                          Ogłoszenie: {ads.find(a=>a.id===u.ad_id)?.role || "—"}
                        </div>
                      </div>
                      <div style={{ fontSize:12, color:C.g400 }}>
                        {new Date(u.created_at).toLocaleDateString("pl-PL")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view==="profile" && (
          <div>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:20, fontWeight:800, color:C.g800, marginBottom:20 }}>👤 Mój profil</h2>
            <div style={{ background:C.white, borderRadius:16, padding:32, border:`1px solid ${C.g100}`, boxShadow:"0 4px 20px rgba(26,115,232,0.06)", maxWidth:500 }}>
              
              <div style={{ marginBottom:28, paddingBottom:28, borderBottom:`1px solid ${C.g100}` }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.g600, marginBottom:16, textTransform:"uppercase", letterSpacing:0.5 }}>Dane konta</div>
                <div style={{ fontSize:14, color:C.g800, marginBottom:8 }}>👤 <strong>{profile?.name}</strong></div>
                <div style={{ fontSize:14, color:C.g800, marginBottom:8 }}>✉️ {profile?.email}</div>
                <div style={{ fontSize:14, color:C.g800 }}>📞 {profile?.phone || "Brak telefonu"}</div>
              </div>

              <ProfileEdit user={user} profile={profile} setProfile={setProfile} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}