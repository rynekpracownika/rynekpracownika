"use client";
import { useRouter } from "next/navigation";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
  white:"#FFFFFF", g100:"#E8ECF0", g400:"#94A3B8", g600:"#475569", g800:"#1E293B",
};

export default function Ranking() {
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

      <div style={{ maxWidth:600, margin:"0 auto", padding:"80px 20px", textAlign:"center" }}>
        <div style={{ fontSize:72, marginBottom:24 }}>🏗️</div>
        <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:32, fontWeight:900, color:C.g800, marginBottom:16 }}>
          Ranking pracodawców
        </h1>
        <div style={{ background:C.white, borderRadius:16, padding:32, border:`1px solid ${C.g100}`, boxShadow:"0 4px 20px rgba(0,0,0,0.06)", marginBottom:32 }}>
          <p style={{ fontSize:16, color:C.g600, lineHeight:1.7, marginBottom:24 }}>
            Ta sekcja jest w trakcie budowy. Wkrótce pojawi się tutaj ranking pracodawców oparty na prawdziwych ocenach pracowników.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              "⭐ Oceny wystawiane przez pracowników",
              "🏢 Tylko zweryfikowane firmy z NIP",
              "📊 Ranking oparty na rzeczywistych danych",
              "🔓 Transparentność procesu rekrutacji",
            ].map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:C.bg, borderRadius:8, fontSize:14, color:C.g600, textAlign:"left" }}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <button onClick={()=>router.push("/")} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"13px 32px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Sora,sans-serif" }}>
          ← Wróć na stronę główną
        </button>
      </div>
    </div>
  );
}