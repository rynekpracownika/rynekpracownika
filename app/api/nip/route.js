export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const nip = searchParams.get("nip")?.replace(/[-\s]/g, "");

  if (!nip || nip.length !== 10) {
    return Response.json({ error: "Nieprawidłowy NIP", valid: false }, { status: 400 });
  }

  try {
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(
      `https://wl-api.mf.gov.pl/api/search/nip/${nip}?date=${today}`,
      { headers: { "Accept": "application/json" } }
    );
    const data = await res.json();

    if (data?.result?.subject) {
      const s = data.result.subject;
      return Response.json({
        name: s.name,
        city: s.workingAddress || "",
        street: "",
        valid: true,
      });
    }
    return Response.json({ error: "Nie znaleziono firmy", valid: false });
  } catch (e) {
    return Response.json({ error: "Błąd połączenia", valid: false });
  }
}