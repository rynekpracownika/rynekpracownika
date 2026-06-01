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
  };
  const [col, label] = map[text] || [C.g400, text];
  return (
    <span style={{ display:"inline-block", padding:"2px 9px", borderRadius:20, fontSize:11, fontWeight:700, background:col+"18", color:col, border:`1px solid ${col}28` }}>
      {label}
    </span>
  );
}

function Stat({ icon, label, value, color=C.blue }) {
  return (
    <div style={{ background:C.white, borderRadius:14, padding:"18px 20px", border:`1px solid ${C.g100}`, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:12, color:C.g400, fontWeight:600, marginBottom:6 }}>{label}</div>
          <div style={{ fontFamily:"Sora,sans-serif", fontSize:26, fontWeight:900, color }}>{value}</div>
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

function Sidebar({ active, setActive, mobileOpen, setMobileOpen }) {
  const nav = [
    { id:"dashboard", icon:"📊", label:"Dashboard" },
    { id:"ads",       icon:"📋", label:"Ogłoszenia" },
    { id:"users",     icon:"👥", label:"Użytkownicy" },
    { id:"unlocks",   icon:"🔓", label:"Odblokowania" },
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
            <span style={{ fontWeight:active===item.id?700:400, fontSize:14 }}>{item.label}</span>
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
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:24 }}>
        <Stat icon="📋" label="Ogłoszenia" value={stats.ads} color={C.blue} />
        <Stat icon="🔓" label="Odblokowania" value={stats.unlocks} color={C.green} />
        <Stat icon="👷" label="Pracownicy" value={stats.workers} color={C.purple} />
        <Stat icon="🏢" label="Pracodawcy" value={stats.employers} color={C.orange} />
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

  const filtered = ads.filter(a =>
    !search || a.role?.toLowerCase().includes(search.toLowerCase()) || a.city?.toLowerCase().includes(search.toLowerCase())
  );

  if(loading) return <div style={{ padding:40, textAlign:"center", color:C.g400 }}>Ładowanie...</div>;

  return (
    <div style={{ padding:"16px" }}>
      {confirm && <ConfirmModal msg={confirm.msg} danger onConfirm={confirm.onConfirm} onCancel={()=>setConfirm(null)} />}

      <div style={{ marginBottom:16, display:"flex", gap:10, alignItems:"center" }}>
        <input placeholder="🔍 Szukaj ogłoszenia..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.white, color:C.g800 }} />
        <span style={{ fontSize:13, color:C.g400 }}>{filtered.length} ogłoszeń</span>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(ad=>(
          <div key={ad.id} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.g100}`, padding:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:15, color:C.g800, marginBottom:2 }}>{ad.role}</div>
                <div style={{ fontSize:12, color:C.g400 }}>{ad.city}, {ad.region} · {ad.category}</div>
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

  const filtered = users.filter(u =>
    (filter==="all" || u.type===filter) &&
    (!search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  if(loading) return <div style={{ padding:40, textAlign:"center", color:C.g400 }}>Ładowanie...</div>;

  return (
    <div style={{ padding:"16px" }}>
      {confirm && <ConfirmModal msg={confirm.msg} danger onConfirm={confirm.onConfirm} onCancel={()=>setConfirm(null)} />}

      <div style={{ marginBottom:14, display:"flex", gap:10 }}>
        <input placeholder="🔍 Szukaj użytkownika..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.white, color:C.g800 }} />
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {[["all","Wszyscy"],["worker","Pracownicy"],["employer","Pracodawcy"]].map(([id,label])=>(
          <button key={id} onClick={()=>setFilter(id)} style={{ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${filter===id?C.blue:C.g200}`, background:filter===id?C.blue:C.white, color:filter===id?"#fff":C.g600, fontSize:12, fontWeight:600, cursor:"pointer" }}>{label}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(u=>(
          <div key={u.id} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.g100}`, padding:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800, marginBottom:2 }}>{u.name}</div>
                <div style={{ fontSize:12, color:C.g400 }}>✉️ {u.email} · 📞 {u.phone}</div>
              </div>
              <Badge text={u.type} />
            </div>
            <div style={{ fontSize:12, color:C.g600, marginBottom:10 }}>
              📅 Dołączył: {new Date(u.created_at).toLocaleDateString("pl-PL")}
              {u.nip && ` · NIP: ${u.nip}`}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setConfirm({ msg:`Usunąć konto użytkownika "${u.name}"?`, onConfirm:()=>deleteUser(u.id) })}
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

  if(loading) return <div style={{ padding:40, textAlign:"center", color:C.g400 }}>Ładowanie...</div>;

  return (
    <div style={{ padding:"16px" }}>
      <div style={{ marginBottom:16, fontSize:13, color:C.g400 }}>Łącznie: <strong style={{ color:C.g800 }}>{unlocks.length}</strong> odblokowań</div>
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

export default function App() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(()=>{
    if(status==="unauthenticated") router.push("/admin/login");
  },[status]);

  if(status==="loading"||!session) return (
    <div style={{ background:"#0F172A", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16 }}>Ładowanie...</div>
  );

  const titles = { dashboard:"Dashboard", ads:"Ogłoszenia", users:"Użytkownicy", unlocks:"Odblokowania" };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'DM Sans',sans-serif; }
        input,select,button { font-family:inherit; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:4px; }
      `}</style>
      <Sidebar active={active} setActive={setActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>
        <Topbar title={titles[active]} setMobileOpen={setMobileOpen} />
        <div style={{ flex:1, overflowY:"auto" }}>
          {active==="dashboard" && <Dashboard />}
          {active==="ads"       && <AdsPanel />}
          {active==="users"     && <UsersPanel />}
          {active==="unlocks"   && <UnlocksPanel />}
        </div>
      </div>
    </div>
  );
}