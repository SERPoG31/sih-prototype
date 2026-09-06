"use client";

import React, { useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { SkillNode } from "@/lib/types";

interface SkillRadarProps {
  skills: SkillNode[];
  targetRoleBenchmark?: { name: string; requiredScore: number }[];
  height?: number;
}

export function SkillRadar({
  skills,
  targetRoleBenchmark,
  height = 360,
}: SkillRadarProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Format data for Recharts Radar
  const data = skills.map((skill) => {
    const benchmark = targetRoleBenchmark?.find(
      (b) => b.name.toLowerCase() === skill.name.toLowerCase()
    );
    return {
      skill: skill.name,
      verifiedScore: skill.score,
      targetBenchmark: benchmark ? benchmark.requiredScore : 75,
      evidenceCount: skill.evidenceCount,
      sources: skill.sources.join(", "),
    };
  });

  if (!isMounted) {
    return (
      <div
        className="w-full flex items-center justify-center text-xs text-slate-500 font-mono"
        style={{ height }}
      >
        Initializing Radar Engine...
      </div>
    );
  }

  return (
    <div className="w-full relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#64748b", fontSize: 9 }}
            stroke="#1e293b"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl text-xs space-y-1 z-50">
                    <p className="font-bold text-white">{item.skill}</p>
                    <p className="text-indigo-400 font-mono">
                      Verified Score: <span className="font-bold">{item.verifiedScore}/100</span>
                    </p>
                    {targetRoleBenchmark && (
                      <p className="text-emerald-400 font-mono">
                        Industry Benchmark: {item.targetBenchmark}/100
                      </p>
                    )}
                    <p className="text-slate-400 text-[10px]">
                      Verified Sources: <span className="text-slate-200">{item.sources}</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          {targetRoleBenchmark && (
            <Radar
              name="Industry Benchmark"
              dataKey="targetBenchmark"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.15}
              strokeDasharray="4 4"
            />
          )}
          <Radar
            name="Student Verified Profile"
            dataKey="verifiedScore"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.45}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
