import { NextRequest, NextResponse } from "next/server";
import { GitHubTelemetry, DevTier } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawHandle = (body.handle || "arjunkumar-dev").trim().toLowerCase().replace("@", "");

    // Simulate network & AST parsing latency
    await new Promise((resolve) => setTimeout(resolve, 750));

    let devTier: DevTier = "Advanced";
    let repos = 34;
    let stars = 142;
    let contributions = 847;
    let codeQualityScore = 91;
    let languages = [
      { name: "TypeScript", percentage: 48, color: "#3178c6" },
      { name: "Python", percentage: 28, color: "#3572A5" },
      { name: "Go", percentage: 14, color: "#00ADD8" },
      { name: "Rust", percentage: 10, color: "#dea584" },
    ];
    let detectedStack = [
      "Next.js 15",
      "React 19",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "TailwindCSS",
      "Turborepo",
    ];

    if (rawHandle.includes("rookie") || rawHandle.includes("beginner")) {
      devTier = "Novice";
      repos = 6;
      stars = 4;
      contributions = 120;
      codeQualityScore = 62;
      languages = [
        { name: "HTML/CSS", percentage: 50, color: "#e34c26" },
        { name: "JavaScript", percentage: 40, color: "#f1e05a" },
        { name: "Python", percentage: 10, color: "#3572A5" },
      ];
      detectedStack = ["React", "Express", "MongoDB"];
    } else if (rawHandle.includes("systems") || rawHandle.includes("architect") || rawHandle.includes("torvalds")) {
      devTier = "Elite Architect";
      repos = 88;
      stars = 1240;
      contributions = 2140;
      codeQualityScore = 98;
      languages = [
        { name: "Rust", percentage: 45, color: "#dea584" },
        { name: "Go", percentage: 35, color: "#00ADD8" },
        { name: "C++", percentage: 20, color: "#f34b7d" },
      ];
      detectedStack = ["Kubernetes", "gRPC", "eBPF", "Kafka", "PostgreSQL", "Docker", "Prometheus"];
    } else if (rawHandle.includes("fullstack") || rawHandle.includes("priya")) {
      devTier = "Advanced";
      repos = 42;
      stars = 210;
      contributions = 1120;
      codeQualityScore = 94;
      languages = [
        { name: "TypeScript", percentage: 60, color: "#3178c6" },
        { name: "Python", percentage: 25, color: "#3572A5" },
        { name: "SQL", percentage: 15, color: "#e38c00" },
      ];
      detectedStack = ["Next.js 15", "Node.js", "Redis", "Prisma", "TailwindCSS", "AWS"];
    } else {
      // Deterministic hash based on handle characters for custom handles
      const hash = rawHandle.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      repos = 15 + (hash % 30);
      stars = 20 + (hash % 150);
      contributions = 300 + (hash % 900);
      codeQualityScore = 75 + (hash % 20);
      devTier = contributions > 1000 ? "Advanced" : "Intermediate";
    }

    const telemetry: GitHubTelemetry = {
      handle: rawHandle,
      totalRepos: repos,
      starsCount: stars,
      contributionsThisYear: contributions,
      topLanguages: languages,
      detectedStack,
      devTier,
      verifiedAt: new Date().toISOString(),
      codeQualityScore,
      recentActivity: [
        { repo: `${rawHandle}/core-platform`, commits: 18, message: "Implement atomic commit logging" },
        { repo: `${rawHandle}/distributed-queue`, commits: 12, message: "Add backpressure buffer support" },
        { repo: `${rawHandle}/ai-agent-mesh`, commits: 24, message: "Upgrade embeddings pipeline to vLLM" },
      ],
    };

    return NextResponse.json({
      success: true,
      handle: rawHandle,
      telemetry,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to analyze GitHub" },
      { status: 500 }
    );
  }
}
