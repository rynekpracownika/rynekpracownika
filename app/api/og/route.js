import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0D47A1 0%, #1A73E8 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo + nazwa */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px", marginBottom: "40px" }}>
          {/* Kółko R */}
          <div
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              border: "5px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
            }}
          >
            <span style={{ color: "white", fontSize: "64px", fontWeight: "900" }}>R</span>
          </div>
          {/* Nazwa */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "0px" }}>
            <span style={{ color: "white", fontSize: "72px", fontWeight: "900" }}>rynekpracownika</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "48px", fontWeight: "400" }}>.pl</span>
          </div>
        </div>

        {/* Hasło */}
        <div
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "32px",
            fontWeight: "500",
            letterSpacing: "0.5px",
          }}
        >
          Ty podajesz warunki. Pracodawca dzwoni do Ciebie.
        </div>

        {/* Pasek na dole */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "6px",
            background: "rgba(255,255,255,0.25)",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}