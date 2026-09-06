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
  size = "sm",
  dot = false,
  icon,
  children,
  ...props
}: BadgeProps) {
  // Strict monochrome with crisp 1px borders - zero purple gradients
  const variants = {
    default: "bg-zinc-900 text-zinc-300 border-zinc-800",
    indigo: "bg-zinc-900 text-zinc-200 border-zinc-800",
    purple: "bg-zinc-900 text-zinc-300 border-zinc-800",
    rose: "bg-zinc-900 text-zinc-300 border-zinc-800",
    success: "bg-zinc-900 text-emerald-400 border-zinc-800",
    warning: "bg-zinc-900 text-amber-400 border-zinc-800",
    amber: "bg-zinc-900 text-amber-400 border-zinc-800",
    danger: "bg-zinc-900 text-red-400 border-zinc-800",
    outline: "bg-transparent text-zinc-400 border-zinc-800",
  };

  const dotColors = {
    default: "bg-zinc-400",
    indigo: "bg-zinc-300",
    purple: "bg-zinc-400",
    rose: "bg-zinc-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    amber: "bg-amber-500",
    danger: "bg-red-500",
    outline: "bg-zinc-500",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5 gap-1.5",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-medium rounded border tracking-wider uppercase select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])}
        />
      )}
      {icon && <span className="shrink-0 [&>*]:h-3 [&>*]:w-3">{icon}</span>}
      {children}
    </span>
  );
}
