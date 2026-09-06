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
import { useStudentContext } from "@/context/student-context";
import { UserAvatar } from "@/components/ui/avatar";

const NAV_SECTIONS = [
  {
    title: "OVERVIEW",
    items: [
      {
        href: "/dashboard",
        label: "Skill Radar & Cockpit",
        icon: LayoutDashboard,
        pill: "Core",
      },
    ],
  },
  {
    title: "VERIFICATION",
    items: [
      {
        href: "/dashboard/certificates",
        label: "1. Certificate Authenticator",
        icon: Award,
        pill: "OCR & Tamper",
      },
      {
        href: "/dashboard/github",
        label: "2. GitHub Ground-Truth",
        icon: Github,
        pill: "Telemetry",
      },
      {
        href: "/dashboard/skill-check",
        label: "5. Skill Check Sandbox",
        icon: Code2,
        pill: "Timed IDE",
      },
      {
        href: "/dashboard/lor",
        label: "9. Tamper-Proof LOR",
        icon: FileCheck2,
        pill: "SHA-256",
      },
    ],
  },
  {
    title: "GROWTH & SKILLING",
    items: [
      {
        href: "/dashboard/pathways",
        label: "4. Dynamic Pathways",
        icon: GitBranch,
        pill: "5-Day Sprints",
      },
      {
        href: "/dashboard/mock-interview",
        label: "6. AI Mock Interviewer",
        icon: Bot,
        pill: "Gap-Targeted",
      },
      {
        href: "/dashboard/market",
        label: "10. Market Demand Radar",
        icon: TrendingUp,
        pill: "Real-Time",
      },
    ],
  },
  {
    title: "OPPORTUNITIES",
    items: [
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
        href: "/p/arjun-kumar",
        label: "11. Public Proof Portfolio",
        icon: Share2,
        pill: "Live URL",
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentPersona } = useStudentContext();

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/60 p-4 hidden md:flex flex-col justify-between backdrop-blur-md">
      <div className="space-y-4 overflow-y-auto pr-1">
        <div className="px-2">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            System Modules (11 Pillars)
          </p>
        </div>

        <div className="space-y-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all group",
                        isActive
                          ? "bg-indigo-600/15 text-indigo-300 border-l-2 border-indigo-500 shadow-sm font-bold pl-2"
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
                            "text-[8px] font-mono px-1.5 py-0.5 rounded border shrink-0",
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
          ))}
        </div>
      </div>

      {/* User profile block & SIH footer */}
      <div className="pt-3 border-t border-slate-800/80 mt-4 space-y-2">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <UserAvatar src={currentPersona.avatar} name={currentPersona.name} size="sm" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-slate-200 truncate">{currentPersona.name}</span>
            <span className="text-[10px] text-slate-400 truncate">{currentPersona.title}</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-2 text-[10px] text-slate-500 font-mono">
          <span>SIH PS: 26044</span>
          <span className="text-emerald-400 font-semibold">Ready</span>
        </div>
      </div>
    </aside>
  );
}
