"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
  white:"#FFFFFF", g100:"#E8ECF0", g200:"#CBD5E1",
  g400:"#94A3B8", g600:"#475569", g800:"#1E293B",
  green:"#16A34A", red:"#DC2626",
};

export default function OgloszeniePage({ params }) {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [id, setId] = useState(null);

  useEffect(() => {
    params.then ? params.then(p => setId(p.id)) : setId(params.id);
  }, []);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("id", id)
        .single();
      setAd(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontSize:14, color:C.g600 }}>Ładowanie...</div>
    </div>
  );

  if (!ad) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>😕</div>
        <div style={{ fontSize:16, color:C.g600 }}>Ogłoszenie nie istnieje lub wygasło</div>
        <button onClick={()=>router.push("/")} style={{ marginTop:20, background:C.blue, color:"#fff", border:"none", padding:"10px 24px", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer" }}>Wróć do strony głównej</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"DM Sans,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* TOPBAR */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.g100}`, padding:"0 20px", height:56, display:"flex", alignItems:"center", gap:12, boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
        <div onClick={()=>router.push("/")} style={{ cursor:"pointer", fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:C.navy }}>
          rynek<span style={{ color:C.blue }}>pracownika</span>
        </div>
        <div style={{ flex:1 }} />
        <button onClick={()=>router.back()} style={{ background:C.g100, border:"none", padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", color:C.g600 }}>← Wróć</button>
      </div>

      <div style={{ maxWidth:720, margin:"0 auto", padding:"32px 20px" }}>
        <div style={{ background:C.white, borderRadius:16, padding:32, border:`1px solid ${C.g100}`, boxShadow:"0 4px 20px rgba(26,115,232,0.06)" }}>

          {/* Nagłówek */}
          <div style={{ marginBottom:24 }}>
            <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:26, fontWeight:800, color:C.g800, marginBottom:8 }}>{ad.role}</h1>
            <div style={{ fontSize:14, color:C.g400 }}>{ad.city}, {ad.region}</div>
          </div>

          {/* Stawka */}
          {ad.rate_from && (
            <div style={{ background:C.blue+"0a", border:`1px solid ${C.blue}20`, borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
              <div style={{ fontSize:12, color:C.g400, marginBottom:4, textTransform:"uppercase", letterSpacing:0.5, fontWeight:600 }}>Oczekiwana stawka</div>
              <div style={{ fontSize:24, fontWeight:800, color:C.blue, fontFamily:"Sora,sans-serif" }}>
                {ad.rate_from}{ad.rate_to ? `–${ad.rate_to}` : ""} {ad.rate_type === "monthly" ? "zł/mies." : "zł/h"}
              </div>
            </div>
          )}

          {/* Szczegóły */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
            {ad.experience && (
              <div style={{ background:C.bg, borderRadius:10, padding:"12px 16px" }}>
                <div style={{ fontSize:11, color:C.g400, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>Doświadczenie</div>
                <div style={{ fontSize:14, fontWeight:600, color:C.g800 }}>{ad.experience}</div>
              </div>
            )}
            {ad.available && (
              <div style={{ background:C.bg, borderRadius:10, padding:"12px 16px" }}>
                <div style={{ fontSize:11, color:C.g400, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>Dostępność</div>
                <div style={{ fontSize:14, fontWeight:600, color:C.g800 }}>{ad.available}</div>
              </div>
            )}
            {ad.contract?.length > 0 && (
              <div style={{ background:C.bg, borderRadius:10, padding:"12px 16px" }}>
                <div style={{ fontSize:11, color:C.g400, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>Umowa</div>
                <div style={{ fontSize:14, fontWeight:600, color:C.g800 }}>{ad.contract.join(", ")}</div>
              </div>
            )}
            {ad.remote && (
              <div style={{ background:C.bg, borderRadius:10, padding:"12px 16px" }}>
                <div style={{ fontSize:11, color:C.g400, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>Praca zdalna</div>
                <div style={{ fontSize:14, fontWeight:600, color:C.green }}>✓ Możliwa</div>
              </div>
            )}
          </div>

          {/* Umiejętności */}
          {ad.skills?.length > 0 && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, color:C.g400, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:10 }}>Umiejętności</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {ad.skills.map(s=>(
                  <span key={s} style={{ background:C.blue+"12", color:C.blue, padding:"5px 12px", borderRadius:20, fontSize:12, fontWeight:600 }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Opis */}
          {ad.description && (
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:11, color:C.g400, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:10 }}>O kandydacie</div>
              <p style={{ fontSize:14, color:C.g600, lineHeight:1.7, margin:0 }}>{ad.description}</p>
            </div>
          )}

          {/* CTA */}
          <div style={{ background:`linear-gradient(135deg,${C.blue}10,${C.navy}10)`, border:`1px solid ${C.blue}20`, borderRadius:12, padding:"20px 24px", textAlign:"center" }}>
            <div style={{ fontSize:15, fontWeight:700, color:C.g800, marginBottom:6 }}>Chcesz skontaktować się z kandydatem?</div>
            <div style={{ fontSize:13, color:C.g600, marginBottom:16 }}>Dane kontaktowe są dostępne po wykupieniu dostępu.</div>
            <button style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"12px 32px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
              🔓 Odblokuj dane kontaktowe
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}