"use client";

import React, { useSyncExternalStore } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { MarketTrendSkill, MarketDemandItem } from "@/lib/types";

type UnifiedMarketItem = {
  name: string;
  category: string;
  openings: number;
  growth: number;
  salary: number;
  trend: "surging" | "stable" | "declining";
  insight?: string;
};

interface MarketTrendChartProps {
  skills: (MarketTrendSkill | MarketDemandItem)[];
  metric: "growth" | "openings" | "salary" | "growthRatePercentage" | "activeOpeningsCount" | "averageSalaryLPA" | "openPositions" | "growthRatePercent";
}

const emptySubscribe = () => () => {};

export function MarketTrendChart({ skills, metric }: MarketTrendChartProps) {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!isMounted) {
    return (
      <div className="h-72 w-full flex items-center justify-center text-xs text-zinc-500 font-mono">
        Initializing Telemetry Chart...
      </div>
    );
  }

  // Normalize data across MarketDemandItem and MarketTrendSkill
  const data: UnifiedMarketItem[] = skills.map((item) => {
    const isDemandItem = "technology" in item;
    const name = isDemandItem ? item.technology : item.skill;
    const openings = isDemandItem ? item.openPositions : item.activeOpeningsCount;
    const growth = isDemandItem ? item.growthRatePercent : item.growthRatePercentage;
    const salary = item.averageSalaryLPA || 18.0;
    const trend: "surging" | "stable" | "declining" = isDemandItem
      ? item.trend
      : item.trendStatus === "Surging"
      ? "surging"
      : item.trendStatus === "Deprecating"
      ? "declining"
      : "stable";

    return {
      name,
      category: item.category,
      openings,
      growth,
      salary,
      trend,
      insight: item.marketInsight,
    };
  });

  // Map metric key to data property
  const activeKey =
    metric === "salary" || metric === "averageSalaryLPA"
      ? "salary"
      : metric === "growth" || metric === "growthRatePercent" || metric === "growthRatePercentage"
      ? "growth"
      : "openings";

  const metricLabels = {
    growth: "YoY Growth Rate (%)",
    openings: "Active Open Vacancies (IN)",
    salary: "Avg CTC Compensation (LPA ₹)",
  };

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
          layout="horizontal"
        >
          <CartesianGrid strokeDasharray="2 2" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#a1a1aa", fontSize: 10, fontFamily: "monospace" }}
            angle={-25}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }}
            stroke="#27272a"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as UnifiedMarketItem;
                return (
                  <div className="rounded border border-zinc-800 bg-zinc-950 p-2.5 text-xs font-mono space-y-1 z-50">
                    <p className="font-bold text-zinc-100">{item.name}</p>
                    <p className="text-zinc-400 text-[10px]">Category: {item.category}</p>
                    <p className="text-emerald-400">
                      {metricLabels[activeKey]}:{" "}
                      <span className="font-bold text-zinc-100">
                        {activeKey === "salary"
                          ? `₹${item.salary} LPA`
                          : activeKey === "growth"
                          ? `${item.growth > 0 ? "+" : ""}${item.growth}%`
                          : item.openings.toLocaleString()}
                      </span>
                    </p>
                    {item.insight && (
                      <p className="text-[10px] text-zinc-500 max-w-xs">{item.insight}</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey={activeKey} radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => {
              const fillColor =
                entry.trend === "declining"
                  ? "#ef4444"
                  : entry.trend === "surging"
                  ? "#10b981"
                  : "#52525b";
              return <Cell key={`cell-${index}`} fill={fillColor} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}