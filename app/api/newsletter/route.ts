import { Resend } from "resend";
import { newsletterSchema } from "@/lib/schemas";

type ApiResponse = { ok: boolean; error?: string };

function json(body: ApiResponse, status = 200) {
  return Response.json(body, { status });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid request" }, 400);
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid request" }, 400);
  }

  const { email, website } = parsed.data;

  // Honeypot filled → pretend success, send nothing
  if (website) return json({ ok: true });

  // Read env and create the client inside the handler: a missing key must not break the build
  const apiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  if (!apiKey || !notificationEmail) {
    console.error(
      `[newsletter] Not configured: missing ${[!apiKey && "RESEND_API_KEY", !notificationEmail && "NOTIFICATION_EMAIL"]
        .filter(Boolean)
        .join(" and ")}`,
    );
    return json(
      { ok: false, error: "Subscriptions are not available right now. Please try again later." },
      503,
    );
  }

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: "Coffea <onboarding@resend.dev>",
      to: notificationEmail,
      subject: "New Coffea newsletter signup",
      // Plain text only: the user's email never goes into HTML
      text: `Email: ${email}\nTime: ${new Date().toUTCString()}`,
    });
    if (error) {
      console.error("[newsletter] Resend error:", error);
      return json({ ok: false, error: "Could not subscribe. Please try again later." }, 502);
    }
  } catch (err) {
    console.error("[newsletter] Resend request failed:", err);
    return json({ ok: false, error: "Could not subscribe. Please try again later." }, 502);
  }

  return json({ ok: true });
}
