"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  UserCheck,
  ExternalLink,
  RotateCcw,
  Menu,
  ChevronRight,
  Terminal,
} from "lucide-react";
import { useStudentContext } from "@/context/student-context";
import { UserAvatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { MobileSidebarDrawer } from "@/components/layout/mobile-sidebar-drawer";

const PATH_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/certificates": "Certificates",
  "/dashboard/github": "GitHub AST",
  "/dashboard/pathways": "Bridge Pathways",
  "/dashboard/skill-check": "Skill Sandbox",
  "/dashboard/mock-interview": "AI Interview",
  "/bounties": "Bounties",
  "/dashboard/team-match": "Team Match",
  "/dashboard/lor": "Proof LOR",
  "/dashboard/evaluator": "Evaluator Hub",
  "/dashboard/market": "Market Radar",
  "/p/arjun-kumar": "Portfolio",
};

export function Navbar() {
  const pathname = usePathname();
  const { currentPersona, personas, switchPersona, readinessScore, resetToDefaults } =
    useStudentContext();
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentSectionName = PATH_TITLES[pathname] || "Cockpit";

  const isEvaluator =
    currentPersona.role === "evaluator" ||
    currentPersona.role === "institutional" ||
    currentPersona.id.includes("sunita");

  const isRecruiter =
    currentPersona.role === "recruiter" || currentPersona.id.includes("vikram");

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex h-13 max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-6">
          {/* Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 -ml-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-6 w-6 items-center justify-center rounded border border-zinc-700 bg-zinc-900 text-zinc-200">
                <Terminal className="h-3.5 w-3.5 text-zinc-300" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-zinc-100 text-sm">
                  SkillNexus
                </span>
                <span className="text-[10px] font-mono px-1 py-0.2 bg-zinc-900 text-zinc-400 rounded border border-zinc-800 hidden sm:inline">
                  PS: 26044
                </span>
              </div>
            </Link>

            {/* Breadcrumb trail on desktop */}
            <div className="hidden lg:flex items-center gap-1.5 ml-3 pl-3 border-l border-zinc-800 text-xs font-mono text-zinc-500">
              <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">
                Cockpit
              </Link>
              <ChevronRight className="h-3 w-3 text-zinc-700" />
              <span className="text-zinc-200 font-medium">{currentSectionName}</span>
            </div>
          </div>

          {/* Center Quick Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {isEvaluator ? (
              <>
                <Link
                  href="/dashboard/evaluator"
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    pathname === "/dashboard/evaluator"
                      ? "bg-zinc-900 text-zinc-100 border border-zinc-800"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  Evaluator Hub
                </Link>
                <Link
                  href="/dashboard/evaluator#roster"
                  className="px-2.5 py-1 rounded text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 transition-colors"
                >
                  Cohort Roster
                </Link>
                <Link
                  href="/dashboard/market"
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    pathname === "/dashboard/market"
                      ? "bg-zinc-900 text-zinc-100 border border-zinc-800"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  Curriculum Radar
                </Link>
              </>
            ) : isRecruiter ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-zinc-900 text-zinc-100 border border-zinc-800"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  Candidate Pipeline
                </Link>
                <Link
                  href="/bounties"
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    pathname === "/bounties"
                      ? "bg-zinc-900 text-zinc-100 border border-zinc-800"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  Bounties
                </Link>
                <Link
                  href="/dashboard/market"
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    pathname === "/dashboard/market"
                      ? "bg-zinc-900 text-zinc-100 border border-zinc-800"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  Market Hiring
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-zinc-900 text-zinc-100 border border-zinc-800"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  Overview
                </Link>
                <Link
                  href="/bounties"
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    pathname === "/bounties"
                      ? "bg-zinc-900 text-zinc-100 border border-zinc-800"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  Bounties
                </Link>
                <Link
                  href="/dashboard/market"
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    pathname === "/dashboard/market"
                      ? "bg-zinc-900 text-zinc-100 border border-zinc-800"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  Market Demand
                </Link>
              </>
            )}
          </nav>

          {/* Right Section: Persona Switcher & Live Readiness Score */}
          <div className="flex items-center gap-2">
            {/* Primary Accent CTA */}
            {isEvaluator ? (
              <Link
                href="/dashboard/lor"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors shadow-none"
              >
                <span>Mint LOR</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            ) : (
              <Link
                href="/p/arjun-kumar"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors shadow-none"
              >
                <span>Portfolio</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}

            {/* Live Readiness Pill with status dot */}
            <Tooltip
              content={
                isEvaluator
                  ? "Institutional Cohort Mean: 142 Monitored Candidates (Multi-source evidence validated)"
                  : isRecruiter
                  ? "Talent Pipeline Benchmark: Verified Tier-1 Candidate Threshold"
                  : "Composite Readiness: 40% Skills + 25% GitHub + 20% Certs + 15% Bounties"
              }
            >
              <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 cursor-default text-xs font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-zinc-400 text-[11px]">
                  {isEvaluator ? "Mean:" : isRecruiter ? "Benchmark:" : "Ready:"}
                </span>
                <span className="font-bold text-zinc-100">
                  {readinessScore}%
                </span>
              </div>
            </Tooltip>

            {/* Reset Demo Data Button */}
            <Tooltip content="Reset verification state">
              <button
                onClick={resetToDefaults}
                aria-label="Reset demo data"
                className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </Tooltip>

            {/* Demo Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                className="flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-left hover:bg-zinc-800/80 transition-colors focus:outline-none"
              >
                <UserAvatar
                  src={currentPersona.avatar}
                  name={currentPersona.name}
                  size="sm"
                  className="border-zinc-700 h-5 w-5"
                />
                <span className="hidden md:inline text-xs text-zinc-300 font-medium max-w-[100px] truncate">
                  {currentPersona.name.split(" ")[0]}
                </span>
                <ChevronDown className="h-3 w-3 text-zinc-500" />
              </button>

              {isPersonaOpen && (
                <div
                  className="absolute right-0 mt-1 w-64 rounded-md border border-zinc-800 bg-zinc-950 p-1 shadow-2xl z-50"
                  onClick={() => setIsPersonaOpen(false)}
                >
                  <div className="px-2 py-1.5 border-b border-zinc-800/80 mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                      Persona Switcher
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    {personas.map((persona) => {
                      const isSelected = persona.id === currentPersona.id;
                      return (
                        <button
                          key={persona.id}
                          onClick={() => switchPersona(persona.id)}
                          className={`w-full flex items-center gap-2.5 p-2 rounded text-left transition-colors ${
                            isSelected
                              ? "bg-zinc-900 text-zinc-100 font-medium"
                              : "hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          <UserAvatar
                            src={persona.avatar}
                            name={persona.name}
                            size="sm"
                            className="border-zinc-800 shrink-0"
                          />
                          <div className="flex flex-col flex-1 overflow-hidden">
                            <span className="text-xs truncate">{persona.name}</span>
                            <span className="text-[10px] text-zinc-500 truncate">
                              {persona.title}
                            </span>
                          </div>
                          {isSelected && <UserCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-1 pt-1.5 border-t border-zinc-800/80 px-1">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] font-mono text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900 transition-colors"
                    >
                      <span>Switch Persona Portal</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileSidebarDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
