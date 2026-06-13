"use client";
import { useRouter } from "next/navigation";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
  white:"#FFFFFF", g100:"#E8ECF0", g400:"#94A3B8",
  g600:"#475569", g800:"#1E293B",
};

export default function PolitykaPrywatnosci() {
  const router = useRouter();
  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"DM Sans,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); h2{margin:32px 0 12px} p,li{line-height:1.8; color:#475569} ul{padding-left:20px} table{width:100%;border-collapse:collapse;margin:16px 0} td,th{padding:10px 14px;border:1px solid #E8ECF0;font-size:14px} th{background:#F5F7FA;font-weight:700}`}</style>

      <div style={{ background:C.white, borderBottom:`1px solid ${C.g100}`, padding:"0 20px", height:56, display:"flex", alignItems:"center", gap:12, boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
        <div onClick={()=>router.push("/")} style={{ cursor:"pointer", fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:C.navy }}>
          rynek<span style={{ color:C.blue }}>pracownika</span>
        </div>
        <div style={{ flex:1 }} />
        <button onClick={()=>router.back()} style={{ background:C.g100, border:"none", padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", color:C.g600 }}>← Wróć</button>
      </div>

      <div style={{ maxWidth:800, margin:"0 auto", padding:"40px 20px" }}>
        <div style={{ background:C.white, borderRadius:16, padding:"40px 48px", border:`1px solid ${C.g100}`, boxShadow:"0 4px 20px rgba(26,115,232,0.06)" }}>
          <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:28, fontWeight:800, color:C.g800, marginBottom:8 }}>Polityka Prywatności i RODO</h1>
          <p style={{ fontSize:13, color:C.g400, marginBottom:32 }}>Wersja z dnia: 21 maja 2026 r.</p>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§1. Administrator danych osobowych</h2>
          <p>Administratorem danych osobowych jest <strong>Robert Godek</strong>, prowadzący indywidualną działalność gospodarczą, z siedzibą: <strong>82A, 39-200 Stobierna</strong>, NIP: <strong>8722387194</strong>, REGON: <strong>387872177</strong>.</p>
          <p>Kontakt z Administratorem: <strong>kontakt@rynekpracownika.pl</strong></p>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§2. Jakie dane zbieramy</h2>
          <p><strong>Pracownicy (szukający pracy):</strong></p>
          <ul>
            <li>Imię i nazwisko, adres email, numer telefonu</li>
            <li>Dane zawodowe: stanowisko, doświadczenie, oczekiwana stawka, region, umiejętności</li>
          </ul>
          <p><strong>Pracodawcy (firmy):</strong></p>
          <ul>
            <li>Imię i nazwisko osoby rejestrującej, adres email, nazwa firmy</li>
            <li>Historia wykupionych odblokowań</li>
          </ul>
          <p><strong>Dane zbierane automatycznie:</strong> adres IP, typ przeglądarki, pliki cookies.</p>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§3. Cel i podstawa prawna przetwarzania</h2>
          <table>
            <thead><tr><th>Cel</th><th>Podstawa prawna</th></tr></thead>
            <tbody>
              <tr><td>Rejestracja i obsługa konta</td><td>Art. 6 ust. 1 lit. b RODO</td></tr>
              <tr><td>Wyświetlanie ogłoszeń</td><td>Art. 6 ust. 1 lit. b RODO</td></tr>
              <tr><td>Udostępnienie danych Pracodawcy</td><td>Art. 6 ust. 1 lit. a RODO (zgoda)</td></tr>
              <tr><td>Obsługa płatności</td><td>Art. 6 ust. 1 lit. b RODO</td></tr>
              <tr><td>Obowiązki podatkowe</td><td>Art. 6 ust. 1 lit. c RODO</td></tr>
            </tbody>
          </table>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§4. Jak długo przechowujemy dane</h2>
          <ul>
            <li><strong>Konto Użytkownika</strong> — przez czas istnienia konta + 3 lata po usunięciu (w celach rozliczeniowych i ochrony przed roszczeniami)</li>
            <li><strong>Ogłoszenia</strong> — 30 dni, następnie usuwane automatycznie</li>
            <li><strong>Dane płatności</strong> — 5 lat (obowiązek podatkowy)</li>
            <li><strong>Logi systemowe</strong> — 90 dni</li>
          </ul>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§5. Prawa Użytkownika</h2>
          <p>Każdy Użytkownik ma prawo do:</p>
          <ul>
            <li><strong>Dostępu</strong> do swoich danych</li>
            <li><strong>Sprostowania</strong> nieprawidłowych danych</li>
            <li><strong>Usunięcia</strong> danych („prawo do bycia zapomnianym")</li>
            <li><strong>Ograniczenia</strong> przetwarzania</li>
            <li><strong>Przenoszenia</strong> danych</li>
            <li><strong>Sprzeciwu</strong> wobec przetwarzania w celach marketingowych</li>
            <li><strong>Cofnięcia zgody</strong> w dowolnym momencie</li>
          </ul>
          <p>Aby skorzystać z powyższych praw, napisz na: <strong>kontakt@rynekpracownika.pl</strong></p>
          <p>Masz również prawo do wniesienia skargi do <strong>Prezesa Urzędu Ochrony Danych Osobowych</strong> (uodo.gov.pl).</p>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§6. Komu udostępniamy dane</h2>
          <p>Dane kontaktowe Pracowników udostępniane są <strong>wyłącznie Pracodawcom, którzy wykupili Odblokowanie</strong>. Dodatkowo dane mogą być przekazywane:</p>
          <ul>
            <li><strong>Supabase</strong> — infrastruktura bazy danych (serwery w UE)</li>
            <li><strong>Vercel</strong> — hosting (serwery w UE)</li>
            <li><strong>Operator płatności</strong> — w zakresie niezbędnym do transakcji</li>
            <li><strong>Organy państwowe</strong> — jeśli wymagają tego przepisy prawa</li>
          </ul>
          <p>Dane <strong>nie są sprzedawane</strong> ani przekazywane w celach reklamowych.</p>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§7. Pliki cookies</h2>
          <table>
            <thead><tr><th>Rodzaj</th><th>Cel</th><th>Czas</th></tr></thead>
            <tbody>
              <tr><td>Niezbędne</td><td>Sesja logowania, bezpieczeństwo</td><td>Sesja / 30 dni</td></tr>
              <tr><td>Analityczne</td><td>Google Analytics — statystyki ruchu</td><td>2 lata</td></tr>
            </tbody>
          </table>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§8. Bezpieczeństwo danych</h2>
          <ul>
            <li>Dane przechowywane są na serwerach z szyfrowaniem SSL/TLS</li>
            <li>Dostęp do danych kontaktowych możliwy wyłącznie po wykupieniu Odblokowania</li>
            <li>Hasła użytkowników są szyfrowane i nie są przechowywane w postaci jawnej</li>
          </ul>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§9. Dane dzieci</h2>
          <p>Serwis nie jest przeznaczony dla osób poniżej <strong>16 roku życia</strong>. Nie zbieramy świadomie danych osobowych dzieci.</p>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§10. Zmiany Polityki Prywatności</h2>
          <p>O istotnych zmianach poinformujemy Użytkowników drogą emailową. Aktualna wersja zawsze dostępna pod adresem: <strong>rynekpracownika.pl/polityka-prywatnosci</strong></p>

          <div style={{ marginTop:40, paddingTop:24, borderTop:`1px solid ${C.g100}`, fontSize:12, color:C.g400 }}>
            <p>Administrator: Robert Godek, 82A, 39-200 Stobierna, NIP: 8722387194</p>
            <p>Kontakt: kontakt@rynekpracownika.pl</p>
            <p>Data ostatniej aktualizacji: 21 maja 2026 r.</p>
          </div>
        </div>
      </div>
    </div>
  );
}