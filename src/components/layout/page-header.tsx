import React from "react";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, badgeText, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-zinc-100">
            {title}
          </h1>
          {badgeText && (
            <Badge variant="outline" dot>
              {badgeText}
            </Badge>
          )}
        </div>
        <p className="text-xs text-zinc-400 leading-snug">{subtitle}</p>
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}
