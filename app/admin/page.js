"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F0F2F5",
  white:"#FFFFFF", g50:"#F8FAFC", g100:"#E8ECF0",
  g200:"#CBD5E1", g400:"#94A3B8", g600:"#475569",
  g800:"#1E293B", green:"#16A34A", orange:"#EA580C",
  yellow:"#F59E0B", red:"#DC2626", purple:"#7C3AED",
  sidebar:"#0F172A",
};

function Badge({ text }) {
  const map = {
    active:    [C.green,  "Aktywne"],
    pending:   [C.yellow, "Oczekujące"],
    paused:    [C.g400,   "Wstrzymane"],
    banned:    [C.red,    "Zbanowane"],
    suspended: [C.red,    "Zawieszone"],
    verified:  [C.green,  "Zweryfikowana"],
    worker:    [C.blue,   "Pracownik"],
    employer:  [C.purple, "Pracodawca"],
    blocked:   [C.red,    "Zablokowany"],
  };
  const [col, label] = map[text] || [C.g400, text];
  return (
    <span style={{ display:"inline-block", padding:"2px 9px", borderRadius:20, fontSize:11, fontWeight:700, background:col+"18", color:col, border:`1px solid ${col}28` }}>
      {label}
    </span>
  );
}

function Stat({ icon, label, value, sub, color=C.blue }) {
  return (
    <div style={{ background:C.white, borderRadius:14, padding:"18px 20px", border:`1px solid ${C.g100}`, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:12, color:C.g400, fontWeight:600, marginBottom:6 }}>{label}</div>
          <div style={{ fontFamily:"Sora,sans-serif", fontSize:26, fontWeight:900, color }}>{value}</div>
          {sub && <div style={{ fontSize:11, color:C.g400, marginTop:3 }}>{sub}</div>}
        </div>
        <div style={{ fontSize:26 }}>{icon}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ msg, onConfirm, onCancel, danger }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onCancel}>
      <div style={{ background:C.white, borderRadius:16, padding:28, maxWidth:360, width:"100%" }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontSize:36, textAlign:"center", marginBottom:12 }}>{danger?"⚠️":"❓"}</div>
        <p style={{ fontSize:14, color:C.g800, textAlign:"center", lineHeight:1.6, marginBottom:24, fontWeight:500 }}>{msg}</p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"10px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, color:C.g600, fontSize:13, fontWeight:600, cursor:"pointer" }}>Anuluj</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"10px", borderRadius:8, border:"none", background:danger?C.red:C.green, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Potwierdź</button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive, mobileOpen, setMobileOpen, counts }) {

const nav = [
  { id:"dashboard", icon:"📊", label:"Dashboard" },
  { id:"ads",       icon:"📋", label:"Ogłoszenia", badge: counts.ads },
  { id:"users",     icon:"👥", label:"Użytkownicy", badge: counts.users },
  { id:"unlocks",   icon:"🔓", label:"Odblokowania", badge: counts.unlocks },
  { id:"stats",     icon:"📈", label:"Statystyki" },
  { id:"reports",   icon:"🚨", label:"Zgłoszenia", badge: counts.reports },
];

  const content = (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"20px 18px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:C.blue, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontWeight:900, fontFamily:"Sora,sans-serif", fontSize:17 }}>R</span>
          </div>
          <div>
            <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:14, color:"#fff" }}>Panel Admina</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", letterSpacing:0.5 }}>rynekpracownika.pl</div>
          </div>
        </div>
      </div>
      <nav style={{ flex:1, padding:"12px 10px" }}>
        {nav.map(item=>(
          <button key={item.id} onClick={()=>{ setActive(item.id); setMobileOpen(false); }} style={{
            width:"100%", display:"flex", alignItems:"center", gap:12,
            padding:"11px 12px", borderRadius:10, border:"none",
            background: active===item.id?"rgba(26,115,232,0.2)":"transparent",
            color: active===item.id?"#fff":"rgba(255,255,255,0.55)",
            cursor:"pointer", marginBottom:2, textAlign:"left",
            borderLeft: active===item.id?`3px solid ${C.blue}`:"3px solid transparent",
          }}>
            <span style={{ fontSize:18 }}>{item.icon}</span>
            <span style={{ fontWeight:active===item.id?700:400, fontSize:14, flex:1 }}>{item.label}</span>
            {item.badge > 0 && <span style={{ background:C.blue, color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:10, fontWeight:800 }}>{item.badge}</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>Administrator</div>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>admin@rynekpracownika.pl</div>
      </div>
    </div>
  );

  return (
    <>
      <div style={{ width:220, background:C.sidebar, height:"100vh", position:"sticky", top:0, flexShrink:0 }}>
        {content}
      </div>
      {mobileOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:400 }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)" }} onClick={()=>setMobileOpen(false)} />
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:240, background:C.sidebar }}>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

function Topbar({ title, setMobileOpen }) {
  return (
    <div style={{ background:C.white, borderBottom:`1px solid ${C.g100}`, padding:"0 16px", height:56, display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
      <button onClick={()=>setMobileOpen(v=>!v)} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:22, padding:4, color:C.g600 }}>☰</button>
      <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:17, fontWeight:800, color:C.g800, flex:1 }}>{title}</h1>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ ads:0, users:0, workers:0, employers:0, unlocks:0 });
  const [recentAds, setRecentAds] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load() {
      const [
        { count: adsCount },
        { count: usersCount },
        { count: workersCount },
        { count: employersCount },
        { count: unlocksCount },
        { data: latestAds },
        { data: latestUsers },
      ] = await Promise.all([
        supabase.from("ads").select("*", { count:"exact", head:true }),
        supabase.from("profiles").select("*", { count:"exact", head:true }),
        supabase.from("profiles").select("*", { count:"exact", head:true }).eq("type","worker"),
        supabase.from("profiles").select("*", { count:"exact", head:true }).eq("type","employer"),
        supabase.from("unlocks").select("*", { count:"exact", head:true }),
        supabase.from("ads").select("*, profiles(name)").order("created_at", { ascending:false }).limit(5),
        supabase.from("profiles").select("*").order("created_at", { ascending:false }).limit(5),
      ]);
      setStats({ ads:adsCount||0, users:usersCount||0, workers:workersCount||0, employers:employersCount||0, unlocks:unlocksCount||0 });
      setRecentAds(latestAds||[]);
      setRecentUsers(latestUsers||[]);
      setLoading(false);
    }
    load();
  },[]);

  if(loading) return <div style={{ padding:40, textAlign:"center", color:C.g400 }}>Ładowanie...</div>;

  return (
    <div style={{ padding:"20px 16px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        <Stat icon="📋" label="Ogłoszenia" value={stats.ads} color={C.blue} />
        <Stat icon="🔓" label="Odblokowania" value={stats.unlocks} color={C.green} />
        <Stat icon="👥" label="Użytkownicy" value={stats.users} color={C.purple} />
        <Stat icon="👷" label="Pracownicy" value={stats.workers} color={C.blue} />
        <Stat icon="🏢" label="Pracodawcy" value={stats.employers} color={C.orange} />
        <Stat icon="💰" label="Przychód (demo)" value="—" sub="Stripe nie wdrożony" color={C.green} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.g100}`, overflow:"hidden" }}>
          <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.g100}`, fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800 }}>Ostatnie ogłoszenia</div>
          {recentAds.map((ad,i)=>(
            <div key={ad.id} style={{ padding:"12px 18px", borderBottom:i<recentAds.length-1?`1px solid ${C.g100}`:"none" }}>
              <div style={{ fontWeight:600, fontSize:13, color:C.g800 }}>{ad.role}</div>
              <div style={{ fontSize:11, color:C.g400 }}>{ad.city}, {ad.region} · {ad.profiles?.name}</div>
            </div>
          ))}
        </div>
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.g100}`, overflow:"hidden" }}>
          <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.g100}`, fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800 }}>Ostatni użytkownicy</div>
          {recentUsers.map((u,i)=>(
            <div key={u.id} style={{ padding:"12px 18px", borderBottom:i<recentUsers.length-1?`1px solid ${C.g100}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontWeight:600, fontSize:13, color:C.g800 }}>{u.name}</div>
                <div style={{ fontSize:11, color:C.g400 }}>{u.email}</div>
              </div>
              <Badge text={u.type} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdsPanel() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [editAd, setEditAd] = useState(null);

  useEffect(()=>{
    async function load() {
      const { data } = await supabase.from("ads").select("*, profiles(name, email, phone)").order("created_at", { ascending:false });
      setAds(data||[]);
      setLoading(false);
    }
    load();
  },[]);

  async function deleteAd(id) {
    await supabase.from("ads").delete().eq("id", id);
    setAds(prev=>prev.filter(a=>a.id!==id));
    setConfirm(null);
  }

  async function saveEditAd() {
    const { error } = await supabase.from("ads").update({
      role: editAd.role,
      city: editAd.city,
      region: editAd.region,
      rate_from: editAd.rate_from,
      rate_to: editAd.rate_to,
    }).eq("id", editAd.id);
    if (!error) {
      setAds(prev=>prev.map(a=>a.id===editAd.id?{...a,...editAd}:a));
      setEditAd(null);
    }
  }

  function exportCSV() {
    const headers = ["ID","Rola","Miasto","Region","Stawka od","Stawka do","Pracownik","Email","Data"];
    const rows = ads.map(a=>[a.id, a.role, a.city, a.region, a.rate_from, a.rate_to, a.profiles?.name, a.profiles?.email, new Date(a.created_at).toLocaleDateString("pl-PL")]);
    const csv = [headers, ...rows].map(r=>r.join(";")).join("\n");
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "ogloszenia.csv"; a.click();
  }

  const filtered = ads.filter(a =>
    !search || a.role?.toLowerCase().includes(search.toLowerCase()) || a.city?.toLowerCase().includes(search.toLowerCase())
  );

  if(loading) return <div style={{ padding:40, textAlign:"center", color:C.g400 }}>Ładowanie...</div>;

  return (
    <div style={{ padding:"16px" }}>
      {confirm && <ConfirmModal msg={confirm.msg} danger onConfirm={confirm.onConfirm} onCancel={()=>setConfirm(null)} />}

      {editAd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={()=>setEditAd(null)}>
          <div style={{ background:C.white, borderRadius:16, padding:28, maxWidth:440, width:"100%" }} onClick={e=>e.stopPropagation()}>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:17, color:C.g800, marginBottom:20 }}>✏️ Edytuj ogłoszenie</h3>
            {[["Rola","role"],["Miasto","city"],["Region","region"]].map(([label,key])=>(
              <div key={key} style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
                <input value={editAd[key]||""} onChange={e=>setEditAd(v=>({...v,[key]:e.target.value}))}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", color:C.g800 }} />
              </div>
            ))}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
              {[["Stawka od","rate_from"],["Stawka do","rate_to"]].map(([label,key])=>(
                <div key={key}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
                  <input type="number" value={editAd[key]||""} onChange={e=>setEditAd(v=>({...v,[key]:e.target.value}))}
                    style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", color:C.g800 }} />
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setEditAd(null)} style={{ flex:1, padding:"10px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, fontSize:13, fontWeight:600, cursor:"pointer", color:C.g600 }}>Anuluj</button>
              <button onClick={saveEditAd} style={{ flex:1, padding:"10px", borderRadius:8, border:"none", background:C.blue, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Zapisz</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom:16, display:"flex", gap:10, alignItems:"center" }}>
        <input placeholder="🔍 Szukaj ogłoszenia..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.white, color:C.g800 }} />
        <button onClick={exportCSV} style={{ padding:"10px 16px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, fontSize:12, fontWeight:600, cursor:"pointer", color:C.g600, whiteSpace:"nowrap" }}>
          📥 Eksport CSV
        </button>
        <span style={{ fontSize:13, color:C.g400 }}>{filtered.length} ogłoszeń</span>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(ad=>(
          <div key={ad.id} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.g100}`, padding:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:15, color:C.g800, marginBottom:2 }}>{ad.role}</div>
                <div style={{ fontSize:12, color:C.g400 }}>{ad.city}, {ad.region} · {ad.category} · 👁 {ad.views||0} wyświetleń</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontWeight:700, fontSize:14, color:C.navy }}>{ad.rate_from}{ad.rate_to?`–${ad.rate_to}`:""} zł/h</div>
                <div style={{ fontSize:11, color:C.g400 }}>{new Date(ad.created_at).toLocaleDateString("pl-PL")}</div>
              </div>
            </div>
            <div style={{ fontSize:12, color:C.g600, marginBottom:10 }}>
              👤 {ad.profiles?.name} · ✉️ {ad.profiles?.email} · 📞 {ad.profiles?.phone}
            </div>
            {ad.skills?.length > 0 && (
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                {ad.skills.map(s=><span key={s} style={{ background:C.blue+"12", color:C.blue, padding:"2px 8px", borderRadius:6, fontSize:11, fontWeight:600 }}>{s}</span>)}
              </div>
            )}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setEditAd({...ad})}
                style={{ padding:"6px 14px", borderRadius:7, border:"none", background:C.blue+"10", color:C.blue, fontSize:12, fontWeight:600, cursor:"pointer" }}>✏️ Edytuj</button>
              <button onClick={()=>setConfirm({ msg:`Usunąć ogłoszenie "${ad.role}"?`, onConfirm:()=>deleteAd(ad.id) })}
                style={{ padding:"6px 14px", borderRadius:7, border:"none", background:C.red+"10", color:C.red, fontSize:12, fontWeight:600, cursor:"pointer" }}>🗑 Usuń</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [confirm, setConfirm] = useState(null);

  useEffect(()=>{
    async function load() {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending:false });
      setUsers(data||[]);
      setLoading(false);
    }
    load();
  },[]);

  async function deleteUser(id) {
    await supabase.from("profiles").delete().eq("id", id);
    setUsers(prev=>prev.filter(u=>u.id!==id));
    setConfirm(null);
  }

  async function blockUser(id) {
    await supabase.from("profiles").update({ blocked: true }).eq("id", id);
    setUsers(prev=>prev.map(u=>u.id===id?{...u,blocked:true}:u));
    setConfirm(null);
  }

  async function unblockUser(id) {
    await supabase.from("profiles").update({ blocked: false }).eq("id", id);
    setUsers(prev=>prev.map(u=>u.id===id?{...u,blocked:false}:u));
  }

  function exportCSV() {
    const headers = ["ID","Imię","Email","Telefon","Typ","NIP","Dołączył","Zablokowany"];
    const rows = users.map(u=>[u.id, u.name, u.email, u.phone, u.type, u.nip||"", new Date(u.created_at).toLocaleDateString("pl-PL"), u.blocked?"Tak":"Nie"]);
    const csv = [headers, ...rows].map(r=>r.join(";")).join("\n");
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "uzytkownicy.csv"; a.click();
  }

  const filtered = users.filter(u =>
    (filter==="all" || (filter==="blocked" ? u.blocked : u.type===filter)) &&
    (!search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  if(loading) return <div style={{ padding:40, textAlign:"center", color:C.g400 }}>Ładowanie...</div>;

  return (
    <div style={{ padding:"16px" }}>
      {confirm && <ConfirmModal msg={confirm.msg} danger onConfirm={confirm.onConfirm} onCancel={()=>setConfirm(null)} />}

      <div style={{ marginBottom:14, display:"flex", gap:10 }}>
        <input placeholder="🔍 Szukaj użytkownika..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.white, color:C.g800 }} />
        <button onClick={exportCSV} style={{ padding:"10px 16px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, fontSize:12, fontWeight:600, cursor:"pointer", color:C.g600, whiteSpace:"nowrap" }}>
          📥 Eksport CSV
        </button>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {[["all","Wszyscy"],["worker","Pracownicy"],["employer","Pracodawcy"],["blocked","Zablokowani"]].map(([id,label])=>(
          <button key={id} onClick={()=>setFilter(id)} style={{ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${filter===id?C.blue:C.g200}`, background:filter===id?C.blue:C.white, color:filter===id?"#fff":C.g600, fontSize:12, fontWeight:600, cursor:"pointer" }}>{label}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(u=>(
          <div key={u.id} style={{ background:C.white, borderRadius:14, border:u.blocked?`1.5px solid ${C.red}30`:`1px solid ${C.g100}`, padding:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800, marginBottom:2 }}>{u.name}</div>
                <div style={{ fontSize:12, color:C.g400 }}>✉️ {u.email} · 📞 {u.phone}</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <Badge text={u.type} />
                {u.blocked && <Badge text="blocked" />}
              </div>
            </div>
            <div style={{ fontSize:12, color:C.g600, marginBottom:10 }}>
              📅 Dołączył: {new Date(u.created_at).toLocaleDateString("pl-PL")}
              {u.nip && ` · NIP: ${u.nip}`}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {u.blocked ? (
                <button onClick={()=>unblockUser(u.id)}
                  style={{ padding:"6px 14px", borderRadius:7, border:"none", background:C.green+"10", color:C.green, fontSize:12, fontWeight:600, cursor:"pointer" }}>✅ Odblokuj</button>
              ) : (
                <button onClick={()=>setConfirm({ msg:`Zablokować konto "${u.name}"?`, onConfirm:()=>blockUser(u.id) })}
                  style={{ padding:"6px 14px", borderRadius:7, border:"none", background:C.orange+"10", color:C.orange, fontSize:12, fontWeight:600, cursor:"pointer" }}>🔒 Zablokuj</button>
              )}
              <button onClick={()=>setConfirm({ msg:`Usunąć konto "${u.name}"? Ta akcja jest nieodwracalna!`, onConfirm:()=>deleteUser(u.id) })}
                style={{ padding:"6px 14px", borderRadius:7, border:"none", background:C.red+"10", color:C.red, fontSize:12, fontWeight:600, cursor:"pointer" }}>🗑 Usuń</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UnlocksPanel() {
  const [unlocks, setUnlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load() {
      const { data } = await supabase
        .from("unlocks")
        .select("*, profiles!unlocks_employer_id_fkey(name, email)")
        .order("created_at", { ascending:false });
      setUnlocks(data||[]);
      setLoading(false);
    }
    load();
  },[]);

  function exportCSV() {
    const headers = ["ID","Firma","Email","Ogłoszenie ID","Data"];
    const rows = unlocks.map(u=>[u.id, u.profiles?.name, u.profiles?.email, u.ad_id, new Date(u.created_at).toLocaleDateString("pl-PL")]);
    const csv = [headers, ...rows].map(r=>r.join(";")).join("\n");
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "odblokowania.csv"; a.click();
  }

  if(loading) return <div style={{ padding:40, textAlign:"center", color:C.g400 }}>Ładowanie...</div>;

  return (
    <div style={{ padding:"16px" }}>
      <div style={{ marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:13, color:C.g400 }}>Łącznie: <strong style={{ color:C.g800 }}>{unlocks.length}</strong> odblokowań</div>
        <button onClick={exportCSV} style={{ padding:"10px 16px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, fontSize:12, fontWeight:600, cursor:"pointer", color:C.g600 }}>
          📥 Eksport CSV
        </button>
      </div>
      <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.g100}`, overflow:"hidden" }}>
        {unlocks.length === 0 ? (
          <div style={{ padding:40, textAlign:"center", color:C.g400 }}>Brak odblokowań</div>
        ) : unlocks.map((u,i)=>(
          <div key={u.id} style={{ padding:"14px 18px", borderBottom:i<unlocks.length-1?`1px solid ${C.g100}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:C.g800 }}>{u.profiles?.name || "Firma"}</div>
              <div style={{ fontSize:11, color:C.g400 }}>✉️ {u.profiles?.email} · Ogłoszenie ID: {u.ad_id}</div>
            </div>
            <div style={{ fontSize:12, color:C.g400 }}>{new Date(u.created_at).toLocaleDateString("pl-PL")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load() {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekAgo = new Date(now - 7*24*60*60*1000).toISOString();
      const monthAgo = new Date(now - 30*24*60*60*1000).toISOString();

      const [
        { count: adsToday },
        { count: adsWeek },
        { count: adsMonth },
        { count: usersToday },
        { count: usersWeek },
        { count: unlocksToday },
        { count: unlocksWeek },
        { data: topAds },
      ] = await Promise.all([
        supabase.from("ads").select("*", { count:"exact", head:true }).gte("created_at", today),
        supabase.from("ads").select("*", { count:"exact", head:true }).gte("created_at", weekAgo),
        supabase.from("ads").select("*", { count:"exact", head:true }).gte("created_at", monthAgo),
        supabase.from("profiles").select("*", { count:"exact", head:true }).gte("created_at", today),
        supabase.from("profiles").select("*", { count:"exact", head:true }).gte("created_at", weekAgo),
        supabase.from("unlocks").select("*", { count:"exact", head:true }).gte("created_at", today),
        supabase.from("unlocks").select("*", { count:"exact", head:true }).gte("created_at", weekAgo),
        supabase.from("ads").select("role, city, region, views").order("views", { ascending:false }).limit(5),
      ]);

      setStats({ adsToday, adsWeek, adsMonth, usersToday, usersWeek, unlocksToday, unlocksWeek, topAds: topAds||[] });
      setLoading(false);
    }
    load();
  },[]);

  if(loading) return <div style={{ padding:40, textAlign:"center", color:C.g400 }}>Ładowanie...</div>;

  return (
    <div style={{ padding:"16px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        <Stat icon="📋" label="Nowe ogłoszenia dziś" value={stats.adsToday||0} color={C.blue} />
        <Stat icon="📋" label="Nowe ogłoszenia (7 dni)" value={stats.adsWeek||0} color={C.blue} />
        <Stat icon="📋" label="Nowe ogłoszenia (30 dni)" value={stats.adsMonth||0} color={C.blue} />
        <Stat icon="👥" label="Nowi użytkownicy dziś" value={stats.usersToday||0} color={C.purple} />
        <Stat icon="👥" label="Nowi użytkownicy (7 dni)" value={stats.usersWeek||0} color={C.purple} />
        <Stat icon="🔓" label="Odblokowania dziś" value={stats.unlocksToday||0} color={C.green} />
      </div>

      <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.g100}`, overflow:"hidden" }}>
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.g100}`, fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800 }}>
          🏆 Najpopularniejsze ogłoszenia (wg wyświetleń)
        </div>
        {stats.topAds.length === 0 ? (
          <div style={{ padding:24, textAlign:"center", color:C.g400, fontSize:13 }}>Brak danych</div>
        ) : stats.topAds.map((ad,i)=>(
          <div key={i} style={{ padding:"12px 18px", borderBottom:i<stats.topAds.length-1?`1px solid ${C.g100}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:C.g800 }}>{ad.role}</div>
              <div style={{ fontSize:11, color:C.g400 }}>{ad.city}, {ad.region}</div>
            </div>
            <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:14, color:C.blue }}>👁 {ad.views||0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsPanel() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);

  useEffect(()=>{
    async function load() {
      const { data } = await supabase
  .from("reports")
  .select("*, ads(id, role, city, region, rate_from, rate_to, description, skills, category)")
  .order("created_at", { ascending:false });
      setReports(data||[]);
      setLoading(false);
    }
    load();
  },[]);

  async function deleteReport(id) {
    await supabase.from("reports").delete().eq("id", id);
    setReports(prev=>prev.filter(r=>r.id!==id));
    setConfirm(null);
  }

  async function resolveReport(id) {
    await supabase.from("reports").update({ status:"resolved" }).eq("id", id);
    setReports(prev=>prev.map(r=>r.id===id?{...r,status:"resolved"}:r));
  }

  async function deleteAd(adId, reportId) {
    await supabase.from("ads").delete().eq("id", adId);
    await supabase.from("reports").update({ status:"resolved" }).eq("id", reportId);
    setReports(prev=>prev.map(r=>r.id===reportId?{...r,status:"resolved"}:r));
    setConfirm(null);
  }

  const pending = reports.filter(r=>r.status==="pending");
  const resolved = reports.filter(r=>r.status==="resolved");

  if(loading) return <div style={{ padding:40, textAlign:"center", color:C.g400 }}>Ładowanie...</div>;

  return (
    <div style={{ padding:"16px" }}>
      {confirm && <ConfirmModal msg={confirm.msg} danger onConfirm={confirm.onConfirm} onCancel={()=>setConfirm(null)} />}

      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        <div style={{ background:C.red+"10", border:`1px solid ${C.red}20`, borderRadius:10, padding:"12px 18px", fontSize:13, color:C.red, fontWeight:600 }}>
          🚨 Oczekujące: <strong>{pending.length}</strong>
        </div>
        <div style={{ background:C.green+"10", border:`1px solid ${C.green}20`, borderRadius:10, padding:"12px 18px", fontSize:13, color:C.green, fontWeight:600 }}>
          ✅ Rozwiązane: <strong>{resolved.length}</strong>
        </div>
      </div>

      {reports.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 20px", color:C.g400 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
          <div style={{ fontSize:15, fontWeight:600, color:C.g600 }}>Brak zgłoszeń</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {reports.map(r=>(
            <div key={r.id} style={{ background:C.white, borderRadius:14, border:r.status==="pending"?`1.5px solid ${C.red}30`:`1px solid ${C.g100}`, padding:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800, marginBottom:3 }}>
                    {r.ads?.role || "Ogłoszenie usunięte"} · {r.ads?.city}, {r.ads?.region}
                  </div>
                  <div style={{ fontSize:12, color:C.g400 }}>
                    📅 {new Date(r.created_at).toLocaleDateString("pl-PL")} · Ogłoszenie ID: {r.ad_id}
                  </div>
                </div>
                <span style={{ padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:r.status==="pending"?C.red+"18":C.green+"18", color:r.status==="pending"?C.red:C.green, border:`1px solid ${r.status==="pending"?C.red:C.green}28` }}>
                  {r.status==="pending"?"⏳ Oczekujące":"✅ Rozwiązane"}
                </span>
              </div>

              <div style={{ background:C.bg, borderRadius:8, padding:"10px 14px", marginBottom:12 }}>
  <div style={{ fontSize:12, fontWeight:700, color:C.g600, marginBottom:4 }}>Powód: <span style={{ color:C.red }}>{r.reason}</span></div>
  {r.details && <div style={{ fontSize:12, color:C.g600 }}>Szczegóły: {r.details}</div>}
</div>

{r.ads && (
  <div style={{ background:C.bg, borderRadius:8, padding:"10px 14px", marginBottom:12, border:`1px solid ${C.g100}` }}>
    <div style={{ fontSize:11, fontWeight:700, color:C.g600, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Szczegóły ogłoszenia</div>
    <div style={{ fontSize:13, fontWeight:700, color:C.g800, marginBottom:4 }}>{r.ads.role} · {r.ads.city}, {r.ads.region}</div>
    {r.ads.rate_from && <div style={{ fontSize:12, color:C.navy, fontWeight:600, marginBottom:4 }}>{r.ads.rate_from}{r.ads.rate_to?`–${r.ads.rate_to}`:""} zł/h</div>}
    {r.ads.description && <div style={{ fontSize:12, color:C.g600, marginBottom:4 }}>{r.ads.description}</div>}
    {r.ads.skills?.length > 0 && (
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {r.ads.skills.map(s=><span key={s} style={{ background:C.blue+"12", color:C.blue, padding:"2px 8px", borderRadius:6, fontSize:11, fontWeight:600 }}>{s}</span>)}
      </div>
    )}
  </div>
)}

              {r.status === "pending" && (
                <div style={{ display:"flex", gap:8 }}>
  <button onClick={()=>setConfirm({ msg:`Usunąć ogłoszenie "${r.ads?.role}"?`, onConfirm:()=>deleteAd(r.ad_id, r.id) })}
    style={{ padding:"6px 14px", borderRadius:7, border:"none", background:C.red+"10", color:C.red, fontSize:12, fontWeight:600, cursor:"pointer" }}>🗑 Usuń ogłoszenie</button>
  <button onClick={()=>deleteReport(r.id)}
    style={{ padding:"6px 14px", borderRadius:7, border:"none", background:C.g100, color:C.g600, fontSize:12, fontWeight:600, cursor:"pointer" }}>✅ Ignoruj zgłoszenie</button>
</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [counts, setCounts] = useState({ ads:0, users:0, unlocks:0, reports:0 });

  useEffect(()=>{
    if(status==="unauthenticated") router.push("/admin/login");
  },[status]);

  useEffect(()=>{
    async function loadCounts() {
      const [{ count: ads }, { count: users }, { count: unlocks }, { count: reports }] = await Promise.all([
        supabase.from("ads").select("*", { count:"exact", head:true }),
        supabase.from("profiles").select("*", { count:"exact", head:true }),
        supabase.from("unlocks").select("*", { count:"exact", head:true }),
        supabase.from("reports").select("*", { count:"exact", head:true }).eq("status","pending"),
      ]);
      setCounts({ ads:ads||0, users:users||0, unlocks:unlocks||0, reports:reports||0 });
    }
    if(session) loadCounts();
  },[session]);

  if(status==="loading"||!session) return (
    <div style={{ background:"#0F172A", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16 }}>Ładowanie...</div>
  );

  const titles = { dashboard:"Dashboard", ads:"Ogłoszenia", users:"Użytkownicy", unlocks:"Odblokowania", stats:"Statystyki" };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'DM Sans',sans-serif; }
        input,select,button { font-family:inherit; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:4px; }
      `}</style>
      <Sidebar active={active} setActive={setActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} counts={counts} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>
        <Topbar title={titles[active]} setMobileOpen={setMobileOpen} />
        <div style={{ flex:1, overflowY:"auto" }}>
          {active==="dashboard" && <Dashboard />}
          {active==="ads"       && <AdsPanel />}
          {active==="users"     && <UsersPanel />}
          {active==="unlocks"   && <UnlocksPanel />}
          {active==="stats"     && <StatsPanel />}
          {active==="reports"   && <ReportsPanel />}
        </div>
      </div>
    </div>
  );
}