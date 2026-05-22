import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  // Zabezpieczenie — tylko Vercel Cron może wywołać
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in8days = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);

    // Pobierz ogłoszenia wygasające za dokładnie 7 dni
    const { data: ads, error } = await supabase
      .from("ads")
      .select("*, profiles(name, email)")
      .gte("expires_at", in7days.toISOString())
      .lt("expires_at", in8days.toISOString());

    if (error) throw error;
    if (!ads || ads.length === 0) {
      return Response.json({ message: "Brak ogłoszeń do powiadomienia", count: 0 });
    }

    // Wyślij email do każdego
    const results = await Promise.all(
      ads.map(async (ad) => {
        const email = ad.profiles?.email;
        const name = ad.profiles?.name?.split(" ")[0] || "";
        if (!email) return { id: ad.id, status: "brak emaila" };

        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "expiry_warning",
            to: email,
            data: { role: ad.role, name },
          }),
        });

        return { id: ad.id, status: res.ok ? "wysłano" : "błąd" };
      })
    );

    return Response.json({ message: "Powiadomienia wysłane", count: ads.length, results });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}