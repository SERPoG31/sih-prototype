import React from "react";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorScheme?: "indigo" | "emerald" | "amber" | "rose" | "monochrome";
  className?: string;
}

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
  colorScheme = "emerald",
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Strict monochrome / single emerald accent - no neon glows
  const colorMap = {
    indigo: {
      stroke: "#e4e4e7", // zinc-200
      text: "text-zinc-100",
    },
    monochrome: {
      stroke: "#e4e4e7",
      text: "text-zinc-100",
    },
    emerald: {
      stroke: "#10b981", // emerald-500 single accent
      text: "text-emerald-400",
    },
    amber: {
      stroke: "#f59e0b",
      text: "text-amber-400",
    },
    rose: {
      stroke: "#ef4444",
      text: "text-red-400",
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.emerald;

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#27272a"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Arc (Clean, flat, zero drop shadow) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scheme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: "stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={cn("text-2xl font-bold tracking-tight font-mono", scheme.text)}>
            {score}%
          </span>
          {label && (
            <span className="text-[9px] uppercase font-mono font-semibold text-zinc-500 tracking-wider">
              {label}
            </span>
          )}
        </div>
      </div>
      {sublabel && (
        <p className="mt-1.5 text-xs font-mono text-zinc-500 text-center">{sublabel}</p>
      )}
    </div>
  );
}
