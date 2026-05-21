"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", white:"#FFFFFF",
  g100:"#E8ECF0", g600:"#475569", g800:"#1E293B",
};

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:1000,
      background:C.g800, color:"#fff",
      padding:"16px 24px",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      gap:16, flexWrap:"wrap",
      boxShadow:"0 -4px 20px rgba(0,0,0,0.15)",
    }}>
      <p style={{ fontSize:13, color:"rgba(255,255,255,0.85)", margin:0, lineHeight:1.6, flex:1, minWidth:260 }}>
        🍪 Używamy plików cookies niezbędnych do działania serwisu (logowanie, bezpieczeństwo).{" "}
        <span
          onClick={()=>router.push("/polityka-prywatnosci")}
          style={{ color:"#93C5FD", cursor:"pointer", textDecoration:"underline" }}
        >
          Polityka prywatności
        </span>
      </p>
      <div style={{ display:"flex", gap:10, flexShrink:0 }}>
        <button onClick={accept} style={{
          background:C.blue, color:"#fff", border:"none",
          padding:"9px 22px", borderRadius:8, fontSize:13,
          fontWeight:700, cursor:"pointer",
        }}>
          Akceptuję
        </button>
      </div>
    </div>
  );
}