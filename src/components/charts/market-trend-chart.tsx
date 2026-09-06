"use client";

import React, { useState, useEffect } from "react";
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
import { MarketTrendSkill } from "@/lib/types";

interface MarketTrendChartProps {
  skills: MarketTrendSkill[];
  metric: "growthRatePercentage" | "activeOpeningsCount" | "averageSalaryLPA";
}

export function MarketTrendChart({ skills, metric }: MarketTrendChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-72 w-full flex items-center justify-center text-xs text-slate-500 font-mono">
        Loading Market Analytics Engine...
      </div>
    );
  }

  const metricLabels = {
    growthRatePercentage: "YoY Growth (%)",
    activeOpeningsCount: "Active Indian Tech Openings",
    averageSalaryLPA: "Average Fresher/Junior CTC (LPA ₹)",
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={skills}
          margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
          layout="horizontal"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="skill"
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            angle={-25}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fill: "#64748b", fontSize: 10 }} stroke="#334155" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as MarketTrendSkill;
                return (
                  <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl text-xs space-y-1 z-50">
                    <p className="font-bold text-white">{item.skill}</p>
                    <p className="text-slate-400">Category: {item.category}</p>
                    <p className="font-mono text-indigo-400">
                      {metricLabels[metric]}:{" "}
                      <span className="font-bold text-white">
                        {metric === "averageSalaryLPA"
                          ? `₹${item.averageSalaryLPA} LPA`
                          : metric === "growthRatePercentage"
                          ? `${item.growthRatePercentage > 0 ? "+" : ""}${item.growthRatePercentage}%`
                          : item.activeOpeningsCount.toLocaleString()}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400 italic max-w-xs">{item.marketInsight}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey={metric} radius={[4, 4, 0, 0]}>
            {skills.map((entry, index) => {
              const isDeprecating = entry.trendStatus === "Deprecating";
              const isSurging = entry.trendStatus === "Surging";
              const fillColor = isDeprecating
                ? "#f43f5e" // rose-500
                : isSurging
                ? "#6366f1" // indigo-500
                : "#10b981"; // emerald-500
              return <Cell key={`cell-${index}`} fill={fillColor} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
