import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  accentColor?: string; // Kept for backwards-compatibility, styled monochrome
  trend?: number[];
  className?: string;
  animationClass?: string;
}

export function StatCard({
  icon,
  label,
  value,
  delta,
  deltaPositive = true,
  trend = [3, 5, 4, 6, 7],
  className,
}: StatCardProps) {
  const maxTrend = Math.max(...trend, 1);

  return (
    <div
      className={cn(
        "rounded-lg border border-zinc-800 bg-zinc-900/50 p-3.5 transition-colors duration-150 hover:bg-zinc-900/80",
        className
      )}
    >
      {/* Top row: label + delta badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
          {icon && <span className="text-zinc-400 [&>*]:h-3.5 [&>*]:w-3.5">{icon}</span>}
          {label}
        </span>
        {delta && (
          <span
            className={cn(
              "text-[10px] font-mono px-1.5 py-0.2 rounded border font-medium",
              deltaPositive
                ? "text-emerald-400 bg-zinc-900 border-zinc-800"
                : "text-zinc-400 bg-zinc-900 border-zinc-800"
            )}
          >
            {delta}
          </span>
        )}
      </div>

      {/* Main value: large bold monospace */}
      <div className="text-2xl font-bold font-mono tracking-tight text-zinc-100 mb-3">
        {value}
      </div>

      {/* Sparkline: dense monochrome micro-bars */}
      <div className="flex items-end gap-1 h-4 pt-1 border-t border-zinc-800/80">
        {trend.map((val, i) => (
          <div
            key={i}
            className="flex-1 rounded-none bg-zinc-700 hover:bg-emerald-500 transition-colors duration-150"
            style={{ height: `${Math.max(15, Math.round((val / maxTrend) * 100))}%` }}
          />
        ))}
      </div>
    </div>
  );
}
