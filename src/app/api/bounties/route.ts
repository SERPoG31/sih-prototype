import { NextRequest, NextResponse } from "next/server";
import { INITIAL_BOUNTIES } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    bounties: INITIAL_BOUNTIES,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const bountyId = body.bountyId || "bounty-zerodha-02";
    const prUrl = body.prUrl || "https://github.com/zerodha/sandbox-challenges/pull/42";

    // Simulate CI/CD runner latency
    await new Promise((resolve) => setTimeout(resolve, 900));

    // Automated Scoring Preview Engine
    const score = 95 + Math.floor(Math.random() * 4); // 95-98

    return NextResponse.json({
      success: true,
      bountyId,
      prUrl,
      score,
      testSuiteResults: {
        totalTests: 14,
        passed: 14,
        failed: 0,
        coveragePct: 94.2,
      },
      automatedReviewCritique:
        "Automated GitHub CI Action succeeded: Benchmarked zero heap allocations per tick under 50k ops/sec. Memory profiling passes without leaked descriptors.",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Bounty submission error" },
      { status: 500 }
    );
  }
}
