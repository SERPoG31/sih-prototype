"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Flame,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { MarketTrendChart } from "@/components/charts/market-trend-chart";
import { MARKET_TRENDS_DATA } from "@/lib/market-data";
import { MarketTrendSkill } from "@/lib/types";

export default function MarketDemandRadarPage() {
  const [activeMetric, setActiveMetric] = useState<
    "growthRatePercentage" | "activeOpeningsCount" | "averageSalaryLPA"
  >("growthRatePercentage");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "AI & ML", "Web & Cloud", "Languages", "Legacy / Obsolete"];

  const filteredData = MARKET_TRENDS_DATA.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  const surgingSkills = MARKET_TRENDS_DATA.filter((s) => s.trendStatus === "Surging");
  const deprecatingSkills = MARKET_TRENDS_DATA.filter((s) => s.trendStatus === "Deprecating");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Live Industry Market Demand Radar"
        subtitle="Real-time algorithmic demand telemetry across 12,000+ Indian tech job postings. Direct comparison between accelerating skills vs. deprecated tech debt."
        badgeText="Module 10"
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-indigo-500/30 bg-gradient-to-br from-slate-900 to-indigo-950/20">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Fastest Accelerating Skill
            </span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-white mt-1">GenAI & LLM Ops</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono mt-2">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+182% YoY Hiring Surge</span>
          </div>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Top Entry CTC Compensation
            </span>
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-white mt-1">Rust & Systems</p>
          <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-mono mt-2">
            <span>Avg ₹28.0 LPA Base</span>
          </div>
        </Card>

        <Card className="border-rose-500/30 bg-rose-950/10">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider">
              Most Deprecated Framework
            </span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-xl font-bold text-white mt-1">AngularJS & jQuery</p>
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono mt-2">
            <ArrowDownRight className="h-3.5 w-3.5" />
            <span>-62% Active Postings</span>
          </div>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="border-slate-800">
        <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
          <div>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-400" />
              <span>Technology Trajectory Analytics</span>
            </CardTitle>
            <CardDescription>
              Comparing tech growth, salary bands, and market absorption across Indian employers
            </CardDescription>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveMetric("growthRatePercentage")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMetric === "growthRatePercentage"
                  ? "bg-indigo-600 text-white shadow border border-indigo-500"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              YoY Growth (%)
            </button>
            <button
              onClick={() => setActiveMetric("activeOpeningsCount")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMetric === "activeOpeningsCount"
                  ? "bg-indigo-600 text-white shadow border border-indigo-500"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Active Openings
            </button>
            <button
              onClick={() => setActiveMetric("averageSalaryLPA")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMetric === "averageSalaryLPA"
                  ? "bg-indigo-600 text-white shadow border border-indigo-500"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Avg Salary (LPA ₹)
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium pr-1">Filter:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedCategory === cat
                    ? "bg-slate-800 text-indigo-300 font-semibold border border-slate-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <MarketTrendChart skills={filteredData} metric={activeMetric} />
        </CardContent>
      </Card>

      {/* Two Column Deep Dive: Surging vs Obsolete */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Surging Skills Table */}
        <Card className="border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/10">
          <CardHeader className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <CardTitle className="text-sm text-emerald-400">
                  Surging & High-Demand Technologies
                </CardTitle>
              </div>
              <Badge variant="success" size="sm" dot>
                High Hiring Velocity
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-3 text-xs">
            {surgingSkills.slice(0, 5).map((skill) => (
              <div
                key={skill.skill}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-slate-100">{skill.skill}</p>
                  <p className="text-[10px] text-slate-400 italic mt-0.5">{skill.marketInsight}</p>
                </div>
                <div className="text-right font-mono shrink-0 pl-2">
                  <span className="text-xs font-bold text-emerald-400">
                    +{skill.growthRatePercentage}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {skill.activeOpeningsCount.toLocaleString()} jobs
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Deprecating Skills Table */}
        <Card className="border-rose-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/10">
          <CardHeader className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-rose-400" />
                <CardTitle className="text-sm text-rose-400">
                  Sunset & Declining Technologies (Tech Debt)
                </CardTitle>
              </div>
              <Badge variant="danger" size="sm" dot>
                Curriculum Risk
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-3 text-xs">
            {deprecatingSkills.map((skill) => (
              <div
                key={skill.skill}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-slate-100">{skill.skill}</p>
                  <p className="text-[10px] text-slate-400 italic mt-0.5">{skill.marketInsight}</p>
                </div>
                <div className="text-right font-mono shrink-0 pl-2">
                  <span className="text-xs font-bold text-rose-400">
                    {skill.growthRatePercentage}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {skill.activeOpeningsCount.toLocaleString()} jobs
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
