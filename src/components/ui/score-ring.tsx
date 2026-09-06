import React from "react";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorScheme?: "indigo" | "emerald" | "amber" | "rose";
  className?: string;
}

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  colorScheme = "indigo",
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorMap = {
    indigo: {
      stroke: "#6366f1",
      glow: "rgba(99, 102, 241, 0.35)",
      text: "text-indigo-400",
    },
    emerald: {
      stroke: "#10b981",
      glow: "rgba(16, 185, 129, 0.35)",
      text: "text-emerald-400",
    },
    amber: {
      stroke: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.35)",
      text: "text-amber-400",
    },
    rose: {
      stroke: "#f43f5e",
      glow: "rgba(244, 63, 94, 0.35)",
      text: "text-rose-400",
    },
  };

  const scheme = colorMap[colorScheme];

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Arc */}
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
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              filter: `drop-shadow(0 0 8px ${scheme.glow})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={cn("text-2xl font-bold tracking-tight font-mono", scheme.text)}>
            {score}%
          </span>
          {label && (
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              {label}
            </span>
          )}
        </div>
      </div>
      {sublabel && (
        <p className="mt-2 text-xs font-medium text-slate-400 text-center">{sublabel}</p>
      )}
    </div>
  );
}
