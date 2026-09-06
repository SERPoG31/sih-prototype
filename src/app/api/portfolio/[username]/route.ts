import { NextRequest, NextResponse } from "next/server";
import {
  DEMO_PERSONAS,
  INITIAL_BOUNTIES,
  INITIAL_CERTIFICATES,
  INITIAL_GITHUB,
  INITIAL_LORS,
  INITIAL_SKILLS,
} from "@/lib/mock-data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const normalized = (username || "arjun-kumar").toLowerCase();

    const student = DEMO_PERSONAS.find(
      (p) => p.id === normalized || p.name.toLowerCase().replace(/\s+/g, "-") === normalized
    ) || DEMO_PERSONAS[0];

    return NextResponse.json({
      success: true,
      username: normalized,
      student,
      skills: INITIAL_SKILLS,
      certificates: INITIAL_CERTIFICATES,
      github: INITIAL_GITHUB,
      bounties: INITIAL_BOUNTIES.filter((b) => b.status === "Completed"),
      lors: INITIAL_LORS,
      readinessScore: 89,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Portfolio lookup failed" },
      { status: 500 }
    );
  }
}
