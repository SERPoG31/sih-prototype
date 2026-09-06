"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Flame,
  ArrowUpRight,
  MapPin,
  RefreshCw,
  Layers,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketTrendChart } from "@/components/charts/market-trend-chart";
import { MarketDemandItem, MarketDemandResponse } from "@/lib/types";

export default function MarketDemandRadarPage() {
  const [data, setData] = useState<MarketDemandResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeMetric, setActiveMetric] = useState<"openings" | "growth" | "salary">("openings");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Frontend", "Backend", "Cloud/DevOps", "AI/ML"];

  useEffect(() => {
    let isMounted = true;
    async function fetchMarketData() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/market");
        if (res.ok) {
          const json: MarketDemandResponse = await res.json();
          if (isMounted) setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch market data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchMarketData();
    return () => {
      isMounted = false;
    };
  }, []);

  const items: MarketDemandItem[] = data?.items || [];
  const source = data?.source || "simulated_cache";
  const summary = data?.summary || {
    totalPositionsTracked: 180000,
    topSurgingTech: "LangChain (+210%)",
    topHiringHub: "Bengaluru (42%)",
    activeCategoryCount: 4,
  };
  const cityBreakdown = data?.cityBreakdown || [
    { city: "Bengaluru", openPositions: 84500, topTech: "Next.js & LangChain" },
    { city: "Hyderabad", openPositions: 51200, topTech: "AWS & Python" },
    { city: "Pune", openPositions: 36400, topTech: "Go & Docker" },
    { city: "Delhi/NCR", openPositions: 28900, topTech: "PyTorch & Rust" },
  ];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  const surgingItems = items.filter((s) => s.trend === "surging");
  const stableOrDecliningItems = items.filter((s) => s.trend !== "surging");

  return (
    <div className="space-y-4">
      {/* Page Header with Live Telemetry Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-zinc-100">
              Module 10 â€¢ Market Demand Radar
            </h1>
            {/* Telemetry Status Tag */}
            {source === "live_adzuna" ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/30 bg-zinc-900 text-emerald-400 font-mono text-[10px] font-semibold tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE TELEMETRY: ADZUNA (IN)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 font-mono text-[10px] font-medium tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                BENCHMARK CACHE
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Algorithmic hiring telemetry tracking Indian technology vacancies across Bengaluru, Hyderabad, Pune, and Delhi/NCR.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 shrink-0">
          <span>Cache TTL: 24h</span>
          <kbd className="text-[9px]">8</kbd>
        </div>
      </div>

      {/* Top 3 Summary Stats Strip (Monochrome Raycast Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <Card>
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider font-semibold">
              Fastest Surging Stack
            </span>
            <Flame className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <p className="text-lg font-bold font-mono text-zinc-100 mt-1">{summary.topSurgingTech}</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>YoY Hiring Acceleration</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider font-semibold">
              Primary Hiring Hub
            </span>
            <MapPin className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <p className="text-lg font-bold font-mono text-zinc-100 mt-1">{summary.topHiringHub}</p>
          <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono mt-1">
            <span>Highest absorption rate for freshers</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider font-semibold">
              Open Positions Tracked
            </span>
            <Activity className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <p className="text-lg font-bold font-mono text-zinc-100 mt-1">
            {summary.totalPositionsTracked.toLocaleString()} Vacancies
          </p>
          <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono mt-1">
            <span>Across 4 core technical pillars</span>
          </div>
        </Card>
      </div>

      {/* City Hub Vacancy Distribution Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {cityBreakdown.map((hub) => (
          <div
            key={hub.city}
            className="rounded border border-zinc-800 bg-zinc-900/30 p-2 text-xs font-mono"
          >
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-semibold text-zinc-200">{hub.city}</span>
              <span className="text-[10px] text-zinc-500">
                {hub.openPositions.toLocaleString()}
              </span>
            </div>
            <p className="text-[9px] text-zinc-500 mt-0.5 truncate">Top: {hub.topTech}</p>
          </div>
        ))}
      </div>

      {/* Main Chart Section */}
      <Card>
        <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800">
          <div>
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-zinc-300" />
              <span>Technology Vacancy Distribution</span>
            </CardTitle>
            <CardDescription className="text-[11px] text-zinc-500">
              Real-world open position counts across Frontend, Backend, Cloud/DevOps, and AI/ML
            </CardDescription>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveMetric("openings")}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                activeMetric === "openings"
                  ? "bg-zinc-900 text-zinc-100 border border-zinc-800 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
              }`}
            >
              Openings
            </button>
            <button
              onClick={() => setActiveMetric("growth")}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                activeMetric === "growth"
                  ? "bg-zinc-900 text-zinc-100 border border-zinc-800 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
              }`}
            >
              YoY Growth (%)
            </button>
            <button
              onClick={() => setActiveMetric("salary")}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                activeMetric === "salary"
                  ? "bg-zinc-900 text-zinc-100 border border-zinc-800 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
              }`}
            >
              Salary (LPA â‚¹)
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-3 space-y-3">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider pr-1">Filter:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  selectedCategory === cat
                    ? "bg-zinc-900 text-zinc-100 border border-zinc-800 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="h-72 w-full flex items-center justify-center text-xs font-mono text-zinc-500">
              <RefreshCw className="h-4 w-4 animate-spin mr-2 text-zinc-400" />
              Ingesting Market Telemetry...
            </div>
          ) : (
            <MarketTrendChart skills={filteredItems} metric={activeMetric} />
          )}
        </CardContent>
      </Card>

      {/* Two Column Breakdown: Accelerating vs Core/Legacy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
        {/* Surging Skills */}
        <Card>
          <CardHeader className="pb-2 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Surging Technologies (+40% YoY)
                </CardTitle>
              </div>
              <Badge variant="success" size="sm" dot>
                High Velocity
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="divide-y divide-zinc-800 pt-0">
            {surgingItems.slice(0, 5).map((item) => (
              <div
                key={item.technology}
                className="py-2 px-1 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-zinc-200">{item.technology}</p>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    Hubs: {item.topLocations.join(", ")}
                  </p>
                </div>
                <div className="text-right font-mono shrink-0 pl-2">
                  <span className="text-xs font-bold text-emerald-400">
                    +{item.growthRatePercent}%
                  </span>
                  <span className="text-[10px] text-zinc-500 block">
                    {item.openPositions.toLocaleString()} jobs
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stable / Core Stacks */}
        <Card>
          <CardHeader className="pb-2 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-zinc-500" />
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Baseline Enterprise Stacks
                </CardTitle>
              </div>
              <Badge variant="default" size="sm" dot>
                Core Volume
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="divide-y divide-zinc-800 pt-0">
            {stableOrDecliningItems.slice(0, 5).map((item) => (
              <div
                key={item.technology}
                className="py-2 px-1 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-zinc-200">{item.technology}</p>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    Hubs: {item.topLocations.join(", ")}
                  </p>
                </div>
                <div className="text-right font-mono shrink-0 pl-2">
                  <span className="text-xs font-medium text-zinc-300">
                    +{item.growthRatePercent}%
                  </span>
                  <span className="text-[10px] text-zinc-500 block">
                    {item.openPositions.toLocaleString()} jobs
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
