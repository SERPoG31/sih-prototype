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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800/80">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {title}
          </h1>
          {badgeText && (
            <Badge variant="default" dot>
              {badgeText}
            </Badge>
          )}
        </div>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">{subtitle}</p>
      </div>
      {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
    </div>
  );
}
