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
  Building2,
  X,
  Terminal,
  LogOut,
} from "lucide-react";
import { Github } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useStudentContext } from "@/context/student-context";
import { UserAvatar } from "@/components/ui/avatar";

interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

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
        className="fixed inset-0 bg-black/80 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="relative w-64 max-w-[80vw] h-full bg-zinc-950 border-r border-zinc-800 p-3 flex flex-col justify-between shadow-none z-10">
        <div className="space-y-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded border border-zinc-700 bg-zinc-900 text-zinc-200">
                <Terminal className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold text-zinc-100 text-sm">
                SkillNexus
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-3">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-0.5">
                <p className="px-2 text-[9px] font-mono uppercase tracking-wider text-zinc-600 font-bold">
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
                        onClick={onClose}
                        className={cn(
                          "flex items-center justify-between rounded px-2 py-1.5 text-xs font-mono transition-colors",
                          isActive
                            ? "bg-zinc-900 text-zinc-100 border-l-2 border-emerald-500 font-medium pl-1.5"
                            : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.kbd && (
                          <kbd className="text-[9px] px-1 text-zinc-500 bg-zinc-900 border border-zinc-800 rounded shrink-0">
                            {item.kbd}
                          </kbd>
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
        <div className="pt-2 border-t border-zinc-800 mt-2 space-y-1.5">
          <div className="flex items-center gap-2 p-1.5 rounded bg-zinc-900/40 border border-zinc-800">
            <UserAvatar src={currentPersona.avatar} name={currentPersona.name} size="sm" className="h-6 w-6 border-zinc-700" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium text-zinc-200 truncate">{currentPersona.name}</span>
              <span className="text-[10px] text-zinc-500 truncate">{currentPersona.title}</span>
            </div>
          </div>
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center justify-between px-2 py-1.5 rounded text-[11px] font-mono text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
          >
            <span className="truncate">Switch Persona / Login</span>
            <LogOut className="h-3 w-3 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
