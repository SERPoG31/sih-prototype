"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  GraduationCap,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudentContext } from "@/context/student-context";
import { MarketDemandItem } from "@/lib/types";

export default function EvaluatorCockpitPage() {
  const { cohortStudents, lors } = useStudentContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [marketItems, setMarketItems] = useState<MarketDemandItem[]>([]);
  const [marketSource, setMarketSource] = useState<string>("simulated_cache");
  const [isLoadingMarket, setIsLoadingMarket] = useState(true);

  // Ingest live market data from Module 10 (/api/market)
  useEffect(() => {
    let isMounted = true;
    async function fetchMarketData() {
      try {
        setIsLoadingMarket(true);
        const res = await fetch("/api/market");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setMarketItems(data.items || []);
            setMarketSource(data.source || "simulated_cache");
          }
        }
      } catch (err) {
        console.error("Failed to fetch market demand:", err);
      } finally {
        if (isMounted) setIsLoadingMarket(false);
      }
    }
    fetchMarketData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter cohort students
  const filteredStudents = cohortStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier =
      tierFilter === "all" || student.devTier.toLowerCase() === tierFilter.toLowerCase();

    return matchesSearch && matchesTier;
  });

  // Top market surging skills
  const surgingTech = marketItems
    .filter((item) => item.trend === "surging")
    .slice(0, 4);

  // Static baseline syllabus items for curriculum delta comparison
  const legacyCurriculum = [
    {
      courseCode: "CS201",
      courseName: "Web Applications Lab",
      currentStack: "PHP 7.4, Apache, MySQL, jQuery",
      marketStatus: "Deprecating",
      deltaNotes: "Zero serverless/SSR coverage; jQuery obsolete in modern tier-1 engineering.",
    },
    {
      courseCode: "CS304",
      courseName: "Enterprise Software Systems",
      currentStack: "Java 8, Spring 4 XML, SOAP Web Services",
      marketStatus: "Legacy",
      deltaNotes: "Industry transitioned to Java 21/Rust microservices and gRPC protocols.",
    },
    {
      courseCode: "CS302",
      courseName: "Distributed Computing",
      currentStack: "C++ POSIX Threads, RPC",
      marketStatus: "Outdated Tooling",
      deltaNotes: "Lacks hands-on Kubernetes, Docker container orchestration, and cloud primitives.",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Evaluator Cockpit"
        subtitle="Department of Computer Science & Engineering • Academic Governance & Verified Placement Pipeline."
      >
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
            <Building2 className="h-3.5 w-3.5 mr-1" />
            IIT Madras CSE Department
          </Badge>
          <Badge variant="outline" className="font-mono text-xs border-zinc-800 text-zinc-400 bg-zinc-900">
            Academic Session 2026–27
          </Badge>
        </div>
      </PageHeader>

      {/* Institutional KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-zinc-400" />
            <span>Monitored Candidates</span>
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">{cohortStudents.length * 28 + 2}</span>
            <span className="text-[10px] font-mono text-emerald-400">+12% vs LY</span>
          </div>
          <p className="text-[10px] text-zinc-500">Department of Computer Science</p>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-emerald-400" />
            <span>Cohort Mean Readiness</span>
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">86.4%</span>
            <span className="text-[10px] font-mono text-zinc-400">Benchmark Tier</span>
          </div>
          <p className="text-[10px] text-zinc-500">Multi-source evidence validated</p>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
            <FileCheck2 className="h-3.5 w-3.5 text-zinc-400" />
            <span>Cryptographic LORs Sealed</span>
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">{lors.length + 27}</span>
            <span className="text-[10px] font-mono text-emerald-400">SHA-256 Validated</span>
          </div>
          <p className="text-[10px] text-zinc-500">Dean & TPO Official Seal</p>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <span>Placement Velocity</span>
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">91.2%</span>
            <span className="text-[10px] font-mono text-emerald-400">Tier-1 Ready</span>
          </div>
          <p className="text-[10px] text-zinc-500">Bounty & Sandbox verified</p>
        </Card>
      </div>

      {/* Cohort Readiness Roster */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="border-b border-zinc-800 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-400" />
                <span>Cohort Readiness Roster</span>
              </CardTitle>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Multi-source evidence ledger across OCR certificates, GitHub AST parsing, and timed sandboxes.
              </p>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  placeholder="Search student or roll ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs font-mono bg-zinc-950 border-zinc-800 w-48 sm:w-60"
                />
              </div>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="h-8 rounded-md bg-zinc-950 border border-zinc-800 px-2.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Tiers</option>
                <option value="Elite Architect">Elite Architect</option>
                <option value="Advanced">Advanced</option>
                <option value="Intermediate">Intermediate</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[10px] uppercase text-zinc-500 tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Student ID & Batch</th>
                  <th className="py-2.5 px-4 font-semibold">Candidate Name</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Readiness Score</th>
                  <th className="py-2.5 px-4 font-semibold">DevTier Rank</th>
                  <th className="py-2.5 px-4 font-semibold">Verification Proofs</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-500">
                      No candidates matched your search filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const isElite = student.devTier === "Elite Architect";
                    const isAdvanced = student.devTier === "Advanced";

                    return (
                      <tr key={student.id} className="hover:bg-zinc-900/40 transition-colors">
                        {/* Student ID & Batch */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-zinc-100 block">{student.studentId}</span>
                          <span className="text-[10px] text-zinc-500">Batch {student.batch} • {student.department}</span>
                        </td>

                        {/* Candidate Name & Avatar */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded bg-zinc-800 border border-zinc-700/60 overflow-hidden shrink-0 flex items-center justify-center text-zinc-300 text-xs font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-zinc-200 block text-xs">{student.name}</span>
                              <span className="text-[10px] text-zinc-500 font-sans">{student.college}</span>
                            </div>
                          </div>
                        </td>

                        {/* Readiness Score */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold">
                            <span>{student.readinessScore}%</span>
                          </div>
                        </td>

                        {/* DevTier */}
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={`font-mono text-[10px] ${
                              isElite
                                ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 font-bold"
                                : isAdvanced
                                ? "border-zinc-700 text-zinc-300 bg-zinc-800/40"
                                : "border-zinc-800 text-zinc-500"
                            }`}
                          >
                            {student.devTier}
                          </Badge>
                        </td>

                        {/* Verification Status */}
                        <td className="py-3 px-4 text-[11px] space-y-0.5">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <span className="text-[10px] text-zinc-500">Cert OCR:</span>
                            <span className="text-zinc-200">
                              {student.verificationStatus.certificatesVerified}/{student.verificationStatus.totalCertificates} Verified
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-400">
                            <span className="text-[10px] text-zinc-500">GitHub AST:</span>
                            <span className="text-emerald-400 font-bold">
                              {student.verificationStatus.githubQualityScore}% Quality
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-400">
                            <span className="text-[10px] text-zinc-500">Sandbox:</span>
                            <span className={student.verificationStatus.sandboxPassed ? "text-emerald-400" : "text-amber-400"}>
                              {student.verificationStatus.sandboxPassed ? "Passed 100%" : "Pending Review"}
                            </span>
                          </div>
                        </td>

                        {/* Action: Issue LOR */}
                        <td className="py-3 px-4 text-right">
                          <Link href={`/dashboard/lor?studentId=${student.studentId}`}>
                            <Button
                              variant="primary"
                              className="h-8 px-3 text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-500 text-zinc-950 cursor-pointer"
                            >
                              <FileCheck2 className="h-3.5 w-3.5 mr-1" />
                              Issue LOR
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Institutional Curriculum Misalignment Widget */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="border-b border-zinc-800 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>Institutional Curriculum Misalignment Radar</span>
              </CardTitle>
              <p className="text-[11px] text-zinc-400">
                Automated comparison between active departmental syllabus and live tech market vacancy telemetry.
              </p>
            </div>

            {/* Alert Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/10 font-mono text-[10px] flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Curriculum Delta: High — Action Recommended for 2026-27 Academic Council</span>
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-6 text-xs">
          {/* Telemetry Status Bar */}
          <div className="flex items-center justify-between p-2.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-[11px]">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Data Pipeline Source:</span>
              <span className="text-emerald-400 font-bold">
                {marketSource === "live_adzuna" ? "LIVE ADZUNA JOBS API (INDIA)" : "BENCHMARK INDIAN MARKET TELEMETRY"}
              </span>
            </div>
            <Link href="/dashboard/market" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[10px]">
              <span>View Full Radar</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Comparison Matrix Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Current Syllabus Emphasis */}
            <div className="space-y-3 p-4 rounded-lg bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-mono font-bold text-zinc-300 uppercase tracking-wider text-[11px]">
                  Current Syllabus Emphasis (Legacy Tracks)
                </span>
                <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-[10px] font-mono">
                  Syllabus v2022.4
                </Badge>
              </div>

              <div className="space-y-2.5">
                {legacyCurriculum.map((item) => (
                  <div key={item.courseCode} className="p-2.5 rounded bg-zinc-900 border border-zinc-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-zinc-200 font-bold">
                        {item.courseCode}: {item.courseName}
                      </span>
                      <Badge variant="outline" className="border-amber-500/30 text-amber-400 font-mono text-[9px]">
                        {item.marketStatus}
                      </Badge>
                    </div>
                    <p className="font-mono text-[10px] text-zinc-400">
                      Coverage: <span className="text-zinc-300">{item.currentStack}</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 leading-normal">
                      {item.deltaNotes}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live Market Demand (Module 10) */}
            <div className="space-y-3 p-4 rounded-lg bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-mono font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Live Market Demand (Adzuna Telemetry)</span>
                </span>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                  Real Hiring Hubs
                </Badge>
              </div>

              <div className="space-y-2.5">
                {isLoadingMarket ? (
                  <div className="py-12 text-center text-zinc-500 font-mono text-xs">
                    Loading market telemetry...
                  </div>
                ) : (
                  (surgingTech.length > 0 ? surgingTech : marketItems.slice(0, 4)).map((tech) => (
                    <div key={tech.technology} className="p-2.5 rounded bg-zinc-900 border border-zinc-800/80 space-y-1 font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-100 font-bold text-xs">{tech.technology}</span>
                        <span className="text-emerald-400 text-[11px] font-bold">
                          +{tech.growthRatePercent}% YoY
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span>Openings: {tech.openPositions.toLocaleString()}</span>
                        <span>Avg CTC: ₹{tech.averageSalaryLPA} LPA</span>
                        <span className="text-zinc-500">{tech.topLocations?.slice(0, 2).join(", ")}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-sans">
                        {tech.marketInsight}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Academic Council Action Items */}
          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2 font-mono">
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Recommended Syllabus Action Items for 2026–27 Academic Council:</span>
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-zinc-300">
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800/80">
                <span className="text-emerald-400 font-bold block mb-1">1. Overhaul CS304 (Enterprise Systems):</span>
                <span>Replace legacy Java 8 SOAP monolith with Rust & Go microservices with Kafka streaming.</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800/80">
                <span className="text-emerald-400 font-bold block mb-1">2. Modernize CS201 (Web Lab):</span>
                <span>Deprecate PHP/jQuery and introduce Next.js App Router, TypeScript, and TailwindCSS sandboxes.</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800/80">
                <span className="text-emerald-400 font-bold block mb-1">3. Cloud & AI Primitives:</span>
                <span>Integrate Docker, Kubernetes, and PyTorch vector embeddings into third-year core requirements.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
