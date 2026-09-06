"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  ChevronDown,
  UserCheck,
  ExternalLink,
  RotateCcw,
  Zap,
  Menu,
  ChevronRight,
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

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-white text-base">
                    Skill<span className="text-indigo-400">Nexus</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 hidden sm:inline">
                    SIH 26044
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                  Academia-Industry Evidence Loop
                </span>
              </div>
            </Link>

            {/* Breadcrumb trail on desktop */}
            <div className="hidden lg:flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-800 text-xs font-mono text-slate-400">
              <Link href="/dashboard" className="hover:text-slate-200 transition-colors">
                Portal
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-600" />
              <span className="text-indigo-300 font-semibold">{currentSectionName}</span>
            </div>
          </div>

          {/* Center Quick Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname === "/dashboard"
                  ? "bg-slate-800/90 text-indigo-400 border border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/bounties"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname === "/bounties"
                  ? "bg-slate-800/90 text-indigo-400 border border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              Bounty Board
            </Link>
            <Link
              href="/dashboard/market"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname === "/dashboard/market"
                  ? "bg-slate-800/90 text-indigo-400 border border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              Market Radar
            </Link>
            <Link
              href="/p/arjun-kumar"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-all border border-emerald-500/30"
            >
              <span>Public Portfolio</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </nav>

          {/* Right Section: Persona Switcher & Live Readiness Score */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Readiness Pill with pulse glow */}
            <Tooltip content="Live dynamic readiness score computed from verified skills, GitHub AST, certs, and bounties">
              <div
                className={`hidden sm:flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-full px-3 py-1 cursor-default transition-all ${
                  readinessScore >= 80 ? "readiness-pulse border-emerald-500/40" : ""
                }`}
              >
                <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs text-slate-400 font-medium">Readiness:</span>
                <span className="text-xs font-bold font-mono text-emerald-400">
                  {readinessScore}%
                </span>
              </div>
            </Tooltip>

            {/* Reset Demo Data Button */}
            <Tooltip content="Reset all evidence to default state">
              <button
                onClick={resetToDefaults}
                aria-label="Reset demo data"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </Tooltip>

            {/* Demo Persona Switcher Dropdown */}
            <div className="relative">
              <Tooltip content="Switch persona role (Student, Recruiter, TPO) instantly">
                <button
                  onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 text-left hover:border-indigo-500/60 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <UserAvatar
                    src={currentPersona.avatar}
                    name={currentPersona.name}
                    size="sm"
                    className="border-slate-700"
                  />
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-200 leading-tight">
                      {currentPersona.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[130px]">
                      {currentPersona.title}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </Tooltip>

              {isPersonaOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-xl p-2 shadow-2xl z-50 animate-fade-slide-up"
                  onClick={() => setIsPersonaOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                      Judge / Demo Persona Switcher
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Switch roles instantly without auth lockouts
                    </p>
                  </div>

                  <div className="space-y-1">
                    {personas.map((persona) => {
                      const isSelected = persona.id === currentPersona.id;
                      return (
                        <button
                          key={persona.id}
                          onClick={() => switchPersona(persona.id)}
                          className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                            isSelected
                              ? "bg-indigo-600/20 border border-indigo-500/40 text-white"
                              : "hover:bg-slate-800/70 text-slate-300"
                          }`}
                        >
                          <UserAvatar
                            src={persona.avatar}
                            name={persona.name}
                            size="md"
                            className="border-slate-700 shrink-0"
                          />
                          <div className="flex flex-col flex-1 overflow-hidden">
                            <span className="text-xs font-semibold leading-snug">
                              {persona.name}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate">
                              {persona.title}
                            </span>
                            <span className="text-[9px] text-indigo-300 font-mono">
                              {persona.organization}
                            </span>
                          </div>
                          {isSelected && <UserCheck className="h-4 w-4 text-indigo-400 shrink-0" />}
                        </button>
                      );
                    })}
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
