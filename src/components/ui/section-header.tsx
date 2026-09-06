import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  icon,
  badge,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800", className)}>
      <div className="flex items-center gap-2">
        {icon && (
          <div className="flex h-5 w-5 items-center justify-center text-zinc-400 shrink-0 [&>*]:h-4 [&>*]:w-4">
            {icon}
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100">{title}</h3>
          {badge}
        </div>
        {subtitle && (
          <span className="hidden md:inline text-xs text-zinc-500 border-l border-zinc-800 pl-2.5 font-normal">
            {subtitle}
          </span>
        )}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
}
