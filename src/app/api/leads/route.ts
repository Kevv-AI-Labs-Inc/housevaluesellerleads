import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, address, agentSlug, valuationResult } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "请输入有效的邮箱地址" },
        { status: 400 }
      );
    }

    // For now, save to a simple file store
    // In production with DATABASE_URL configured, this would use Drizzle
    const lead = {
      email: email.trim(),
      address: address || "",
      agentSlug: agentSlug || "default",
      valuationResult: valuationResult || null,
      createdAt: new Date().toISOString(),
    };

    // Try database insert, fall back to console log
    try {
      const { db } = await import("@/lib/db");
      const { leads } = await import("@/lib/db/schema");
      await db.insert(leads).values({
        email: lead.email,
        address: lead.address,
        agentSlug: lead.agentSlug,
      });
      console.log("✅ Lead saved to database:", lead.email);
    } catch {
      // Database not configured yet, log it
      console.log("📋 Lead captured (no DB):", JSON.stringify(lead, null, 2));
    }

    return NextResponse.json({
      success: true,
      message: "感谢您的关注！完整估价报告将发送到您的邮箱。",
    });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { error: "提交失败，请稍后重试" },
      { status: 500 }
    );
  }
}
