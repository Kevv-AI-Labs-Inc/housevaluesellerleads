import { NextRequest, NextResponse } from "next/server";
import { generateValuation } from "@/lib/ai/valuation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address || typeof address !== "string" || address.trim().length < 5) {
      return NextResponse.json(
        { error: "请输入有效的房屋地址" },
        { status: 400 }
      );
    }

    const result = await generateValuation(address.trim());

    if (!result.success) {
      return NextResponse.json(
        { error: "估值服务暂时不可用，请稍后重试" },
        { status: 500 }
      );
    }

    // Optionally save to database (non-blocking)
    // We'll save when user provides email via /api/leads

    return NextResponse.json({
      success: true,
      address: address.trim(),
      valuation: result.data,
      model: result.model,
    });
  } catch (error) {
    console.error("Valuation API error:", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}
