"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
  white:"#FFFFFF", g50:"#F8FAFC", g100:"#E8ECF0",
  g200:"#CBD5E1", g400:"#475569", g600:"#475569",
  g800:"#1E293B", green:"#16A34A", orange:"#EA580C",
  yellow:"#F59E0B", red:"#DC2626",
};

const REGIONS = [
  "Cała Polska","Dolnośląskie","Kujawsko-Pomorskie","Lubelskie","Lubuskie",
  "Łódź i okolice","Małopolskie","Mazowieckie","Opolskie","Podkarpackie",
  "Podlaskie","Pomorskie","Śląskie","Świętokrzyskie","Warmińsko-Mazurskie",
  "Wielkopolskie","Zachodniopomorskie",
];

const CATEGORIES = [
  { id:"budowlanka",  icon:"🏗️",  label:"Budowlanka",          sub:["Elektryk","Hydraulik","Murarz","Tynkarz","Malarz","Dekarz","Cieśla","Glazurnik","Spawacz"] },
  { id:"produkcja",   icon:"🏭",  label:"Produkcja",           sub:["Operator maszyn","Kontroler jakości","Magazynier","Pakowacz","Pracownik linii"] },
  { id:"logistyka",   icon:"🚚",  label:"Logistyka / Transport",sub:["Kierowca C+E","Kierowca B","Kurier","Spedytor","Magazynier"] },
  { id:"handel",      icon:"🛒",  label:"Handel / Sprzedaż",   sub:["Sprzedawca","Kasjer","Doradca klienta","Handlowiec","Przedstawiciel"] },
  { id:"uslugi",      icon:"🔧",  label:"Usługi",              sub:["Mechanik","Fryzjer","Kucharz","Kelner","Ochroniarz","Sprzątaczka"] },
  { id:"it",          icon:"💻",  label:"IT / Technologia",    sub:["Programista","Administrator IT","Helpdesk","Tester","DevOps"] },
  { id:"biuro",       icon:"📋",  label:"Biuro / Administracja",sub:["Księgowa","Asystentka","HR","Recepcjonistka","Prawnik"] },
  { id:"edukacja",    icon:"🎓",  label:"Edukacja / Nauka",    sub:["Nauczyciel","Korepetytor","Trener","Coach"] },
];

const ADS = [
  { id:1,  cat:"budowlanka", role:"Elektryk instalacyjny",        region:"Śląskie",          city:"Katowice", exp:"8 lat",  rate:"55–70 zł/h",   avail:"od zaraz",   contract:["Zlecenie","B2B"], remote:false, premium:true,  verified:true,  skills:["Instalacje elektryczne","Pomiary","Uprawnienia SEP"],           desc:"Doświadczony elektryk z uprawnieniami SEP do 1kV.",            offers:14, added:"2 dni temu" },
  { id:2,  cat:"logistyka",  role:"Kierowca kat. C+E",            region:"Mazowieckie",      city:"Warszawa", exp:"12 lat", rate:"22–26 zł/h",   avail:"1 tydzień",  contract:["UoP","Zlecenie"], remote:false, premium:false, verified:true,  skills:["Kat. C+E","ADR","Tacho cyfrowe"],                            desc:"Kierowca z 12-letnim stażem, krajowe i zagraniczne.",          offers:9,  added:"dziś" },
  { id:3,  cat:"budowlanka", role:"Spawacz MIG/MAG/TIG",          region:"Dolnośląskie",     city:"Wrocław",  exp:"6 lat",  rate:"45–60 zł/h",   avail:"od zaraz",   contract:["B2B","Zlecenie"], remote:false, premium:true,  verified:true,  skills:["MIG/MAG","TIG","Certyfikat EN"],                             desc:"Spawacz z certyfikatami EN.",                                  offers:11, added:"dziś" },
  { id:4,  cat:"it",         role:"Programista React / Node.js",  region:"Małopolskie",      city:"Kraków",   exp:"5 lat",  rate:"110–150 zł/h", avail:"2 tygodnie", contract:["B2B"],             remote:true,  premium:false, verified:false, skills:["React","Node.js","TypeScript"],                              desc:"Full-stack developer, 5 lat w SaaS.",                          offers:6,  added:"3 dni temu" },
  { id:5,  cat:"logistyka",  role:"Magazynier / Wózkowy",         region:"Wielkopolskie",    city:"Poznań",   exp:"4 lata", rate:"22–28 zł/h",   avail:"od zaraz",   contract:["UoP"],             remote:false, premium:false, verified:true,  skills:["Wózek widłowy UDT","WMS","Kompletacja"],                     desc:"Uprawnienia UDT, magazyny wysokiego składowania.",             offers:7,  added:"wczoraj" },
  { id:6,  cat:"uslugi",     role:"Kucharz / Sous Chef",          region:"Pomorskie",        city:"Gdańsk",   exp:"7 lat",  rate:"30–40 zł/h",   avail:"2 tygodnie", contract:["UoP","Zlecenie"], remote:false, premium:true,  verified:true,  skills:["Kuchnia polska","HACCP","Zarządzanie kuchnią"],              desc:"Kucharz z 7 laty w gastronomii.",                              offers:5,  added:"4 dni temu" },
  { id:7,  cat:"budowlanka", role:"Hydraulik / Instalator",       region:"Łódź i okolice",  city:"Łódź",     exp:"10 lat", rate:"50–65 zł/h",   avail:"od zaraz",   contract:["Zlecenie","B2B"], remote:false, premium:false, verified:false, skills:["Instalacje CO","Wod-kan","Pompy ciepła"],                    desc:"Instalator z pełnym doświadczeniem.",                          offers:8,  added:"wczoraj" },
  { id:8,  cat:"handel",     role:"Doradca klienta / Sprzedawca", region:"Śląskie",          city:"Gliwice",  exp:"3 lata", rate:"18–24 zł/h",   avail:"od zaraz",   contract:["UoP"],             remote:false, premium:false, verified:true,  skills:["Obsługa klienta","Kasa fiskalna"],                           desc:"Sprzedawczyni z branży FMCG.",                                 offers:3,  added:"5 dni temu" },
  { id:9,  cat:"uslugi",     role:"Mechanik samochodowy",         region:"Mazowieckie",      city:"Radom",    exp:"9 lat",  rate:"35–50 zł/h",   avail:"1 tydzień",  contract:["UoP","B2B"],      remote:false, premium:false, verified:true,  skills:["Diagnostyka","Silniki benzynowe/diesel","Hamulce"],          desc:"Mechanik z uprawnieniami diagnostycznymi.",                    offers:10, added:"2 dni temu" },
  { id:10, cat:"produkcja",  role:"Operator CNC / Tokarz",        region:"Dolnośląskie",     city:"Legnica",  exp:"5 lat",  rate:"28–36 zł/h",   avail:"od zaraz",   contract:["UoP","Zlecenie"], remote:false, premium:true,  verified:true,  skills:["CNC Fanuc","Toczenie","Frezowanie"],                         desc:"Operator CNC z praktyką na maszynach Fanuc.",                  offers:12, added:"dziś" },
  { id:11, cat:"biuro",      role:"Główna Księgowa / Księgowy",   region:"Małopolskie",      city:"Kraków",   exp:"15 lat", rate:"40–55 zł/h",   avail:"1 miesiąc",  contract:["UoP","B2B"],      remote:true,  premium:false, verified:true,  skills:["Symfonia","Comarch ERP","VAT","Bilans"],                     desc:"Samodzielna księgowa z certyfikatem MF.",                      offers:4,  added:"tydzień temu" },
  { id:12, cat:"budowlanka", role:"Dekarz / Blachodekarz",        region:"Warmińsko-Mazurskie",city:"Olsztyn",exp:"11 lat", rate:"45–60 zł/h",   avail:"od zaraz",   contract:["Zlecenie"],       remote:false, premium:false, verified:false, skills:["Blachodachówka","Papa termozgrzewalna","Rynny"],             desc:"Dekarz z długim stażem, dysponuję ekipą.",                     offers:6,  added:"3 dni temu" },
];

function Pill({ text, color=C.blue, small }) {
  return <span style={{ display:"inline-block", padding:small?"2px 8px":"4px 10px", borderRadius:20, fontSize:small?10:11, fontWeight:600, background:color+"18", color, border:`1px solid ${color}28` }}>{text}</span>;
}

function Btn({ children, variant="primary", onClick, full, small }) {
  const base = { border:"none", cursor:"pointer", borderRadius:8, fontFamily:"inherit", fontWeight:600, transition:"all 0.15s", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, padding:small?"7px 14px":"10px 20px", fontSize:small?12:13, width:full?"100%":undefined };
  const variants = {
    primary: { background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", boxShadow:"0 3px 12px rgba(26,115,232,0.28)" },
    outline: { background:"transparent", color:C.blue, border:`1.5px solid ${C.blue}` },
    ghost:   { background:C.blue+"0f", color:C.blue },
    danger:  { background:C.red+"12", color:C.red, border:`1px solid ${C.red}28` },
    success: { background:C.green+"12", color:C.green, border:`1px solid ${C.green}28` },
  };
  return <button style={{...base,...variants[variant]}} onClick={onClick}>{children}</button>;
}

function Avatar({ seed, size=42 }) {
  const colors = ["#1A73E8","#0D47A1","#16A34A","#EA580C","#7C3AED","#0891B2"];
  const icons = ["👷","🔧","🚚","💼","🏗️","⚡","🔩","🛒"];
  return <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,${colors[seed%colors.length]},${colors[seed%colors.length]}cc)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.42, flexShrink:0, boxShadow:"0 2px 8px rgba(0,0,0,0.12)" }}>{icons[seed%icons.length]}</div>;
}

function Navbar({ view, setView }) {
  const [open, setOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: prof } = await supabase.from("profiles").select("type").eq("id", user.id).single();
        setProfile(prof);
      }
    }
    loadUser();
  }, []);

  function handleAddAd() {
  if (user) {
    window.location.href = profile?.type === "worker" ? "/panel/pracownik" : "/panel/pracodawca";
  } else {
    setShowAuthModal(true);
  }
}

  return (
    <> {showAuthModal && (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={()=>setShowAuthModal(false)}>
    <div style={{ background:"#fff", borderRadius:18, padding:36, maxWidth:400, width:"100%", textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }} onClick={e=>e.stopPropagation()}>
      <div style={{ fontSize:48, marginBottom:16 }}>👷</div>
      <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:22, color:"#1E293B", marginBottom:8 }}>Dodaj ogłoszenie</h3>
      <p style={{ fontSize:14, color:"#475569", marginBottom:28, lineHeight:1.6 }}>Zaloguj się lub zarejestruj żeby dodać ogłoszenie ze swoją stawką.</p>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <button onClick={()=>window.location.href="/logowanie"} style={{ width:"100%", background:`linear-gradient(135deg,#1A73E8,#0D47A1)`, color:"#fff", border:"none", padding:"13px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
          Mam już konto → Zaloguj się
        </button>
        <button onClick={()=>window.location.href="/rejestracja?type=worker"} style={{ width:"100%", background:"transparent", color:"#1A73E8", border:"1.5px solid #1A73E8", padding:"13px", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>
          Nowy użytkownik → Zarejestruj się
        </button>
      </div>
      <button onClick={()=>setShowAuthModal(false)} style={{ marginTop:14, background:"transparent", border:"none", color:"#94A3B8", fontSize:12, cursor:"pointer" }}>
        Anuluj
      </button>
    </div>
  </div>
)}
    <nav style={{ position:"sticky", top:0, zIndex:200, background:"rgba(255,255,255,0.97)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${C.g100}`, boxShadow:"0 1px 12px rgba(13,71,161,0.07)" }}>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 20px", height:60, display:"flex", alignItems:"center", gap:16 }}>
        <div onClick={()=>setView("home")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:`linear-gradient(135deg,${C.blue},${C.navy})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontWeight:900, fontFamily:"Sora,sans-serif", fontSize:16 }}>R</span>
          </div>
          <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:C.navy, lineHeight:1.1 }}>
            rynek<span style={{ color:C.blue }}>pracownika</span>
            <div style={{ fontSize:9, fontWeight:500, color:C.g400, letterSpacing:0.5 }}>ODWRÓCONY RYNEK PRACY</div>
          </div>
        </div>
        <div style={{ flex:1 }} />
        <div className="hide-mobile" style={{ display:"flex", gap:2 }}>
          {[["home","Strona główna"],["ads","Ogłoszenia"],["ranking","Ranking firm"],["howitworks","Jak to działa"]].map(([id,label])=>(
            <button key={id} onClick={()=>{ 
  if(id==="ranking") { window.location.href="/ranking"; return; }
  if(id==="howitworks") { window.location.href="/howitworks"; return; }
  setView(id); }} style={{ background:view===id?C.blue+"10":"transparent", border:"none", cursor:"pointer", padding:"7px 13px", borderRadius:7, fontSize:13, fontWeight:view===id?700:400, color:view===id?C.blue:C.g600 }}>{label}</button>
          ))}
        </div>
        <div className="hide-mobile" style={{ display:"flex", gap:8, marginLeft:8 }}>
          {user ? (
            <>
              <Btn variant="ghost" small onClick={()=>window.location.href=profile?.type==="worker"?"/panel/pracownik":"/panel/pracodawca"}>
                👤 Moje konto
              </Btn>
              <Btn variant="primary" small onClick={handleAddAd}>
                {profile?.type === "worker" ? "+ Dodaj ogłoszenie" : "🔍 Szukaj pracowników"}
              </Btn>
            </>
          ) : (
            <>
              <Btn variant="outline" small onClick={()=>window.location.href='/logowanie'}>Zaloguj</Btn>
              <Btn variant="primary" small onClick={handleAddAd}>+ Dodaj ogłoszenie</Btn>
            </>
          )}
        </div>
        <button className="show-mobile" onClick={()=>setOpen(!open)} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:22, padding:4 }}>☰</button>
      </div>
      {open && (
        <div style={{ background:C.white, borderTop:`1px solid ${C.g100}`, padding:"12px 20px", display:"flex", flexDirection:"column", gap:8 }}>
          {[["home","🏠 Strona główna"],["ads","📋 Ogłoszenia"],["ranking","🏆 Ranking firm"],["howitworks","❓ Jak to działa"]].map(([id,label])=>(
            <button key={id} onClick={()=>{ setView(id); setOpen(false); }} style={{ background:view===id?C.blue+"10":"transparent", border:"none", cursor:"pointer", padding:"10px 14px", borderRadius:8, fontSize:14, fontWeight:view===id?700:400, color:view===id?C.blue:C.g800, textAlign:"left" }}>{label}</button>
          ))}
          <div style={{ display:"flex", gap:8, paddingTop:8, borderTop:`1px solid ${C.g100}` }}>
            {user ? (
              <>
                <Btn variant="ghost" small onClick={()=>window.location.href=profile?.type==="worker"?"/panel/pracownik":"/panel/pracodawca"}>👤 Moje konto</Btn>
                <Btn variant="primary" small onClick={handleAddAd}>
                  {profile?.type === "worker" ? "+ Dodaj ogłoszenie" : "🔍 Szukaj"}
                </Btn>
              </>
            ) : (
              <>
                <Btn variant="outline" small onClick={()=>window.location.href='/logowanie'}>Zaloguj</Btn>
                <Btn variant="primary" small onClick={()=>window.location.href='/rejestracja?type=worker'}>+ Dodaj ogłoszenie</Btn>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  </>
  );
}

function HomeView({ setView, setActiveCat, ads: realAds=[], adsCount=0, user, profile, setShowAuthModal, setReportAd }) {
  const stats = [
    { n:adsCount>0?`${adsCount}`:"0", t:"Aktywnych ogłoszeń" },
    { n:"16 woj.", t:"Zasięg regionalny" },
    { n:"za darmo", t:"Ogłoszenie pracownika" },
    { n:"100%", t:"Anonimowość danych" },
  ];
  return (
    <div>
      <div className="hero-padding" style={{ background:`linear-gradient(150deg,${C.navy} 0%,#1565C0 55%,${C.blue} 100%)`, position:"relative", overflow:"hidden" }}>
        {[400,650,900].map((s,i)=>(
          <div key={i} style={{ position:"absolute", width:s, height:s, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.05)", top:"50%", right:-s*0.3+i*40, transform:"translateY(-50%)", pointerEvents:"none" }}/>
        ))}
        <div style={{ maxWidth:760, margin:"0 auto", textAlign:"center", position:"relative" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.12)", borderRadius:20, padding:"5px 16px", marginBottom:24, border:"1px solid rgba(255,255,255,0.18)", fontSize:12, color:"rgba(255,255,255,0.9)", fontWeight:500 }}>
            🇵🇱 Pierwsza polska platforma odwróconych ogłoszeń o pracę
          </div>
          <h1 className="hero-title" style={{ fontFamily:"Sora,sans-serif", fontWeight:900, color:"#fff", lineHeight:1.15, marginBottom:18 }}>
            Ty podajesz warunki.<br/>
            <span style={{ color:"#93C5FD" }}>Pracodawca dzwoni do Ciebie.</span>
          </h1>
          <p style={{ fontSize:17, color:"rgba(255,255,255,0.75)", maxWidth:540, margin:"0 auto 36px", lineHeight:1.65 }}>
            Elektryk, kierowca, spawacz, kucharz — dodaj ogłoszenie ze swoją stawką i regionem.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={()=>{ if(user) { window.location.href="/panel/pracownik"; } else { setShowAuthModal(true); } }} style={{ background:"#fff", color:C.navy, border:"none", padding:"13px 30px", borderRadius:10, fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"Sora,sans-serif", boxShadow:"0 6px 20px rgba(0,0,0,0.18)" }}>📝 Dodaj ogłoszenie — to GRATIS</button>
            <button onClick={()=>setView("ads")} style={{ background:"rgba(255,255,255,0.12)", color:"#fff", border:"1.5px solid rgba(255,255,255,0.28)", padding:"13px 28px", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>🔍 Szukam pracowników</button>
          </div>
        </div>
      </div>

      <div style={{ background:C.white, borderBottom:`1px solid ${C.g100}` }}>
        <div className="stats-grid" style={{ maxWidth:1000, margin:"0 auto" }}>
          {stats.map((s,i)=>(
            <div key={i} style={{ textAlign:"center", padding:"22px 12px", borderRight:i<3?`1px solid ${C.g100}`:"none" }}>
              <div style={{ fontFamily:"Sora,sans-serif", fontSize:24, fontWeight:900, color:C.blue }}>{s.n}</div>
              <div style={{ fontSize:12, color:C.g600, marginTop:3 }}>{s.t}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"56px 20px" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:C.blue, textTransform:"uppercase", marginBottom:10 }}>Branże</div>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:30, fontWeight:800, color:C.g800 }}>Dla każdego zawodu</h2>
        </div>
        <div className="grid-4">
          {CATEGORIES.map(cat=>(
            <div key={cat.id} onClick={()=>{ setActiveCat(cat.id); setView("ads"); }} style={{ background:C.white, borderRadius:14, padding:"20px 18px", cursor:"pointer", border:`1.5px solid ${C.g100}`, transition:"all 0.18s", boxShadow:"0 2px 8px rgba(26,115,232,0.04)" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue; e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.g100; e.currentTarget.style.transform="";}}
            >
              <div style={{ fontSize:30, marginBottom:10 }}>{cat.icon}</div>
              <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800, marginBottom:6 }}>{cat.label}</div>
              <div style={{ fontSize:11, color:C.g400 }}>{cat.sub.slice(0,3).join(", ")}...</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:C.g50, borderTop:`1px solid ${C.g100}`, borderBottom:`1px solid ${C.g100}`, padding:"56px 20px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center", marginBottom:44 }}>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:30, fontWeight:800, color:C.g800 }}>Jak działa rynekpracownika.pl?</h2>
        </div>
        <div className="grid-3" style={{ maxWidth:900, margin:"0 auto" }}>
          {[
            { step:"1", icon:"📝", title:"Dodajesz ogłoszenie", desc:"Wpisujesz zawód, doświadczenie, oczekiwaną stawkę i region. Twoje dane są anonimowe." },
            { step:"2", icon:"📞", title:"Firmy dzwonią do Ciebie", desc:"Zainteresowane firmy kupują dostęp do Twoich danych. Żadnego wysyłania CV w ciemno." },
            { step:"3", icon:"🤝", title:"Ty decydujesz", desc:"Rozmawiasz z firmą, negocjujesz warunki i sam decydujesz czy podjąć współpracę." },
          ].map(s=>(
            <div key={s.step} style={{ background:C.white, borderRadius:14, padding:28, border:`1px solid ${C.g100}`, position:"relative" }}>
              <div style={{ position:"absolute", top:-13, left:24, width:26, height:26, borderRadius:7, background:`linear-gradient(135deg,${C.blue},${C.navy})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:800 }}>{s.step}</div>
              <div style={{ fontSize:34, marginBottom:14 }}>{s.icon}</div>
              <h3 style={{ fontFamily:"Sora,sans-serif", fontSize:16, fontWeight:700, color:C.g800, marginBottom:8 }}>{s.title}</h3>
              <p style={{ fontSize:13, color:C.g600, lineHeight:1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"52px 20px" }}>
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
    <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:24, fontWeight:800, color:C.g800 }}>Najnowsze ogłoszenia</h2>
    <button onClick={()=>setView("ads")} style={{ background:"transparent", border:"none", color:C.blue, fontWeight:700, fontSize:13, cursor:"pointer" }}>Zobacz wszystkie →</button>
  </div>
  <div className="grid-3">
    {realAds === null ? (
  <div className="grid-3">
    {[1,2,3].map(i=>(
      <div key={i} style={{ background:C.white, borderRadius:14, padding:"18px 20px", border:`1px solid ${C.g100}`, boxShadow:"0 2px 10px rgba(26,115,232,0.04)" }}>
        <div style={{ display:"flex", gap:12, marginBottom:12 }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:C.g100, flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ height:14, background:C.g100, borderRadius:6, marginBottom:8, width:"70%" }} />
            <div style={{ height:11, background:C.g100, borderRadius:6, width:"50%" }} />
          </div>
          <div style={{ width:80 }}>
            <div style={{ height:14, background:C.g100, borderRadius:6, marginBottom:6 }} />
            <div style={{ height:11, background:C.g100, borderRadius:6 }} />
          </div>
        </div>
        <div style={{ display:"flex", gap:6, marginBottom:12 }}>
          {[60,80,70].map((w,j)=>(
            <div key={j} style={{ height:20, background:C.g100, borderRadius:6, width:w }} />
          ))}
        </div>
        <div style={{ height:40, background:C.g100, borderRadius:8 }} />
      </div>
    ))}
  </div>
) : realAds.length > 0 ? (
  realAds.slice(0,6).map(ad=><AdCard key={ad.id} ad={ad} preview onReport={()=>setReportAd(ad)} />)
) : (
  ADS.slice(0,6).map(ad=><AdCard key={ad.id} ad={ad} preview onReport={()=>setReportAd(ad)} />)
)}
  </div>
</div>

      <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, padding:"60px 20px", textAlign:"center" }}>
        <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:32, fontWeight:800, color:"#fff", marginBottom:14 }}>Masz zawód? Podaj swoje warunki.</h2>
        <p style={{ color:"rgba(255,255,255,0.72)", fontSize:15, marginBottom:32 }}>Ogłoszenie jest bezpłatne. Firmy płacą za kontakt do Ciebie.</p>
        <button onClick={()=>{ if(user) { window.location.href="/panel/pracownik"; } else { setShowAuthModal(true); } }} style={{ background:"#fff", color:C.navy, border:"none", padding:"13px 34px", borderRadius:10, fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"Sora,sans-serif", boxShadow:"0 6px 20px rgba(0,0,0,0.15)" }}>Dodaj ogłoszenie za darmo →</button>
      </div>
    </div>
  );
}
function AdCard({ ad, preview, onUnlock, onReport }) {
  const cat = CATEGORIES.find(c=>c.id===ad.cat || c.id===ad.category);
  return (
    <div style={{ background:C.white, borderRadius:14, padding:"18px 20px", border:ad.premium?`1.5px solid ${C.yellow}50`:`1px solid ${C.g100}`, boxShadow:ad.premium?"0 4px 20px rgba(245,158,11,0.08)":"0 2px 10px rgba(26,115,232,0.04)", position:"relative", cursor:"pointer", transition:"all 0.18s" }}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 28px rgba(26,115,232,0.12)"; e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow=ad.premium?"0 4px 20px rgba(245,158,11,0.08)":"0 2px 10px rgba(26,115,232,0.04)"; e.currentTarget.style.transform="";}}
      onClick={async ()=>{
  if(ad.id && typeof ad.id === 'number') {
    await supabase.from("ads").update({ views: (ad.views || 0) + 1 }).eq("id", ad.id);
  }
  window.location.href=`/ogloszenie/${ad.id}`;
}}
    >
      {ad.premium && <div style={{ position:"absolute", top:0, right:0, background:`linear-gradient(135deg,${C.yellow},${C.orange})`, padding:"3px 12px", borderBottomLeftRadius:10, borderTopRightRadius:12, fontSize:9, fontWeight:800, color:"#fff", letterSpacing:1 }}>★ WYRÓŻNIONE</div>}
      <div style={{ display:"flex", gap:12, marginBottom:12 }}>
        <Avatar seed={ad.id} size={44} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800, marginBottom:2, display:"flex", alignItems:"center", gap:6 }}>
            {ad.role}{ad.verified && <span style={{ fontSize:11, color:C.blue }}>✓</span>}
          </div>
          <div style={{ fontSize:11, color:C.g400 }}>{cat?.icon} {cat?.label} · {ad.city}, {ad.region}</div>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:14, color:C.navy }}>{ad.rate || (ad.rate_from && `${ad.rate_from}${ad.rate_to?`–${ad.rate_to}`:""}`)}</div>
          <div style={{ fontSize:10, color:C.g400 }}>zł/h netto (na rękę)</div>
        </div>
      </div>
      {!preview && <p style={{ fontSize:12, color:C.g600, lineHeight:1.6, marginBottom:12, borderTop:`1px solid ${C.g100}`, paddingTop:10 }}>{ad.desc || ad.description}</p>}
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
        {(ad.skills||[]).slice(0,3).map(s=><Pill key={s} text={s} small />)}
      </div>
      <div style={{ display:"flex", gap:12, fontSize:11, color:C.g400, marginBottom:12, flexWrap:"wrap" }}>
        <span>⏱ {ad.avail || ad.available}</span>
        <span>🗓 {ad.exp || ad.experience} dośw.</span>
        {ad.remote && <span style={{ color:C.green, fontWeight:600 }}>🏠 Zdalnie</span>}
        <span>📨 {ad.offers||0} ofert</span>
        <span>👁 {ad.views||0} wyświetleń</span>
        <span style={{ marginLeft:"auto", color:C.g200 }}>{ad.added}</span>
      </div>
      <div style={{ background:C.g50, borderRadius:8, padding:"10px 14px", border:`1px dashed ${C.g200}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
  <div style={{ fontSize:11, color:C.g400 }}>🔒 <span style={{ fontFamily:"monospace", letterSpacing:3, color:C.g200 }}>Jan K*****i · ☎ +48 5** *** ***</span></div>
  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
    {!preview && <Btn variant="primary" small onClick={onUnlock}>Odblokuj kontakt</Btn>}
    <button onClick={e=>{ e.stopPropagation(); onReport && onReport(); }} style={{ background:"transparent", border:"none", color:C.g400, fontSize:11, cursor:"pointer", padding:"4px 8px" }}>🚨 Zgłoś</button>
  </div>
</div>
{preview && <div style={{ display:"flex", gap:6, marginTop:10 }}>{(ad.contract||[]).map(c=><Pill key={c} text={c} small color={C.navy} />)}</div>}
    </div>
  );
}

function AdsView({ ads: realAds=[], initialCat="all" }) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Cała Polska");
  const [catFilter, setCatFilter] = useState(initialCat);
  const [sortBy, setSortBy] = useState("newest");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [unlocked, setUnlocked] = useState({});
  const [showUnlock, setShowUnlock] = useState(null);

  const filtered = realAds.filter(a=>{
    const q = search.toLowerCase();
    return (
      (!search || a.role.toLowerCase().includes(q) || (a.skills||[]).some(s=>s.toLowerCase().includes(q)) || (a.city||"").toLowerCase().includes(q)) &&
      (region==="Cała Polska" || a.region===region) &&
      (catFilter==="all" || a.cat===catFilter || a.category===catFilter) &&
      (!remoteOnly || a.remote)
    );
  }).sort((a,b)=>{
    if(sortBy==="newest") return b.id-a.id;
    if(sortBy==="offers") return (b.offers||0)-(a.offers||0);
    if(sortBy==="premium") return (b.premium?1:0)-(a.premium?1:0);
    return 0;
  });

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 20px" }}>
      {showUnlock && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setShowUnlock(null)}>
          <div style={{ background:C.white, borderRadius:18, padding:36, maxWidth:420, width:"90%", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:36, textAlign:"center", marginBottom:16 }}>🔓</div>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:20, color:C.g800, textAlign:"center", marginBottom:8 }}>Odblokuj dane kontaktowe</h3>
            <p style={{ fontSize:13, color:C.g600, textAlign:"center", marginBottom:24, lineHeight:1.6 }}>Uzyskaj dostęp do danych: <strong>{showUnlock.role}</strong> z {showUnlock.city}.</p>
            <div style={{ background:C.g50, borderRadius:10, padding:14, marginBottom:20, border:`1px solid ${C.g100}` }}>
              {[["Pojedyncze odblokowanie","9 zł brutto"],["Pakiet 10 odblokowań","79 zł brutto"]].map(([t,p])=>(
                <div key={t} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.g100}`, fontSize:13 }}>
                  <span style={{ color:C.g800 }}>{t}</span><span style={{ fontWeight:700, color:C.blue }}>{p}</span>
                </div>
              ))}
            </div>
            <Btn variant="primary" full onClick={()=>{ setUnlocked(u=>({...u,[showUnlock.id]:true})); setShowUnlock(null); }}>Odblokuj teraz (demo) →</Btn>
            <button onClick={()=>setShowUnlock(null)} style={{ width:"100%", background:"transparent", border:"none", color:C.g400, fontSize:12, marginTop:10, cursor:"pointer", padding:6 }}>Anuluj</button>
          </div>
        </div>
      )}

      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:26, fontWeight:900, color:C.g800, marginBottom:4 }}>Ogłoszenia pracowników</h1>
        <p style={{ color:C.g600, fontSize:14 }}>Przeglądaj profile i skontaktuj się bezpośrednio z kandydatem.</p>
      </div>

      <div style={{ background:C.white, borderRadius:14, padding:"16px 20px", border:`1px solid ${C.g100}`, marginBottom:20, boxShadow:"0 2px 10px rgba(26,115,232,0.05)" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <input placeholder="🔍  Zawód, umiejętność, miasto..." value={search} onChange={e=>setSearch(e.target.value)} style={{ padding:"9px 14px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.bg, color:"#1E293B" }} />
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <select value={region} onChange={e=>setRegion(e.target.value)} style={{ flex:1, minWidth:140, padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", color:"#1E293B" }}>
              {REGIONS.map(r=><option key={r}>{r}</option>)}
            </select>
            <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{ flex:1, minWidth:140, padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", color:"#1E293B" }}>
              <option value="all">Wszystkie branże</option>
              {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ flex:1, minWidth:120, padding:"9px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", color:"#1E293B" }}>
              <option value="newest">Najnowsze</option>
              <option value="offers">Najpopularniejsze</option>
              <option value="premium">Wyróżnione</option>
            </select>
            <label style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer", fontSize:13, fontWeight:500 }}>
              <input type="checkbox" checked={remoteOnly} onChange={e=>setRemoteOnly(e.target.checked)} style={{ accentColor:C.blue, width:15, height:15 }} />
              Tylko zdalne
            </label>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        <button onClick={()=>setCatFilter("all")} style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${catFilter==="all"?C.blue:C.g200}`, background:catFilter==="all"?C.blue:C.white, color:catFilter==="all"?"#fff":C.g600, fontSize:12, fontWeight:600, cursor:"pointer" }}>Wszystkie</button>
        {CATEGORIES.map(c=>(
          <button key={c.id} onClick={()=>setCatFilter(c.id)} style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${catFilter===c.id?C.blue:C.g200}`, background:catFilter===c.id?C.blue:C.white, color:catFilter===c.id?"#fff":C.g600, fontSize:12, fontWeight:600, cursor:"pointer" }}>{c.icon} {c.label}</button>
        ))}
      </div>

      <div style={{ fontSize:13, color:C.g400, marginBottom:16 }}>Znaleziono: <strong style={{ color:C.g800 }}>{filtered.length}</strong> ogłoszeń</div>

      <div className="grid-2">
        {filtered.map(ad=>(
          <div key={ad.id}>
            {unlocked[ad.id] ? (
              <div style={{ background:C.white, borderRadius:14, padding:"18px 20px", border:`2px solid ${C.green}40`, boxShadow:"0 4px 16px rgba(22,163,74,0.1)" }}>
                <div style={{ display:"flex", gap:12, marginBottom:12 }}>
                  <Avatar seed={ad.id} size={44} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:14, color:C.g800, marginBottom:2 }}>{ad.role}</div>
                    <div style={{ fontSize:11, color:C.g400 }}>{ad.city}, {ad.region}</div>
                  </div>
                  <div style={{ textAlign:"right" }}><div style={{ fontWeight:800, fontSize:14, color:C.navy }}>{ad.rate}</div></div>
                </div>
                <div style={{ background:C.green+"0f", borderRadius:8, padding:"12px 14px", border:`1px solid ${C.green}30` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:C.green, marginBottom:6 }}>✅ Dane kontaktowe odblokowane</div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.g800 }}>Jan Kowalski</div>
                  <div style={{ fontSize:13, color:C.blue, fontWeight:600 }}>☎ +48 500 123 456</div>
                </div>
              </div>
            ) : (
              <AdCard ad={ad} onUnlock={()=>setShowUnlock(ad)} />
            )}
          </div>
        ))}
      </div>

      {filtered.length===0 && (
        <div style={{ textAlign:"center", padding:"60px 20px", color:C.g400 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
          <div style={{ fontSize:16, fontWeight:600, color:C.g600, marginBottom:8 }}>Brak wyników</div>
          <div style={{ fontSize:13 }}>Zmień filtry lub wróć później.</div>
        </div>
      )}
    </div>
  );
}

function AddAdView({ setView }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ cat:"", role:"", exp:"", rateFrom:"", rateTo:"", region:"", city:"", avail:"", contract:[], remote:false, skills:"", desc:"", name:"", phone:"", email:"", premium:false });
  const [done, setDone] = useState(false);
  const up = (k,v) => setForm(f=>({...f,[k]:v}));
  const selCat = CATEGORIES.find(c=>c.id===form.cat);

  if(done) return (
    <div style={{ maxWidth:560, margin:"60px auto", padding:"0 20px", textAlign:"center" }}>
      <div style={{ fontSize:64, marginBottom:20 }}>🎉</div>
      <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:28, fontWeight:800, color:C.g800, marginBottom:12 }}>Ogłoszenie dodane!</h2>
      <p style={{ fontSize:14, color:C.g600, lineHeight:1.65, marginBottom:28 }}>Twoje ogłoszenie jest aktywne. Dane są anonimowe — firmy zobaczą tylko profil zawodowy.</p>
      <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
        <Btn variant="primary" onClick={()=>setView("ads")}>Zobacz ogłoszenia →</Btn>
        <Btn variant="outline" onClick={()=>{ setDone(false); setStep(1); }}>Dodaj kolejne</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:680, margin:"0 auto", padding:"36px 20px" }}>
      <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:26, fontWeight:800, color:C.g800, marginBottom:6 }}>Dodaj ogłoszenie</h1>
      <p style={{ color:C.g600, fontSize:14, marginBottom:28 }}>Twoje dane kontaktowe są ukryte do momentu wykupienia dostępu przez firmę.</p>
      <div style={{ display:"flex", gap:0, marginBottom:32 }}>
        {["Branża","Szczegóły","Warunki","Dane"].map((s,i)=>(
          <div key={s} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:step>i+1?C.green:step===i+1?C.blue:C.g200, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, marginBottom:4 }}>{step>i+1?"✓":i+1}</div>
            <div style={{ fontSize:10, color:step===i+1?C.blue:C.g400, fontWeight:step===i+1?700:400 }}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{ background:C.white, borderRadius:16, padding:"28px", border:`1px solid ${C.g100}`, boxShadow:"0 4px 20px rgba(26,115,232,0.06)" }}>
        {step===1 && (
          <div>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:17, color:C.g800, marginBottom:20 }}>Wybierz branżę</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:24 }}>
              {CATEGORIES.map(cat=>(
                <div key={cat.id} onClick={()=>up("cat",cat.id)} style={{ padding:"14px 16px", borderRadius:10, cursor:"pointer", border:`2px solid ${form.cat===cat.id?C.blue:C.g100}`, background:form.cat===cat.id?C.blue+"0a":C.bg, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:22 }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:form.cat===cat.id?C.blue:C.g800 }}>{cat.label}</div>
                    <div style={{ fontSize:11, color:C.g400 }}>{cat.sub.slice(0,2).join(", ")}</div>
                  </div>
                </div>
              ))}
            </div>
            {selCat && (
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Stanowisko</label>
                <select value={form.role} onChange={e=>up("role",e.target.value)} style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.bg }}>
                  <option value="">-- wybierz --</option>
                  {selCat.sub.map(s=><option key={s}>{s}</option>)}
                  <option value="Inne">Inne</option>
                </select>
              </div>
            )}
            <Btn variant="primary" onClick={()=>form.cat&&form.role&&setStep(2)} full>Dalej →</Btn>
          </div>
        )}
        {step===2 && (
          <div>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:17, color:C.g800, marginBottom:20 }}>Szczegóły oferty</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              {[["exp","Doświadczenie",["Brak","do 1 roku","1–3 lata","3–5 lat","5–10 lat","ponad 10 lat"]],["avail","Dostępność",["Od zaraz","Za 1 tydzień","Za 2 tygodnie","Za 1 miesiąc","Elastycznie"]]].map(([k,l,opts])=>(
                <div key={k}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>{l}</label>
                  <select value={form[k]} onChange={e=>up(k,e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none" }}>
                    <option value="">-- wybierz --</option>
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              {[["rateFrom","Stawka od (zł/h netto)","np. 30"],["rateTo","Stawka do (zł/h netto)","np. 45"]].map(([k,l,p])=>(
                <div key={k}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>{l}</label>
                  <input type="number" placeholder={p} value={form[k]} onChange={e=>up(k,e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none" }} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Umiejętności (oddziel przecinkiem)</label>
              <input placeholder="np. Uprawnienia SEP, Pomiary" value={form.skills} onChange={e=>up("skills",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none" }} />
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Opis (opcjonalnie)</label>
              <textarea rows={3} placeholder="Krótko o sobie..." value={form.desc} onChange={e=>up("desc",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", resize:"none", lineHeight:1.6 }} />
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <Btn variant="ghost" onClick={()=>setStep(1)}>← Wstecz</Btn>
              <Btn variant="primary" onClick={()=>setStep(3)} full>Dalej →</Btn>
            </div>
          </div>
        )}
        {step===3 && (
          <div>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:17, color:C.g800, marginBottom:20 }}>Warunki i lokalizacja</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Województwo</label>
                <select value={form.region} onChange={e=>up("region",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none" }}>
                  <option value="">-- wybierz --</option>
                  {REGIONS.filter(r=>r!=="Cała Polska").map(r=><option key={r}>{r}</option>)}
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
                    <input type="checkbox" checked={form.contract.includes(c)} onChange={e=>{ const nc=e.target.checked?[...form.contract,c]:form.contract.filter(x=>x!==c); up("contract",nc); }} style={{ accentColor:C.blue }} />{c}
                  </label>
                ))}
              </div>
            </div>
            <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, fontWeight:500, marginBottom:20 }}>
              <input type="checkbox" checked={form.remote} onChange={e=>up("remote",e.target.checked)} style={{ accentColor:C.blue, width:16, height:16 }} />
              Możliwa praca zdalna / hybrydowa
            </label>
            <div style={{ display:"flex", gap:10 }}>
              <Btn variant="ghost" onClick={()=>setStep(2)}>← Wstecz</Btn>
              <Btn variant="primary" onClick={()=>setStep(4)} full>Dalej →</Btn>
            </div>
          </div>
        )}
        {step===4 && (
          <div>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:17, color:C.g800, marginBottom:8 }}>Dane kontaktowe</h3>
            <div style={{ background:C.blue+"0a", borderRadius:10, padding:"12px 14px", marginBottom:20, border:`1px solid ${C.blue}20`, fontSize:12, color:C.blue }}>
              🔒 Twoje dane są <strong>w pełni anonimowe</strong>. Firma zobaczy je dopiero po wykupieniu dostępu.
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              {[["name","Imię i nazwisko","Jan Kowalski"],["phone","Telefon","+48 500 000 000"]].map(([k,l,p])=>(
                <div key={k}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>{l}</label>
                  <input placeholder={p} value={form[k]} onChange={e=>up(k,e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none" }} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>E-mail</label>
              <input placeholder="jan@example.pl" value={form.email} onChange={e=>up("email",e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none" }} />
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <Btn variant="ghost" onClick={()=>setStep(3)}>← Wstecz</Btn>
              <Btn variant="primary" onClick={()=>setDone(true)} full>✅ Opublikuj ogłoszenie</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RankingView() {
  const data = [
    { pos:1, name:"TechCorp Sp. z o.o.",  industry:"Software House", score:98, rating:4.9, reviews:124, resp:"< 2h",  pay:5.0, badge:"🥇 Złoty",     bc:C.yellow },
    { pos:2, name:"Budmax S.A.",           industry:"Budowlanka",     score:93, rating:4.8, reviews:89,  resp:"< 3h",  pay:4.9, badge:"🥈 Srebrny",    bc:C.g400 },
    { pos:3, name:"LogiHub",               industry:"Transport",      score:88, rating:4.6, reviews:67,  resp:"< 5h",  pay:4.7, badge:"🥉 Brązowy",    bc:C.orange },
    { pos:4, name:"Medianova S.A.",        industry:"E-commerce",     score:82, rating:4.4, reviews:54,  resp:"< 8h",  pay:4.5, badge:"✅ Zaufany",    bc:C.blue },
    { pos:5, name:"ProdEx Fabryka",        industry:"Produkcja",      score:76, rating:4.1, reviews:41,  resp:"< 12h", pay:4.2, badge:"✅ Zaufany",    bc:C.blue },
    { pos:6, name:"HandelPro",             industry:"Handel",         score:68, rating:3.8, reviews:28,  resp:"< 24h", pay:3.9, badge:"⚪ Podstawowy", bc:C.g400 },
    { pos:7, name:"QuickJobs Agencja",     industry:"Agencja pracy",  score:61, rating:3.5, reviews:19,  resp:"> 24h", pay:3.4, badge:"⚠️ Nisko ocen.",bc:C.red },
  ];
  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"40px 20px" }}>
      <div style={{ textAlign:"center", marginBottom:44 }}>
        <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:32, fontWeight:900, color:C.g800, marginBottom:10 }}>Ranking Pracodawców</h1>
        <p style={{ color:C.g600, fontSize:14, maxWidth:500, margin:"0 auto" }}>Oceny wystawiane przez pracowników.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.15fr 1fr", gap:14, marginBottom:36, alignItems:"end" }}>
        {[data[1],data[0],data[2]].map((e,i)=>{
          const isPrimary=i===1;
          return (
            <div key={e.pos} style={{ background:isPrimary?`linear-gradient(145deg,${C.navy},${C.blue})`:C.white, borderRadius:16, padding:isPrimary?"32px 24px":"24px 20px", textAlign:"center", border:isPrimary?"none":`1px solid ${C.g100}`, boxShadow:isPrimary?"0 12px 40px rgba(26,115,232,0.22)":"0 4px 14px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>{["🥈","🥇","🥉"][i]}</div>
              <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:isPrimary?"#fff":C.g800, marginBottom:4 }}>{e.name}</div>
              <div style={{ fontSize:11, color:isPrimary?"rgba(255,255,255,0.6)":C.g400, marginBottom:12 }}>{e.industry}</div>
              <div style={{ fontFamily:"Sora,sans-serif", fontSize:36, fontWeight:900, color:isPrimary?"#93C5FD":C.blue }}>{e.score}</div>
              <div style={{ fontSize:11, color:isPrimary?"rgba(255,255,255,0.5)":C.g400 }}>punktów</div>
            </div>
          );
        })}
      </div>
      <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.g100}`, overflow:"hidden" }}>
        {data.map((e,i)=>(
          <div key={e.pos} style={{ display:"flex", padding:"14px 20px", borderBottom:i<data.length-1?`1px solid ${C.g100}`:"none", alignItems:"center", gap:12 }}>
            <span style={{ fontFamily:"Sora,sans-serif", fontSize:15, fontWeight:800, color:C.g400, minWidth:24 }}>{e.pos}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:13, color:C.g800 }}>{e.name}</div>
              <div style={{ fontSize:11, color:C.g400 }}>{e.industry} · {e.reviews} opinii</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:17, color:e.score>=90?C.blue:e.score>=75?C.green:C.orange }}>{e.score}</div>
              <span style={{ fontSize:11, fontWeight:700, color:e.bc, background:e.bc+"18", padding:"2px 8px", borderRadius:20 }}>{e.badge}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HowItWorksView({ setView }) {
  const faq = [
    { q:"Czy ogłoszenie jest płatne?", a:"Dla pracownika ogłoszenie jest zawsze bezpłatne. Firmy płacą za odblokowanie danych kontaktowych." },
    { q:"Czy moje dane są widoczne publicznie?", a:"Nie. Wyświetlany jest tylko Twój profil zawodowy. Imię i telefon są ukryte." },
    { q:"Co się dzieje gdy firma odblokuje moje dane?", a:"Dostajesz powiadomienie email. To Ty decydujesz czy odebrać telefon i podjąć rozmowę." },
    { q:"Jak długo aktywne jest ogłoszenie?", a:"Ogłoszenie jest aktywne przez 30 dni. Możesz je przedłużyć lub usunąć w każdej chwili." },
    { q:"Jak firmy są weryfikowane?", a:"Każda firma musi podać NIP, który weryfikujemy w GUS." },
  ];
  const [open, setOpen] = useState(null);
  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:"40px 20px" }}>
      <div style={{ textAlign:"center", marginBottom:52 }}>
        <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:32, fontWeight:900, color:C.g800, marginBottom:12 }}>Jak to działa?</h1>
        <p style={{ color:C.g600, fontSize:15 }}>Prosty schemat dla pracownika i dla firmy.</p>
      </div>
      <div style={{ marginBottom:48 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${C.blue},${C.navy})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>👷</div>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:20, fontWeight:800, color:C.g800 }}>Dla pracownika</h2>
        </div>
        {[
          { icon:"📝", t:"Rejestrujesz się i wypełniasz profil", d:"Zawód, doświadczenie, stawka, region. Zajmuje 5 minut." },
          { icon:"🔒", t:"Twoje dane są anonimowe", d:"Firmy widzą tylko Twój profil zawodowy." },
          { icon:"📬", t:"Firmy przeglądają ogłoszenia", d:"Pracodawcy przeszukują bazę wg branży, regionu, stawki." },
          { icon:"📞", t:"Firma wykupuje Twój kontakt", d:"Gdy firma jest zainteresowana, płaci za odblokowanie." },
          { icon:"🤝", t:"Negocjujesz i decydujesz", d:"Sam podejmujesz decyzję. Żadnego przymusu." },
        ].map((s,i)=>(
          <div key={i} style={{ display:"flex", gap:16, paddingBottom:24 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
              <div style={{ width:44, height:44, borderRadius:12, background:C.blue+"12", border:`2px solid ${C.blue}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{s.icon}</div>
              {i<4 && <div style={{ width:2, flex:1, background:`linear-gradient(to bottom,${C.blue}30,${C.blue}08)`, marginTop:6 }} />}
            </div>
            <div style={{ paddingTop:8 }}>
              <div style={{ fontWeight:700, fontSize:14, color:C.g800, marginBottom:3 }}>{s.t}</div>
              <div style={{ fontSize:13, color:C.g600, lineHeight:1.6 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
      <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:22, fontWeight:800, color:C.g800, marginBottom:20 }}>Najczęstsze pytania</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {faq.map((f,i)=>(
          <div key={i} style={{ background:C.white, borderRadius:12, border:`1px solid ${C.g100}`, overflow:"hidden" }}>
            <button onClick={()=>setOpen(open===i?null:i)} style={{ width:"100%", padding:"16px 20px", background:"transparent", border:"none", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", textAlign:"left" }}>
              <span style={{ fontWeight:600, fontSize:14, color:C.g800 }}>{f.q}</span>
              <span style={{ color:C.blue, fontSize:18, transform:open===i?"rotate(45deg)":"none", transition:"0.2s" }}>+</span>
            </button>
            {open===i && <div style={{ padding:"0 20px 16px", fontSize:13, color:C.g600, lineHeight:1.7 }}>{f.a}</div>}
          </div>
        ))}
      </div>
      <div style={{ textAlign:"center", marginTop:40 }}>
        <Btn variant="primary" onClick={()=>setView("addad")}>📝 Dodaj ogłoszenie za darmo →</Btn>
      </div>
    </div>
  );
}

function Footer({ setView }) {
  return (
    <footer style={{ background:C.navy, color:"rgba(255,255,255,0.65)", padding:"44px 20px 24px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="grid-footer" style={{ marginBottom:32 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <div style={{ width:28, height:28, borderRadius:7, background:C.blue, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"#fff", fontWeight:900, fontFamily:"Sora,sans-serif", fontSize:14 }}>R</span>
              </div>
              <span style={{ fontFamily:"Sora,sans-serif", fontWeight:800, color:"#fff", fontSize:14 }}>rynekpracownika.pl</span>
            </div>
            <p style={{ fontSize:12, lineHeight:1.7 }}>Pierwsza polska platforma odwróconych ogłoszeń o pracę.</p>
          </div>
          {[
            { title:"Pracownik", links:["Dodaj ogłoszenie","Jak to działa","Wyróżnij profil","FAQ"] },
            { title:"Pracodawca", links:["Szukaj pracowników","Cennik","Weryfikacja NIP","Ranking firm"] },
            { title:"Portal", links:["O nas","Blog","Kontakt","Regulamin","RODO"] },
          ].map(col=>(
            <div key={col.title}>
              <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, color:"#fff", fontSize:11, marginBottom:12, textTransform:"uppercase", letterSpacing:1.2 }}>{col.title}</div>
              {col.links.map(l=>(
                <div key={l} onClick={()=>{ 
                if(l==="Regulamin") window.location.href="/regulamin"; 
                else if(l==="RODO") window.location.href="/polityka-prywatnosci";
                else if(l==="Kontakt") window.location.href="/kontakt";
                else if(l==="Cennik") window.location.href="/dla-pracodawcy";
                else if(l==="Szukaj pracowników") window.location.href="/dla-pracodawcy";
                else if(l==="Dodaj ogłoszenie") window.location.href="/rejestracja";
                else if(l==="Jak to działa") window.location.href="/howitworks";
                else if(l==="Wyróżnij profil") window.location.href="/rejestracja";
                else if(l==="FAQ") window.location.href="/howitworks";
                else if(l==="Ranking firm") window.location.href="/ranking";
                else if(l==="Weryfikacja NIP") window.location.href="/dla-pracodawcy";
                else if(l==="O nas") window.location.href="/o-nas";
                else if(l==="Blog") window.location.href="/blog";
              
              }} style={{ fontSize:12, marginBottom:7, cursor:"pointer" }}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:18, display:"flex", justifyContent:"space-between", fontSize:11, flexWrap:"wrap", gap:8 }}>
          <span>© 2026 rynekpracownika.pl — Wszelkie prawa zastrzeżone</span>
          <span>Polityka prywatności · Cookies · RODO</span>
        </div>
      </div>
    </footer>
  );
}

function ReportModal({ ad, onClose, user }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const reasons = ["Spam", "Nieodpowiednie treści", "Fałszywe dane", "Duplikat ogłoszenia", "Inne"];

  async function handleSubmit() {
    if (!reason) { alert("Wybierz powód zgłoszenia!"); return; }
    setSending(true);
    await supabase.from("reports").insert({
      ad_id: ad.id,
      reporter_id: user?.id || null,
      reason,
      details,
      status: "pending",
    });
    setSending(false);
    setDone(true);
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:18, padding:32, maxWidth:420, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }} onClick={e=>e.stopPropagation()}>
        {done ? (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:20, color:"#1E293B", marginBottom:8 }}>Zgłoszenie wysłane!</h3>
            <p style={{ fontSize:14, color:"#475569", marginBottom:24 }}>Dziękujemy za zgłoszenie. Admin sprawdzi ogłoszenie.</p>
            <button onClick={onClose} style={{ background:`linear-gradient(135deg,#1A73E8,#0D47A1)`, color:"#fff", border:"none", padding:"11px 28px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>Zamknij</button>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:18, color:"#1E293B" }}>🚨 Zgłoś ogłoszenie</h3>
              <button onClick={onClose} style={{ background:"transparent", border:"none", fontSize:20, cursor:"pointer", color:"#94A3B8" }}>✕</button>
            </div>
            <div style={{ background:"#F5F7FA", borderRadius:8, padding:"10px 14px", marginBottom:20, fontSize:13, color:"#475569" }}>
              <strong>{ad.role}</strong> · {ad.city}, {ad.region}
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Powód zgłoszenia</label>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {reasons.map(r=>(
                  <label key={r} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, color:"#1E293B" }}>
                    <input type="radio" name="reason" value={r} checked={reason===r} onChange={()=>setReason(r)} style={{ accentColor:"#1A73E8" }} />
                    {r}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Szczegóły (opcjonalnie)</label>
              <textarea rows={3} value={details} onChange={e=>setDetails(e.target.value)} placeholder="Opisz problem..." style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:"1.5px solid #CBD5E1", fontSize:13, outline:"none", resize:"none", lineHeight:1.6, color:"#1E293B" }} />
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={onClose} style={{ flex:1, padding:"11px", borderRadius:8, border:"1.5px solid #CBD5E1", background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", color:"#475569" }}>Anuluj</button>
              <button onClick={handleSubmit} disabled={sending} style={{ flex:1, background:`linear-gradient(135deg,#DC2626,#991B1B)`, color:"#fff", border:"none", padding:"11px", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                {sending ? "Wysyłanie..." : "🚨 Wyślij zgłoszenie"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [realAds, setRealAds] = useState(null);
  const [activeCat, setActiveCat] = useState("all");
  const [adsCount, setAdsCount] = useState(0);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [reportAd, setReportAd] = useState(null);

useEffect(() => {
  async function loadAds() {
    const { data } = await supabase.from("ads").select("*, profiles(name, phone, email)").eq("status","active").order("created_at",{ ascending:false }).limit(12);
    if(data) setRealAds(data);

    const { count } = await supabase.from("ads").select("*", { count:"exact", head:true }).eq("status","active");
    if(count) setAdsCount(count);

    const { data: { user } } = await supabase.auth.getUser();
    if(user) {
      setUser(user);
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if(prof) setProfile(prof);
    }
  }
  loadAds();
}, []);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'DM Sans',sans-serif; }
        select, input, textarea, button { font-family:inherit; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:3px; }
        .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
        .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .grid-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        .grid-footer { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:28px; }
        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); }
        .hide-mobile { display:flex !important; }
        .show-mobile { display:none !important; }
        .hero-title { font-size:46px; }
        .hero-padding { padding:64px 20px 80px; }
        @media (max-width:768px) {
          .grid-4 { grid-template-columns:repeat(2,1fr); }
          .grid-3 { grid-template-columns:1fr; }
          .grid-2 { grid-template-columns:1fr; }
          .grid-footer { grid-template-columns:1fr 1fr; gap:20px; }
          .stats-grid { grid-template-columns:repeat(2,1fr); }
          .hide-mobile { display:none !important; }
          .show-mobile { display:flex !important; }
          .hero-title { font-size:32px; }
          .hero-padding { padding:40px 20px 56px; }
        }
      `}</style>

{reportAd && (
        <ReportModal ad={reportAd} onClose={()=>setReportAd(null)} user={user} />
      )}

      {showAuthModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={()=>setShowAuthModal(false)}>
          <div style={{ background:"#fff", borderRadius:18, padding:36, maxWidth:400, width:"100%", textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:48, marginBottom:16 }}>👷</div>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:22, color:"#1E293B", marginBottom:8 }}>Dodaj ogłoszenie</h3>
            <p style={{ fontSize:14, color:"#475569", marginBottom:28, lineHeight:1.6 }}>Zaloguj się lub zarejestruj żeby dodać ogłoszenie ze swoją stawką.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <button onClick={()=>window.location.href="/logowanie"} style={{ width:"100%", background:`linear-gradient(135deg,#1A73E8,#0D47A1)`, color:"#fff", border:"none", padding:"13px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>Mam już konto → Zaloguj się</button>
              <button onClick={()=>window.location.href="/rejestracja?type=worker"} style={{ width:"100%", background:"transparent", color:"#1A73E8", border:"1.5px solid #1A73E8", padding:"13px", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>Nowy użytkownik → Zarejestruj się</button>
            </div>
            <button onClick={()=>setShowAuthModal(false)} style={{ marginTop:14, background:"transparent", border:"none", color:"#94A3B8", fontSize:12, cursor:"pointer" }}>Anuluj</button>
          </div>
        </div>
      )}

      <Navbar view={view} setView={setView} />
      <main>
        {view==="home" && <HomeView setView={setView} setActiveCat={setActiveCat} ads={realAds} adsCount={adsCount} user={user} profile={profile} setShowAuthModal={setShowAuthModal} setReportAd={setReportAd} />}
        {view==="ads"        && <AdsView ads={realAds} initialCat={activeCat} />}
        {view==="addad"      && <AddAdView setView={setView} />}
        {view==="ranking"    && <RankingView />}
        {view==="howitworks" && <HowItWorksView setView={setView} />}
      </main>
      <Footer setView={setView} />
    </div>
  );
}