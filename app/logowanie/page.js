"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const C = {
  blue: "#1A73E8", navy: "#0D47A1", bg: "#F5F7FA",
  white: "#FFFFFF", g100: "#E8ECF0", g200: "#CBD5E1",
  g400: "#94A3B8", g600: "#475569", g800: "#1E293B",
  green: "#16A34A", red: "#DC2626",
};

export default function Logowanie() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin() {
    if (!email || !password) {
      setError("Wypełnij wszystkie pola!"); return;
    }
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Nieprawidłowy email lub hasło");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("type")
      .eq("id", data.user.id)
      .single();

    setLoading(false);

    if (profile?.type === "worker") {
      router.push("/panel/pracownik");
    } else {
      router.push("/panel/pracodawca");
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:C.white, borderRadius:16, padding:40, maxWidth:420, width:"100%", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:48, height:48, borderRadius:12, background:`linear-gradient(135deg,${C.blue},${C.navy})`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", fontSize:22 }}>🔑</div>
          <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:24, fontWeight:800, color:C.g800, marginBottom:6 }}>Zaloguj się</h1>
          <p style={{ fontSize:13, color:C.g600 }}>rynekpracownika.pl</p>
        </div>

        {error && (
          <div style={{ background:C.red+"10", border:`1px solid ${C.red}30`, borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13, color:C.red }}>{error}</div>
        )}

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="jan@example.pl" type="email"
            style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.bg }} />
        </div>

        <div style={{ marginBottom:24 }}>
          <label style={{ fontSize:11, fontWeight:700, color:C.g600, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Hasło</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" type="password"
            onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, outline:"none", background:C.bg }} />
        </div>

        <button onClick={handleLogin} disabled={loading} style={{ width:"100%", background:`linear-gradient(135deg,${C.blue},${C.navy})`, color:"#fff", border:"none", padding:"12px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Sora,sans-serif" }}>
          {loading ? "Logowanie..." : "Zaloguj się →"}
        </button>

        <p style={{ textAlign:"center", marginTop:16, fontSize:13, color:C.g600 }}>
          Nie masz konta? <a href="/rejestracja" style={{ color:C.blue, fontWeight:600 }}>Zarejestruj się</a>
        </p>
      </div>
    </div>
  );
}