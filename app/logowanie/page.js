"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const C = {
  blue: "#1A73E8", navy: "#0D47A1", bg: "#F5F7FA",
  white: "#FFFFFF", g100: "#E8ECF0", g200: "#CBD5E1",
  g400: "#94A3B8", g600: "#475569", g800: "#1E293B",
  green: "#16A34A", red: "#DC2626", orange: "#EA580C",
};

const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60 * 1000; // 15 minut

function getLoginAttempts(email) {
  try {
    const data = JSON.parse(localStorage.getItem(`login_attempts_${email}`) || "{}");
    return data;
  } catch { return {}; }
}

function saveLoginAttempts(email, attempts) {
  localStorage.setItem(`login_attempts_${email}`, JSON.stringify(attempts));
}

function clearLoginAttempts(email) {
  localStorage.removeItem(`login_attempts_${email}`);
}

export default function Logowanie() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("login");
  const router = useRouter();

  async function handleLogin() {
    if (!email || !password) { setError("Wypełnij wszystkie pola!"); return; }

    // Sprawdź blokadę
    const attempts = getLoginAttempts(email);
    if (attempts.blockedUntil && Date.now() < attempts.blockedUntil) {
      const minutesLeft = Math.ceil((attempts.blockedUntil - Date.now()) / 60000);
      setError(`Konto zablokowane na ${minutesLeft} minut z powodu zbyt wielu nieudanych prób logowania.`);
      return;
    }

    setLoading(true); setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      // Zwiększ licznik nieudanych prób
      const currentAttempts = attempts.count || 0;
      const newCount = currentAttempts + 1;

      if (newCount >= MAX_ATTEMPTS) {
        saveLoginAttempts(email, { count: newCount, blockedUntil: Date.now() + BLOCK_TIME });
        setError(`Zbyt wiele nieudanych prób. Konto zablokowane na 15 minut.`);
      } else {
        saveLoginAttempts(email, { count: newCount });
        setError(`Nieprawidłowy email lub hasło. Pozostało prób: ${MAX_ATTEMPTS - newCount}`);
      }
      setLoading(false);
      return;
    }

    // Udane logowanie — wyczyść licznik
    clearLoginAttempts(email);

    const { data: profile } = await supabase.from("profiles").select("type").eq("id", data.user.id).single();
    setLoading(false);
    if (profile?.type === "worker") router.push("/panel/pracownik");
    else router.push("/panel/pracodawca");
  }

  async function handleReset() {
    if (!email) { setError("Podaj adres email!"); return; }
    setLoading(true); setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://rynekpracownika.pl/nowe-haslo",
    });
    setLoading(false);
    if (resetError) { setError("Błąd — sprawdź czy email jest poprawny"); return; }
    setView("resetSent");
  }

  // Sprawdź czy email jest zablokowany
  const attempts = email ? getLoginAttempts(email) : {};
  const isBlocked = attempts.blockedUntil && Date.now() < attempts.blockedUntil;
  const minutesLeft = isBlocked ? Math.ceil((attempts.blockedUntil - Date.now()) / 60000) : 0;
  const attemptsLeft = MAX_ATTEMPTS - (attempts.count || 0);

  const inputStyle = {
    width:"100%", padding:"10px 12px", borderRadius:8,
    border:`1.5px solid ${C.g200}`, fontSize:13,
    outline:"none", background:C.bg, color:C.g800,
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:C.white, borderRadius:16, padding:40, maxWidth:420, width:"100%", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>

        {/* LOGIN */}
        {view === "login" && (
          <>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ width:48, height:48, borderRadius:12, background:`linear-gradient(135deg,${C.blue},${C.navy})`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", fontSize:22 }}>🔑</div>
              <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:24, fontWeight:800, color:C.g800, marginBottom:6 }}>Zaloguj się</h1>
              <p style={{ fontSize:13, color:C.g600 }}>rynekpracownika.pl</p>
            </div>

            {isBlocked && (
              <div style={{ background:C.red+"10", border:`1px solid ${C.red}30`, borderRadius:8, padding:"12px 14px", marginBottom:16, fontSize:13, color:C.red }}>
                🔒 Konto zablokowane na <strong>{minutesLeft} minut</strong> z powodu zbyt wielu nieudanych prób logowania.
              </div>
            )}

            {!isBlocked && attempts.count > 0 && (
              <div style={{ background:C.orange+"10", border:`1px solid ${C.orange}30`, borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13, color:C.orange }}>
                ⚠️ Pozostało prób logowania: <strong>{attemptsLeft}</strong>
              </div>
            )}

            {error && !isBlocked && <div style={{ background:C.red+"10", border:`1px solid ${C.red}30`, borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13, color:C.red }}>{error}</div>}

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Email</label>
              <input value={email} onChange={e=>{ setEmail(e.target.value); setError(""); }} placeholder="jan@example.pl" type="email" style={inputStyle} />
            </div>
            <div style={{ marginBottom:8 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Hasło</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" type="password" onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={inputStyle} />
            </div>
            <div style={{ textAlign:"right", marginBottom:20 }}>
              <span onClick={()=>{ setView("reset"); setError(""); }} style={{ fontSize:12, color:C.blue, cursor:"pointer", fontWeight:600 }}>
                Zapomniałem hasła
              </span>
            </div>
            <button onClick={handleLogin} disabled={loading || isBlocked} style={{ width:"100%", background:isBlocked?C.g200:`linear-gradient(135deg,${C.blue},${C.navy})`, color:isBlocked?C.g400:"#fff", border:"none", padding:"12px", borderRadius:10, fontSize:14, fontWeight:700, cursor:isBlocked?"not-allowed":"pointer", fontFamily:"Sora,sans-serif" }}>
              {loading ? "Logowanie..." : isBlocked ? `🔒 Zablokowane (${minutesLeft} min)` : "Zaloguj się →"}
            </button>
            <p style={{ textAlign:"center", marginTop:16, fontSize:13, color:C.g600 }}>
              Nie masz konta? <a href="/rejestracja" style={{ color:C.blue, fontWeight:600 }}>Zarejestruj się</a>
            </p>
          </>
        )}

        {/* RESET */}
        {view === "reset" && (
          <>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔐</div>
              <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:22, fontWeight:800, color:C.g800, marginBottom:6 }}>Resetuj hasło</h1>
              <p style={{ fontSize:13, color:C.g600 }}>Wyślemy Ci link do ustawienia nowego hasła.</p>
            </div>
            {error && <div style={{ background:C.red+"10", border:`1px solid ${C.red}30`, borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13, color:C.red }}>{error}</div>}
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="jan@example.pl" type="email" style={inputStyle} />
            </div>
            <button onClick={handleReset} disabled={loading} style={{ width:"100%", background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"12px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
              {loading ? "Wysyłanie..." : "Wyślij link resetujący →"}
            </button>
            <p style={{ textAlign:"center", marginTop:16, fontSize:13, color:C.g600 }}>
              <span onClick={()=>{ setView("login"); setError(""); }} style={{ color:C.blue, cursor:"pointer", fontWeight:600 }}>← Wróć do logowania</span>
            </p>
          </>
        )}

        {/* RESET SENT */}
        {view === "resetSent" && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:56, marginBottom:16 }}>📧</div>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:22, fontWeight:800, color:C.g800, marginBottom:8 }}>Sprawdź email!</h2>
            <p style={{ fontSize:14, color:C.g600, lineHeight:1.7, marginBottom:24 }}>
              Wysłaliśmy link do resetowania hasła na adres <strong>{email}</strong>. Sprawdź również folder spam.
            </p>
            <button onClick={()=>{ setView("login"); setError(""); }} style={{ background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"11px 28px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
              Wróć do logowania
            </button>
          </div>
        )}
      </div>
    </div>
  );
}