"use client";
import { useRouter } from "next/navigation";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
  white:"#FFFFFF", g50:"#F8FAFC", g100:"#E8ECF0",
  g200:"#CBD5E1", g400:"#94A3B8", g600:"#475569",
  g800:"#1E293B", green:"#16A34A", orange:"#EA580C",
  yellow:"#F59E0B",
};

export default function DlaPracodawcy() {
  const router = useRouter();

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .grid-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }
        @media(max-width:768px) {
          .grid-3 { grid-template-columns:1fr; }
          .grid-2 { grid-template-columns:1fr; }
          .hero-title { font-size:32px !important; }
          .hero-padding { padding:48px 20px !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ background:"rgba(255,255,255,0.97)", borderBottom:`1px solid ${C.g100}`, padding:"0 20px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 12px rgba(13,71,161,0.07)" }}>
        <div onClick={()=>router.push("/")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:`linear-gradient(135deg,${C.blue},${C.navy})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontWeight:900, fontFamily:"Sora,sans-serif", fontSize:16 }}>R</span>
          </div>
          <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:C.navy }}>
            rynek<span style={{ color:C.blue }}>pracownika</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>router.push("/logowanie")} style={{ background:"transparent", border:`1.5px solid ${C.blue}`, color:C.blue, padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>Zaloguj</button>
          <button onClick={()=>router.push("/rejestracja")} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, border:"none", color:"#fff", padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>Zarejestruj firmę →</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero-padding" style={{ background:`linear-gradient(150deg,${C.navy} 0%,#1565C0 55%,${C.blue} 100%)`, padding:"80px 20px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        {[500,750,1000].map((s,i)=>(
          <div key={i} style={{ position:"absolute", width:s, height:s, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.05)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none" }}/>
        ))}
        <div style={{ maxWidth:760, margin:"0 auto", position:"relative" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.12)", borderRadius:20, padding:"5px 16px", marginBottom:24, border:"1px solid rgba(255,255,255,0.18)", fontSize:12, color:"rgba(255,255,255,0.9)", fontWeight:500 }}>
            🏢 Dla pracodawców i firm rekrutujących
          </div>
          <h1 className="hero-title" style={{ fontFamily:"Sora,sans-serif", fontWeight:900, fontSize:48, color:"#fff", lineHeight:1.15, marginBottom:20 }}>
            Znajdź pracownika,<br/>
            <span style={{ color:"#93C5FD" }}>który już chce pracować.</span>
          </h1>
          <p style={{ fontSize:18, color:"rgba(255,255,255,0.75)", maxWidth:540, margin:"0 auto 40px", lineHeight:1.65 }}>
            Przeglądaj profile elektryków, kierowców, spawaczy i setek innych zawodów. Płacisz tylko za kontakt który Cię interesuje.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={()=>router.push("/rejestracja")} style={{ background:"#fff", color:C.navy, border:"none", padding:"14px 32px", borderRadius:10, fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"Sora,sans-serif", boxShadow:"0 6px 20px rgba(0,0,0,0.18)" }}>
              🚀 Zacznij szukać za darmo
            </button>
            <button onClick={()=>router.push("/logowanie")} style={{ background:"rgba(255,255,255,0.12)", color:"#fff", border:"1.5px solid rgba(255,255,255,0.28)", padding:"14px 28px", borderRadius:10, fontSize:15, fontWeight:600, cursor:"pointer" }}>
              Mam już konto →
            </button>
          </div>
        </div>
      </div>

      {/* PROBLEM */}
      <div style={{ background:C.white, padding:"60px 20px", borderBottom:`1px solid ${C.g100}` }}>
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:32, fontWeight:800, color:C.g800, marginBottom:16 }}>
            Koniec z przeglądaniem setek CV.
          </h2>
          <p style={{ fontSize:16, color:C.g600, maxWidth:600, margin:"0 auto 48px", lineHeight:1.7 }}>
            Na rynekpracownika.pl to pracownicy ogłaszają się ze swoją stawką i dostępnością. Ty tylko wybierasz kogo chcesz zatrudnić.
          </p>
          <div className="grid-3">
            {[
              { icon:"⏱️", title:"Oszczędność czasu", desc:"Nie czekasz na odpowiedzi. Profil pracownika masz od razu — ze stawką, doświadczeniem i dostępnością." },
              { icon:"🎯", title:"Tylko aktywni kandydaci", desc:"Każdy profil to osoba która aktywnie szuka pracy. Zero nieaktualnych ogłoszeń." },
              { icon:"💰", title:"Płacisz za wyniki", desc:"Nie płacisz za ogłoszenie. Płacisz tylko gdy znajdziesz kogoś kto Cię interesuje." },
            ].map(s=>(
              <div key={s.title} style={{ background:C.g50, borderRadius:16, padding:28, border:`1px solid ${C.g100}`, textAlign:"left" }}>
                <div style={{ fontSize:36, marginBottom:14 }}>{s.icon}</div>
                <h3 style={{ fontFamily:"Sora,sans-serif", fontSize:17, fontWeight:700, color:C.g800, marginBottom:8 }}>{s.title}</h3>
                <p style={{ fontSize:13, color:C.g600, lineHeight:1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* JAK TO DZIAŁA */}
      <div style={{ background:C.g50, padding:"60px 20px", borderBottom:`1px solid ${C.g100}` }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:C.blue, textTransform:"uppercase", marginBottom:10 }}>Proces</div>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:32, fontWeight:800, color:C.g800 }}>Jak to działa dla firmy?</h2>
          </div>
          <div className="grid-3">
            {[
              { step:"1", icon:"🔍", title:"Szukasz profili", desc:"Filtrujesz po branży, regionie i stawce. Widzisz profile pracowników którzy pasują do Twoich potrzeb." },
              { step:"2", icon:"👤", title:"Przeglądasz profil", desc:"Widzisz doświadczenie, umiejętności, oczekiwaną stawkę i dostępność. Dane kontaktowe są ukryte." },
              { step:"3", icon:"🔓", title:"Odblokowujesz kontakt", desc:"Płacisz jednorazowo za odblokowanie danych. Dzwonisz bezpośrednio do kandydata." },
            ].map(s=>(
              <div key={s.step} style={{ background:C.white, borderRadius:16, padding:28, border:`1px solid ${C.g100}`, position:"relative" }}>
                <div style={{ position:"absolute", top:-14, left:24, width:28, height:28, borderRadius:8, background:`linear-gradient(135deg,${C.blue},${C.navy})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:800 }}>{s.step}</div>
                <div style={{ fontSize:36, marginBottom:14, marginTop:8 }}>{s.icon}</div>
                <h3 style={{ fontFamily:"Sora,sans-serif", fontSize:16, fontWeight:700, color:C.g800, marginBottom:8 }}>{s.title}</h3>
                <p style={{ fontSize:13, color:C.g600, lineHeight:1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CENNIK */}
      <div style={{ background:C.white, padding:"60px 20px", borderBottom:`1px solid ${C.g100}` }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:C.blue, textTransform:"uppercase", marginBottom:10 }}>Cennik</div>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:32, fontWeight:800, color:C.g800, marginBottom:12 }}>Przejrzyste ceny</h2>
            <p style={{ fontSize:15, color:C.g600 }}>Płacisz tylko za kontakty które Cię interesują. Zero ukrytych kosztów.</p>
          </div>
          <div className="grid-2">
            {[
              {
                icon:"🔓",
                title:"Pojedyncze odblokowanie",
                price:"9 zł",
                unit:"brutto / kontakt",
                desc:"Idealne na start. Odblokujesz dane jednego pracownika.",
                features:["1 odblokowanie kontaktu","Dostęp do telefonu i emaila","Ważność bezterminowa"],
                color:C.blue,
                primary:false,
              },
              {
                icon:"📦",
                title:"Pakiet 10 kontaktów",
                price:"79 zł",
                unit:"brutto / 10 kontaktów",
                desc:"Oszczędzasz 11 zł. Idealne przy aktywnej rekrutacji.",
                features:["10 odblokowań kontaktów","Dostęp do telefonu i emaila","Ważność bezterminowa","Oszczędzasz 11 zł"],
                color:C.navy,
                primary:true,
              },
            ].map(p=>(
              <div key={p.title} style={{ background:p.primary?`linear-gradient(145deg,${C.navy},${C.blue})`:C.white, borderRadius:20, padding:32, border:p.primary?"none":`1.5px solid ${C.g200}`, boxShadow:p.primary?"0 12px 40px rgba(26,115,232,0.22)":"0 4px 14px rgba(0,0,0,0.05)", position:"relative" }}>
                {p.primary && <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg,${C.yellow},${C.orange})`, color:"#fff", fontSize:10, fontWeight:800, padding:"4px 14px", borderRadius:20, letterSpacing:1 }}>★ NAJPOPULARNIEJSZY</div>}
                <div style={{ fontSize:32, marginBottom:12 }}>{p.icon}</div>
                <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:16, color:p.primary?"#fff":C.g800, marginBottom:8 }}>{p.title}</div>
                <div style={{ fontFamily:"Sora,sans-serif", fontWeight:900, fontSize:42, color:p.primary?"#fff":C.navy, lineHeight:1, marginBottom:4 }}>{p.price}</div>
                <div style={{ fontSize:12, color:p.primary?"rgba(255,255,255,0.6)":C.g400, marginBottom:16 }}>{p.unit}</div>
                <p style={{ fontSize:13, color:p.primary?"rgba(255,255,255,0.75)":C.g600, marginBottom:20, lineHeight:1.6 }}>{p.desc}</p>
                <div style={{ marginBottom:24 }}>
                  {p.features.map(f=>(
                    <div key={f} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, fontSize:13, color:p.primary?"rgba(255,255,255,0.85)":C.g600 }}>
                      <span style={{ color:p.primary?"#93C5FD":C.green, fontWeight:700 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <button onClick={()=>router.push("/rejestracja")} style={{ width:"100%", background:p.primary?"#fff":`linear-gradient(135deg,${C.blue},${C.navy})`, color:p.primary?C.navy:"#fff", border:"none", padding:"12px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                  Zarejestruj się →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BRANŻE */}
      <div style={{ background:C.g50, padding:"60px 20px", borderBottom:`1px solid ${C.g100}` }}>
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:28, fontWeight:800, color:C.g800, marginBottom:12 }}>Znajdziesz pracowników z każdej branży</h2>
          <p style={{ fontSize:14, color:C.g600, marginBottom:36 }}>Aktywne ogłoszenia z całej Polski</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center" }}>
            {[
              "🏗️ Budowlanka","🏭 Produkcja","🚚 Transport","🛒 Handel",
              "🔧 Usługi","💻 IT","📋 Biuro / Administracja","🎓 Edukacja",
            ].map(b=>(
              <div key={b} style={{ background:C.white, borderRadius:10, padding:"10px 20px", border:`1px solid ${C.g200}`, fontSize:14, fontWeight:500, color:C.g800 }}>{b}</div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, padding:"70px 20px", textAlign:"center" }}>
        <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:34, fontWeight:900, color:"#fff", marginBottom:14 }}>
          Gotowy żeby znaleźć pracownika?
        </h2>
        <p style={{ color:"rgba(255,255,255,0.72)", fontSize:15, marginBottom:36, maxWidth:480, margin:"0 auto 36px" }}>
          Rejestracja jest bezpłatna. Płacisz dopiero gdy znajdziesz kogoś kogo chcesz zatrudnić.
        </p>
        <button onClick={()=>router.push("/rejestracja")} style={{ background:"#fff", color:C.navy, border:"none", padding:"14px 36px", borderRadius:10, fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"Sora,sans-serif", boxShadow:"0 6px 20px rgba(0,0,0,0.15)" }}>
          Zarejestruj firmę za darmo →
        </button>
      </div>

      {/* FOOTER */}
      <footer style={{ background:C.navy, color:"rgba(255,255,255,0.6)", padding:"24px 20px", textAlign:"center", fontSize:12 }}>
        <div onClick={()=>router.push("/")} style={{ cursor:"pointer", fontFamily:"Sora,sans-serif", fontWeight:800, color:"#fff", fontSize:14, marginBottom:8 }}>
          rynek<span style={{ color:C.blue }}>pracownika</span>.pl
        </div>
        <div>© 2025 rynekpracownika.pl — Wszelkie prawa zastrzeżone</div>
      </footer>
    </div>
  );
}