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
  Terminal,
  LogOut,
  FileKey2,
  ShieldAlert,
  FileText,
} from "lucide-react";
import { Github } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useStudentContext } from "@/context/student-context";
import { UserAvatar } from "@/components/ui/avatar";

interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  href: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  kbd?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// 1. Dr. Sunita Rao (Evaluator / Dean of Academics / TPO)
const EVALUATOR_SECTIONS: NavSection[] = [
  {
    title: "INSTITUTIONAL GOVERNANCE",
    items: [
      {
        href: "/dashboard/evaluator",
        label: "Evaluator Cockpit",
        icon: LayoutDashboard,
        kbd: "1",
      },
      {
        href: "/dashboard/evaluator#roster",
        label: "Cohort Roster & Triage",
        icon: Users,
        kbd: "2",
      },
      {
        href: "/dashboard/evaluator#audit-queue",
        label: "Credential Audit Queue",
        icon: FileCheck2,
        kbd: "3",
      },
    ],
  },
  {
    title: "ACADEMIC INTEGRITY",
    items: [
      {
        href: "/dashboard/lor",
        label: "Mint Cryptographic LOR",
        icon: FileKey2,
        kbd: "4",
      },
      {
        href: "/dashboard/certificates",
        label: "Certificate Registry Forensics",
        icon: ShieldAlert,
        kbd: "5",
      },
    ],
  },
  {
    title: "CURRICULUM REFORM",
    items: [
      {
        href: "/dashboard/market",
        label: "Market Demand vs Syllabus",
        icon: TrendingUp,
        kbd: "6",
      },
      {
        href: "/dashboard/evaluator#memo",
        label: "Academic Council Memo",
        icon: FileText,
        kbd: "7",
      },
    ],
  },
];

// 2. Vikram Malhotra (Recruiter / Industry Talent Partner)
const RECRUITER_SECTIONS: NavSection[] = [
  {
    title: "TALENT INTELLIGENCE",
    items: [
      {
        href: "/dashboard",
        label: "Candidate Pipeline",
        icon: Users,
        kbd: "1",
      },
      {
        href: "/bounties",
        label: "Bounty Board",
        icon: Briefcase,
        kbd: "2",
      },
      {
        href: "/dashboard/lor",
        label: "Cryptographic Verifier",
        icon: FileCheck2,
        kbd: "3",
      },
      {
        href: "/dashboard/market",
        label: "Market Hiring Trends",
        icon: TrendingUp,
        kbd: "4",
      },
      {
        href: "/p/arjun-kumar",
        label: "Public Talent Showcase",
        icon: Share2,
        kbd: "5",
      },
    ],
  },
];

// 3. Arjun Kumar (Student / Candidate) — Complete curriculum, NO Institutional link!
const STUDENT_SECTIONS: NavSection[] = [
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
];

export function MobileSidebarDrawer({ isOpen, onClose }: MobileSidebarDrawerProps) {
  const pathname = usePathname();
  const { currentPersona } = useStudentContext();

  const isEvaluator =
    currentPersona.role === "evaluator" ||
    currentPersona.role === "institutional" ||
    currentPersona.type === "faculty" ||
    currentPersona.id.includes("sunita");

  const isRecruiter =
    currentPersona.role === "recruiter" ||
    currentPersona.type === "recruiter" ||
    currentPersona.id.includes("vikram");

  const navSections = isEvaluator
    ? EVALUATOR_SECTIONS
    : isRecruiter
    ? RECRUITER_SECTIONS
    : STUDENT_SECTIONS;

  const roleBadge = isEvaluator
    ? "INSTITUTIONAL GOVERNANCE"
    : isRecruiter
    ? "RECRUITER SUITE"
    : "STUDENT PORTAL";

  const [currentHash, setCurrentHash] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHash(window.location.hash);
      const handleHashChange = () => setCurrentHash(window.location.hash);
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div className="relative flex flex-col w-64 max-w-[80vw] bg-zinc-950 border-r border-zinc-800 p-4 z-10 shadow-2xl h-full justify-between">
        <div className="space-y-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded border border-zinc-700 bg-zinc-900 text-zinc-200">
                <Terminal className="h-3.5 w-3.5 text-zinc-300" />
              </div>
              <span className="font-bold tracking-tight text-zinc-100 text-sm">SkillNexus</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
              aria-label="Close drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Navigation
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-emerald-400 font-semibold">
              {roleBadge}
            </span>
          </div>

          {/* Nav Sections */}
          <nav className="space-y-4">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <p className="px-2 text-[9px] font-mono uppercase tracking-wider text-zinc-600 font-bold">
                  {section.title}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const [itemPath, itemHash] = item.href.split("#");
                    const hasHash = Boolean(itemHash);
                    const isPathMatch = pathname === itemPath;
                    const isActive = hasHash
                      ? isPathMatch && currentHash === `#${itemHash}`
                      : isPathMatch && (!currentHash || !item.href.includes("#"));
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          if (hasHash) setCurrentHash(`#${itemHash}`);
                          else setCurrentHash("");
                          onClose();
                        }}
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
            <UserAvatar
              src={currentPersona.avatar}
              name={currentPersona.name}
              size="sm"
              className="h-6 w-6 border-zinc-700"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium text-zinc-200 truncate">
                {currentPersona.name}
              </span>
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
