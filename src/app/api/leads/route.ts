import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { escapeHtml } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    // ── Origin check ──────────────────────────────────
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    if (origin && host && !origin.includes(host)) {
      return NextResponse.json(
        { errorCode: "FORBIDDEN", error: "Cross-origin requests not allowed" },
        { status: 403 }
      );
    }

    // ── Rate limiting ─────────────────────────────────
    const ip = getClientIp(request.headers);
    const rateCheck = checkRateLimit(`leads:${ip}`, {
      limit: 30,
      windowSeconds: 60,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { errorCode: "RATE_LIMITED", error: "Too many requests" },
        { status: 429 }
      );
    }

    // ── Input validation ──────────────────────────────
    const body = await request.json();
    const { email, phone, name, address, agentSlug, valuationResult } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { errorCode: "INVALID_EMAIL", error: "Invalid email address" },
        { status: 400 }
      );
    }

    const lead = {
      email: email.trim(),
      phone: phone?.trim() || "",
      name: name?.trim() || "",
      address: address || "",
      agentSlug: agentSlug || "default",
      valuationResult: valuationResult || null,
      createdAt: new Date().toISOString(),
    };

    // ── Database insert ───────────────────────────────
    try {
      const { getDb } = await import("@/lib/db");
      const db = getDb();
      if (db) {
        const { leads } = await import("@/lib/db/schema");
        await db.insert(leads).values({
          email: lead.email,
          phone: lead.phone || null,
          name: lead.name || null,
          address: lead.address,
          agentSlug: lead.agentSlug,
        });
        console.log("✅ Lead saved to database:", lead.email);
      } else {
        console.log("📋 Lead captured (no DB):", JSON.stringify(lead, null, 2));
      }
    } catch {
      console.log("📋 Lead captured (DB error):", JSON.stringify(lead, null, 2));
    }

    // ── Agent Notification (non-blocking) ─────────────
    notifyAgent(lead).catch((err) =>
      console.error("Agent notification failed:", err)
    );

    return NextResponse.json({
      success: true,
      message: "Lead captured successfully.",
    });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { errorCode: "SERVER_ERROR", error: "Submission failed" },
      { status: 500 }
    );
  }
}

// ── Notification helpers ──────────────────────────────────

interface LeadData {
  email: string;
  phone: string;
  name: string;
  address: string;
  agentSlug: string;
  valuationResult: unknown;
  createdAt: string;
}

async function notifyAgent(lead: LeadData) {
  const tasks: Promise<void>[] = [];

  const notifyEmail = process.env.AGENT_NOTIFICATION_EMAIL;
  if (notifyEmail) {
    tasks.push(sendEmailNotification(notifyEmail, lead));
  }

  const webhookUrl = process.env.AGENT_WEBHOOK_URL;
  if (webhookUrl) {
    tasks.push(sendWebhookNotification(webhookUrl, lead));
  }

  await Promise.allSettled(tasks);
}

async function sendEmailNotification(toEmail: string, lead: LeadData) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log(
      `📧 Would notify ${toEmail} about new lead: ${lead.email} (${lead.address})`
    );
    return;
  }

  // Sanitize all user-provided values before embedding in HTML
  const safeEmail = escapeHtml(lead.email);
  const safePhone = escapeHtml(lead.phone || "—");
  const safeName = escapeHtml(lead.name || "—");
  const safeAddress = escapeHtml(lead.address);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "Smart Value <noreply@smartvalue.ai>",
      to: [toEmail],
      subject: `🏠 New Seller Lead: ${lead.address}`,
      html: `
        <div style="font-family: system-ui; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #6366f1;">🏠 New Lead from Smart Value</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0; font-weight: 600;">${safeEmail}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0; font-weight: 600;">${safePhone}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Name</td><td style="padding: 8px 0; font-weight: 600;">${safeName}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Address</td><td style="padding: 8px 0; font-weight: 600;">${safeAddress}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Time</td><td style="padding: 8px 0;">${lead.createdAt}</td></tr>
          </table>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">Powered by Smart Value AI</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    console.error("Resend email failed:", await res.text());
  } else {
    console.log(`✅ Notification email sent to ${toEmail}`);
  }
}

async function sendWebhookNotification(url: string, lead: LeadData) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "lead.created",
      data: lead,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    console.error("Webhook failed:", res.status);
  } else {
    console.log(`✅ Webhook sent to ${url}`);
  }
}
