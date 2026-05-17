"use client";
import { useState } from "react";

const C = {
  blue:   "#1A73E8",
  navy:   "#0D47A1",
  bg:     "#F0F2F5",
  white:  "#FFFFFF",
  g50:    "#F8FAFC",
  g100:   "#E8ECF0",
  g200:   "#CBD5E1",
  g400:   "#94A3B8",
  g600:   "#475569",
  g800:   "#1E293B",
  green:  "#16A34A",
  orange: "#EA580C",
  yellow: "#F59E0B",
  red:    "#DC2626",
  purple: "#7C3AED",
  sidebar:"#0F172A",
};

/* ── MOCK DATA ───────────────────────────────────────────────────────────── */
const MOCK_ADS = [
  { id:1,  role:"Elektryk instalacyjny",      cat:"Budowlanka",  city:"Katowice",  region:"Śląskie",      user:"Jan Kowalski",    phone:"+48 501 234 567", added:"2025-01-15", status:"active",  premium:true,  reports:0, rate:"55–70 zł/h" },
  { id:2,  role:"Kierowca kat. C+E",          cat:"Transport",   city:"Warszawa",  region:"Mazowieckie",  user:"Marek Wiśniewski",phone:"+48 502 345 678", added:"2025-01-14", status:"active",  premium:false, reports:2, rate:"22–26 zł/h" },
  { id:3,  role:"SPAM – zarabiaj 5000 zł",    cat:"Inne",        city:"???",       region:"???",          user:"bot_acc_123",     phone:"+48 000 000 000", added:"2025-01-14", status:"pending", premium:false, reports:7, rate:"999 zł/h" },
  { id:4,  role:"Spawacz MIG/MAG",            cat:"Budowlanka",  city:"Wrocław",   region:"Dolnośląskie", user:"Tomasz Zając",    phone:"+48 503 456 789", added:"2025-01-13", status:"active",  premium:true,  reports:0, rate:"45–60 zł/h" },
  { id:5,  role:"Programista React",          cat:"IT",          city:"Kraków",    region:"Małopolskie",  user:"Anna Nowak",      phone:"+48 504 567 890", added:"2025-01-13", status:"active",  premium:false, reports:0, rate:"110–150 zł/h" },
  { id:6,  role:"Kucharz / Sous Chef",        cat:"Usługi",      city:"Gdańsk",    region:"Pomorskie",    user:"Ewa Dąbrowska",   phone:"+48 505 678 901", added:"2025-01-12", status:"paused",  premium:false, reports:1, rate:"30–40 zł/h" },
  { id:7,  role:"Nieodpowiednia treść XXX",   cat:"Inne",        city:"Poznań",    region:"Wielkopolskie",user:"fake_user_99",    phone:"+48 111 111 111", added:"2025-01-12", status:"pending", premium:false, reports:5, rate:"0 zł/h" },
  { id:8,  role:"Magazynier / Wózkowy",       cat:"Logistyka",   city:"Poznań",    region:"Wielkopolskie",user:"Piotr Lewandowski",phone:"+48 506 789 012",added:"2025-01-11", status:"active",  premium:false, reports:0, rate:"22–28 zł/h" },
];

const MOCK_USERS = [
  { id:1,  name:"Jan Kowalski",     email:"jan@example.pl",    phone:"+48 501 234 567", type:"worker",   joined:"2025-01-10", status:"active",  ads:3,  verified:true,  lastLogin:"dziś" },
  { id:2,  name:"Marek Wiśniewski", email:"marek@example.pl",  phone:"+48 502 345 678", type:"worker",   joined:"2025-01-09", status:"active",  ads:1,  verified:false, lastLogin:"wczoraj" },
  { id:3,  name:"bot_acc_123",      email:"spam@spam.ru",      phone:"+48 000 000 000", type:"worker",   joined:"2025-01-14", status:"active",  ads:4,  verified:false, lastLogin:"dziś" },
  { id:4,  name:"TechCorp Sp.z o.o.",email:"hr@techcorp.pl",  phone:"+48 22 123 4567", type:"employer", joined:"2024-12-01", status:"active",  ads:0,  verified:true,  lastLogin:"dziś" },
  { id:5,  name:"Medianova S.A.",   email:"praca@medianova.pl",phone:"+48 22 234 5678", type:"employer", joined:"2024-11-15", status:"active",  ads:0,  verified:true,  lastLogin:"3 dni temu" },
  { id:6,  name:"fake_user_99",     email:"fake@fake.com",     phone:"+48 111 111 111", type:"worker",   joined:"2025-01-12", status:"active",  ads:2,  verified:false, lastLogin:"dziś" },
  { id:7,  name:"Anna Nowak",       email:"anna@example.pl",   phone:"+48 504 567 890", type:"worker",   joined:"2024-12-20", status:"active",  ads:1,  verified:true,  lastLogin:"2 dni temu" },
  { id:8,  name:"QuickJobs Agencja",email:"contact@qj.pl",     phone:"+48 33 345 6789", type:"employer", joined:"2024-10-05", status:"suspended",ads:0, verified:false, lastLogin:"tydzień temu" },
];

const MOCK_COMPANIES = [
  { id:1, name:"TechCorp Sp. z o.o.", nip:"7272727272", email:"hr@techcorp.pl",     status:"verified",   plan:"unlimited", unlocks:47, rating:4.9, joined:"2024-12-01", badge:"gold" },
  { id:2, name:"Medianova S.A.",      nip:"9898989898", email:"praca@medianova.pl", status:"verified",   plan:"package10", unlocks:18, rating:4.7, joined:"2024-11-15", badge:"silver" },
  { id:3, name:"BudMax Sp. z o.o.",   nip:"1234567890", email:"praca@budmax.pl",    status:"pending",    plan:"single",    unlocks:3,  rating:0,   joined:"2025-01-10", badge:"none" },
  { id:4, name:"QuickJobs Agencja",   nip:"5555555555", email:"contact@qj.pl",      status:"suspended",  plan:"none",      unlocks:0,  rating:2.1, joined:"2024-10-05", badge:"none" },
  { id:5, name:"LogiHub S.A.",        nip:"3333333333", email:"hr@logihub.pl",      status:"verified",   plan:"unlimited", unlocks:31, rating:4.5, joined:"2024-09-20", badge:"silver" },
  { id:6, name:"Anonimowa Firma XYZ", nip:"9999999999", email:"xyz@temp.pl",        status:"pending",    plan:"none",      unlocks:0,  rating:0,   joined:"2025-01-13", badge:"none" },
];

const MOCK_PAYMENTS = [
  { id:1,  date:"2025-01-15 10:23", company:"TechCorp Sp. z o.o.",  type:"Abonament miesięczny", amount:199, status:"paid" },
  { id:2,  date:"2025-01-15 09:11", company:"Medianova S.A.",       type:"Pakiet 10 kontaktów",  amount:69,  status:"paid" },
  { id:3,  date:"2025-01-14 16:45", company:"BudMax Sp. z o.o.",    type:"Pojedynczy kontakt",   amount:9,   status:"paid" },
  { id:4,  date:"2025-01-14 14:22", company:"LogiHub S.A.",         type:"Abonament miesięczny", amount:199, status:"paid" },
  { id:5,  date:"2025-01-14 11:05", company:"TechCorp Sp. z o.o.",  type:"Pojedynczy kontakt",   amount:9,   status:"paid" },
  { id:6,  date:"2025-01-13 09:30", company:"QuickJobs Agencja",    type:"Pakiet 10 kontaktów",  amount:69,  status:"refunded" },
  { id:7,  date:"2025-01-13 08:15", company:"Medianova S.A.",       type:"Pojedynczy kontakt",   amount:9,   status:"paid" },
  { id:8,  date:"2025-01-12 17:50", company:"LogiHub S.A.",         type:"Pakiet 10 kontaktów",  amount:69,  status:"pending" },
];

/* ── HELPERS ─────────────────────────────────────────────────────────────── */
function Badge({ text, color }) {
  const map = {
    active:    [C.green,  "Aktywne"],
    pending:   [C.yellow, "Do weryfikacji"],
    paused:    [C.g400,   "Wstrzymane"],
    banned:    [C.red,    "Zbanowane"],
    suspended: [C.red,    "Zawieszone"],
    verified:  [C.green,  "Zweryfikowana"],
    paid:      [C.green,  "Opłacone"],
    refunded:  [C.orange, "Zwrot"],
    worker:    [C.blue,   "Pracownik"],
    employer:  [C.purple, "Pracodawca"],
    gold:      [C.yellow, "🥇 Złoty"],
    silver:    [C.g400,   "🥈 Srebrny"],
    none:      [C.g200,   "Brak"],
  };
  const [col, label] = map[text] || [color || C.g400, text];
  return (
    <span style={{ display:"inline-block", padding:"2px 9px", borderRadius:20, fontSize:11, fontWeight:700, background:col+"18", color:col, border:`1px solid ${col}28`, whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
}

function Stat({ icon, label, value, sub, color = C.blue }) {
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
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={onCancel}>
      <div style={{ background:C.white, borderRadius:16, padding:28, maxWidth:360, width:"100%" }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontSize:36, textAlign:"center", marginBottom:12 }}>{danger ? "⚠️" : "❓"}</div>
        <p style={{ fontSize:14, color:C.g800, textAlign:"center", lineHeight:1.6, marginBottom:24, fontWeight:500 }}>{msg}</p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"10px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, color:C.g600, fontSize:13, fontWeight:600, cursor:"pointer" }}>Anuluj</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"10px", borderRadius:8, border:"none", background:danger?C.red:C.green, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>{danger?"Tak, wykonaj":"Potwierdź"}</button>
        </div>
      </div>
    </div>
  );
}

/* ── SIDEBAR ─────────────────────────────────────────────────────────────── */
function Sidebar({ active, setActive, mobileOpen, setMobileOpen }) {
  const nav = [
    { id:"dashboard", icon:"📊", label:"Dashboard" },
    { id:"ads",       icon:"📋", label:"Ogłoszenia",  badge: MOCK_ADS.filter(a=>a.status==="pending").length },
    { id:"users",     icon:"👥", label:"Użytkownicy" },
    { id:"companies", icon:"🏢", label:"Firmy",       badge: MOCK_COMPANIES.filter(c=>c.status==="pending").length },
    { id:"payments",  icon:"💳", label:"Płatności" },
    { id:"reports",   icon:"🚨", label:"Zgłoszenia",  badge: MOCK_ADS.filter(a=>a.reports>0).length },
  ];

  const content = (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      {/* Logo */}
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

      {/* Nav */}
      <nav style={{ flex:1, padding:"12px 10px" }}>
        {nav.map(item => (
          <button key={item.id} onClick={() => { setActive(item.id); setMobileOpen(false); }} style={{
            width:"100%", display:"flex", alignItems:"center", gap:12,
            padding:"11px 12px", borderRadius:10, border:"none",
            background: active===item.id ? "rgba(26,115,232,0.2)" : "transparent",
            color: active===item.id ? "#fff" : "rgba(255,255,255,0.55)",
            cursor:"pointer", marginBottom:2, textAlign:"left",
            borderLeft: active===item.id ? `3px solid ${C.blue}` : "3px solid transparent",
            transition:"all 0.15s",
          }}>
            <span style={{ fontSize:18 }}>{item.icon}</span>
            <span style={{ fontWeight: active===item.id ? 700 : 400, fontSize:14, flex:1 }}>{item.label}</span>
            {item.badge > 0 && (
              <span style={{ background:C.red, color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:10, fontWeight:800 }}>{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Admin info */}
      <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.navy})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>👤</div>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>Administrator</div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>admin@rynekpracownika.pl</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div style={{ width:220, background:C.sidebar, height:"100vh", position:"sticky", top:0, flexShrink:0, display:"flex", flexDirection:"column" }}>
        {content}
      </div>
      {/* Mobile overlay */}
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

/* ── TOPBAR ──────────────────────────────────────────────────────────────── */
function Topbar({ title, setMobileOpen }) {
  return (
    <div style={{ background:C.white, borderBottom:`1px solid ${C.g100}`, padding:"0 16px", height:56, display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
      <button onClick={()=>setMobileOpen(v=>!v)} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:22, padding:4, color:C.g600 }}>☰</button>
      <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:17, fontWeight:800, color:C.g800, flex:1 }}>{title}</h1>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <button style={{ background:C.red+"12", border:"none", borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:13, color:C.red, fontWeight:700, position:"relative" }}>
          🔔
          <span style={{ position:"absolute", top:2, right:2, width:8, height:8, borderRadius:"50%", background:C.red }} />
        </button>
        <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.navy})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>👤</div>
      </div>
    </div>
  );
}

/* ── DASHBOARD ───────────────────────────────────────────────────────────── */
function Dashboard() {
  const todayRevenue = MOCK_PAYMENTS.filter(p=>p.date.startsWith("2025-01-15")&&p.status==="paid").reduce((s,p)=>s+p.amount,0);
  const pending = MOCK_ADS.filter(a=>a.status==="pending").length;
  const reported = MOCK_ADS.filter(a=>a.reports>0).length;

  const activity = [
    { time:"10:23", text:"Nowa płatność — TechCorp Sp. z o.o. — 199 zł", type:"payment" },
    { time:"09:45", text:"Nowe ogłoszenie do weryfikacji — Elektryk, Katowice", type:"ad" },
    { time:"09:11", text:"Nowa płatność — Medianova S.A. — 69 zł", type:"payment" },
    { time:"08:33", text:"Zgłoszenie spamu — ogłoszenie #3 (7 zgłoszeń)", type:"report" },
    { time:"08:10", text:"Nowa firma do weryfikacji — BudMax Sp. z o.o.", type:"company" },
    { time:"07:55", text:"Użytkownik zbanowany — fake_user_99", type:"ban" },
  ];
  const typeColor = { payment:C.green, ad:C.blue, report:C.red, company:C.purple, ban:C.orange };
  const typeIcon  = { payment:"💳", ad:"📋", report:"🚨", company:"🏢", ban:"🔨" };

  return (
    <div style={{ padding:"20px 16px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:20 }}>
        <Stat icon="📋" label="Aktywne ogłoszenia"  value={MOCK_ADS.filter(a=>a.status==="active").length}  sub="łącznie w bazie"       color={C.blue} />
        <Stat icon="🚨" label="Do weryfikacji"       value={pending}   sub="czeka na akcję"        color={C.red} />
        <Stat icon="💳" label="Przychód dziś"        value={`${todayRevenue} zł`} sub="2 transakcje"    color={C.green} />
        <Stat icon="🏢" label="Firmy oczekujące"     value={MOCK_COMPANIES.filter(c=>c.status==="pending").length} sub="weryfikacja NIP" color={C.orange} />
        <Stat icon="👥" label="Użytkownicy"          value={MOCK_USERS.length}    sub="łącznie zarejestrowanych" color={C.purple} />
        <Stat icon="⭐" label="Premium ogłoszenia"   value={MOCK_ADS.filter(a=>a.premium).length}   sub="aktywne"              color={C.yellow} />
      </div>

      {/* Reported ads alert */}
      {reported > 0 && (
        <div style={{ background:C.red+"0f", border:`1.5px solid ${C.red}30`, borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.red, marginBottom:4 }}>🚨 {reported} ogłoszeń ze zgłoszeniami!</div>
          <div style={{ fontSize:12, color:C.g600 }}>Wymagają przeglądu — przejdź do zakładki "Zgłoszenia".</div>
        </div>
      )}

      {/* Activity feed */}
      <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.g100}`, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.g100}`, fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800 }}>
          Ostatnia aktywność
        </div>
        {activity.map((a,i)=>(
          <div key={i} style={{ display:"flex", gap:12, padding:"12px 18px", borderBottom: i<activity.length-1?`1px solid ${C.g100}`:"none", alignItems:"flex-start" }}>
            <div style={{ width:32, height:32, borderRadius:8, background:typeColor[a.type]+"14", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{typeIcon[a.type]}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, color:C.g800, lineHeight:1.5 }}>{a.text}</div>
              <div style={{ fontSize:11, color:C.g400, marginTop:2 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ADS PANEL ───────────────────────────────────────────────────────────── */
function AdsPanel() {
  const [ads, setAds] = useState(MOCK_ADS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [editAd, setEditAd] = useState(null);

  const filtered = ads.filter(a =>
    (filter==="all" || a.status===filter || (filter==="reported" && a.reports>0)) &&
    (!search || a.role.toLowerCase().includes(search.toLowerCase()) || a.user.toLowerCase().includes(search.toLowerCase()))
  );

  function action(id, type) {
    setAds(prev => prev.map(a => {
      if(a.id !== id) return a;
      if(type==="approve")  return {...a, status:"active", reports:0};
      if(type==="pause")    return {...a, status:"paused"};
      if(type==="delete")   return {...a, status:"banned"};
      if(type==="premium")  return {...a, premium:!a.premium};
      if(type==="clear")    return {...a, reports:0};
      return a;
    }));
    setConfirm(null);
  }

  const tabs = [
    { id:"all",      label:"Wszystkie", count: ads.length },
    { id:"pending",  label:"Do weryfikacji", count: ads.filter(a=>a.status==="pending").length },
    { id:"reported", label:"Zgłoszone", count: ads.filter(a=>a.reports>0).length },
    { id:"active",   label:"Aktywne",   count: ads.filter(a=>a.status==="active").length },
    { id:"banned",   label:"Zbanowane", count: ads.filter(a=>a.status==="banned").length },
  ];

  return (
    <div style={{ padding:"16px" }}>
      {confirm && <ConfirmModal msg={confirm.msg} danger={confirm.danger} onConfirm={()=>action(confirm.id, confirm.type)} onCancel={()=>setConfirm(null)} />}

      {/* Edit modal */}
      {editAd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:C.white, borderRadius:16, padding:24, maxWidth:420, width:"100%", maxHeight:"90vh", overflowY:"auto" }}>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:17, color:C.g800, marginBottom:20 }}>✏️ Edytuj ogłoszenie #{editAd.id}</h3>
            {[["Rola / stanowisko","role"],["Miasto","city"],["Stawka","rate"]].map(([label,key])=>(
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
                <input value={editAd[key]} onChange={e=>setEditAd(v=>({...v,[key]:e.target.value}))}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none" }} />
              </div>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button onClick={()=>setEditAd(null)} style={{ flex:1, padding:"10px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, fontSize:13, fontWeight:600, cursor:"pointer", color:C.g600 }}>Anuluj</button>
              <button onClick={()=>{ setAds(prev=>prev.map(a=>a.id===editAd.id?editAd:a)); setEditAd(null); }}
                style={{ flex:1, padding:"10px", borderRadius:8, border:"none", background:C.blue, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Zapisz</button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <input placeholder="🔍 Szukaj ogłoszenia..." value={search} onChange={e=>setSearch(e.target.value)}
        style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.white, marginBottom:14 }} />

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4, marginBottom:16 }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setFilter(t.id)} style={{ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${filter===t.id?C.blue:C.g200}`, background:filter===t.id?C.blue:C.white, color:filter===t.id?"#fff":C.g600, fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:5 }}>
            {t.label}
            {t.count>0 && <span style={{ background:filter===t.id?"rgba(255,255,255,0.25)":C.g100, borderRadius:10, padding:"0 6px", fontSize:11 }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Ad cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(ad=>(
          <div key={ad.id} style={{ background:C.white, borderRadius:14, border: ad.reports>3?`1.5px solid ${C.red}30`:ad.status==="pending"?`1.5px solid ${C.yellow}30`:`1px solid ${C.g100}`, padding:"14px 16px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800, marginBottom:3 }}>{ad.role}</div>
                <div style={{ fontSize:12, color:C.g400 }}>#{ad.id} · {ad.cat} · {ad.city}, {ad.region}</div>
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0, marginLeft:8 }}>
                <Badge text={ad.status} />
                {ad.premium && <Badge text="⭐ Premium" color={C.yellow} />}
              </div>
            </div>

            <div style={{ display:"flex", gap:12, fontSize:12, color:C.g600, marginBottom:10, flexWrap:"wrap" }}>
              <span>👤 {ad.user}</span>
              <span>📞 {ad.phone}</span>
              <span>💰 {ad.rate}</span>
              <span>📅 {ad.added}</span>
              {ad.reports>0 && <span style={{ color:C.red, fontWeight:700 }}>🚨 {ad.reports} zgłoszeń</span>}
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {ad.status==="pending" && (
                <button onClick={()=>setConfirm({id:ad.id,type:"approve",msg:`Zatwierdzić ogłoszenie "${ad.role}"?`})}
                  style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.green+"12", color:C.green, fontSize:12, fontWeight:700, cursor:"pointer" }}>✅ Zatwierdź</button>
              )}
              {ad.status==="active" && (
                <button onClick={()=>setConfirm({id:ad.id,type:"pause",msg:`Wstrzymać ogłoszenie "${ad.role}"?`})}
                  style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.orange+"12", color:C.orange, fontSize:12, fontWeight:700, cursor:"pointer" }}>⏸ Wstrzymaj</button>
              )}
              {ad.status==="paused" && (
                <button onClick={()=>action(ad.id,"approve")}
                  style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.blue+"12", color:C.blue, fontSize:12, fontWeight:700, cursor:"pointer" }}>▶️ Aktywuj</button>
              )}
              <button onClick={()=>setEditAd({...ad})}
                style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.blue+"0f", color:C.blue, fontSize:12, fontWeight:700, cursor:"pointer" }}>✏️ Edytuj</button>
              <button onClick={()=>action(ad.id,"premium")}
                style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.yellow+"14", color:C.yellow, fontSize:12, fontWeight:700, cursor:"pointer" }}>{ad.premium?"☆ Usuń premium":"⭐ Premium"}</button>
              {ad.reports>0 && (
                <button onClick={()=>action(ad.id,"clear")}
                  style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.g100, color:C.g600, fontSize:12, fontWeight:600, cursor:"pointer" }}>🧹 Wyczyść zgłoszenia</button>
              )}
              <button onClick={()=>setConfirm({id:ad.id,type:"delete",msg:`Usunąć/zbanować ogłoszenie "${ad.role}"? Ta akcja jest nieodwracalna.`,danger:true})}
                style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.red+"12", color:C.red, fontSize:12, fontWeight:700, cursor:"pointer" }}>🗑 Usuń</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── USERS PANEL ─────────────────────────────────────────────────────────── */
function UsersPanel() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);

  const filtered = users.filter(u =>
    (filter==="all" || u.type===filter || (filter==="suspended" && u.status==="suspended")) &&
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  function action(id, type) {
    setUsers(prev => prev.map(u => {
      if(u.id!==id) return u;
      if(type==="ban")     return {...u, status:"suspended"};
      if(type==="unban")   return {...u, status:"active"};
      if(type==="verify")  return {...u, verified:true};
      return u;
    }));
    setConfirm(null);
  }

  return (
    <div style={{ padding:"16px" }}>
      {confirm && <ConfirmModal msg={confirm.msg} danger={confirm.danger} onConfirm={()=>action(confirm.id,confirm.type)} onCancel={()=>setConfirm(null)} />}

      <input placeholder="🔍 Szukaj użytkownika..." value={search} onChange={e=>setSearch(e.target.value)}
        style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.white, marginBottom:14 }} />

      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {[["all","Wszyscy"],["worker","Pracownicy"],["employer","Pracodawcy"],["suspended","Zawieszeni"]].map(([id,label])=>(
          <button key={id} onClick={()=>setFilter(id)} style={{ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${filter===id?C.blue:C.g200}`, background:filter===id?C.blue:C.white, color:filter===id?"#fff":C.g600, fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>{label}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(u=>(
          <div key={u.id} style={{ background:C.white, borderRadius:14, border: u.status==="suspended"?`1.5px solid ${C.red}20`:`1px solid ${C.g100}`, padding:"14px 16px", boxShadow:"0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:8 }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${u.type==="employer"?C.purple:C.blue},${C.navy})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                {u.type==="employer"?"🏢":"👷"}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:2 }}>
                  <span style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800 }}>{u.name}</span>
                  <Badge text={u.type} />
                  {u.verified && <span style={{ fontSize:11, color:C.blue, fontWeight:700 }}>✓ Zweryfikowany</span>}
                  {u.status==="suspended" && <Badge text="suspended" />}
                </div>
                <div style={{ fontSize:12, color:C.g400 }}>{u.email}</div>
              </div>
            </div>

            <div style={{ display:"flex", gap:12, fontSize:12, color:C.g600, marginBottom:10, flexWrap:"wrap" }}>
              <span>📞 {u.phone}</span>
              <span>📅 Dołączył: {u.joined}</span>
              <span>🕐 Ostatnio: {u.lastLogin}</span>
              {u.type==="worker" && <span>📋 Ogłoszeń: {u.ads}</span>}
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {!u.verified && (
                <button onClick={()=>action(u.id,"verify")}
                  style={{ padding:"6px 13px", borderRadius:7, border:"none", background:C.blue+"10", color:C.blue, fontSize:12, fontWeight:700, cursor:"pointer" }}>✓ Zweryfikuj</button>
              )}
              {u.status==="active" ? (
                <button onClick={()=>setConfirm({id:u.id,type:"ban",msg:`Zawiesić konto użytkownika "${u.name}"?`,danger:true})}
                  style={{ padding:"6px 13px", borderRadius:7, border:"none", background:C.red+"10", color:C.red, fontSize:12, fontWeight:700, cursor:"pointer" }}>🔨 Zawieś konto</button>
              ) : (
                <button onClick={()=>action(u.id,"unban")}
                  style={{ padding:"6px 13px", borderRadius:7, border:"none", background:C.green+"10", color:C.green, fontSize:12, fontWeight:700, cursor:"pointer" }}>✅ Przywróć dostęp</button>
              )}
              <button style={{ padding:"6px 13px", borderRadius:7, border:"none", background:C.g50, color:C.g600, fontSize:12, fontWeight:600, cursor:"pointer" }}>✉️ Wyślij email</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── COMPANIES PANEL ─────────────────────────────────────────────────────── */
function CompaniesPanel() {
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [confirm, setConfirm] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered = companies.filter(c => filter==="all" || c.status===filter);

  function action(id, type) {
    setCompanies(prev => prev.map(c => {
      if(c.id!==id) return c;
      if(type==="verify")    return {...c, status:"verified"};
      if(type==="suspend")   return {...c, status:"suspended"};
      if(type==="unsuspend") return {...c, status:"verified"};
      if(type==="gold")      return {...c, badge:"gold"};
      if(type==="silver")    return {...c, badge:"silver"};
      if(type==="nobadge")   return {...c, badge:"none"};
      return c;
    }));
    setConfirm(null);
  }

  return (
    <div style={{ padding:"16px" }}>
      {confirm && <ConfirmModal msg={confirm.msg} danger={confirm.danger} onConfirm={()=>action(confirm.id,confirm.type)} onCancel={()=>setConfirm(null)} />}

      <div style={{ display:"flex", gap:6, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
        {[["all","Wszystkie"],["pending","Oczekujące"],["verified","Zweryfikowane"],["suspended","Zawieszone"]].map(([id,label])=>(
          <button key={id} onClick={()=>setFilter(id)} style={{ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${filter===id?C.blue:C.g200}`, background:filter===id?C.blue:C.white, color:filter===id?"#fff":C.g600, fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>{label}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(c=>(
          <div key={c.id} style={{ background:C.white, borderRadius:14, border: c.status==="pending"?`1.5px solid ${C.yellow}30`:c.status==="suspended"?`1.5px solid ${C.red}30`:`1px solid ${C.g100}`, padding:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:15, color:C.g800, marginBottom:2 }}>{c.name}</div>
                <div style={{ fontSize:12, color:C.g400 }}>NIP: {c.nip} · {c.email}</div>
              </div>
              <Badge text={c.status} />
            </div>

            <div style={{ display:"flex", gap:14, fontSize:12, color:C.g600, marginBottom:12, flexWrap:"wrap" }}>
              <span>💳 Plan: {c.plan}</span>
              <span>🔓 Odblokowania: {c.unlocks}</span>
              {c.rating>0 && <span>⭐ Ocena: {c.rating}</span>}
              <span>📅 Od: {c.joined}</span>
            </div>

            {/* Badge selector */}
            <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
              <span style={{ fontSize:11, fontWeight:700, color:C.g400, alignSelf:"center" }}>Odznaka:</span>
              {[["gold","🥇 Złoty"],["silver","🥈 Srebrny"],["none","Brak"]].map(([type,label])=>(
                <button key={type} onClick={()=>action(c.id,type)} style={{ padding:"4px 10px", borderRadius:20, border:`1.5px solid ${c.badge===type?C.yellow:C.g200}`, background:c.badge===type?C.yellow+"12":C.white, color:c.badge===type?C.yellow:C.g600, fontSize:11, fontWeight:600, cursor:"pointer" }}>{label}</button>
              ))}
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {c.status==="pending" && (
                <button onClick={()=>setConfirm({id:c.id,type:"verify",msg:`Zweryfikować firmę "${c.name}" (NIP: ${c.nip})?`})}
                  style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.green+"10", color:C.green, fontSize:12, fontWeight:700, cursor:"pointer" }}>✅ Zatwierdź</button>
              )}
              {c.status==="verified" && (
                <button onClick={()=>setConfirm({id:c.id,type:"suspend",msg:`Zawiesić firmę "${c.name}"?`,danger:true})}
                  style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.red+"10", color:C.red, fontSize:12, fontWeight:700, cursor:"pointer" }}>🚫 Zawieś</button>
              )}
              {c.status==="suspended" && (
                <button onClick={()=>action(c.id,"unsuspend")}
                  style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.green+"10", color:C.green, fontSize:12, fontWeight:700, cursor:"pointer" }}>✅ Przywróć</button>
              )}
              <button style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.blue+"0f", color:C.blue, fontSize:12, fontWeight:600, cursor:"pointer" }}>📋 Historia kontaktów</button>
              <button style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.g50, color:C.g600, fontSize:12, fontWeight:600, cursor:"pointer" }}>✉️ Wyślij wiadomość</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PAYMENTS PANEL ──────────────────────────────────────────────────────── */
function PaymentsPanel() {
  const total = MOCK_PAYMENTS.filter(p=>p.status==="paid").reduce((s,p)=>s+p.amount,0);
  const today = MOCK_PAYMENTS.filter(p=>p.date.startsWith("2025-01-15")&&p.status==="paid").reduce((s,p)=>s+p.amount,0);

  return (
    <div style={{ padding:"16px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:20 }}>
        <Stat icon="💰" label="Przychód łącznie" value={`${total} zł`}  sub="wszystkie transakcje" color={C.green} />
        <Stat icon="📅" label="Dziś"             value={`${today} zł`}  sub="2 transakcje"        color={C.blue} />
        <Stat icon="⏳" label="Oczekujące"       value={MOCK_PAYMENTS.filter(p=>p.status==="pending").length} sub="do potwierdzenia" color={C.yellow} />
        <Stat icon="↩️" label="Zwroty"           value={MOCK_PAYMENTS.filter(p=>p.status==="refunded").length} sub="w tym miesiącu"   color={C.red} />
      </div>

      <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.g100}`, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ padding:"13px 16px", borderBottom:`1px solid ${C.g100}`, fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800 }}>Historia transakcji</div>
        {MOCK_PAYMENTS.map((p,i)=>(
          <div key={p.id} style={{ padding:"13px 16px", borderBottom: i<MOCK_PAYMENTS.length-1?`1px solid ${C.g100}`:"none", display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ width:36, height:36, borderRadius:9, background: p.status==="paid"?C.green+"12":p.status==="refunded"?C.red+"12":C.yellow+"12", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
              {p.status==="paid"?"✅":p.status==="refunded"?"↩️":"⏳"}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.g800, marginBottom:2 }}>{p.company}</div>
              <div style={{ fontSize:11, color:C.g400 }}>{p.type} · {p.date}</div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color: p.status==="paid"?C.green:p.status==="refunded"?C.red:C.yellow }}>
                {p.status==="refunded"?"-":""}{p.amount} zł
              </div>
              <Badge text={p.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── REPORTS PANEL ───────────────────────────────────────────────────────── */
function ReportsPanel() {
  const [ads, setAds] = useState(MOCK_ADS);
  const [confirm, setConfirm] = useState(null);

  const reported = ads.filter(a=>a.reports>0).sort((a,b)=>b.reports-a.reports);

  function action(id, type) {
    setAds(prev=>prev.map(a=>{
      if(a.id!==id) return a;
      if(type==="delete") return {...a, status:"banned", reports:0};
      if(type==="clear")  return {...a, reports:0};
      return a;
    }));
    setConfirm(null);
  }

  if(reported.length===0) return (
    <div style={{ padding:"16px" }}>
      <div style={{ textAlign:"center", padding:"60px 20px", color:C.g400 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
        <div style={{ fontSize:16, fontWeight:700, color:C.g600, marginBottom:8 }}>Brak zgłoszeń!</div>
        <div style={{ fontSize:13 }}>Wszystkie ogłoszenia są w porządku.</div>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"16px" }}>
      {confirm && <ConfirmModal msg={confirm.msg} danger={confirm.danger} onConfirm={()=>action(confirm.id,confirm.type)} onCancel={()=>setConfirm(null)} />}

      <div style={{ background:C.red+"0a", border:`1.5px solid ${C.red}20`, borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
        <div style={{ fontWeight:700, fontSize:14, color:C.red }}>🚨 {reported.length} ogłoszeń ze zgłoszeniami użytkowników</div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {reported.map(ad=>(
          <div key={ad.id} style={{ background:C.white, borderRadius:14, border:`1.5px solid ${ad.reports>=5?C.red:C.orange}30`, padding:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800, marginBottom:2 }}>{ad.role}</div>
                <div style={{ fontSize:12, color:C.g400 }}>#{ad.id} · {ad.city} · Użytkownik: {ad.user}</div>
              </div>
              <div style={{ background:C.red, color:"#fff", borderRadius:10, padding:"3px 10px", fontSize:13, fontWeight:800 }}>
                🚨 {ad.reports}
              </div>
            </div>

            <div style={{ background:ad.reports>=5?C.red+"0a":C.orange+"0a", borderRadius:8, padding:"8px 12px", marginBottom:12, fontSize:12, color:ad.reports>=5?C.red:C.orange, fontWeight:600 }}>
              {ad.reports>=5?"⛔ Wysoka liczba zgłoszeń — prawdopodobny spam lub nieodpowiednie treści":"⚠️ Umiarkowana liczba zgłoszeń — wymaga przeglądu"}
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <button onClick={()=>setConfirm({id:ad.id,type:"delete",msg:`Usunąć i zbanować ogłoszenie "${ad.role}"?`,danger:true})}
                style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.red+"12", color:C.red, fontSize:12, fontWeight:700, cursor:"pointer" }}>🗑 Usuń ogłoszenie</button>
              <button onClick={()=>action(ad.id,"clear")}
                style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.green+"10", color:C.green, fontSize:12, fontWeight:700, cursor:"pointer" }}>✅ Wyczyść zgłoszenia</button>
              <button style={{ padding:"7px 14px", borderRadius:8, border:"none", background:C.blue+"0f", color:C.blue, fontSize:12, fontWeight:600, cursor:"pointer" }}>👤 Profil autora</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ROOT ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const titles = {
    dashboard:"Dashboard",
    ads:"Ogłoszenia",
    users:"Użytkownicy",
    companies:"Firmy",
    payments:"Płatności",
    reports:"Zgłoszenia",
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'DM Sans',sans-serif; }
        input,select,button,textarea { font-family:inherit; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:4px; }
        @media(max-width:640px){ .sidebar-desktop{ display:none !important; } }
      `}</style>

      <Sidebar active={active} setActive={setActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>
        <Topbar title={titles[active]} setMobileOpen={setMobileOpen} />
        <div style={{ flex:1, overflowY:"auto" }}>
          {active==="dashboard" && <Dashboard />}
          {active==="ads"       && <AdsPanel />}
          {active==="users"     && <UsersPanel />}
          {active==="companies" && <CompaniesPanel />}
          {active==="payments"  && <PaymentsPanel />}
          {active==="reports"   && <ReportsPanel />}
        </div>
      </div>
    </div>
  );
}
