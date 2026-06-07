"use client";
import { useRouter } from "next/navigation";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
  white:"#FFFFFF", g100:"#E8ECF0", g200:"#CBD5E1",
  g400:"#94A3B8", g600:"#475569", g800:"#1E293B",
  green:"#16A34A",
};

export default function ONas() {
  const router = useRouter();

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

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
        <button onClick={()=>router.push("/")} style={{ background:"transparent", border:"none", color:C.g600, padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>← Strona główna</button>
      </nav>

      {/* HERO */}
      <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.blue} 100%)`, padding:"80px 20px", textAlign:"center" }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <div style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.7)", letterSpacing:2, textTransform:"uppercase", marginBottom:20 }}>O nas</div>
          <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:42, fontWeight:900, color:"#fff", lineHeight:1.2, marginBottom:24 }}>
            Nie szukaj pracy.<br/>
            <span style={{ color:"#93C5FD" }}>Niech praca znajdzie Ciebie.</span>
          </h1>
          <p style={{ fontSize:17, color:"rgba(255,255,255,0.85)", lineHeight:1.7, marginBottom:32 }}>
            Jesteśmy pierwszą polską platformą odwróconych ogłoszeń o pracę. Zmieniamy reguły gry — to pracodawca szuka pracownika, nie odwrotnie.
          </p>
          <button onClick={()=>router.push("/rejestracja?type=worker")} style={{ background:"#fff", color:C.navy, border:"none", padding:"14px 32px", borderRadius:10, fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"Sora,sans-serif", boxShadow:"0 6px 20px rgba(0,0,0,0.2)" }}>
            Dołącz za darmo →
          </button>
        </div>
      </div>

      <div style={{ maxWidth:800, margin:"0 auto", padding:"60px 20px" }}>

        {/* MISJA */}
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.blue, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Nasza misja</div>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:32, fontWeight:900, color:C.g800, marginBottom:20 }}>
            Odwrócony rynek pracy
          </h2>
          <p style={{ fontSize:16, color:C.g600, lineHeight:1.8, maxWidth:600, margin:"0 auto" }}>
            Przez lata to pracownicy musieli przeglądać setki ofert, pisać CV i czekać na odpowiedź. My odwróciliśmy ten model. Teraz Ty podajesz swoje warunki — stawkę, region, dostępność — a firmy same do Ciebie dzwonią.
          </p>
        </div>

        {/* DLA PRACOWNIKA I PRACODAWCY */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:60 }}>
          <div style={{ background:C.white, borderRadius:16, padding:32, border:`1px solid ${C.g100}`, boxShadow:"0 4px 20px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize:40, marginBottom:16 }}>👷</div>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontSize:20, fontWeight:800, color:C.g800, marginBottom:12 }}>Dla pracownika</h3>
            <p style={{ fontSize:14, color:C.g600, lineHeight:1.7, marginBottom:20 }}>
              Dodaj ogłoszenie ze swoją stawką i regionem. Twoje dane są anonimowe — firmy widzą tylko Twoje umiejętności i stawkę. Gdy firma odblokuje Twój kontakt — dostajesz powiadomienie email.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {["✅ Zawsze za darmo","✅ Pełna anonimowość","✅ Ty decydujesz czy odebrać telefon","✅ Firmy konkurują o Ciebie"].map(item=>(
                <div key={item} style={{ fontSize:13, color:C.g800, fontWeight:500 }}>{item}</div>
              ))}
            </div>
          </div>
          <div style={{ background:C.white, borderRadius:16, padding:32, border:`1px solid ${C.g100}`, boxShadow:"0 4px 20px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize:40, marginBottom:16 }}>🏢</div>
            <h3 style={{ fontFamily:"Sora,sans-serif", fontSize:20, fontWeight:800, color:C.g800, marginBottom:12 }}>Dla pracodawcy</h3>
            <p style={{ fontSize:14, color:C.g600, lineHeight:1.7, marginBottom:20 }}>
              Koniec z przeglądaniem CV. Kandydat już na Ciebie czeka. Przeglądaj profile, filtruj po zawodzie i regionie, odblokuj kontakt tylko do tych których naprawdę chcesz.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {["✅ Tylko zweryfikowane firmy z NIP","✅ Płacisz tylko za kontakt","✅ Bez abonamentu","✅ Oszczędność czasu na rekrutacji"].map(item=>(
                <div key={item} style={{ fontSize:13, color:C.g800, fontWeight:500 }}>{item}</div>
              ))}
            </div>
          </div>
        </div>

        {/* JAK TO DZIAŁA */}
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.blue, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Jak to działa</div>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:32, fontWeight:900, color:C.g800, marginBottom:40 }}>Prosto i szybko</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { step:"1", icon:"📝", title:"Dodaj ogłoszenie", desc:"Wypełnij formularz — branża, stawka, region. Zajmuje 2 minuty." },
              { step:"2", icon:"👀", title:"Firmy przeglądają", desc:"Pracodawcy widzą Twój profil bez danych kontaktowych." },
              { step:"3", icon:"📞", title:"Pracodawca dzwoni", desc:"Firma odblokuje kontakt i dzwoni do Ciebie. Ty decydujesz." },
            ].map(item=>(
              <div key={item.step} style={{ background:C.white, borderRadius:14, padding:24, border:`1px solid ${C.g100}` }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", fontFamily:"Sora,sans-serif", fontWeight:900, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>{item.step}</div>
                <div style={{ fontSize:32, marginBottom:12 }}>{item.icon}</div>
                <div style={{ fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:15, color:C.g800, marginBottom:8 }}>{item.title}</div>
                <div style={{ fontSize:13, color:C.g600, lineHeight:1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius:20, padding:"48px 40px", textAlign:"center" }}>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:28, fontWeight:900, color:"#fff", marginBottom:12 }}>
            Gotowy na odwrócony rynek pracy?
          </h2>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.8)", marginBottom:28 }}>
            Dołącz do pierwszej polskiej platformy gdzie pracodawca szuka Ciebie.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={()=>router.push("/rejestracja?type=worker")} style={{ background:"#fff", color:C.navy, border:"none", padding:"13px 28px", borderRadius:10, fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"Sora,sans-serif" }}>
              👷 Jestem pracownikiem
            </button>
            <button onClick={()=>router.push("/rejestracja?type=employer")} style={{ background:"transparent", color:"#fff", border:"2px solid rgba(255,255,255,0.5)", padding:"13px 28px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
              🏢 Szukam pracowników
            </button>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div style={{ background:C.g800, padding:"24px 20px", textAlign:"center" }}>
        <div style={{ fontSize:13, color:C.g400 }}>© 2026 rynekpracownika.pl · Pierwsza polska platforma odwróconych ogłoszeń o pracę</div>
      </div>
    </div>
  );
}