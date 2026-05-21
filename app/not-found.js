"use client";
import { useRouter } from "next/navigation";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
  white:"#FFFFFF", g100:"#E8ECF0", g400:"#94A3B8", g600:"#475569", g800:"#1E293B",
};

export default function NotFound() {
  const router = useRouter();
  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"DM Sans,sans-serif", display:"flex", flexDirection:"column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* TOPBAR */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.g100}`, padding:"0 20px", height:56, display:"flex", alignItems:"center", boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
        <div onClick={()=>router.push("/")} style={{ cursor:"pointer", fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:C.navy }}>
          rynek<span style={{ color:C.blue }}>pracownika</span>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
        <div style={{ textAlign:"center", maxWidth:480 }}>
          <div style={{ fontFamily:"Sora,sans-serif", fontSize:120, fontWeight:900, color:C.blue, lineHeight:1, marginBottom:8 }}>404</div>
          <div style={{ fontFamily:"Sora,sans-serif", fontSize:24, fontWeight:800, color:C.g800, marginBottom:12 }}>Strona nie istnieje</div>
          <p style={{ fontSize:15, color:C.g600, lineHeight:1.7, marginBottom:32 }}>
            Strona której szukasz mogła zostać usunięta, przeniesiona lub nigdy nie istniała.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={()=>router.push("/")} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"12px 28px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
              🏠 Strona główna
            </button>
            <button onClick={()=>router.push("/")} style={{ background:C.white, color:C.blue, border:`1.5px solid ${C.blue}`, padding:"12px 28px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
              🔍 Przeglądaj ogłoszenia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}