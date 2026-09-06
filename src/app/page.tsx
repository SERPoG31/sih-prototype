"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Award,
  GitBranch,
  Code2,
  Bot,
  Briefcase,
  Users,
  FileCheck2,
  TrendingUp,
  Share2,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Zap,
  Building,
} from "lucide-react";
import { Github } from "@/components/ui/icons";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const PILLARS = [
    {
      num: "01",
      title: "AI Certificate Authenticator",
      description:
        "Forensic anti-tamper scans analyzing EXIF metadata, Canva/Photoshop splicing, and cryptographic issuer signatures from NPTEL, AWS, and Coursera.",
      href: "/dashboard/certificates",
      icon: Award,
      badge: "OCR & Forensics",
      color: "text-indigo-400",
    },
    {
      num: "02",
      title: "GitHub Ground-Truth Scraper",
      description:
        "Deep AST telemetry extracting verified commit cadence, language proportions, and framework imports to award verified Dev Tiers.",
      href: "/dashboard/github",
      icon: Github,
      badge: "Bytecode Telemetry",
      color: "text-emerald-400",
    },
    {
      num: "03",
      title: "Dynamic Skill Radar & Readiness Score",
      description:
        "Multi-dimensional polygon that reacts in real-time as new certificates, PRs, and sandbox checks are committed to the applicant record.",
      href: "/dashboard",
      icon: Zap,
      badge: "Real-Time Recharts",
      color: "text-amber-400",
    },
    {
      num: "04",
      title: "Dynamic Bridge Pathway Generator",
      description:
        "Calculates delta gaps between student skills and job specs (e.g. Razorpay, Zerodha), generating structured 5-day sprints with verified assessments.",
      href: "/dashboard/pathways",
      icon: GitBranch,
      badge: "5-Day Sprints",
      color: "text-purple-400",
    },
    {
      num: "05",
      title: "In-Browser 'Skill Check' Sandbox",
      description:
        "Timed 3-minute interactive coding and debugging snippet runner with client-side syntax evaluation and instant badge awards.",
      href: "/dashboard/skill-check",
      icon: Code2,
      badge: "Timed IDE",
      color: "text-blue-400",
    },
    {
      num: "06",
      title: "Gap-Targeted AI Mock Interviewer",
      description:
        "Technical screening modal focused strictly on candidate requirement deltas, grading architectural depth and tradeoff explanations.",
      href: "/dashboard/mock-interview",
      icon: Bot,
      badge: "AI Screening",
      color: "text-rose-400",
    },
    {
      num: "07",
      title: "Industry Micro-Bounty Board",
      description:
        "48-hour scoped production challenges from Razorpay, Zerodha, and PhonePe with automated CI test harness grading on PR submissions.",
      href: "/bounties",
      icon: Briefcase,
      badge: "Cash Grants & PRs",
      color: "text-teal-400",
    },
    {
      num: "08",
      title: "Capstone Team Matchmaker",
      description:
        "Graph-matching algorithm assembling complementary profiles (Frontend + Backend + AI/ML + DevOps) into high-synergy squads.",
      href: "/dashboard/team-match",
      icon: Users,
      badge: "Synergy AI",
      color: "text-cyan-400",
    },
    {
      num: "09",
      title: "Tamper-Proof AI LOR Generator",
      description:
        "Employer/faculty evaluation rubric yielding cryptographically sealed recommendation letters authenticated with SHA-256 checksums.",
      href: "/dashboard/lor",
      icon: FileCheck2,
      badge: "SHA-256 Sealed",
      color: "text-yellow-400",
    },
    {
      num: "10",
      title: "Live Industry Market Demand Radar",
      description:
        "Real-time analytics comparing surging skills (+182% GenAI) against sunsetting technologies across 12,000+ tech job openings in India.",
      href: "/dashboard/market",
      icon: TrendingUp,
      badge: "Demand Analytics",
      color: "text-emerald-400",
    },
    {
      num: "11",
      title: "Public 'Proof-of-Work' Portfolio",
      description:
        "Shareable, public applicant URL (/p/[username]) rendering verified badges, GitHub telemetry, merged bounties, and skill radar polygons.",
      href: "/p/arjun-kumar",
      icon: Share2,
      badge: "Zero-Auth Public URL",
      color: "text-indigo-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-800/80 bg-radial-gradient">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs text-indigo-300 font-mono">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Smart India Hackathon 2026 • Problem Statement ID: 26044</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Replace Self-Reported Resumes With{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-emerald-300 to-sky-400 bg-clip-text text-transparent">
              Automated Ground-Truth Evidence
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            SkillNexus connects students, premier academic institutions, and high-growth employers
            through an end-to-end multi-source verification loop: OCR anti-tamper forensics, code AST
            analysis, timed sandboxes, and cryptographic LORs.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link href="/dashboard">
              <Button variant="primary" size="lg">
                <span>Launch Interactive Cockpit</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/p/arjun-kumar">
              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4 mr-2 text-emerald-400" />
                <span>View Public Proof Showcase</span>
              </Button>
            </Link>
            <Link href="/bounties">
              <Button variant="secondary" size="lg">
                <Briefcase className="h-4 w-4 mr-2 text-indigo-400" />
                <span>Solve Company Bounties</span>
              </Button>
            </Link>
          </div>

          {/* Metric Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80 mt-10">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <p className="text-2xl font-bold font-mono text-emerald-400">98.4%</p>
              <p className="text-xs text-slate-400 mt-0.5">Tamper Detection Precision</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <p className="text-2xl font-bold font-mono text-indigo-400">12,000+</p>
              <p className="text-xs text-slate-400 mt-0.5">Analyzed Codebases & ASTs</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <p className="text-2xl font-bold font-mono text-amber-400">5-Day</p>
              <p className="text-xs text-slate-400 mt-0.5">Bridge Sprint Turnaround</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <p className="text-2xl font-bold font-mono text-purple-400">₹65k+</p>
              <p className="text-xs text-slate-400 mt-0.5">Active Industry Grants</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11 Functional Modules Showcase Grid */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="default" dot>
            Production Modules
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Eleven Pillars of the SkillNexus Verification Loop
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Click any module below to interact with the operational prototype, complete with mock inference engines and live reactive updates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link key={pillar.num} href={pillar.href} className="group">
                <Card className="h-full border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all p-6 flex flex-col justify-between group-hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-indigo-500/40 transition-colors">
                          <Icon className={`h-5 w-5 ${pillar.color}`} />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {pillar.num}
                        </span>
                      </div>
                      <Badge variant="outline" size="sm">
                        {pillar.badge}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-white mt-4 group-hover:text-indigo-300 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                    <span>Test Module</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-10 mt-auto text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">SkillNexus</span>
            <span>• Smart India Hackathon (SIH 2026) Prototype</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Engineered for Problem Statement 26044: AI-Driven Academia-Industry Collaboration Portal.
          </p>
        </div>
      </footer>
    </div>
  );
}
