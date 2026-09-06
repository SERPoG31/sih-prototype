import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "purple" | "amber" | "rose" | "indigo" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
  icon?: React.ReactNode;
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  dot = false,
  icon,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    outline: "bg-transparent text-slate-300 border-slate-700",
  };

  const dotColors = {
    default: "bg-indigo-400",
    indigo: "bg-indigo-400",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    amber: "bg-amber-400",
    danger: "bg-rose-400",
    rose: "bg-rose-400",
    purple: "bg-purple-400",
    outline: "bg-slate-400",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border tracking-wide uppercase font-mono transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColors[variant])}
        />
      )}
      {icon && <span className="shrink-0 [&>*]:h-3 [&>*]:w-3">{icon}</span>}
      {children}
    </span>
  );
}
