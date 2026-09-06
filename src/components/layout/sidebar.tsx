"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Award,
  GitBranch,
  Code2,
  Bot,
  Briefcase,
  Users,
  FileCheck2,
  TrendingUp,
  Share2,
} from "lucide-react";
import { Github } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Skill Radar & Overview",
    icon: LayoutDashboard,
    pill: "Core",
  },
  {
    href: "/dashboard/certificates",
    label: "1. Certificate Authenticator",
    icon: Award,
    pill: "OCR & Anti-Tamper",
  },
  {
    href: "/dashboard/github",
    label: "2. GitHub Ground-Truth",
    icon: Github,
    pill: "Telemetry",
  },
  {
    href: "/dashboard/pathways",
    label: "4. Dynamic Bridge Pathways",
    icon: GitBranch,
    pill: "5-Day Sprints",
  },
  {
    href: "/dashboard/skill-check",
    label: "5. Skill Check Sandbox",
    icon: Code2,
    pill: "Timed IDE",
  },
  {
    href: "/dashboard/mock-interview",
    label: "6. AI Mock Interviewer",
    icon: Bot,
    pill: "Gap-Targeted",
  },
  {
    href: "/bounties",
    label: "7. Industry Bounty Board",
    icon: Briefcase,
    pill: "48h Sprints",
  },
  {
    href: "/dashboard/team-match",
    label: "8. Capstone Matchmaker",
    icon: Users,
    pill: "Synergy AI",
  },
  {
    href: "/dashboard/lor",
    label: "9. Tamper-Proof LOR",
    icon: FileCheck2,
    pill: "SHA-256",
  },
  {
    href: "/dashboard/market",
    label: "10. Market Demand Radar",
    icon: TrendingUp,
    pill: "Real-Time",
  },
  {
    href: "/p/arjun-kumar",
    label: "11. Public Proof Portfolio",
    icon: Share2,
    pill: "Live URL",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/50 p-4 hidden md:flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2">
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            System Modules (11 Pillars)
          </p>
        </div>

        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all group",
                  isActive
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
                )}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.pill && (
                  <span
                    className={cn(
                      "text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0",
                      isActive
                        ? "bg-indigo-950/60 text-indigo-300 border-indigo-800/60"
                        : "bg-slate-900 text-slate-400 border-slate-800"
                    )}
                  >
                    {item.pill}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom SIH Pill */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs space-y-1 mt-6">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200">Smart India Hackathon</span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">2026</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Replacing unverified resumes with verifiable multi-source proof loops.
        </p>
      </div>
    </aside>
  );
}
