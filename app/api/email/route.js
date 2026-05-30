import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { type, to, data } = await request.json();

    let subject, html;

    if (type === "welcome_worker") {
      subject = "Witaj na rynekpracownika.pl! 👋";
      html = `
        <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #F5F7FA;">
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(26,115,232,0.06);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="background: linear-gradient(135deg, #1A73E8, #0D47A1); width: 60px; height: 60px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="color: white; font-size: 28px;">R</span>
              </div>
              <h1 style="font-size: 24px; font-weight: 800; color: #1E293B; margin: 0;">Witaj na rynekpracownika.pl!</h1>
            </div>
            <p style="color: #475569; font-size: 15px; line-height: 1.7;">Cześć <strong>${data.name || ""}!</strong></p>
            <p style="color: #475569; font-size: 15px; line-height: 1.7;">Twoje konto zostało utworzone. Możesz teraz dodać ogłoszenie i czekać aż firmy same się do Ciebie odezwą!</p>
            <div style="background: #F5F7FA; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #E8ECF0;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #94A3B8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Jak to działa?</p>
              <p style="margin: 0 0 8px; font-size: 14px; color: #475569;">✅ Dodajesz ogłoszenie ze swoją stawką — <strong>bezpłatnie</strong></p>
              <p style="margin: 0 0 8px; font-size: 14px; color: #475569;">🔒 Twoje dane są anonimowe dla firm</p>
              <p style="margin: 0; font-size: 14px; color: #475569;">📞 Firmy płacą za dostęp do Twoich danych i dzwonią do Ciebie</p>
            </div>
            <div style="text-align: center; margin-top: 32px;">
              <a href="https://rynekpracownika.pl/panel/pracownik" style="background: linear-gradient(135deg, #1A73E8, #0D47A1); color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">
                Dodaj pierwsze ogłoszenie →
              </a>
            </div>
          </div>
          <p style="text-align: center; color: #94A3B8; font-size: 12px; margin-top: 24px;">
            rynekpracownika.pl · <a href="https://rynekpracownika.pl/polityka-prywatnosci" style="color: #94A3B8;">Polityka prywatności</a>
          </p>
        </div>
      `;
    }

    if (type === "welcome_employer") {
      subject = "Witaj na rynekpracownika.pl! 🏢";
      html = `
        <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #F5F7FA;">
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(26,115,232,0.06);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 24px; font-weight: 800; color: #1E293B; margin: 0;">Witaj na rynekpracownika.pl!</h1>
            </div>
            <p style="color: #475569; font-size: 15px; line-height: 1.7;">Cześć <strong>${data.name || ""}!</strong></p>
            <p style="color: #475569; font-size: 15px; line-height: 1.7;">Twoje konto firmowe zostało utworzone. Możesz teraz przeglądać ogłoszenia pracowników i odblokowywać ich dane kontaktowe.</p>
            <div style="background: #F5F7FA; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #E8ECF0;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #475569;">🔍 Przeglądaj ogłoszenia pracowników</p>
              <p style="margin: 0 0 8px; font-size: 14px; color: #475569;">💳 Odblokuj kontakt za <strong>9 zł</strong> lub kup pakiet 10 za <strong>79 zł</strong></p>
              <p style="margin: 0; font-size: 14px; color: #475569;">📞 Dzwoń bezpośrednio do kandydatów</p>
            </div>
            <div style="text-align: center; margin-top: 32px;">
              <a href="https://rynekpracownika.pl/panel/pracodawca" style="background: linear-gradient(135deg, #1A73E8, #0D47A1); color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">
                Szukaj pracowników →
              </a>
            </div>
          </div>
          <p style="text-align: center; color: #94A3B8; font-size: 12px; margin-top: 24px;">
            rynekpracownika.pl · <a href="https://rynekpracownika.pl/polityka-prywatnosci" style="color: #94A3B8;">Polityka prywatności</a>
          </p>
        </div>
      `;
    }

    if (type === "expiry_warning") {
      subject = "⚠️ Twoje ogłoszenie wygasa za 7 dni";
      html = `
        <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #F5F7FA;">
          <div style="background: white; border-radius: 16px; padding: 40px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #1E293B;">Twoje ogłoszenie wygasa za 7 dni</h1>
            <p style="color: #475569; font-size: 15px; line-height: 1.7;">Ogłoszenie <strong>${data.role}</strong> wygaśnie za 7 dni. Zaloguj się i odśwież ogłoszenie żeby pozostało aktywne.</p>
            <div style="text-align: center; margin-top: 32px;">
              <a href="https://rynekpracownika.pl/panel/pracownik" style="background: linear-gradient(135deg, #1A73E8, #0D47A1); color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">
                Przejdź do panelu →
              </a>
            </div>
          </div>
        </div>
      `;
    }

    if (type === "contact") {
      subject = `📨 ${data.subject || "Wiadomość z formularza kontaktowego"}`;
      html = `
        <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #F5F7FA;">
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(26,115,232,0.06);">
            <h1 style="font-size: 20px; font-weight: 800; color: #1E293B; margin-bottom: 24px;">📨 Nowa wiadomość z formularza</h1>
            <div style="background: #F5F7FA; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #E8ECF0;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #94A3B8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Od:</p>
              <p style="margin: 0 0 16px; font-size: 15px; color: #1E293B; font-weight: 600;">${data.name} &lt;${data.email}&gt;</p>
              <p style="margin: 0 0 8px; font-size: 13px; color: #94A3B8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Temat:</p>
              <p style="margin: 0 0 16px; font-size: 15px; color: #1E293B;">${data.subject || "Brak tematu"}</p>
              <p style="margin: 0 0 8px; font-size: 13px; color: #94A3B8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Wiadomość:</p>
              <p style="margin: 0; font-size: 15px; color: #1E293B; line-height: 1.7; white-space: pre-wrap;">${data.message}</p>
            </div>
            <p style="font-size: 12px; color: #94A3B8; margin: 0;">Odpowiedz na: <a href="mailto:${data.email}" style="color: #1A73E8;">${data.email}</a></p>
          </div>
        </div>
      `;
    }

    const { data: emailData, error } = await resend.emails.send({
      from: "rynekpracownika.pl <kontakt@rynekpracownika.pl>",
      to,
      subject,
      html,
    });

    if (error) return Response.json({ error }, { status: 400 });
    return Response.json({ success: true, id: emailData.id });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}