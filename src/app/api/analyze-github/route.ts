import { NextRequest, NextResponse } from "next/server";
import { GitHubTelemetry, DevTier } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawHandle = (body.handle || "arjunkumar-dev").trim().toLowerCase().replace("@", "");

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
    let isLive = false;
    let avatarUrl: string | undefined = undefined;

    // 1. Attempt Live GitHub API Fetch (3.5s timeout for fast response)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(rawHandle)}`, {
        headers: {
          "User-Agent": "SkillNexus-SIH2026-Verifier",
          Accept: "application/vnd.github.v3+json",
        },
        signal: controller.signal,
        next: { revalidate: 3600 },
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        avatarUrl = userData.avatar_url;

        const reposRes = await fetch(
          `https://api.github.com/users/${encodeURIComponent(rawHandle)}/repos?sort=updated&per_page=30`,
          {
            headers: {
              "User-Agent": "SkillNexus-SIH2026-Verifier",
              Accept: "application/vnd.github.v3+json",
            },
            signal: controller.signal,
            next: { revalidate: 3600 },
          }
        );

        clearTimeout(timeoutId);

        if (reposRes.ok) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const reposData: any[] = await reposRes.json();
          isLive = true;

          repos = userData.public_repos ?? reposData.length;
          stars = reposData.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
          contributions = Math.max(120, (userData.public_repos || 10) * 26 + (userData.followers || 0) * 8);

          // Extract top languages
          const langCounts: Record<string, number> = {};
          reposData.forEach((r) => {
            if (r.language) {
              langCounts[r.language] = (langCounts[r.language] || 0) + 1;
            }
          });

          const langEntries = Object.entries(langCounts);
          if (langEntries.length > 0) {
            const totalCount = langEntries.reduce((acc, [, c]) => acc + c, 0);
            const langColors: Record<string, string> = {
              TypeScript: "#3178c6",
              JavaScript: "#f1e05a",
              Python: "#3572A5",
              Go: "#00ADD8",
              Rust: "#dea584",
              "C++": "#f34b7d",
              C: "#555555",
              Java: "#b07219",
              HTML: "#e34c26",
              CSS: "#563d7c",
              Shell: "#89e051",
            };
            languages = langEntries
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([name, count]) => ({
                name,
                percentage: Math.max(5, Math.round((count / totalCount) * 100)),
                color: langColors[name] || "#6366f1",
              }));
          }

          // Evaluate dev tier and quality
          if (repos > 40 || stars > 500) {
            devTier = "Elite Architect";
            codeQualityScore = 96;
            detectedStack = ["Kubernetes", "gRPC", "Docker", "PostgreSQL", "Next.js", "Redis"];
          } else if (repos > 15 || stars > 30) {
            devTier = "Advanced";
            codeQualityScore = 91;
            detectedStack = ["Next.js 15", "React 19", "TailwindCSS", "Node.js", "TypeScript"];
          } else if (repos > 5) {
            devTier = "Intermediate";
            codeQualityScore = 80;
            detectedStack = ["React", "Express", "Node.js", "MongoDB", "CSS"];
          } else {
            devTier = "Novice";
            codeQualityScore = 65;
            detectedStack = ["HTML5", "JavaScript", "CSS3"];
          }
        }
      } else {
        clearTimeout(timeoutId);
      }
    } catch {
      // Graceful fallback to deterministic mock below
      isLive = false;
    }

    // 2. Deterministic Mock Fallback (if live fetch failed or wasn't applicable)
    if (!isLive) {
      await new Promise((resolve) => setTimeout(resolve, 600));

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
        const hash = rawHandle.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        repos = 15 + (hash % 30);
        stars = 20 + (hash % 150);
        contributions = 300 + (hash % 900);
        codeQualityScore = 75 + (hash % 20);
        devTier = contributions > 1000 ? "Advanced" : "Intermediate";
      }
    }

    const telemetry: GitHubTelemetry = {
      handle: rawHandle,
      avatarUrl,
      isLive,
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
      isLive,
      telemetry,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to analyze GitHub" },
      { status: 500 }
    );
  }
}
