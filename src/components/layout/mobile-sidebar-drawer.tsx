"use client";

import React, { useEffect } from "react";
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
  X,
  Sparkles,
} from "lucide-react";
import { Github } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useStudentContext } from "@/context/student-context";
import { UserAvatar } from "@/components/ui/avatar";

interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_GROUPS = [
  {
    title: "OVERVIEW",
    items: [
      {
        href: "/dashboard",
        label: "Skill Radar & Overview",
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
        label: "4. Dynamic Bridge Pathways",
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
    title: "COLLABORATION & HIRED",
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

export function MobileSidebarDrawer({ isOpen, onClose }: MobileSidebarDrawerProps) {
  const pathname = usePathname();
  const { currentPersona } = useStudentContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="relative w-72 max-w-[85vw] h-full bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between shadow-2xl z-10 animate-fade-slide-up">
        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-emerald-400 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-slate-950">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-sm">
                  Skill<span className="text-indigo-400">Nexus</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400">SIH 26044 Navigation</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="space-y-1">
                <p className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all group",
                          isActive
                            ? "bg-indigo-600/15 text-indigo-300 border-l-2 border-indigo-500 font-bold"
                            : "text-slate-300 hover:bg-slate-900 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Icon
                            className={cn(
                              "h-3.5 w-3.5 shrink-0 transition-colors",
                              isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.pill && (
                          <span
                            className={cn(
                              "text-[8px] font-mono px-1 py-0.2 rounded border shrink-0",
                              isActive
                                ? "bg-indigo-950/60 text-indigo-300 border-indigo-800/60"
                                : "bg-slate-900 text-slate-500 border-slate-800"
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
          </nav>
        </div>

        {/* User profile footer */}
        <div className="pt-3 border-t border-slate-800/80 mt-4">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <UserAvatar src={currentPersona.avatar} name={currentPersona.name} size="sm" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-200 truncate">{currentPersona.name}</span>
              <span className="text-[10px] text-slate-400 truncate">{currentPersona.title}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
