"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const C = {
  blue: "#1A73E8", navy: "#0D47A1", bg: "#F5F7FA",
  white: "#FFFFFF", g100: "#E8ECF0", g200: "#CBD5E1",
  g400: "#94A3B8", g600: "#475569", g800: "#1E293B",
  green: "#16A34A", red: "#DC2626",
};

export default function Rejestracja() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"", password2:"" });
  const [nip, setNip] = useState("");
  const [nipStatus, setNipStatus] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

useEffect(() => {
  const t = searchParams.get("type");
  if (t === "worker") { setType("worker"); setStep(3); }
  if (t === "employer") { setType("employer"); setStep(2); }
}, []);

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function checkNip() {
    const cleaned = nip.replace(/[-\s]/g, "");
    if (cleaned.length !== 10) {
      setNipStatus("invalid");
      setCompanyData(null);
      return;
    }
    setNipStatus("checking");
    try {
      const res = await fetch(`/api/nip?nip=${cleaned}`);
      const data = await res.json();
      if (data.valid) {
        setNipStatus("valid");
        setCompanyData(data);
        up("name", data.name);
      } else {
        setNipStatus("invalid");
        setCompanyData(null);
      }
    } catch {
      setNipStatus("invalid");
      setCompanyData(null);
    }
  }

  async function handleRegister() {
    if (form.password !== form.password2) {
      setError("Hasła nie są identyczne!"); return;
    }
    if (!form.name || !form.email || !form.password) {
  setError("Wypełnij wszystkie pola!"); return;
}
if (type === "worker" && !form.phone) {
  setError("Numer telefonu jest wymagany — pracodawca musi mieć możliwość kontaktu!"); return;
}
if (type === "employer" && !form.phone) {
  setError("Numer telefonu jest wymagany!"); return;
}
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        type: type,
        name: form.name,
        phone: form.phone,
        email: form.email,
        nip: type === "employer" ? nip.replace(/[-\s]/g, "") : null,
        company_name: type === "employer" ? companyData?.name : null,
        verified: type === "employer" ? nipStatus === "valid" : false,
      });
    }

    await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: type === "worker" ? "welcome_worker" : "welcome_employer",
        to: form.email,
        data: { name: form.name.split(" ")[0] },
      }),
    });

    setLoading(false);
    setDone(true);
  }

  if (done) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:C.white, borderRadius:16, padding:40, maxWidth:420, width:"90%", textAlign:"center", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
        <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:22, fontWeight:800, color:C.g800, marginBottom:10 }}>Konto utworzone!</h2>
        <p style={{ fontSize:14, color:C.g600, marginBottom:24, lineHeight:1.6 }}>
          Sprawdź email <strong>{form.email}</strong> i potwierdź rejestrację. Potem wróć i zaloguj się.
        </p>
        <button onClick={() => router.push("/logowanie")} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"12px 28px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
          Przejdź do logowania →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:C.white, borderRadius:16, padding:40, maxWidth:440, width:"100%", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:24, fontWeight:800, color:C.g800, marginBottom:6 }}>Utwórz konto</h1>
          <p style={{ fontSize:13, color:C.g600 }}>rynekpracownika.pl</p>
        </div>

        {/* KROK 1 */}
        {step === 1 && (
          <div>
            <p style={{ fontSize:14, fontWeight:600, color:C.g800, marginBottom:16, textAlign:"center" }}>Kim jesteś?</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
              {[["worker","👷","Pracownik","Szukam pracy / zleceń"],["employer","🏢","Pracodawca","Szukam pracowników"]].map(([id,icon,label,sub])=>(
                <div key={id} onClick={() => setType(id)} style={{
                  padding:20, borderRadius:12, cursor:"pointer", textAlign:"center",
                  border:`2px solid ${type===id?C.blue:C.g100}`,
                  background: type===id ? C.blue+"0a" : C.bg,
                }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>{icon}</div>
                  <div style={{ fontWeight:700, fontSize:14, color:type===id?C.blue:C.g800 }}>{label}</div>
                  <div style={{ fontSize:11, color:C.g400, marginTop:3 }}>{sub}</div>
                </div>
              ))}
            </div>
            <button onClick={() => type && setStep(type === "employer" ? 2 : 3)} style={{ width:"100%", background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"12px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", opacity: type ? 1 : 0.5 }}>
              Dalej →
            </button>
          </div>
        )}

        {/* KROK 2 — NIP */}
        {step === 2 && (
          <div>
            <p style={{ fontSize:14, fontWeight:600, color:C.g800, marginBottom:6, textAlign:"center" }}>Weryfikacja firmy</p>
            <p style={{ fontSize:12, color:C.g400, marginBottom:24, textAlign:"center" }}>Podaj NIP firmy — zweryfikujemy ją w rejestrze GUS</p>

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>NIP firmy</label>
              <div style={{ display:"flex", gap:8 }}>
                <input
                  placeholder="np. 8722387194"
                  value={nip}
                  onChange={e => { setNip(e.target.value); setNipStatus(null); setCompanyData(null); }}
                  style={{ flex:1, padding:"10px 12px", borderRadius:8, border:`1.5px solid ${nipStatus==="valid"?C.green:nipStatus==="invalid"?C.red:C.g200}`, fontSize:13, outline:"none", background:C.bg, color:C.g800 }}
                />
                <button onClick={checkNip} disabled={nipStatus==="checking"} style={{ padding:"10px 16px", borderRadius:8, background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
                  {nipStatus==="checking" ? "⏳" : "Sprawdź"}
                </button>
              </div>
            </div>

            {nipStatus === "valid" && companyData && (
              <div style={{ background:C.green+"0f", border:`1px solid ${C.green}30`, borderRadius:10, padding:"14px 16px", marginBottom:20 }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.green, marginBottom:6 }}>✅ Firma zweryfikowana</div>
                <div style={{ fontSize:14, fontWeight:700, color:C.g800 }}>{companyData.name}</div>
                {companyData.city && <div style={{ fontSize:12, color:C.g600, marginTop:2 }}>{companyData.city}</div>}
              </div>
            )}

            {nipStatus === "invalid" && (
              <div style={{ background:C.red+"0f", border:`1px solid ${C.red}30`, borderRadius:10, padding:"12px 16px", marginBottom:20 }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.red }}>❌ Nie znaleziono firmy o podanym NIP</div>
              </div>
            )}

            <div style={{ display:"flex", gap:10, marginTop:8 }}>
              <button onClick={() => setStep(1)} style={{ padding:"11px 20px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, fontSize:13, fontWeight:600, cursor:"pointer", color:C.g600 }}>← Wstecz</button>
              <button onClick={() => setStep(3)} disabled={nipStatus !== "valid"} style={{ flex:1, background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"11px", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer", opacity: nipStatus === "valid" ? 1 : 0.5 }}>
                Dalej →
              </button>
            </div>
          </div>
        )}

        {/* KROK 3 — dane */}
        {step === 3 && (
          <div>
            {error && <div style={{ background:C.red+"10", border:`1px solid ${C.red}30`, borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13, color:C.red }}>{error}</div>}
            {[
              ["name", type==="employer"?"Nazwa firmy":"Imię i nazwisko", type==="employer"?"Nazwa firmy":"Jan Kowalski"],
              ["email","Email","jan@example.pl"],
              ["phone","Telefon *","+48 500 000 000"],
              ["password","Hasło","••••••••"],
              ["password2","Powtórz hasło","••••••••"]
            ].map(([key,label,placeholder])=>(
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
                <input
                  type={key.includes("password") ? "password" : "text"}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => up(key, e.target.value)}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.bg, color:C.g800 }}
                />
              </div>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button onClick={() => setStep(type === "employer" ? 2 : 1)} style={{ padding:"11px 20px", borderRadius:8, border:`1.5px solid ${C.g200}`, background:C.white, fontSize:13, fontWeight:600, cursor:"pointer", color:C.g600 }}>← Wstecz</button>
              <button onClick={handleRegister} disabled={loading} style={{ flex:1, background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"11px", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                {loading ? "Rejestrowanie..." : "Utwórz konto →"}
              </button>
            </div>
            <p style={{ textAlign:"center", marginTop:16, fontSize:13, color:C.g600 }}>
              Masz już konto? <a href="/logowanie" style={{ color:C.blue, fontWeight:600 }}>Zaloguj się</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}