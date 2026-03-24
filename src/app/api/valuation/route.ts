import { NextRequest, NextResponse } from "next/server";
import { generateValuation } from "@/lib/ai/valuation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // ── Origin check ──────────────────────────────────
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const host = request.headers.get("host");

    if (origin && host && !origin.includes(host)) {
      return NextResponse.json(
        { errorCode: "FORBIDDEN", error: "Cross-origin requests not allowed" },
        { status: 403 }
      );
    }

    if (!origin && !referer) {
      // Allow server-side or curl for development, but log it
      console.warn("[Valuation] Request without origin/referer");
    }

    // ── Rate limiting ─────────────────────────────────
    const ip = getClientIp(request.headers);
    const rateCheck = checkRateLimit(`valuation:${ip}`, {
      limit: 10,
      windowSeconds: 60,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          errorCode: "RATE_LIMITED",
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((rateCheck.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateCheck.resetAt - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    // ── Input validation ──────────────────────────────
    const body = await request.json();
    const { address, locale } = body;

    if (!address || typeof address !== "string" || address.trim().length < 5) {
      return NextResponse.json(
        { errorCode: "INVALID_ADDRESS", error: "Invalid address" },
        { status: 400 }
      );
    }

    // ── Generate valuation ────────────────────────────
    const userLocale =
      locale === "zh" || locale === "en" ? locale : "en";
    const result = await generateValuation(address.trim(), userLocale);

    if (!result.success) {
      return NextResponse.json(
        {
          errorCode: result.errorCode || "VALUATION_FAILED",
          error: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      address: address.trim(),
      valuation: result.data,
      model: result.model,
    });
  } catch (error) {
    console.error("Valuation API error:", error);
    return NextResponse.json(
      { errorCode: "SERVER_ERROR", error: "Internal server error" },
      { status: 500 }
    );
  }
}
