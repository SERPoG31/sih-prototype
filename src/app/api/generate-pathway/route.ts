import { NextRequest, NextResponse } from "next/server";
import { BridgePathway, PathwayDayPlan } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const roleTitle = body.roleTitle || "Backend Platform Engineer Intern";
    const company = body.company || "Razorpay";
    const requiredSkills: string[] = body.requiredSkills || [
      "Distributed Systems",
      "Docker & Kubernetes",
      "PostgreSQL & Redis",
    ];
    const studentSkills: string[] = body.studentSkills || ["TypeScript & React", "Next.js App Router"];

    // Compute Delta: missing skills
    const missingSkills = requiredSkills.filter(
      (req) => !studentSkills.some((s) => s.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(s.toLowerCase()))
    );

    const matchPercentage = Math.round(
      ((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100
    );

    const primaryFocusSkill = missingSkills[0] || requiredSkills[0] || "Distributed Systems";

    // Build curated 5-Day Sprint Plan
    const sprintPlan: PathwayDayPlan[] = [
      {
        day: 1,
        topic: `Architectural Principles of ${primaryFocusSkill}`,
        curatedDocs: [
          { title: "Martin Kleppmann: Designing Data-Intensive Applications Ch. 5-7", url: "https://dataintensive.net", timeEstimate: "45 mins" },
          { title: "Production Postmortem Analysis: Mitigating Distributed Split-Brain", url: "https://highscalability.com", timeEstimate: "30 mins" },
        ],
        dailyTask: "Map out failure domain boundaries and write an RFC draft for state replication.",
        assessmentSnippetPrompt: "Identify consensus failure states in a 3-node cluster.",
      },
      {
        day: 2,
        topic: "Production Patterns & Real-World Codebases",
        curatedDocs: [
          { title: "Razorpay Engineering: Zero-Downtime Database Migrations at Scale", url: "https://engineering.razorpay.com", timeEstimate: "35 mins" },
          { title: "Uber Tech: Consistent Hashing Ring Implementations", url: "https://www.uber.com/en-IN/blog/engineering/", timeEstimate: "40 mins" },
        ],
        dailyTask: "Clone the reference open-source repository and trace the transaction commit path.",
        assessmentSnippetPrompt: "Write a deterministic hash ring ring-slot assignment function.",
      },
      {
        day: 3,
        topic: "Hands-on Implementation & Resilience Engineering",
        curatedDocs: [
          { title: "Redis Enterprise: Distributed Lock Patterns (Redlock Algorithm)", url: "https://redis.io/topics/distlock", timeEstimate: "25 mins" },
          { title: "Resilience4j & Circuit Breaker State Machine Specifications", url: "https://resilience4j.readme.io", timeEstimate: "30 mins" },
        ],
        dailyTask: "Implement exponential backoff with full jitter in an asynchronous retry loop.",
        assessmentSnippetPrompt: "Fix a race condition in a Redis lock lease expiration handler.",
      },
      {
        day: 4,
        topic: "Benchmarking, Profiling & Chaos Verification",
        curatedDocs: [
          { title: "Brendan Gregg: FlameGraph CPU & Allocation Profiling Guide", url: "https://www.brendangregg.com/flamegraphs.html", timeEstimate: "50 mins" },
          { title: "k6 Load Testing: Simulating 10,000 Concurrent Webhook Dispatches", url: "https://k6.io/docs", timeEstimate: "30 mins" },
        ],
        dailyTask: "Run local chaos test by injecting 150ms synthetic latency and verify graceful degradation.",
        assessmentSnippetPrompt: "Optimize a query that produces an unindexed sequential scan.",
      },
      {
        day: 5,
        topic: "Mini-Assessment & Platform Verification",
        curatedDocs: [
          { title: "SkillNexus Sandbox Evaluation Rubric", url: "#", timeEstimate: "15 mins" },
        ],
        dailyTask: "Complete the 3-minute in-browser live challenge in SkillNexus Sandbox to earn your Platform-Verified Badge.",
        assessmentSnippetPrompt: "Complete in-browser coding check and submit PR.",
      },
    ];

    const pathway: BridgePathway = {
      id: `PATHWAY-${Date.now().toString().slice(-6)}`,
      targetRole: roleTitle,
      companyName: company,
      missingSkills,
      matchPercentage,
      sprintPlan,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      pathway,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to generate bridge pathway" },
      { status: 500 }
    );
  }
}
