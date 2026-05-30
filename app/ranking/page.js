"use client";
import { useRouter } from "next/navigation";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
  white:"#FFFFFF", g100:"#E8ECF0", g200:"#CBD5E1",
  g400:"#94A3B8", g600:"#475569", g800:"#1E293B",
  green:"#16A34A", orange:"#EA580C", red:"#DC2626", yellow:"#F59E0B",
};

export default function Ranking() {
  const router = useRouter();

  const data = [
    { pos:1, name:"TechCorp Sp. z o.o.",  industry:"Software House", score:98, rating:4.9, reviews:124, resp:"< 2h",  badge:"🥇 Złoty",     bc:C.yellow },
    { pos:2, name:"Budmax S.A.",           industry:"Budowlanka",     score:93, rating:4.8, reviews:89,  resp:"< 3h",  badge:"🥈 Srebrny",    bc:C.g400 },
    { pos:3, name:"LogiHub",               industry:"Transport",      score:88, rating:4.6, reviews:67,  resp:"< 5h",  badge:"🥉 Brązowy",    bc:C.orange },
    { pos:4, name:"Medianova S.A.",        industry:"E-commerce",     score:82, rating:4.4, reviews:54,  resp:"< 8h",  badge:"✅ Zaufany",    bc:C.blue },
    { pos:5, name:"ProdEx Fabryka",        industry:"Produkcja",      score:76, rating:4.1, reviews:41,  resp:"< 12h", badge:"✅ Zaufany",    bc:C.blue },
    { pos:6, name:"HandelPro",             industry:"Handel",         score:68, rating:3.8, reviews:28,  resp:"< 24h", badge:"⚪ Podstawowy", bc:C.g400 },
    { pos:7, name:"QuickJobs Agencja",     industry:"Agencja pracy",  score:61, rating:3.5, reviews:19,  resp:"> 24h", badge:"⚠️ Nisko ocen.",bc:C.red },
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
        <button onClick={()=>router.push("/")} style={{ background:"transparent", border:"none", color:C.g600, padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>← Strona główna</button>
      </nav>

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
                <div style={{ fontSize:11, color:C.g400 }}>{e.industry} · {e.reviews} opinii · czas odpowiedzi {e.resp}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:17, color:e.score>=90?C.blue:e.score>=75?C.green:C.orange }}>{e.score}</div>
                <span style={{ fontSize:11, fontWeight:700, color:e.bc, background:e.bc+"18", padding:"2px 8px", borderRadius:20 }}>{e.badge}</span>
              </div>
            </div>
          ))}
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