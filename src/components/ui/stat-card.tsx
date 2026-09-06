import React from "react";
import { cn } from "@/lib/utils";

type AccentColor = "indigo" | "emerald" | "amber" | "purple" | "rose";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  accentColor?: AccentColor;
  trend?: number[];
  className?: string;
  animationClass?: string;
}

const accentMap: Record<AccentColor, { icon: string; value: string; bar: string; border: string }> = {
  indigo: {
    icon: "bg-indigo-500/15 text-indigo-400",
    value: "text-indigo-300",
    bar: "bg-indigo-500",
    border: "border-indigo-500/20 hover:border-indigo-500/40",
  },
  emerald: {
    icon: "bg-emerald-500/15 text-emerald-400",
    value: "text-emerald-300",
    bar: "bg-emerald-500",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
  },
  amber: {
    icon: "bg-amber-500/15 text-amber-400",
    value: "text-amber-300",
    bar: "bg-amber-500",
    border: "border-amber-500/20 hover:border-amber-500/40",
  },
  purple: {
    icon: "bg-purple-500/15 text-purple-400",
    value: "text-purple-300",
    bar: "bg-purple-500",
    border: "border-purple-500/20 hover:border-purple-500/40",
  },
  rose: {
    icon: "bg-rose-500/15 text-rose-400",
    value: "text-rose-300",
    bar: "bg-rose-500",
    border: "border-rose-500/20 hover:border-rose-500/40",
  },
};

export function StatCard({
  icon,
  label,
  value,
  delta,
  deltaPositive = true,
  accentColor = "indigo",
  trend = [3, 5, 4, 6, 7],
  className,
  animationClass,
}: StatCardProps) {
  const accent = accentMap[accentColor];
  const maxTrend = Math.max(...trend, 1);

  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-slate-900/60 p-4 backdrop-blur-md",
        "transition-all duration-200 hover:bg-slate-900/80 card-glow",
        accent.border,
        animationClass,
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg shrink-0 [&>*]:h-4 [&>*]:w-4", accent.icon)}>
          {icon}
        </div>
        {delta && (
          <span
            className={cn(
              "text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border",
              deltaPositive
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : "text-rose-400 bg-rose-500/10 border-rose-500/20"
            )}
          >
            {deltaPositive ? "+" : ""}{delta}
          </span>
        )}
      </div>

      <div className={cn("text-2xl font-extrabold font-mono tracking-tight leading-none mb-1", accent.value)}>
        {value}
      </div>

      <p className="text-[11px] text-slate-400 font-medium leading-tight mb-3">{label}</p>

      <div className="flex items-end gap-0.5 h-5">
        {trend.map((val, i) => (
          <div
            key={i}
            className={cn("flex-1 rounded-sm opacity-50 group-hover:opacity-90 transition-opacity duration-300", accent.bar)}
            style={{ height: `${Math.round((val / maxTrend) * 100)}%`, minHeight: "4px" }}
          />
        ))}
      </div>
    </div>
  );
}
