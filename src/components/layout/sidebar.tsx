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
  Building2,
  LogOut,
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
        label: "Cockpit & Skills",
        icon: LayoutDashboard,
        kbd: "1",
      },
    ],
  },
  {
    title: "VERIFICATION",
    items: [
      {
        href: "/dashboard/certificates",
        label: "Certificate OCR",
        icon: Award,
        kbd: "2",
      },
      {
        href: "/dashboard/github",
        label: "GitHub AST",
        icon: Github,
        kbd: "3",
      },
      {
        href: "/dashboard/skill-check",
        label: "Timed Sandbox",
        icon: Code2,
        kbd: "4",
      },
      {
        href: "/dashboard/lor",
        label: "Tamper-Proof LOR",
        icon: FileCheck2,
        kbd: "5",
      },
    ],
  },
  {
    title: "GROWTH",
    items: [
      {
        href: "/dashboard/pathways",
        label: "Bridge Pathways",
        icon: GitBranch,
        kbd: "6",
      },
      {
        href: "/dashboard/mock-interview",
        label: "AI Interviewer",
        icon: Bot,
        kbd: "7",
      },
      {
        href: "/dashboard/market",
        label: "Market Demand",
        icon: TrendingUp,
        kbd: "8",
      },
    ],
  },
  {
    title: "OUTCOMES",
    items: [
      {
        href: "/bounties",
        label: "Bounty Board",
        icon: Briefcase,
        kbd: "9",
      },
      {
        href: "/dashboard/team-match",
        label: "Capstone Match",
        icon: Users,
        kbd: "0",
      },
      {
        href: "/p/arjun-kumar",
        label: "Proof Portfolio",
        icon: Share2,
        kbd: "P",
      },
    ],
  },
  {
    title: "INSTITUTIONAL",
    items: [
      {
        href: "/dashboard/evaluator",
        label: "Evaluator Hub",
        icon: Building2,
        kbd: "E",
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentPersona } = useStudentContext();

  return (
    <aside className="w-56 shrink-0 border-r border-zinc-800 bg-zinc-950 p-3 hidden md:flex flex-col justify-between select-none">
      <div className="space-y-4 overflow-y-auto">
        <div className="px-2 pt-1 pb-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
            System Modules
          </p>
        </div>

        <div className="space-y-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-0.5">
              <p className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-zinc-600 font-bold">
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
                        "flex items-center justify-between rounded px-2 py-1.5 text-xs font-mono transition-colors group",
                        isActive
                          ? "bg-zinc-900 text-zinc-100 border-l-2 border-emerald-500 font-medium pl-1.5"
                          : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon
                          className={cn(
                            "h-3.5 w-3.5 shrink-0 transition-colors",
                            isActive ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-300"
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.kbd && (
                        <kbd className="text-[9px] px-1 py-0.2 text-zinc-500 bg-zinc-900 border border-zinc-800 rounded shrink-0">
                          {item.kbd}
                        </kbd>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User profile footer */}
      <div className="pt-2 border-t border-zinc-800 mt-3 space-y-1.5">
        <div className="flex items-center gap-2 p-1.5 rounded bg-zinc-900/40 border border-zinc-800">
          <UserAvatar src={currentPersona.avatar} name={currentPersona.name} size="sm" className="h-6 w-6 border-zinc-700" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium text-zinc-200 truncate">{currentPersona.name}</span>
            <span className="text-[10px] text-zinc-500 truncate">{currentPersona.title}</span>
          </div>
        </div>
        <Link
          href="/login"
          className="flex items-center justify-between px-2 py-1.5 rounded text-[11px] font-mono text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
        >
          <span className="truncate">Switch Persona / Login</span>
          <LogOut className="h-3 w-3 shrink-0" />
        </Link>
      </div>
    </aside>
  );
}
