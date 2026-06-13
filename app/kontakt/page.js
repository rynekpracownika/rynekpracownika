"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
  white:"#FFFFFF", g100:"#E8ECF0", g200:"#CBD5E1",
  g400:"#94A3B8", g600:"#475569", g800:"#1E293B",
  green:"#16A34A", red:"#DC2626",
};

const inputStyle = { width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.white, color:C.g800 };

export default function Kontakt() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const up = (k,v) => setForm(f=>({...f,[k]:v}));

  async function handleSend() {
    if (!form.name || !form.email || !form.message) { setError("Wypełnij wszystkie wymagane pola!"); return; }
    setLoading(true); setError("");
    let res;
    try {
      res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type:"contact", to:"kontakt@rynekpracownika.pl", data:{ name:form.name, email:form.email, subject:form.subject||"Wiadomość z formularza kontaktowego", message:form.message } }),
      });
    } catch {
      setError("Brak połączenia z internetem. Sprawdź sieć i spróbuj ponownie.");
      setLoading(false);
      return;
    }
    setLoading(false);
    if (res.ok) setDone(true);
    else setError("Błąd wysyłki — spróbuj ponownie lub napisz na kontakt@rynekpracownika.pl");
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"DM Sans,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
      <div style={{ background:C.white, borderBottom:`1px solid ${C.g100}`, padding:"0 20px", height:56, display:"flex", alignItems:"center", gap:12, boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
        <div onClick={()=>router.push("/")} style={{ cursor:"pointer", fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:C.navy }}>
          rynek<span style={{ color:C.blue }}>pracownika</span>
        </div>
        <div style={{ flex:1 }} />
        <button onClick={()=>router.back()} style={{ background:C.g100, border:"none", padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", color:C.g600 }}>← Wróć</button>
      </div>
      <div style={{ maxWidth:640, margin:"0 auto", padding:"40px 20px" }}>
        {!done ? (
          <div style={{ background:C.white, borderRadius:16, padding:"40px", border:`1px solid ${C.g100}`, boxShadow:"0 4px 20px rgba(26,115,232,0.06)" }}>
            <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:26, fontWeight:800, color:C.g800, marginBottom:8 }}>Kontakt</h1>
            <p style={{ fontSize:14, color:C.g600, marginBottom:32, lineHeight:1.6 }}>Masz pytanie lub sugestię? Napisz do nas — odpiszemy najszybciej jak to możliwe.</p>
            {error && <div style={{ background:C.red+"10", border:`1px solid ${C.red}30`, borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13, color:C.red }}>{error}</div>}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Imię i nazwisko *</label>
                <input value={form.name} onChange={e=>up("name",e.target.value)} placeholder="Jan Kowalski" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Email *</label>
                <input value={form.email} onChange={e=>up("email",e.target.value)} placeholder="jan@example.pl" type="email" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Temat</label>
              <input value={form.subject} onChange={e=>up("subject",e.target.value)} placeholder="np. Pytanie o ogłoszenie" style={inputStyle} />
            </div>
            <div style={{ marginBottom:28 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Wiadomość *</label>
              <textarea value={form.message} onChange={e=>up("message",e.target.value)} placeholder="Treść wiadomości..." rows={6} style={{...inputStyle, resize:"vertical", lineHeight:1.6}} />
            </div>
            <button onClick={handleSend} disabled={loading} style={{ width:"100%", background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"13px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
              {loading ? "Wysyłanie..." : "📨 Wyślij wiadomość"}
            </button>
            <p style={{ textAlign:"center", marginTop:16, fontSize:12, color:C.g400 }}>Możesz też napisać bezpośrednio: <strong>kontakt@rynekpracownika.pl</strong></p>
          </div>
        ) : (
          <div style={{ background:C.white, borderRadius:16, padding:"40px", border:`1px solid ${C.g100}`, textAlign:"center" }}>
            <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:22, fontWeight:800, color:C.g800, marginBottom:8 }}>Wiadomość wysłana!</h2>
            <p style={{ fontSize:14, color:C.g600, lineHeight:1.7, marginBottom:24 }}>Dziękujemy za kontakt. Odpiszemy na adres <strong>{form.email}</strong> najszybciej jak to możliwe.</p>
            <button onClick={()=>router.push("/")} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"11px 28px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>Wróć na stronę główną</button>
          </div>
        )}
      </div>
    </div>
  );
}