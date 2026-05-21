"use client";
import { useRouter } from "next/navigation";

const C = {
  blue:"#1A73E8", navy:"#0D47A1", bg:"#F5F7FA",
  white:"#FFFFFF", g100:"#E8ECF0", g400:"#94A3B8",
  g600:"#475569", g800:"#1E293B",
};

export default function Regulamin() {
  const router = useRouter();
  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"DM Sans,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); h2{margin:32px 0 12px} h3{margin:24px 0 8px} p,li{line-height:1.8; color:#475569} ul{padding-left:20px} table{width:100%;border-collapse:collapse;margin:16px 0} td,th{padding:10px 14px;border:1px solid #E8ECF0;font-size:14px} th{background:#F5F7FA;font-weight:700}`}</style>

      <div style={{ background:C.white, borderBottom:`1px solid ${C.g100}`, padding:"0 20px", height:56, display:"flex", alignItems:"center", gap:12, boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
        <div onClick={()=>router.push("/")} style={{ cursor:"pointer", fontFamily:"Sora,sans-serif", fontWeight:800, fontSize:15, color:C.navy }}>
          rynek<span style={{ color:C.blue }}>pracownika</span>
        </div>
        <div style={{ flex:1 }} />
        <button onClick={()=>router.back()} style={{ background:C.g100, border:"none", padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", color:C.g600 }}>← Wróć</button>
      </div>

      <div style={{ maxWidth:800, margin:"0 auto", padding:"40px 20px" }}>
        <div style={{ background:C.white, borderRadius:16, padding:"40px 48px", border:`1px solid ${C.g100}`, boxShadow:"0 4px 20px rgba(26,115,232,0.06)" }}>
          <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:28, fontWeight:800, color:C.g800, marginBottom:8 }}>Regulamin serwisu</h1>
          <p style={{ fontSize:13, color:C.g400, marginBottom:32 }}>Wersja z dnia: 21 maja 2026 r.</p>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§1. Postanowienia ogólne</h2>
          <p>Serwis internetowy dostępny pod adresem <strong>rynekpracownika.pl</strong> prowadzony jest przez <strong>Roberta Godka</strong>, prowadzącego indywidualną działalność gospodarczą, z siedzibą: <strong>82A, 39-200 Stobierna</strong>, NIP: <strong>8722387194</strong>, REGON: <strong>387872177</strong> (zwanego dalej „Operatorem").</p>
          <p>Serwis jest platformą odwróconych ogłoszeń o pracę, na której Pracownicy publikują ogłoszenia ze swoimi oczekiwaniami zawodowymi, a Pracodawcy mogą wykupić dostęp do danych kontaktowych Pracowników.</p>
          <p>Korzystanie z Serwisu oznacza akceptację niniejszego Regulaminu. Kontakt z Operatorem: <strong>kontakt@rynekpracownika.pl</strong></p>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§2. Definicje</h2>
          <ul>
            <li><strong>Serwis</strong> — platforma internetowa dostępna pod adresem rynekpracownika.pl</li>
            <li><strong>Operator</strong> — Robert Godek, właściciel i administrator Serwisu</li>
            <li><strong>Pracownik</strong> — Użytkownik publikujący ogłoszenie jako szukający pracy</li>
            <li><strong>Pracodawca</strong> — Użytkownik wykupujący dostęp do danych kontaktowych</li>
            <li><strong>Ogłoszenie</strong> — profil zawodowy Pracownika opublikowany w Serwisie</li>
            <li><strong>Odblokowanie</strong> — wykupienie przez Pracodawcę dostępu do danych kontaktowych Pracownika</li>
          </ul>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§3. Rejestracja i konto użytkownika</h2>
          <ul>
            <li>Korzystanie z pełnej funkcjonalności Serwisu wymaga rejestracji i utworzenia konta.</li>
            <li>Użytkownik zobowiązany jest podać prawdziwe dane podczas rejestracji.</li>
            <li>Użytkownik zobowiązuje się do zachowania w tajemnicy hasła do swojego konta.</li>
            <li>Operator zastrzega sobie prawo do usunięcia konta naruszającego Regulamin.</li>
            <li>Jeden Użytkownik może posiadać tylko jedno konto w Serwisie.</li>
          </ul>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§4. Ogłoszenia Pracowników</h2>
          <ul>
            <li>Dodanie ogłoszenia przez Pracownika jest <strong>bezpłatne</strong>.</li>
            <li>Ogłoszenie jest aktywne przez <strong>30 dni</strong> od daty publikacji.</li>
            <li>Pracownik może w każdej chwili usunąć swoje ogłoszenie.</li>
            <li>Dane kontaktowe Pracownika są <strong>ukryte</strong> — widoczny jest tylko profil zawodowy.</li>
            <li>Zabrania się publikowania treści niezgodnych z prawem lub wprowadzających w błąd.</li>
          </ul>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§5. Konto Pracodawcy i odblokowanie kontaktów</h2>
          <ul>
            <li>Pracodawca po rejestracji może przeglądać ogłoszenia Pracowników.</li>
            <li>Dostęp do danych kontaktowych wymaga wykupienia Odblokowania zgodnie z cennikiem.</li>
            <li>Pakiet 10 odblokowań uprawnia do dostępu do danych 10 różnych Pracowników.</li>
            <li>Pracodawca zobowiązuje się do wykorzystania danych wyłącznie w celu rekrutacji.</li>
            <li>Zabrania się przekazywania danych kontaktowych Pracowników osobom trzecim.</li>
          </ul>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§6. Cennik</h2>
          <table>
            <thead><tr><th>Usługa</th><th>Cena brutto</th></tr></thead>
            <tbody>
              <tr><td>Pojedyncze odblokowanie kontaktu</td><td><strong>9 zł</strong></td></tr>
              <tr><td>Pakiet 10 odblokowań</td><td><strong>79 zł</strong></td></tr>
            </tbody>
          </table>
          <ul>
            <li>Wszystkie ceny są cenami brutto i zawierają podatek VAT.</li>
            <li>Faktury wystawiane są na żądanie — kontakt: kontakt@rynekpracownika.pl</li>
          </ul>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§7. Reklamacje i zwroty</h2>
          <ul>
            <li>Reklamacje należy składać na adres: <strong>kontakt@rynekpracownika.pl</strong></li>
            <li>Operator rozpatruje reklamacje w terminie <strong>14 dni roboczych</strong>.</li>
            <li>Ze względu na cyfrowy charakter usługi, prawo do odstąpienia od umowy nie przysługuje po uzyskaniu dostępu do danych kontaktowych (art. 38 pkt 13 ustawy o prawach konsumenta).</li>
            <li>W przypadku błędu technicznego Operator zobowiązuje się do zwrotu płatności lub ponownego udostępnienia usługi.</li>
          </ul>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§8. Odpowiedzialność</h2>
          <ul>
            <li>Operator nie ponosi odpowiedzialności za treść ogłoszeń publikowanych przez Pracowników.</li>
            <li>Operator nie pośredniczy w zawieraniu umów o pracę.</li>
            <li>Operator nie gwarantuje aktualności danych kontaktowych w momencie odblokowania.</li>
          </ul>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§9. Zmiany Regulaminu</h2>
          <ul>
            <li>Operator zastrzega sobie prawo do zmiany Regulaminu.</li>
            <li>O zmianach Użytkownicy zostaną powiadomieni emailem z <strong>14-dniowym</strong> wyprzedzeniem.</li>
          </ul>

          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:18, fontWeight:700, color:C.g800 }}>§10. Postanowienia końcowe</h2>
          <p>W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego. Regulamin wchodzi w życie z dniem <strong>21 maja 2026 r.</strong></p>

          <div style={{ marginTop:40, paddingTop:24, borderTop:`1px solid ${C.g100}`, fontSize:12, color:C.g400 }}>
            <p>Operator: Robert Godek, 82A, 39-200 Stobierna, NIP: 8722387194</p>
            <p>Kontakt: kontakt@rynekpracownika.pl</p>
          </div>
        </div>
      </div>
    </div>
  );
}