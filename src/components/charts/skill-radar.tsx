"use client";

import React, { useSyncExternalStore } from "react";
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

const emptySubscribe = () => () => {};

export function SkillRadar({
  skills,
  targetRoleBenchmark,
  height = 360,
}: SkillRadarProps) {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

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
        className="w-full flex items-center justify-center text-xs text-zinc-500 font-mono"
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
          <PolarGrid stroke="#27272a" strokeDasharray="2 2" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#a1a1aa", fontSize: 10, fontWeight: 500, fontFamily: "monospace" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#52525b", fontSize: 9, fontFamily: "monospace" }}
            stroke="#27272a"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="rounded-md border border-zinc-800 bg-zinc-950 p-2.5 text-xs font-mono space-y-1 z-50">
                    <p className="font-bold text-zinc-100">{item.skill}</p>
                    <p className="text-emerald-400">
                      Verified: <span className="font-bold">{item.verifiedScore}/100</span>
                    </p>
                    {targetRoleBenchmark && (
                      <p className="text-zinc-400">
                        Benchmark: {item.targetBenchmark}/100
                      </p>
                    )}
                    <p className="text-zinc-500 text-[10px]">
                      Sources: {item.sources}
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
              stroke="#71717a"
              fill="#3f3f46"
              fillOpacity={0.15}
              strokeDasharray="3 3"
            />
          )}
          <Radar
            name="Student Verified Profile"
            dataKey="verifiedScore"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.25}
            strokeWidth={1.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
