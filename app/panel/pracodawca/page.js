"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import CityAutocomplete from "@/app/components/CityAutocomplete";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
  white:"#FFFFFF", g100:"#E8ECF0", g200:"#CBD5E1",
  g400:"#475569", g600:"#475569", g800:"#1E293B",
  green:"#16A34A", orange:"#EA580C", red:"#DC2626", yellow:"#F59E0B",
};

const REGIONS = [
  "Cała Polska","Dolnośląskie","Kujawsko-Pomorskie","Lubelskie","Lubuskie","Łódź i okolice",
  "Małopolskie","Mazowieckie","Opolskie","Podkarpackie","Podlaskie",
  "Pomorskie","Śląskie","Świętokrzyskie","Warmińsko-Mazurskie","Wielkopolskie","Zachodniopomorskie",
];

const CATEGORIES = [
  { id:"all", label:"Wszystkie kategorie" },
  { id:"budowlanka", label:"🏗️ Budowlanka" },
  { id:"produkcja",  label:"🏭 Produkcja" },
  { id:"logistyka",  label:"🚚 Transport" },
  { id:"handel",     label:"🛒 Handel" },
  { id:"uslugi",     label:"🔧 Usługi" },
  { id:"it",         label:"💻 IT" },
  { id:"biuro",      label:"📋 Biuro" },
];

const ROLES = {
  all: [],
  budowlanka: ["Elektryk","Hydraulik","Murarz","Tynkarz","Malarz","Dekarz","Cieśla","Spawacz"],
  produkcja:  ["Operator maszyn","Kontroler jakości","Magazynier","Pakowacz"],
  logistyka:  ["Kierowca C+E","Kierowca B","Kurier","Spedytor","Magazynier"],
  handel:     ["Sprzedawca","Kasjer","Doradca klienta","Handlowiec"],
  uslugi:     ["Mechanik","Fryzjer","Kucharz","Kelner","Ochroniarz"],
  it:         ["Programista","Administrator IT","Helpdesk","Tester"],
  biuro:      ["Księgowa","Asystentka","HR","Recepcjonistka"],
};

const STATUSES = [
  { id:"none", label:"Brak statusu", color:"#94A3B8" },
  { id:"call", label:"📞 Do zadzwonienia", color:"#1A73E8" },
  { id:"talking", label:"🔄 W trakcie rozmów", color:"#EA580C" },
  { id:"hired", label:"✅ Zatrudniony", color:"#16A34A" },
  { id:"rejected", label:"❌ Odrzucony", color:"#DC2626" },
];

function DeleteAccountButton({ userId }) {
  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    try {
      await supabase.from("unlocks").delete().eq("employer_id", userId);
      await supabase.from("profiles").delete().eq("id", userId);
      await supabase.auth.signOut();
      await fetch("/api/delete-account", { method: "POST" });
      router.push("/?deleted=1");
    } catch {
      setDeleting(false);
      alert("Błąd podczas usuwania konta. Spróbuj ponownie.");
    }
  }

  if (!confirm1) return (
    <button onClick={() => setConfirm1(true)} style={{ background:"#DC262610", color:"#DC2626", border:"1px solid #DC262630", padding:"9px 18px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>
      🗑 Usuń konto
    </button>
  );

  if (!confirm2) return (
    <div style={{ background:"#DC262608", border:"1px solid #DC262630", borderRadius:10, padding:"16px" }}>
      <div style={{ fontSize:13, fontWeight:700, color:"#DC2626", marginBottom:8 }}>Na pewno chcesz usunąć konto?</div>
      <p style={{ fontSize:12, color:"#475569", marginBottom:14 }}>Wszystkie dane zostaną trwale usunięte. Tej operacji nie można cofnąć.</p>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={() => setConfirm1(false)} style={{ padding:"8px 16px", borderRadius:8, border:"1.5px solid #CBD5E1", background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", color:"#475569" }}>Anuluj</button>
        <button onClick={() => setConfirm2(true)} style={{ padding:"8px 16px", borderRadius:8, border:"none", background:"#DC2626", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Tak, usuń konto</button>
      </div>
    </div>
  );

  return (
    <div style={{ background:"#DC262608", border:"1px solid #DC262630", borderRadius:10, padding:"16px" }}>
      <div style={{ fontSize:13, fontWeight:700, color:"#DC2626", marginBottom:8 }}>⚠️ Ostatnie ostrzeżenie</div>
      <p style={{ fontSize:12, color:"#475569", marginBottom:14 }}>Kliknij poniższy przycisk aby <strong>trwale</strong> usunąć konto i wszystkie dane.</p>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={() => { setConfirm1(false); setConfirm2(false); }} style={{ padding:"8px 16px", borderRadius:8, border:"1.5px solid #CBD5E1", background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", color:"#475569" }}>Anuluj</button>
        <button onClick={handleDelete} disabled={deleting} style={{ padding:"8px 16px", borderRadius:8, border:"none", background:"#DC2626", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
          {deleting ? "Usuwanie..." : "🗑 Usuń trwale"}
        </button>
      </div>
    </div>
  );
}

function ProfileEdit({ user, profile, setProfile }) {
  const [phone, setPhone] = useState(profile?.phone || "");
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
      setNewPassword("");
      setNewPassword2("");
    } else {
      setPasswordMsg("❌ Błąd zmiany hasła!");
    }
    setSavingPassword(false);
  }

  return (
    <div>
      <div style={{ marginBottom:28, paddingBottom:28, borderBottom:`1px solid ${C.g100}` }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.g600, marginBottom:12, textTransform:"uppercase", letterSpacing:0.5 }}>Zmień numer telefonu</div>
        <input type="tel" placeholder="+48 500 000 000" value={phone} onChange={e=>{ setPhone(e.target.value); setPhoneMsg(""); }}
          style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.bg, color:C.g800, marginBottom:10 }} />
        {phoneMsg && <div style={{ fontSize:13, color:phoneMsg.includes("✅")?C.green:C.red, marginBottom:10 }}>{phoneMsg}</div>}
        <button onClick={handleSavePhone} disabled={savingPhone} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>
          {savingPhone ? "Zapisywanie..." : "Zapisz telefon"}
        </button>
      </div>
      <div>
        <div style={{ fontSize:13, fontWeight:700, color:C.g600, marginBottom:12, textTransform:"uppercase", letterSpacing:0.5 }}>Zmień hasło</div>
        {[["Nowe hasło", newPassword, setNewPassword],["Powtórz nowe hasło", newPassword2, setNewPassword2]].map(([label, val, setter])=>(
          <div key={label} style={{ marginBottom:10 }}>
            <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
            <input type="password" value={val} onChange={e=>{ setter(e.target.value); setPasswordMsg(""); }}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.bg, color:C.g800 }} />
          </div>
        ))}
        {passwordMsg && <div style={{ fontSize:13, color:passwordMsg.includes("✅")?C.green:C.red, marginBottom:10 }}>{passwordMsg}</div>}
        <button onClick={handleSavePassword} disabled={savingPassword} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>
          {savingPassword ? "Zapisywanie..." : "Zmień hasło"}
        </button>
      </div>
    </div>
  );
}

export default function PanelPracodawcy() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [ads, setAds] = useState([]);
  const [unlocked, setUnlocked] = useState({});
  const [favorites, setFavorites] = useState({});
  const [notes, setNotes] = useState({});
  const [statuses, setStatuses] = useState({});
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("search");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Cała Polska");
  const [city, setCity] = useState("");
  const [cat, setCat] = useState("all");
  const [role, setRole] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [rateMin, setRateMin] = useState("");
  const [rateMax, setRateMax] = useState("");
  const [showUnlock, setShowUnlock] = useState(null);
  const [page, setPage] = useState(0);
  const PER_PAGE = 10;
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/logowanie"); return; }
      // Sprawdź 24h nieaktywności
      const lastActive = localStorage.getItem("lastActive");
      const now = Date.now();
      if (lastActive && now - parseInt(lastActive) > 24 * 60 * 60 * 1000) {
        await supabase.auth.signOut();
        router.push("/logowanie?reason=inactive");
        return;
      }
      localStorage.setItem("lastActive", now.toString());
      setUser(user);
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);
      if (prof?.type === "worker") { router.push("/panel/pracownik"); return; }
      const { data: allAds } = await supabase.from("ads").select("*, profiles(name, phone, email)").eq("status","active").order("created_at", { ascending: false });
      setAds(allAds || []);
      const { data: unlocksData } = await supabase.from("unlocks").select("ad_id").eq("employer_id", user.id);
      if (unlocksData) {
        const map = {};
        unlocksData.forEach(u => { map[u.ad_id] = true; });
        setUnlocked(map);
      }
      // Wczytaj ulubione, notatki i statusy z localStorage
      const savedFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "{}");
      const savedNotes = JSON.parse(localStorage.getItem(`notes_${user.id}`) || "{}");
      const savedStatuses = JSON.parse(localStorage.getItem(`statuses_${user.id}`) || "{}");
      setFavorites(savedFavorites);
      setNotes(savedNotes);
      setStatuses(savedStatuses);
      setLoading(false);
    }
    load();
  }, []);

  function toggleFavorite(adId) {
    const newFav = { ...favorites, [adId]: !favorites[adId] };
    if (!newFav[adId]) delete newFav[adId];
    setFavorites(newFav);
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFav));
  }

  function saveNote(adId) {
    const newNotes = { ...notes, [adId]: noteText };
    setNotes(newNotes);
    localStorage.setItem(`notes_${user.id}`, JSON.stringify(newNotes));
    setEditingNote(null);
    setNoteText("");
  }

  function saveStatus(adId, status) {
    const newStatuses = { ...statuses, [adId]: status };
    setStatuses(newStatuses);
    localStorage.setItem(`statuses_${user.id}`, JSON.stringify(newStatuses));
  }

  const filtered = ads.filter(a => {
    const q = search.toLowerCase();
    const min = rateMin ? parseInt(rateMin) : null;
    const max = rateMax ? parseInt(rateMax) : null;
    return (
      (!search || a.role?.toLowerCase().includes(q) || a.skills?.some(s=>s.toLowerCase().includes(q)) || a.city?.toLowerCase().includes(q)) &&
      (region === "Cała Polska" || a.region === region) &&
      (!city || a.city?.toLowerCase() === city.toLowerCase()) &&
      (cat === "all" || a.category === cat) &&
      (role === "all" || a.role === role) &&
      (!min || (a.rate_from || 0) >= min) &&
      (!max || (a.rate_from || 0) <= max)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "rate_asc") return (a.rate_from || 0) - (b.rate_from || 0);
    if (sortBy === "rate_desc") return (b.rate_from || 0) - (a.rate_from || 0);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const paginated = sorted.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function confirmUnlock(ad) {
    const { error } = await supabase.from("unlocks").upsert({ employer_id: user.id, ad_id: ad.id }, { onConflict: "employer_id,ad_id" });
    setUnlocked(u => ({...u, [ad.id]: true}));
    setShowUnlock(null);
    setView("contacts");
  }

  if (loading) return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"DM Sans,sans-serif" }}>
      <div style={{ background:"#fff", borderBottom:`1px solid #E8ECF0`, padding:"0 20px", height:56, display:"flex", alignItems:"center", boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ width:160, height:20, background:"#E8ECF0", borderRadius:6 }} />
        <div style={{ flex:1 }} />
        <div style={{ width:80, height:32, background:"#E8ECF0", borderRadius:8 }} />
      </div>
      <div style={{ maxWidth:1000, margin:"0 auto", padding:"32px 20px" }}>
        <div style={{ display:"flex", gap:8, marginBottom:28 }}>
          {[1,2,3,4].map(i=>(
            <div key={i} style={{ width:140, height:38, background:"#E8ECF0", borderRadius:10 }} />
          ))}
        </div>
        <div style={{ background:"#fff", borderRadius:14, padding:"16px 20px", border:`1px solid #E8ECF0`, marginBottom:20 }}>
          <div style={{ height:40, background:"#E8ECF0", borderRadius:8, marginBottom:10 }} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            {[1,2,3].map(i=><div key={i} style={{ height:40, background:"#E8ECF0", borderRadius:8 }} />)}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {[1,2,3].map(i=>(
            <div key={i} style={{ background:"#fff", borderRadius:14, padding:"20px", border:`1px solid #E8ECF0` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <div>
                  <div style={{ width:200, height:16, background:"#E8ECF0", borderRadius:6, marginBottom:8 }} />
                  <div style={{ width:140, height:12, background:"#E8ECF0", borderRadius:6 }} />
                </div>
                <div style={{ width:120, height:16, background:"#E8ECF0", borderRadius:6 }} />
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {[70,90,60].map((w,j)=><div key={j} style={{ width:w, height:22, background:"#E8ECF0", borderRadius:6 }} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const inputStyle = { padding:"9px 14px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.bg, color:C.g800 };
  const selectStyle = { padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", cursor:"pointer", color:C.g800 };
  const availableRoles = cat !== "all" ? ROLES[cat] || [] : [];
  const favoriteAds = ads.filter(a => favorites[a.id]);
  const unlockedAds = ads.filter(a => unlocked[a.id]);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"DM Sans,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* Modal notatki */}
      {editingNote && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={()=>setEditingNote(null)}>
          <div style={{ background:C.white, borderRadius:16, padding:28, maxWidth:420, width:"100%" }} onClick={e=>e.stopPropagation()}>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:17, color:C.g800, marginBottom:16 }}>📝 Notatka</h3>
            <textarea rows={4} value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="Wpisz notatkę o kandydacie..." style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", resize:"none", lineHeight:1.6, color:C.g800 }} />
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button onClick={()=>setEditingNote(null)} style={{ flex:1, padding:"10px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, fontSize:13, fontWeight:600, cursor:"pointer", color:C.g600 }}>Anuluj</button>
              <button onClick={()=>saveNote(editingNote)} style={{ flex:1, padding:"10px", borderRadius:8, border:"none", background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Zapisz</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal odblokowania */}
      {showUnlock && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={()=>setShowUnlock(null)}>
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
        <div style={{ display:"flex", gap:8, marginBottom:28, flexWrap:"wrap" }}>
          {[
            ["search","🔍 Szukaj pracowników"],
            ["contacts",`📞 Moje kontakty${unlockedAds.length>0?` (${unlockedAds.length})`:""}`],
            ["favorites",`⭐ Ulubione${favoriteAds.length>0?` (${favoriteAds.length})`:""}`],
            ["profile","👤 Profil"],
          ].map(([id,label])=>(
            <button key={id} onClick={()=>setView(id)} style={{ padding:"9px 18px", borderRadius:10, border:`1.5px solid ${view===id?C.blue:C.g200}`, background:view===id?C.blue:C.white, color:view===id?"#fff":C.g600, fontSize:13, fontWeight:600, cursor:"pointer" }}>{label}</button>
          ))}
        </div>

        {/* SEARCH */}
        {view==="search" && (
          <div>
            <div style={{ background:C.white, borderRadius:14, padding:"16px 20px", border:`1px solid ${C.g100}`, marginBottom:20, boxShadow:"0 2px 10px rgba(26,115,232,0.05)" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 180px 180px", gap:10, marginBottom:10 }}>
                <input placeholder="🔍 Zawód, umiejętność..." value={search} onChange={e=>{ setSearch(e.target.value); setPage(0); }} style={inputStyle} />
                <select value={region} onChange={e=>{ setRegion(e.target.value); setCity(""); setPage(0); }} style={selectStyle}>
                  {REGIONS.map(r=><option key={r}>{r}</option>)}
                </select>
                <CityAutocomplete value={city} onChange={v=>{ setCity(v); setPage(0); }} region={region==="Cała Polska" ? "" : region} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:10 }}>
                <select value={cat} onChange={e=>{ setCat(e.target.value); setRole("all"); setPage(0); }} style={selectStyle}>
                  {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <select value={role} onChange={e=>{ setRole(e.target.value); setPage(0); }} style={selectStyle} disabled={cat==="all"}>
                  <option value="all">{cat==="all" ? "Wybierz kategorię" : "Wszystkie zawody"}</option>
                  {availableRoles.map(r=><option key={r} value={r}>{r}</option>)}
                </select>
                <select value={sortBy} onChange={e=>{ setSortBy(e.target.value); setPage(0); }} style={selectStyle}>
                  <option value="newest">Najnowsze</option>
                  <option value="rate_desc">Stawka: najwyższa</option>
                  <option value="rate_asc">Stawka: najniższa</option>
                </select>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:10, marginBottom:12, alignItems:"center" }}>
                <input type="number" placeholder="Stawka od (zł/h)" value={rateMin} onChange={e=>{ setRateMin(e.target.value); setPage(0); }} style={inputStyle} />
                <input type="number" placeholder="Stawka do (zł/h)" value={rateMax} onChange={e=>{ setRateMax(e.target.value); setPage(0); }} style={inputStyle} />
                <button onClick={()=>{ setSearch(""); setRegion("Cała Polska"); setCat("all"); setRole("all"); setSortBy("newest"); setRateMin(""); setRateMax(""); setCity(""); setPage(0); }} style={{ padding:"9px 14px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, fontSize:12, fontWeight:600, cursor:"pointer", color:C.g600, whiteSpace:"nowrap" }}>
                  🔄 Resetuj filtry
                </button>
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
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <button onClick={()=>toggleFavorite(ad.id)} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:20, padding:4 }} title={favorites[ad.id]?"Usuń z ulubionych":"Dodaj do ulubionych"}>
                            {favorites[ad.id] ? "⭐" : "☆"}
                          </button>
                          <div style={{ textAlign:"right" }}>
                            <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:C.navy }}>
                              {ad.rate_from}{ad.rate_to ? `–${ad.rate_to}` : ''} zł/h netto (na rękę)
                            </div>
                            {ad.remote && <div style={{ fontSize:11, color:C.green, fontWeight:600 }}>🏠 Zdalnie</div>}
                          </div>
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
                          <button onClick={()=>setShowUnlock(ad)} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"8px 16px", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                            🔓 Odblokuj kontakt
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {sorted.length > PER_PAGE && (
                  <div style={{ display:"flex", gap:8, justifyContent:"center", alignItems:"center", marginTop:24 }}>
                    <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{ padding:"8px 18px", borderRadius:8, border:`1px solid ${C.g200}`, background:C.white, fontSize:13, cursor:"pointer", color:C.g600, opacity:page===0?0.4:1 }}>← Poprzednia</button>
                    <span style={{ padding:"8px 16px", fontSize:13, color:C.g600, fontWeight:600 }}>Strona {page+1} z {Math.ceil(sorted.length/PER_PAGE)}</span>
                    <button onClick={()=>setPage(p=>p+1)} disabled={(page+1)*PER_PAGE>=sorted.length} style={{ padding:"8px 18px", borderRadius:8, border:`1px solid ${C.g200}`, background:C.white, fontSize:13, cursor:"pointer", color:C.g600, opacity:(page+1)*PER_PAGE>=sorted.length?0.4:1 }}>Następna →</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CONTACTS */}
        {view==="contacts" && (
          <div>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:20, fontWeight:800, color:C.g800, marginBottom:20 }}>📞 Moje kontakty</h2>
            {unlockedAds.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:C.g400 }}>
                <div style={{ fontSize:48, marginBottom:16 }}>📞</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.g600, marginBottom:8 }}>Brak odblokowanych kontaktów</div>
                <div style={{ fontSize:13 }}>Przejdź do wyszukiwarki i odblokuj kontakty pracowników.</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {unlockedAds.map(ad=>(
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

                    <div style={{ background:C.green+"0a", borderRadius:8, padding:"12px 14px", border:`1px solid ${C.green}30`, marginBottom:12 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:C.green, marginBottom:8 }}>✅ Dane kontaktowe</div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.g800 }}>{ad.profiles?.name}</div>
                      <div style={{ fontSize:13, color:C.blue, fontWeight:600 }}>☎ {ad.profiles?.phone}</div>
                      <div style={{ fontSize:12, color:C.g600 }}>✉ {ad.profiles?.email}</div>
                    </div>

                    {/* Status kontaktu */}
                    <div style={{ marginBottom:12 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:C.g600, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Status</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {STATUSES.map(s=>(
                          <button key={s.id} onClick={()=>saveStatus(ad.id, s.id)} style={{ padding:"4px 12px", borderRadius:20, border:`1.5px solid ${statuses[ad.id]===s.id?s.color:C.g200}`, background:statuses[ad.id]===s.id?s.color+"18":C.white, color:statuses[ad.id]===s.id?s.color:C.g600, fontSize:11, fontWeight:600, cursor:"pointer" }}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notatka */}
                    <div style={{ background:C.bg, borderRadius:8, padding:"10px 14px", border:`1px solid ${C.g100}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:notes[ad.id]?6:0 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:C.g600, textTransform:"uppercase", letterSpacing:0.5 }}>📝 Notatka</div>
                        <button onClick={()=>{ setEditingNote(ad.id); setNoteText(notes[ad.id]||""); }} style={{ background:"transparent", border:"none", color:C.blue, fontSize:12, fontWeight:600, cursor:"pointer" }}>
                          {notes[ad.id] ? "Edytuj" : "+ Dodaj"}
                        </button>
                      </div>
                      {notes[ad.id] && <div style={{ fontSize:13, color:C.g600, lineHeight:1.6 }}>{notes[ad.id]}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAVORITES */}
        {view==="favorites" && (
          <div>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:20, fontWeight:800, color:C.g800, marginBottom:20 }}>⭐ Ulubione ogłoszenia</h2>
            {favoriteAds.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:C.g400 }}>
                <div style={{ fontSize:48, marginBottom:16 }}>⭐</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.g600, marginBottom:8 }}>Brak ulubionych</div>
                <div style={{ fontSize:13 }}>Kliknij ☆ przy ogłoszeniu żeby je zapisać.</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {favoriteAds.map(ad=>(
                  <div key={ad.id} style={{ background:C.white, borderRadius:14, padding:"20px", border:`1.5px solid ${C.yellow}50`, boxShadow:"0 2px 10px rgba(245,158,11,0.08)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <div>
                        <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:16, color:C.g800, marginBottom:3 }}>{ad.role}</div>
                        <div style={{ fontSize:12, color:C.g400 }}>{ad.city}, {ad.region} · {ad.experience} dośw. · {ad.available}</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <button onClick={()=>toggleFavorite(ad.id)} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:20, padding:4 }}>⭐</button>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:C.navy }}>
                            {ad.rate_from}{ad.rate_to ? `–${ad.rate_to}` : ''} zł/h netto (na rękę)
                          </div>
                        </div>
                      </div>
                    </div>
                    {ad.skills?.length > 0 && (
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                        {ad.skills.map(s=><span key={s} style={{ background:C.blue+"12", color:C.blue, padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600 }}>{s}</span>)}
                      </div>
                    )}
                    {ad.description && <p style={{ fontSize:13, color:C.g600, lineHeight:1.6, marginBottom:12 }}>{ad.description}</p>}
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
                        <button onClick={()=>setShowUnlock(ad)} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"8px 16px", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                          🔓 Odblokuj kontakt
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {view==="profile" && (
          <div>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:20, fontWeight:800, color:C.g800, marginBottom:20 }}>👤 Mój profil</h2>
            <div style={{ background:C.white, borderRadius:16, padding:32, border:`1px solid ${C.g100}`, boxShadow:"0 4px 20px rgba(26,115,232,0.06)", maxWidth:500 }}>
              <div style={{ marginBottom:28, paddingBottom:28, borderBottom:`1px solid ${C.g100}` }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.g600, marginBottom:16, textTransform:"uppercase", letterSpacing:0.5 }}>Dane konta</div>
                <div style={{ fontSize:14, color:C.g800, marginBottom:8 }}>🏢 <strong>{profile?.name}</strong></div>
                <div style={{ fontSize:14, color:C.g800, marginBottom:8 }}>✉️ {profile?.email}</div>
                <div style={{ fontSize:14, color:C.g800, marginBottom:8 }}>📞 {profile?.phone || "Brak telefonu"}</div>
                {profile?.nip && <div style={{ fontSize:14, color:C.g800 }}>🏛️ NIP: {profile?.nip}</div>}
              </div>
              <ProfileEdit key={profile?.id} user={user} profile={profile} setProfile={setProfile} />
           {/* Usuń konto */}
              <div style={{ marginTop:28, paddingTop:28, borderTop:`1px solid ${C.g100}` }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.red, marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Strefa niebezpieczna</div>
                <p style={{ fontSize:12, color:C.g600, marginBottom:12, lineHeight:1.6 }}>
                  Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane zostaną trwale usunięte.
                </p>
                <DeleteAccountButton userId={user.id} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}