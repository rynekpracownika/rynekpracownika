"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin() {
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (result?.ok) {
      router.push("/admin");
    } else {
      setError("Nieprawidłowy login lub hasło");
    }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0F172A" }}>
      <div style={{ background:"#1E293B", borderRadius:16, padding:40, width:340, boxShadow:"0 20px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:48, height:48, borderRadius:12, background:"#1A73E8", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", fontSize:22 }}>🔒</div>
          <h1 style={{ color:"#fff", fontFamily:"Sora,sans-serif", fontSize:20, fontWeight:800 }}>Panel Admina</h1>
          <p style={{ color:"#94A3B8", fontSize:13, marginTop:4 }}>rynekpracownika.pl</p>
        </div>
        {error && (
          <div style={{ background:"#DC262620", border:"1px solid #DC262640", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13, color:"#DC2626" }}>{error}</div>
        )}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:700, color:"#94A3B8", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Login</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="admin"
            style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:"1.5px solid #334155", background:"#0F172A", color:"#fff", fontSize:13, outline:"none" }} />
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={{ fontSize:11, fontWeight:700, color:"#94A3B8", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Hasło</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••"
            onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:"1.5px solid #334155", background:"#0F172A", color:"#fff", fontSize:13, outline:"none" }} />
        </div>
        <button onClick={handleLogin} style={{ width:"100%", background:"linear-gradient(135deg,#1A73E8,#0D47A1)", border:"none", color:"#fff", padding:"12px", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Sora,sans-serif" }}>
          Zaloguj się →
        </button>
      </div>
    </div>
  );
}