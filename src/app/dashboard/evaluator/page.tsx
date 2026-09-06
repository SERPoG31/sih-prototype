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
  Check,
  X,
  ShieldAlert,
  ShieldCheck,
  Download,
  Printer,
  Layers,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudentContext } from "@/context/student-context";
import { MarketDemandItem, CohortStudent } from "@/lib/types";

interface PendingEvidenceItem {
  id: string;
  studentId: string;
  studentName: string;
  evidenceType: "Certificate" | "Sandbox" | "Bounty";
  title: string;
  issuer: string;
  credentialId?: string;
  score: number;
  dateUploaded: string;
  skills: string[];
  flagReason?: string;
  status: "pending" | "approved" | "flagged";
}

const INITIAL_AUDIT_QUEUE: PendingEvidenceItem[] = [
  {
    id: "audit-01",
    studentId: "2026-CS-041",
    studentName: "Arjun Kumar",
    evidenceType: "Certificate",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services (Credly Registry)",
    credentialId: "AWS-7892-ARC-041",
    score: 94,
    dateUploaded: "Today, 10:14 AM",
    skills: ["AWS Cloud Architecture", "Docker", "S3"],
    status: "pending",
  },
  {
    id: "audit-02",
    studentId: "2026-CS-055",
    studentName: "Rohan Verma",
    evidenceType: "Certificate",
    title: "Coursera: Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    credentialId: "COURSERA-98F4-A1",
    score: 78,
    dateUploaded: "Yesterday, 4:30 PM",
    skills: ["Deep Learning", "PyTorch"],
    flagReason: "Recipient name similarity check: 84% - manual Dean inspection required",
    status: "pending",
  },
  {
    id: "audit-03",
    studentId: "2026-CS-088",
    studentName: "Siddharth Iyer",
    evidenceType: "Sandbox",
    title: "Sliding Window Rate Limiter Challenge",
    issuer: "SkillNexus V8 Sandbox",
    score: 96,
    dateUploaded: "Today, 09:22 AM",
    skills: ["Redis", "Distributed Concurrency"],
    status: "pending",
  },
  {
    id: "audit-04",
    studentId: "2026-CS-103",
    studentName: "Rahul Verma",
    evidenceType: "Bounty",
    title: "FastAPI Async Connection Pool PR #88",
    issuer: "GitHub Auto-Grading Engine",
    score: 89,
    dateUploaded: "Yesterday, 6:15 PM",
    skills: ["FastAPI", "Python Async"],
    status: "pending",
  },
];

export default function EvaluatorCockpitPage() {
  const { cohortStudents, lors, addVerifiedSkill, updateCohortStudent } = useStudentContext();

  // Filter & Search states
  const [activeFilterTab, setActiveFilterTab] = useState<"all" | "audit" | "atRisk" | "tier1">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Market demand states
  const [marketItems, setMarketItems] = useState<MarketDemandItem[]>([]);
  const [marketSource, setMarketSource] = useState<string>("simulated_cache");
  const [isLoadingMarket, setIsLoadingMarket] = useState(true);

  // Evidence Review Queue state
  const [auditQueue, setAuditQueue] = useState<PendingEvidenceItem[]>(INITIAL_AUDIT_QUEUE);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "warning" } | null>(null);

  // Board of Studies (BOS) Report Modal
  const [showBosModal, setShowBosModal] = useState(false);

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

  // Filter cohort students based on tab and search
  const filteredStudents = cohortStudents.filter((student) => {
    // Search query matching
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      student.name.toLowerCase().includes(q) ||
      student.studentId.toLowerCase().includes(q) ||
      student.department.toLowerCase().includes(q) ||
      student.devTier.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Filter tab condition
    if (activeFilterTab === "audit") {
      // Students needing audit (unverified certs or sandbox pending)
      return (
        student.verificationStatus.certificatesVerified < student.verificationStatus.totalCertificates ||
        !student.verificationStatus.sandboxPassed
      );
    }
    if (activeFilterTab === "atRisk") {
      return student.readinessScore < 70;
    }
    if (activeFilterTab === "tier1") {
      return student.readinessScore >= 85;
    }
    return true;
  });

  // Calculate counts for filter tab badges
  const auditCount = cohortStudents.filter(
    (s) =>
      s.verificationStatus.certificatesVerified < s.verificationStatus.totalCertificates ||
      !s.verificationStatus.sandboxPassed
  ).length;
  const atRiskCount = cohortStudents.filter((s) => s.readinessScore < 70).length;
  const tier1Count = cohortStudents.filter((s) => s.readinessScore >= 85).length;

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleTabChange = (tab: "all" | "audit" | "atRisk" | "tier1") => {
    setActiveFilterTab(tab);
    setCurrentPage(1);
  };

  // Actions for Audit Queue
  const handleApproveEvidence = (item: PendingEvidenceItem) => {
    setAuditQueue((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "approved" } : i))
    );

    // If it's Arjun Kumar, credit skills and boost readiness in StudentContext
    if (item.studentId === "2026-CS-041") {
      item.skills.forEach((sk) => {
        addVerifiedSkill(sk, item.score, "Certificate", "Cloud/DevOps");
      });
      updateCohortStudent("2026-CS-041", {
        readinessScore: 96,
        verificationStatus: {
          certificatesVerified: 4,
          totalCertificates: 4,
          githubQualityScore: 94,
          sandboxPassed: true,
        },
      });
    }

    setToastMessage({
      text: `✓ Approved & Credited: "${item.title}" verified for ${item.studentName} (${item.studentId}). Readiness score boosted.`,
      type: "success",
    });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFlagEvidence = (item: PendingEvidenceItem) => {
    setAuditQueue((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "flagged" } : i))
    );

    setToastMessage({
      text: `⚠ Flagged for Verification: Audit flag dispatched for ${item.studentName} (${item.studentId}). Student prompted for proof re-submission.`,
      type: "warning",
    });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Top market surging skills
  const surgingTech = marketItems.filter((item) => item.trend === "surging").slice(0, 4);

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

  // Departmental Skill Gap Pillars
  const departmentalPillars = [
    { name: "Frontend", score: 88, status: "Proficient", color: "bg-emerald-500", textColor: "text-emerald-400" },
    { name: "Backend", score: 74, status: "Adequate", color: "bg-blue-500", textColor: "text-blue-400" },
    { name: "Cloud / DevOps", score: 48, status: "Critical Gap", color: "bg-rose-500", textColor: "text-rose-400" },
    { name: "System Design", score: 42, status: "Critical Gap", color: "bg-rose-500", textColor: "text-rose-400" },
    { name: "AI / ML", score: 69, status: "Moderate", color: "bg-amber-500", textColor: "text-amber-400" },
    { name: "Database Systems", score: 81, status: "Proficient", color: "bg-emerald-500", textColor: "text-emerald-400" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Evaluator Hub"
        subtitle="Dean of Academics & Placement Directorate • Operational Governance, Audit Queues & Board of Studies Telemetry."
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

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`p-3 rounded-lg border font-mono text-xs flex items-center justify-between transition-all ${
            toastMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
              : "bg-amber-500/10 border-amber-500/40 text-amber-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Institutional KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-zinc-400" />
            <span>Monitored Candidates</span>
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">142</span>
            <span className="text-[10px] font-mono text-emerald-400">+12% YoY</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono">Batch 2026 CS Department</p>
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
          <p className="text-[10px] text-zinc-500 font-mono">Multi-source evidence validated</p>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
            <FileCheck2 className="h-3.5 w-3.5 text-zinc-400" />
            <span>Cryptographic LORs Sealed</span>
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">{lors.length + 27}</span>
            <span className="text-[10px] font-mono text-emerald-400">SHA-256 PKI</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono">Dean & TPO Official Seal</p>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <span>Placement Velocity</span>
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">91.2%</span>
            <span className="text-[10px] font-mono text-emerald-400">Tier-1 Qualified</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono">Bounty & Sandbox verified</p>
        </Card>
      </div>

      {/* Two Column Operational Layout: Department Heatmap & Pending Audit Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Departmental Skill Gap Heatmap Widget (5 cols) */}
        <Card className="lg:col-span-5 bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-3 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>Departmental Competency Heatmap</span>
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono border-zinc-800 text-zinc-400">
                6 Pillars
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Aggregate student readiness telemetry evaluated across verified coursework and sandboxes.
            </p>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-3 font-mono text-xs">
              {departmentalPillars.map((pillar) => (
                <div key={pillar.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium">{pillar.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold ${pillar.textColor}`}>
                        {pillar.status}
                      </span>
                      <span className="text-zinc-100 font-bold">{pillar.score}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden">
                    <div
                      className={`h-full ${pillar.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pillar.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Department Action Advisory */}
            <div className="mt-4 p-3 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>Curriculum Intervention Advisory:</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                Department Recommendation: Host 3-day Concurrency &amp; Docker workshop to bridge the
                Cloud/System Design gap prior to semester capstone reviews.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Pending Credential Audit & Approval Queue (7 cols) */}
        <Card className="lg:col-span-7 bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-3 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Incoming Student Evidence Audit Queue</span>
                </CardTitle>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Student credential uploads awaiting Dean / TPO validation and platform readiness credit.
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 text-amber-400 bg-amber-500/10">
                {auditQueue.filter((i) => i.status === "pending").length} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {auditQueue.map((item) => {
              const isPending = item.status === "pending";
              const isApproved = item.status === "approved";
              const isFlagged = item.status === "flagged";

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isApproved
                      ? "bg-zinc-950/60 border-emerald-500/40 text-zinc-300"
                      : isFlagged
                      ? "bg-zinc-950/60 border-amber-500/40 text-zinc-300"
                      : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-zinc-100 font-mono">
                          {item.studentName}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {item.studentId}
                        </span>
                        <Badge
                          variant={item.evidenceType === "Certificate" ? "default" : "purple"}
                          size="sm"
                        >
                          {item.evidenceType}
                        </Badge>
                        <span className="text-[10px] font-mono text-zinc-500">{item.dateUploaded}</span>
                      </div>

                      <h4 className="text-xs font-semibold text-zinc-200">{item.title}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        Issuer: {item.issuer} {item.credentialId && `• ID: ${item.credentialId}`}
                      </p>

                      {item.flagReason && (
                        <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-300 flex items-center gap-1.5">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          <span>{item.flagReason}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      {isPending ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFlagEvidence(item)}
                            className="h-7 px-2 text-[11px] font-mono border-zinc-800 hover:border-amber-500/50 hover:text-amber-400 text-zinc-400"
                          >
                            <ShieldAlert className="h-3 w-3 mr-1 text-amber-400" />
                            <span>Flag / Reject</span>
                          </Button>

                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleApproveEvidence(item)}
                            className="h-7 px-2.5 text-[11px] font-mono font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            <span>Approve &amp; Credit</span>
                          </Button>
                        </>
                      ) : isApproved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approved &amp; Credited</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Flagged for Review</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Cohort Roster Triage & Smart Filters */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="border-b border-zinc-800 pb-3 space-y-3">
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

            {/* Real-time Search Input */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search student, roll ID, skill..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 h-8 text-xs font-mono bg-zinc-950 border-zinc-800 w-full sm:w-64"
              />
            </div>
          </div>

          {/* Interactive Smart Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/80">
            <button
              onClick={() => handleTabChange("all")}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1.5 ${
                activeFilterTab === "all"
                  ? "bg-zinc-100 text-zinc-950 font-bold"
                  : "bg-zinc-950 hover:bg-zinc-800 text-zinc-400 border border-zinc-800"
              }`}
            >
              <span>All Students</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded ${activeFilterTab === "all" ? "bg-zinc-300 text-zinc-900" : "bg-zinc-900 text-zinc-500"}`}>
                142
              </span>
            </button>

            <button
              onClick={() => handleTabChange("audit")}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1.5 ${
                activeFilterTab === "audit"
                  ? "bg-amber-400 text-zinc-950 font-bold"
                  : "bg-zinc-950 hover:bg-zinc-800 text-zinc-400 border border-zinc-800"
              }`}
            >
              <span>Verification Queue (Needs Audit)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${activeFilterTab === "audit" ? "bg-amber-600 text-white" : "bg-amber-500/20 text-amber-400"}`}>
                {auditCount}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("atRisk")}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1.5 ${
                activeFilterTab === "atRisk"
                  ? "bg-rose-500 text-white font-bold"
                  : "bg-zinc-950 hover:bg-zinc-800 text-zinc-400 border border-zinc-800"
              }`}
            >
              <span>At-Risk Candidates (&lt; 70% Readiness)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${activeFilterTab === "atRisk" ? "bg-rose-700 text-white" : "bg-rose-500/20 text-rose-400"}`}>
                {atRiskCount}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("tier1")}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1.5 ${
                activeFilterTab === "tier1"
                  ? "bg-emerald-500 text-zinc-950 font-bold"
                  : "bg-zinc-950 hover:bg-zinc-800 text-zinc-400 border border-zinc-800"
              }`}
            >
              <span>Tier-1 Qualified (&ge; 85% Readiness)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${activeFilterTab === "tier1" ? "bg-emerald-700 text-white" : "bg-emerald-500/20 text-emerald-400"}`}>
                {tier1Count}
              </span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[10px] uppercase text-zinc-500 tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Student ID &amp; Batch</th>
                  <th className="py-2.5 px-4 font-semibold">Candidate Name</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Readiness Score</th>
                  <th className="py-2.5 px-4 font-semibold">DevTier Rank</th>
                  <th className="py-2.5 px-4 font-semibold">Verification Proofs</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-500 font-mono">
                      No candidates match the active filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((student: CohortStudent) => {
                    const isElite = student.devTier === "Elite Architect";
                    const isAdvanced = student.devTier === "Advanced";

                    return (
                      <tr key={student.id} className="hover:bg-zinc-900/40 transition-colors">
                        {/* Student ID & Batch */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-zinc-100 block">{student.studentId}</span>
                          <span className="text-[10px] text-zinc-500">
                            Batch {student.batch} • {student.department}
                          </span>
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
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-bold ${
                              student.readinessScore >= 85
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : student.readinessScore < 70
                                ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                                : "border-zinc-700 bg-zinc-800/40 text-zinc-300"
                            }`}
                          >
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

                        {/* Verification Proofs */}
                        <td className="py-3 px-4 text-[11px] space-y-0.5">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <span className="text-[10px] text-zinc-500">Cert OCR:</span>
                            <span className="text-zinc-200">
                              {student.verificationStatus.certificatesVerified}/
                              {student.verificationStatus.totalCertificates} Verified
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
                            <span
                              className={
                                student.verificationStatus.sandboxPassed
                                  ? "text-emerald-400"
                                  : "text-amber-400"
                              }
                            >
                              {student.verificationStatus.sandboxPassed
                                ? "Passed 100%"
                                : "Pending Review"}
                            </span>
                          </div>
                        </td>

                        {/* Action: Issue LOR */}
                        <td className="py-3 px-4 text-right">
                          <Link href={`/dashboard/lor?studentId=${student.studentId}`}>
                            <Button
                              variant="primary"
                              className="h-7 px-2.5 text-xs font-mono font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 cursor-pointer"
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

          {/* Clean Pagination Controls */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between font-mono text-xs text-zinc-400">
            <div>
              Showing{" "}
              <span className="text-zinc-200 font-bold">
                {filteredStudents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="text-zinc-200 font-bold">
                {Math.min(currentPage * pageSize, filteredStudents.length)}
              </span>{" "}
              of <span className="text-zinc-200 font-bold">{filteredStudents.length}</span> candidates
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
              >
                <ChevronLeft className="h-3 w-3" />
                <span>Prev</span>
              </button>

              <span className="px-2 py-1 text-[11px] text-zinc-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
              >
                <span>Next</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Institutional Curriculum Misalignment Widget with BOS Memo Export */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="border-b border-zinc-800 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>Institutional Curriculum Misalignment Radar</span>
              </CardTitle>
              <p className="text-[11px] text-zinc-400">
                Automated comparison between active departmental syllabus and live tech market vacancy telemetry.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-amber-500/40 text-amber-400 bg-amber-500/10 font-mono text-[10px] flex items-center gap-1"
              >
                <AlertTriangle className="h-3 w-3" />
                <span>Delta: High — Reform Recommended</span>
              </Badge>

              {/* 1-Click Export BOS Memo Button */}
              <Button
                variant="primary"
                onClick={() => setShowBosModal(true)}
                className="h-8 text-xs font-mono font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Export Board of Studies (BOS) Report
              </Button>
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
                {marketSource === "live_adzuna"
                  ? "LIVE ADZUNA JOBS API (INDIA)"
                  : "BENCHMARK INDIAN MARKET TELEMETRY"}
              </span>
            </div>
            <Link
              href="/dashboard/market"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[10px]"
            >
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
                  <div
                    key={item.courseCode}
                    className="p-2.5 rounded bg-zinc-900 border border-zinc-800/80 space-y-1"
                  >
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
                    <p className="text-[10px] text-zinc-500 leading-normal">{item.deltaNotes}</p>
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
                    <div
                      key={tech.technology}
                      className="p-2.5 rounded bg-zinc-900 border border-zinc-800/80 space-y-1 font-mono"
                    >
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
                      <p className="text-[10px] text-zinc-400 font-sans">{tech.marketInsight}</p>
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
                <span className="text-emerald-400 font-bold block mb-1">
                  1. Overhaul CS304 (Enterprise Systems):
                </span>
                <span>Replace legacy Java 8 SOAP monolith with Rust &amp; Go microservices with Kafka streaming.</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800/80">
                <span className="text-emerald-400 font-bold block mb-1">
                  2. Modernize CS201 (Web Lab):
                </span>
                <span>Deprecate PHP/jQuery and introduce Next.js App Router, TypeScript, and TailwindCSS sandboxes.</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800/80">
                <span className="text-emerald-400 font-bold block mb-1">
                  3. Cloud &amp; AI Primitives:
                </span>
                <span>Integrate Docker, Kubernetes, and PyTorch vector embeddings into core third-year lab requirements.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Board of Studies (BOS) Report Modal */}
      {showBosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-lg bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 my-8 text-zinc-100">
            {/* Modal Actions Bar */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-400" />
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                  Board of Studies (BOS) Executive Governance Memorandum
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.print()}
                  className="h-7 text-xs font-mono"
                >
                  <Printer className="h-3 w-3 mr-1" />
                  <span>Print Memo</span>
                </Button>
                <button
                  onClick={() => setShowBosModal(false)}
                  className="p-1 rounded text-zinc-500 hover:text-zinc-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Memorandum Body (Formal Format) */}
            <div className="space-y-6 font-mono text-xs">
              {/* Institutional Letterhead */}
              <div className="border-b border-zinc-800 pb-4 text-center space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight">
                  DEPARTMENT OF COMPUTER SCIENCE &amp; ENGINEERING
                </h2>
                <p className="text-[11px] text-zinc-400">
                  NATIONAL INSTITUTE OF TECHNOLOGY KARNATAKA / IIT MADRAS
                </p>
                <p className="text-[10px] text-zinc-500">
                  Ref No: BOS/CSE/2026-27/REC-041 • Dated: 6 September 2026
                </p>
              </div>

              {/* Subject & Metadata */}
              <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div>
                  <span className="text-zinc-500">TO: </span>
                  <span className="text-zinc-200 font-bold">Academic Council &amp; Board of Studies (BOS)</span>
                </div>
                <div>
                  <span className="text-zinc-500">FROM: </span>
                  <span className="text-zinc-200 font-bold">
                    Dr. Sunita Rao, Dean (Academics) &amp; Head of Department
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500">SUBJECT: </span>
                  <span className="text-emerald-400 font-bold">
                    Curriculum Modernization &amp; Industry Alignment Recommendation (2026–27)
                  </span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  1. Executive Summary &amp; Telemetry Basis
                </h3>
                <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                  Based on continuous algorithmic telemetry collected via the SkillNexus Market Demand Radar
                  (connected to live Adzuna employment indices covering tier-1 Indian technology hubs including
                  Bengaluru, Hyderabad, and Pune), the Department of Computer Science has identified a statistically
                  critical divergence between our active syllabus (v2022.4) and industry hiring demands.
                </p>
              </div>

              {/* Delta Matrix Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  2. Curriculum Delta vs. Live Tech Hiring Demand
                </h3>
                <table className="w-full border border-zinc-800 text-left text-[11px]">
                  <thead className="bg-zinc-900 text-zinc-400">
                    <tr>
                      <th className="p-2 border-b border-zinc-800">Course Code</th>
                      <th className="p-2 border-b border-zinc-800">Current Syllabus (v2022.4)</th>
                      <th className="p-2 border-b border-zinc-800">Industry Hiring Demand</th>
                      <th className="p-2 border-b border-zinc-800">YoY Vacancy Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 text-zinc-300">
                    <tr>
                      <td className="p-2 font-bold text-zinc-200">CS201</td>
                      <td className="p-2 text-zinc-400">PHP 7.4, jQuery, Apache</td>
                      <td className="p-2 text-emerald-400">Next.js App Router, TypeScript, React 19</td>
                      <td className="p-2 font-bold text-emerald-400">+34% YoY</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-zinc-200">CS304</td>
                      <td className="p-2 text-zinc-400">Java 8, SOAP Web Services</td>
                      <td className="p-2 text-emerald-400">Rust &amp; Go Microservices, gRPC</td>
                      <td className="p-2 font-bold text-emerald-400">+48% YoY</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-zinc-200">CS302</td>
                      <td className="p-2 text-zinc-400">C++ POSIX Threads, RPC</td>
                      <td className="p-2 text-emerald-400">Docker, Kubernetes Cloud Primitives</td>
                      <td className="p-2 font-bold text-emerald-400">+29% YoY</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-zinc-200">CS410</td>
                      <td className="p-2 text-zinc-400">Classical ML (Scikit-Learn)</td>
                      <td className="p-2 text-emerald-400">PyTorch, Vector Embeddings, LLM Ops</td>
                      <td className="p-2 font-bold text-emerald-400">+42% YoY</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Three Sign-off Signature Blocks */}
              <div className="pt-6 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="space-y-1">
                  <div className="h-10 border-b border-zinc-700 flex items-end justify-center pb-1">
                    <span className="font-serif italic text-emerald-400 text-sm">Sunita Rao</span>
                  </div>
                  <span className="font-bold text-zinc-200 block text-[11px]">Dr. Sunita Rao</span>
                  <span className="text-[10px] text-zinc-500 block">Dean of Academics &amp; HoD</span>
                </div>

                <div className="space-y-1">
                  <div className="h-10 border-b border-zinc-700 flex items-end justify-center pb-1">
                    <span className="font-serif italic text-zinc-400 text-sm">K. V. Narayanan</span>
                  </div>
                  <span className="font-bold text-zinc-200 block text-[11px]">Prof. K. V. Narayanan</span>
                  <span className="text-[10px] text-zinc-500 block">Secretary, Academic Council</span>
                </div>

                <div className="space-y-1">
                  <div className="h-10 border-b border-zinc-700 flex items-end justify-center pb-1">
                    <span className="font-serif italic text-zinc-400 text-sm">Vikram Malhotra</span>
                  </div>
                  <span className="font-bold text-zinc-200 block text-[11px]">Vikram Malhotra</span>
                  <span className="text-[10px] text-zinc-500 block">VP Engineering, Razorpay (Industry Rep)</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Close */}
            <div className="flex justify-end pt-3 border-t border-zinc-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBosModal(false)}
                className="font-mono text-xs"
              >
                Close Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
