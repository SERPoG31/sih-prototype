import { NextResponse } from "next/server";
import { MarketDemandItem, MarketDemandResponse } from "@/lib/types";

// Deterministic Indian Tech Market Benchmark Dataset
const BENCHMARK_ITEMS: MarketDemandItem[] = [
  // Frontend
  {
    technology: "Next.js",
    category: "Frontend",
    openPositions: 16840,
    trend: "surging",
    growthRatePercent: 64,
    topLocations: ["Bengaluru", "Hyderabad", "Delhi/NCR"],
    averageSalaryLPA: 18.5,
    marketInsight: "Rapid adoption by Indian unicorn startups transitioning to Server Components and edge rendering.",
  },
  {
    technology: "React",
    category: "Frontend",
    openPositions: 24500,
    trend: "stable",
    growthRatePercent: 18,
    topLocations: ["Bengaluru", "Pune", "Hyderabad"],
    averageSalaryLPA: 16.0,
    marketInsight: "Baseline core requirement across enterprise digital transformation and consumer web applications.",
  },
  {
    technology: "TypeScript",
    category: "Frontend",
    openPositions: 28200,
    trend: "stable",
    growthRatePercent: 28,
    topLocations: ["Bengaluru", "Hyderabad", "Pune"],
    averageSalaryLPA: 17.5,
    marketInsight: "Universal standard for enterprise maintainability across full-stack applications.",
  },

  // Backend
  {
    technology: "Rust",
    category: "Backend",
    openPositions: 3420,
    trend: "surging",
    growthRatePercent: 94,
    topLocations: ["Bengaluru", "Delhi/NCR", "Hyderabad"],
    averageSalaryLPA: 28.0,
    marketInsight: "High compensation for zero-allocation infra, blockchain protocols, and low-latency financial engines.",
  },
  {
    technology: "Go",
    category: "Backend",
    openPositions: 7850,
    trend: "surging",
    growthRatePercent: 78,
    topLocations: ["Bengaluru", "Pune", "Hyderabad"],
    averageSalaryLPA: 24.2,
    marketInsight: "Preferred replacement for heavy Java backend microservices in payments and trading platforms.",
  },
  {
    technology: "Node.js",
    category: "Backend",
    openPositions: 19400,
    trend: "stable",
    growthRatePercent: 14,
    topLocations: ["Bengaluru", "Delhi/NCR", "Pune"],
    averageSalaryLPA: 15.5,
    marketInsight: "Dominant runtime for fast I/O microservices and API gateways.",
  },
  {
    technology: "Python",
    category: "Backend",
    openPositions: 26100,
    trend: "stable",
    growthRatePercent: 22,
    topLocations: ["Bengaluru", "Hyderabad", "Delhi/NCR"],
    averageSalaryLPA: 18.0,
    marketInsight: "Universal backend language for microservices, data engineering, and ML model serving.",
  },

  // Cloud/DevOps
  {
    technology: "Kubernetes",
    category: "Cloud/DevOps",
    openPositions: 12800,
    trend: "surging",
    growthRatePercent: 48,
    topLocations: ["Bengaluru", "Pune", "Delhi/NCR"],
    averageSalaryLPA: 23.5,
    marketInsight: "Standard platform engineering requirement for container orchestration and hybrid cloud.",
  },
  {
    technology: "Docker",
    category: "Cloud/DevOps",
    openPositions: 22400,
    trend: "stable",
    growthRatePercent: 19,
    topLocations: ["Bengaluru", "Hyderabad", "Pune"],
    averageSalaryLPA: 16.5,
    marketInsight: "Fundamental baseline skill expected of every junior and mid-level software engineer.",
  },
  {
    technology: "AWS",
    category: "Cloud/DevOps",
    openPositions: 31000,
    trend: "stable",
    growthRatePercent: 25,
    topLocations: ["Bengaluru", "Hyderabad", "Delhi/NCR"],
    averageSalaryLPA: 19.5,
    marketInsight: "Largest public cloud footprint across Indian tech sector and enterprise migrations.",
  },

  // AI/ML
  {
    technology: "PyTorch",
    category: "AI/ML",
    openPositions: 6400,
    trend: "surging",
    growthRatePercent: 142,
    topLocations: ["Bengaluru", "Hyderabad", "Delhi/NCR"],
    averageSalaryLPA: 26.5,
    marketInsight: "Preferred framework for deep learning research, model training, and LLM fine-tuning.",
  },
  {
    technology: "TensorFlow",
    category: "AI/ML",
    openPositions: 7200,
    trend: "stable",
    growthRatePercent: 8,
    topLocations: ["Bengaluru", "Pune", "Hyderabad"],
    averageSalaryLPA: 21.0,
    marketInsight: "Maintained heavily in production edge inference and legacy enterprise computer vision pipelines.",
  },
  {
    technology: "LangChain",
    category: "AI/ML",
    openPositions: 4950,
    trend: "surging",
    growthRatePercent: 210,
    topLocations: ["Bengaluru", "Delhi/NCR", "Hyderabad"],
    averageSalaryLPA: 25.0,
    marketInsight: "Fastest growing orchestration framework for enterprise RAG, agentic tools, and LLM integrations.",
  },
];

const CITY_BREAKDOWN = [
  { city: "Bengaluru", openPositions: 84500, topTech: "Next.js & LangChain" },
  { city: "Hyderabad", openPositions: 51200, topTech: "AWS & Python" },
  { city: "Pune", openPositions: 36400, topTech: "Go & Docker" },
  { city: "Delhi/NCR", openPositions: 28900, topTech: "PyTorch & Rust" },
];

export async function GET() {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  // 1. If Adzuna credentials are configured, attempt live telemetry with 24h cache
  if (appId && appKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      // Query sample core stacks targeting India (country code 'in')
      const targetTechs = ["React", "Python", "Kubernetes", "AWS"];
      const liveResults: Record<string, number> = {};

      const fetchPromises = targetTechs.map(async (tech) => {
        const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${encodeURIComponent(
          appId
        )}&app_key=${encodeURIComponent(appKey)}&what=${encodeURIComponent(
          tech
        )}&content-type=application/json`;

        const res = await fetch(url, {
          signal: controller.signal,
          next: { revalidate: 86400 }, // 24-hour cache
        });

        if (res.ok) {
          const data = await res.json();
          if (typeof data.count === "number") {
            liveResults[tech] = data.count;
          }
        }
      });

      await Promise.allSettled(fetchPromises);
      clearTimeout(timeoutId);

      // If we got live counts back, merge them into the benchmark structure
      if (Object.keys(liveResults).length > 0) {
        const mergedItems = BENCHMARK_ITEMS.map((item) => {
          if (liveResults[item.technology]) {
            return {
              ...item,
              openPositions: liveResults[item.technology],
            };
          }
          return item;
        });

        const totalTracked = mergedItems.reduce((acc, curr) => acc + curr.openPositions, 0);

        const response: MarketDemandResponse = {
          source: "live_adzuna",
          timestamp: new Date().toISOString(),
          items: mergedItems,
          summary: {
            totalPositionsTracked: totalTracked,
            topSurgingTech: "LangChain (+210%)",
            topHiringHub: "Bengaluru (42%)",
            activeCategoryCount: 4,
          },
          cityBreakdown: CITY_BREAKDOWN,
        };

        return NextResponse.json(response, {
          headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
          },
        });
      }
    } catch {
      // Graceful fallback to simulated cache on error or timeout
    }
  }

  // 2. Fault-Tolerant Deterministic Fallback
  const totalTracked = BENCHMARK_ITEMS.reduce((acc, curr) => acc + curr.openPositions, 0);

  const fallbackResponse: MarketDemandResponse = {
    source: "simulated_cache",
    timestamp: new Date().toISOString(),
    items: BENCHMARK_ITEMS,
    summary: {
      totalPositionsTracked: totalTracked,
      topSurgingTech: "LangChain (+210%)",
      topHiringHub: "Bengaluru (42%)",
      activeCategoryCount: 4,
    },
    cityBreakdown: CITY_BREAKDOWN,
  };

  return NextResponse.json(fallbackResponse, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}