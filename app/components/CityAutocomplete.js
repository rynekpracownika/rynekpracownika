"use client";
import { useState, useRef } from "react";

const C = {
  blue:"#1A73E8", bg:"#F5F7FA", white:"#FFFFFF",
  g100:"#E8ECF0", g200:"#CBD5E1", g400:"#94A3B8", g800:"#1E293B",
};

const CITIES_BY_REGION = {
  "Dolnośląskie": ["Wrocław","Legnica","Wałbrzych","Jelenia Góra","Lubin","Świdnica","Bolesławiec","Głogów","Nowa Sól","Polkowice","Dzierżoniów","Kłodzko","Oleśnica","Oława","Strzelin","Trzebnica","Ząbkowice Śląskie","Zgorzelec","Bielawa","Bystrzyca Kłodzka","Jawor","Kamienna Góra","Lwówek Śląski","Milicz","Nowa Ruda","Stronie Śląskie","Świebodzice","Złotoryja"],
  "Kujawsko-Pomorskie": ["Bydgoszcz","Toruń","Włocławek","Grudziądz","Inowrocław","Brodnica","Chełmno","Ciechocinek","Golub-Dobrzyń","Lipno","Nakło nad Notecią","Nowe Miasto Lubawskie","Rypin","Sępólno Krajeńskie","Solec Kujawski","Szubin","Świecie","Tuchola","Wąbrzeźno","Żnin","Aleksandrów Kujawski","Chodzież","Kcynia","Kruszwica","Mogilno","Radziejów","Strzelno","Szamotuły"],
  "Lubelskie": ["Lublin","Zamość","Chełm","Biała Podlaska","Puławy","Stalowa Wola","Kraśnik","Świdnik","Łuków","Radzyń Podlaski","Hrubieszów","Tomaszów Lubelski","Janów Lubelski","Opole Lubelskie","Biłgoraj","Włodawa","Annopol","Dęblin","Józefów","Kazimierz Dolny","Krasnystaw","Łęczna","Międzyrzec Podlaski","Parczew","Poniatowa","Rejowiec Fabryczny","Ryki","Szczebrzeszyn","Turobin","Zwierzyniec"],
  "Lubuskie": ["Zielona Góra","Gorzów Wielkopolski","Nowa Sól","Żary","Żagań","Gubin","Krosno Odrzańskie","Lubsko","Słubice","Świebodzin","Sulęcin","Strzelce Krajeńskie","Drezdenko","Kostrzyn nad Odrą","Międzyrzecz","Rzepin","Skwierzyna","Wschowa"],
  "Łódź i okolice": ["Łódź","Piotrków Trybunalski","Pabianice","Tomaszów Mazowiecki","Bełchatów","Zgierz","Skierniewice","Radomsko","Zduńska Wola","Sieradz","Kutno","Łęczyca","Łowicz","Opoczno","Wieluń","Brzeziny","Konstantynów Łódzki","Ozorków","Rawa Mazowiecka","Wieruszów","Aleksandrów Łódzki","Działoszyn","Głowno","Koluszki","Łask","Poddębice","Szadek","Tuszyn","Warta","Zelów"],
  "Małopolskie": ["Kraków","Tarnów","Nowy Sącz","Oświęcim","Chrzanów","Nowy Targ","Zakopane","Wieliczka","Olkusz","Gorlice","Brzesko","Myślenice","Limanowa","Sucha Beskidzka","Wadowice","Andrychów","Bochnia","Ciężkowice","Dąbrowa Tarnowska","Jordanów","Kalwaria Zebrzydowska","Kęty","Krzeszowice","Maków Podhalański","Miechów","Mszana Dolna","Nowe Brzesko","Niepołomice","Proszowice","Rabka-Zdrój","Skała","Skawina","Słomniki","Stary Sącz","Szczawnica","Tuchów","Wolbrom"],
  "Mazowieckie": ["Warszawa","Radom","Płock","Siedlce","Pruszków","Legionowo","Otwock","Wołomin","Nowy Dwór Mazowiecki","Żyrardów","Grodzisk Mazowiecki","Mińsk Mazowiecki","Ostrołęka","Ciechanów","Mława","Pułtusk","Płońsk","Sochaczew","Łomianki","Piaseczno","Konstancin-Jeziorna","Józefów","Marki","Zielonka","Ząbki","Kobyłka","Tłuszcz","Wyszków","Maków Mazowiecki","Różan","Sierpc","Sokołów Podlaski","Węgrów","Zwoleń","Kozienice","Lipsko","Przysucha","Szydłowiec"],
  "Opolskie": ["Opole","Kędzierzyn-Koźle","Nysa","Brzeg","Kluczbork","Prudnik","Strzelce Opolskie","Głubczyce","Namysłów","Olesno","Dobrodzień","Głuchołazy","Grodków","Krapkowice","Lewin Brzeski","Otmuchów","Paczków","Praszka","Zdzieszowice"],
  "Podkarpackie": ["Rzeszów","Przemyśl","Stalowa Wola","Mielec","Tarnobrzeg","Krosno","Dębica","Sanok","Jarosław","Jasło","Łańcut","Nisko","Przeworsk","Ropczyce","Leżajsk","Brzozów","Dynów","Kolbuszowa","Lesko","Lubaczów","Nowa Dęba","Nowy Sącz","Radymno","Sędziszów Małopolski","Strzyżów","Ustrzyki Dolne","Zagórz"],
  "Podlaskie": ["Białystok","Suwałki","Łomża","Bielsk Podlaski","Augustów","Hajnówka","Zambrów","Grajewo","Kolno","Mońki","Sejny","Siemiatycze","Sokółka","Wysokie Mazowieckie"],
  "Pomorskie": ["Gdańsk","Gdynia","Sopot","Słupsk","Tczew","Starogard Gdański","Wejherowo","Rumia","Reda","Chojnice","Kościerzyna","Kartuzy","Malbork","Kwidzyn","Lębork","Bytów","Puck","Człuchów","Nowy Dwór Gdański","Pruszcz Gdański","Ustka","Miastko","Szczecinek"],
  "Śląskie": ["Katowice","Częstochowa","Sosnowiec","Gliwice","Zabrze","Bielsko-Biała","Bytom","Rybnik","Ruda Śląska","Tychy","Dąbrowa Górnicza","Chorzów","Jastrzębie-Zdrój","Mysłowice","Jaworzno","Siemianowice Śląskie","Żory","Piekary Śląskie","Tarnowskie Góry","Będzin","Czeladź","Świętochłowice","Knurów","Mikołów","Żywiec","Cieszyn","Oświęcim","Zawiercie","Wodzisław Śląski","Olkusz","Racibórz","Radzionków","Czerwionka-Leszczyny","Lubliniec","Pszczyna","Lędziny","Łaziska Górne"],
  "Świętokrzyskie": ["Kielce","Ostrowiec Świętokrzyski","Starachowice","Skarżysko-Kamienna","Końskie","Busko-Zdrój","Jędrzejów","Sandomierz","Staszów","Pińczów","Włoszczowa","Kazimierza Wielka","Połaniec","Suchedniów"],
  "Warmińsko-Mazurskie": ["Olsztyn","Elbląg","Ełk","Ostróda","Iława","Giżycko","Kętrzyn","Bartoszyce","Mrągowo","Szczytno","Lidzbark Warmiński","Pisz","Nidzica","Działdowo","Braniewo","Górowo Iławeckie","Nowe Miasto Lubawskie","Olecko","Węgorzewo"],
  "Wielkopolskie": ["Poznań","Kalisz","Konin","Leszno","Gniezno","Piła","Ostrów Wielkopolski","Swarzędz","Luboń","Śrem","Szamotuły","Wągrowiec","Jarocin","Krotoszyn","Koło","Turek","Rawicz","Gostyń","Środa Wielkopolska","Złotów","Słupca","Czarnków","Nowy Tomyśl","Pleszew","Kępno","Wolsztyn","Wronki","Chodzież","Trzcianka","Obrzycko"],
  "Zachodniopomorskie": ["Szczecin","Koszalin","Świnoujście","Stargard","Kołobrzeg","Goleniów","Police","Gryfino","Białogard","Świdwin","Wałcz","Drawsko Pomorskie","Złocieniec","Czaplinek","Kamień Pomorski","Gryfice","Międzyzdroje","Pyrzyce","Myślibórz","Dębno","Nowogard","Choszczno"],
};

export default function CityAutocomplete({ value, onChange, placeholder="np. Katowice", region="" }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  function handleChange(val) {
    setQuery(val);
    onChange(val);
    if (val.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const q = val.toLowerCase();
    const regionCities = region && CITIES_BY_REGION[region] ? CITIES_BY_REGION[region] : Object.values(CITIES_BY_REGION).flat();
    const found = regionCities
      .filter(c => c.toLowerCase().includes(q))
      .slice(0, 6);
    setSuggestions(found);
    setOpen(found.length > 0);
  }

  function selectCity(city) {
    setQuery(city);
    onChange(city);
    setOpen(false);
    setSuggestions([]);
  }

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <input
        placeholder={placeholder}
        value={query}
        onChange={e => handleChange(e.target.value)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${C.g200}`, fontSize:13, background:C.bg, outline:"none", color:C.g800 }}
      />
      {open && suggestions.length > 0 && (
        <div style={{ position:"absolute", top:"100%", left:0, right:0, background:C.white, borderRadius:8, border:`1px solid ${C.g200}`, boxShadow:"0 4px 16px rgba(0,0,0,0.1)", zIndex:100, marginTop:4, overflow:"hidden" }}>
          {suggestions.map((city, i) => (
            <div
              key={i}
              onMouseDown={() => selectCity(city)}
              style={{ padding:"10px 14px", fontSize:13, color:C.g800, cursor:"pointer", borderBottom:i<suggestions.length-1?`1px solid ${C.g100}`:"none", background:C.white }}
              onMouseEnter={e => e.currentTarget.style.background = C.bg}
              onMouseLeave={e => e.currentTarget.style.background = C.white}
            >
              📍 {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}