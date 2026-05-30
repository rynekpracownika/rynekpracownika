"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
  white:"#FFFFFF", g100:"#E8ECF0", g200:"#CBD5E1",
  g400:"#94A3B8", g600:"#475569", g800:"#1E293B",
};

export default function HowItWorks() {
  const [open, setOpen] = useState(null);
  const router = useRouter();

  const faq = [
    { q:"Czy ogłoszenie jest płatne?", a:"Dla pracownika ogłoszenie jest zawsze bezpłatne. Firmy płacą za odblokowanie danych kontaktowych." },
    { q:"Czy moje dane są widoczne publicznie?", a:"Nie. Wyświetlany jest tylko Twój profil zawodowy. Imię i telefon są ukryte." },
    { q:"Co się dzieje gdy firma odblokuje moje dane?", a:"Dostajesz SMS z powiadomieniem. To Ty decydujesz czy odebrać telefon." },
    { q:"Jak długo aktywne jest ogłoszenie?", a:"Ogłoszenie jest aktywne przez 30 dni. Możesz je przedłużyć lub usunąć w każdej chwili." },
    { q:"Jak firmy są weryfikowane?", a:"Każda firma musi podać NIP, który weryfikujemy w GUS." },
  ];

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
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>router.push("/")} style={{ background:"transparent", border:"none", color:C.g600, padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>← Strona główna</button>
          <button onClick={()=>router.push("/rejestracja")} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, border:"none", color:"#fff", padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>+ Dodaj ogłoszenie</button>
        </div>
      </nav>

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
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:40 }}>
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

        <div style={{ textAlign:"center" }}>
          <button onClick={()=>router.push("/rejestracja")} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"13px 32px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
            📝 Dodaj ogłoszenie za darmo →
          </button>
        </div>
      </div>

      <footer style={{ background:C.navy, color:"rgba(255,255,255,0.6)", padding:"24px 20px", textAlign:"center", fontSize:12, marginTop:40 }}>
        <div onClick={()=>router.push("/")} style={{ cursor:"pointer", fontFamily:"Sora,sans-serif", fontWeight:800, color:"#fff", fontSize:14, marginBottom:8 }}>
          rynek<span style={{ color:C.blue }}>pracownika</span>.pl
        </div>
        <div>© 2025 rynekpracownika.pl — Wszelkie prawa zastrzeżone</div>
      </footer>
    </div>
  );
}