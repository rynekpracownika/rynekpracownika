"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const C = {
  blue: "#1A73E8", navy: "#0D47A1", bg: "#F5F7FA",
  white: "#FFFFFF", g100: "#E8ECF0", g200: "#CBD5E1",
  g400: "#94A3B8", g600: "#475569", g800: "#1E293B",
  green: "#16A34A", red: "#DC2626",
};

export default function NoweHaslo() {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleSave() {
    if (!password || !password2) { setError("Wypełnij oba pola!"); return; }
    if (password.length < 6) { setError("Hasło musi mieć minimum 6 znaków!"); return; }
    if (password !== password2) { setError("Hasła nie są identyczne!"); return; }
    setLoading(true); setError("");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) { setError("Błąd — spróbuj ponownie lub poproś o nowy link"); return; }
    setDone(true);
    setTimeout(() => router.push("/logowanie"), 3000);
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:C.white, borderRadius:16, padding:40, maxWidth:420, width:"100%", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>

        {!done ? (
          <>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔒</div>
              <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:22, fontWeight:800, color:C.g800, marginBottom:6 }}>Nowe hasło</h1>
              <p style={{ fontSize:13, color:C.g600 }}>Ustaw nowe hasło do swojego konta.</p>
            </div>
            {error && <div style={{ background:C.red+"10", border:`1px solid ${C.red}30`, borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13, color:C.red }}>{error}</div>}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Nowe hasło</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="minimum 6 znaków" type="password"
                style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.bg }} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Powtórz hasło</label>
              <input value={password2} onChange={e=>setPassword2(e.target.value)} placeholder="••••••••" type="password"
                onKeyDown={e=>e.key==="Enter"&&handleSave()}
                style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.bg }} />
            </div>
            <button onClick={handleSave} disabled={loading} style={{ width:"100%", background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"12px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
              {loading ? "Zapisywanie..." : "Zapisz nowe hasło →"}
            </button>
          </>
        ) : (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
            <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:22, fontWeight:800, color:C.g800, marginBottom:8 }}>Hasło zmienione!</h2>
            <p style={{ fontSize:14, color:C.g600, lineHeight:1.7 }}>
              Twoje hasło zostało zaktualizowane. Za chwilę zostaniesz przekierowany do logowania...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}