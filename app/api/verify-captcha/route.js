import { NextResponse } from "next/server";

export async function POST(req) {
  const { token } = await req.json();

  console.log("CAPTCHA token:", token);
  console.log("Secret key exists:", !!process.env.TURNSTILE_SECRET_KEY);

  const formData = new URLSearchParams();
  formData.append("secret", process.env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  const data = await res.json();
  console.log("Cloudflare response:", JSON.stringify(data));

  if (!data.success) {
    return NextResponse.json({ error: "Weryfikacja CAPTCHA nie powiodła się.", details: data }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}