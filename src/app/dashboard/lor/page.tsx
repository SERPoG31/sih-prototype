"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileCheck2,
  ShieldCheck,
  Hash,
  Copy,
  Check,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  RefreshCw,
  Award,
  Calendar,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudentContext } from "@/context/student-context";

// Helper to compute SHA-256 in the browser via Web Crypto API
async function computeSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function LORContent() {
  const searchParams = useSearchParams();
  const studentParam = searchParams.get("studentId");

  const {
    currentPersona,
    lors,
    cohortStudents,
    addIssuedLOR,
    toggleLORPortfolioDisplay,
  } = useStudentContext();

  // Role detection
  const isEvaluator =
    currentPersona.type === "faculty" ||
    currentPersona.id === "dr-sunita-rao" ||
    currentPersona.name.toLowerCase().includes("sunita") ||
    currentPersona.name.toLowerCase().includes("dean");

  const isRecruiter =
    currentPersona.type === "recruiter" ||
    currentPersona.id === "vikram-malhotra" ||
    currentPersona.name.toLowerCase().includes("vikram") ||
    currentPersona.name.toLowerCase().includes("malhotra");

  const isStudent = !isEvaluator && !isRecruiter;

  // Evaluator Minting Console State
  const defaultStudent =
    cohortStudents.find((s) => s.studentId === studentParam) || cohortStudents[0];

  const [selectedStudentId, setSelectedStudentId] = useState(defaultStudent?.studentId || "2026-CS-041");
  const [studentName, setStudentName] = useState(defaultStudent?.name || "Arjun Kumar");
  const [college, setCollege] = useState(defaultStudent?.college || "Indian Institute of Technology, Madras");
  const [evaluatorName, setEvaluatorName] = useState("Dr. Sunita Rao");
  const [evaluatorTitle, setEvaluatorTitle] = useState("Dean of Academic Affairs & TPO");
  const [companyOrDept, setCompanyOrDept] = useState("Department of Computer Science and Engineering");

  const [ratings, setRatings] = useState({
    technicalProficiency: 5,
    systemArchitecture: 5,
    problemSolving: 5,
    communicationCollab: 4,
    innovationInitiative: 5,
  });

  const [customNotes, setCustomNotes] = useState(
    "Led development of the department's high-throughput lab scheduler, reducing job queuing latency by 74%."
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [mintedSuccess, setMintedSuccess] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Sync state if studentParam changes
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (studentParam) {
      const match = cohortStudents.find((s) => s.studentId === studentParam);
      if (match) {
        setSelectedStudentId(match.studentId);
        setStudentName(match.name);
        setCollege(match.college);
      }
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [studentParam, cohortStudents]);

  const handleStudentSelect = (stdId: string) => {
    setSelectedStudentId(stdId);
    const match = cohortStudents.find((s) => s.studentId === stdId);
    if (match) {
      setStudentName(match.name);
      setCollege(match.college);
    }
  };

  const handleRatingChange = (field: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({ ...prev, [field]: value }));
  };

  const handleMintLOR = async () => {
    setIsGenerating(true);
    setMintedSuccess(false);

    try {
      const res = await fetch("/api/generate-lor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          studentId: selectedStudentId,
          college,
          evaluatorName,
          evaluatorTitle,
          companyOrDept,
          ratings,
          customNotes,
        }),
      });

      const data = await res.json();
      if (data.success && data.lor) {
        addIssuedLOR(data.lor);
        setMintedSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Recruiter Tamper Audit State
  const selectedAuditLor = lors[0] || null;
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    calculatedHash: string;
    isAuthentic: boolean;
    timestampChecked: string;
  } | null>(null);
  const [isSimulatingTampering, setIsSimulatingTampering] = useState(false);

  const handleVerifyIntegrity = async (tampered: boolean = false) => {
    if (!selectedAuditLor) return;
    setIsVerifying(true);
    setIsSimulatingTampering(tampered);

    // Give visual animation feedback
    await new Promise((r) => setTimeout(r, 600));

    // Construct canonical payload
    const ratingsObj = tampered
      ? { ...selectedAuditLor.metricRatings, technicalProficiency: 1 }
      : selectedAuditLor.metricRatings;

    const payload = `${selectedAuditLor.studentName}_${selectedAuditLor.studentId}_${selectedAuditLor.evaluatorName}_${JSON.stringify(ratingsObj)}_${selectedAuditLor.issuedAt}`;
    const hash = await computeSha256(payload);

    setVerificationResult({
      calculatedHash: hash,
      isAuthentic: !tampered && hash === selectedAuditLor.cryptographicHash,
      timestampChecked: new Date().toLocaleTimeString(),
    });
    setIsVerifying(false);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* CASE 1: FACULTY / EVALUATOR PERSONA (Dr. Sunita Rao)                      */}
      {/* ========================================================================= */}
      {isEvaluator && (
        <div className="space-y-6">
          <PageHeader
            title="Institutional LOR Minting Console"
            subtitle="Restricted evaluation authority: Dean of Academic Affairs & Training & Placement Officer."
          >
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                Issuer Authority: Dr. Sunita Rao (Dean / TPO)
              </Badge>
            </div>
          </PageHeader>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Controls */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="border-b border-zinc-800 pb-3">
                  <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-emerald-400" />
                    <span>Candidate Rubric Configuration</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-4 space-y-4 text-xs">
                  {/* Student Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                      Target Candidate Roster:
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => handleStudentSelect(e.target.value)}
                      className="w-full rounded-md bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
                    >
                      {cohortStudents.map((s) => (
                        <option key={s.studentId} value={s.studentId}>
                          {s.name} — {s.studentId} ({s.devTier})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Student Details (Readonly) */}
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Candidate Name"
                      value={studentName}
                      disabled
                      className="bg-zinc-950/60 border-zinc-800/80 text-zinc-400 font-mono text-xs"
                    />
                    <Input
                      label="Student Roll ID"
                      value={selectedStudentId}
                      disabled
                      className="bg-zinc-950/60 border-zinc-800/80 text-zinc-400 font-mono text-xs"
                    />
                  </div>

                  {/* Evaluator Authority Fields */}
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Evaluator Name"
                      value={evaluatorName}
                      onChange={(e) => setEvaluatorName(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-zinc-200 font-mono text-xs"
                    />
                    <Input
                      label="Designation / Role"
                      value={evaluatorTitle}
                      onChange={(e) => setEvaluatorTitle(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-zinc-200 font-mono text-xs"
                    />
                  </div>

                  <Input
                    label="Academic Department"
                    value={companyOrDept}
                    onChange={(e) => setCompanyOrDept(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-zinc-200 font-mono text-xs"
                  />

                  {/* 5-Axis Rubric Sliders */}
                  <div className="space-y-3 pt-3 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                        5-Axis Evaluation Rubric (1–5 Scale)
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        Avg: {(
                          Object.values(ratings).reduce((a, b) => a + b, 0) / 5
                        ).toFixed(1)} / 5.0
                      </span>
                    </div>

                    {(
                      [
                        { key: "technicalProficiency", label: "Technical & Language Proficiency" },
                        { key: "systemArchitecture", label: "System Design & Architecture" },
                        { key: "problemSolving", label: "Algorithmic & Problem Solving" },
                        { key: "communicationCollab", label: "Communication & Collaboration" },
                        { key: "innovationInitiative", label: "Initiative & Autonomous Execution" },
                      ] as const
                    ).map(({ key, label }) => (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-300">{label}</span>
                          <span className="font-mono font-bold text-emerald-400">
                            {ratings[key]} / 5
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={ratings[key]}
                            onChange={(e) => handleRatingChange(key, Number(e.target.value))}
                            className="w-full accent-emerald-500 bg-zinc-800 h-1.5 rounded cursor-pointer"
                          />
                          <div className="flex gap-1 shrink-0">
                            {[1, 2, 3, 4, 5].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => handleRatingChange(key, val)}
                                className={`h-5 w-5 rounded font-mono text-[10px] font-semibold transition-colors ${
                                  ratings[key] === val
                                    ? "bg-emerald-500 text-zinc-950 font-bold"
                                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Project Deliverable Text Area */}
                  <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                      Deliverable / Capstone Impact Note:
                    </label>
                    <textarea
                      rows={3}
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="Specify verifiable software deliverables, performance improvements, or research benchmarks..."
                      className="w-full rounded-md bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                    />
                  </div>

                  {/* Primary Action Button */}
                  <Button
                    variant="primary"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-semibold font-mono text-xs h-10 cursor-pointer"
                    onClick={handleMintLOR}
                    isLoading={isGenerating}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Cryptographically Seal & Mint LOR (SHA-256)
                  </Button>

                  {mintedSuccess && (
                    <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>Sealed & committed to {studentName}&apos;s cryptographic ledger!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Live Document Preview */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="bg-zinc-900/50 border-zinc-800 shadow-2xl relative overflow-hidden">
                <div className="absolute right-6 top-6 opacity-5 pointer-events-none">
                  <ShieldCheck className="h-64 w-64 text-zinc-100" />
                </div>

                <CardHeader className="border-b border-zinc-800 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-zinc-100">
                          Official Institutional Recommendation Letter
                        </CardTitle>
                        <p className="text-[10px] font-mono text-zinc-400">
                          IIT Madras • Department of Computer Science & Engineering
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
                      Verified PKI Seal
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6 text-xs">
                  {/* Official Letterhead & Body */}
                  <div className="p-6 rounded-lg bg-zinc-950 border border-zinc-800 space-y-4 font-serif text-zinc-200 leading-relaxed text-sm">
                    <div className="flex justify-between border-b border-zinc-800 pb-3 font-sans text-xs">
                      <div>
                        <p className="font-bold text-zinc-100">{evaluatorName}</p>
                        <p className="text-zinc-400 text-[11px]">{evaluatorTitle}</p>
                        <p className="text-zinc-500 text-[10px] font-mono">{companyOrDept}</p>
                      </div>
                      <div className="text-right font-mono text-[11px]">
                        <p className="text-zinc-500">Date Issued:</p>
                        <p className="text-zinc-300">
                          {new Date().toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 font-sans text-xs text-zinc-300 leading-relaxed">
                      <p>
                        It is with immense conviction that I issue this Cryptographically Authenticated Letter of Recommendation for{" "}
                        <strong className="text-zinc-100">{studentName}</strong> (Roll: <code className="font-mono text-emerald-400">{selectedStudentId}</code>) from {college}.
                      </p>

                      <p>
                        Having closely evaluated {studentName}&apos;s engineering contributions across complex departmental coursework, real-world sandboxes, and systems architecture challenges, I can attest to their stellar technical acumen. Across our formal evaluation rubric, {studentName} secured an aggregate score of{" "}
                        <strong className="text-zinc-100 font-mono">
                          {(Object.values(ratings).reduce((a, b) => a + b, 0) / 5).toFixed(1)} / 5.0
                        </strong>.
                      </p>

                      <p>
                        In the realm of System Architecture (Rating: {ratings.systemArchitecture}/5) and Technical Proficiency (Rating: {ratings.technicalProficiency}/5), they have consistently designed fault-tolerant, low-latency pipelines and modular, typed APIs. Their problem-solving rigor ({ratings.problemSolving}/5) combined with their collaborative ethos ({ratings.communicationCollab}/5) makes them an exceptional engineering multiplier.
                      </p>

                      {customNotes && (
                        <p className="p-2.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-300">
                          <strong className="text-emerald-400">Special Deliverable Note:</strong> {customNotes}
                        </p>
                      )}

                      <p>
                        I recommend {studentName} with the highest tier of institutional endorsement for senior engineering internships and roles at premier technology companies.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-800 flex items-end justify-between font-sans text-xs">
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                          Authorized Digital Authority:
                        </p>
                        <p className="font-mono text-xs font-bold text-emerald-400">
                          {evaluatorName} (TPO & Dean)
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="border-zinc-800 text-zinc-400 font-mono text-[10px]">
                          IITM Academic Council
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Minted Cryptographic Receipt Box */}
                  {lors.length > 0 && (
                    <div className="p-3.5 rounded-md bg-zinc-950 border border-zinc-800 space-y-2 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase text-zinc-400 tracking-wider flex items-center gap-1.5 font-bold">
                          <Hash className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Ledger SHA-256 Checksum ({lors[0].id})</span>
                        </span>
                        <button
                          onClick={() => handleCopy(lors[0].cryptographicHash)}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedHash ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedHash ? "Copied" : "Copy Hash"}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-300 break-all bg-zinc-900 p-2 rounded border border-zinc-800/80">
                        {lors[0].cryptographicHash}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        Immutable cryptographic fingerprint. Any alteration to candidate rubrics or letter text will cause checksum mismatch.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE 2: STUDENT PERSONA (Arjun Kumar) — READ-ONLY VAULT                   */}
      {/* ========================================================================= */}
      {isStudent && (
        <div className="space-y-6">
          <PageHeader
            title="Student Credentials Vault"
            subtitle="Verified, cryptographically signed Letters of Recommendation issued by your academic institution."
          >
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs border-zinc-800 text-zinc-400 bg-zinc-900">
                <Lock className="h-3 w-3 mr-1 text-emerald-400" />
                Read-Only Credential Vault
              </Badge>
            </div>
          </PageHeader>

          {/* Academic Integrity Notice */}
          <div className="p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-start gap-3 text-xs">
            <div className="p-1.5 rounded bg-zinc-800 text-zinc-300 shrink-0">
              <Lock className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-zinc-200">
                Academic Integrity & Zero Self-Certification Guarantee
              </p>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Evaluation sliders and signing controls are strictly restricted to institutional authorities (Dr. Sunita Rao, Dean & TPO). As a student, you can view your authenticated credentials, inspect their SHA-256 receipts, and control public visibility on your showcase portfolio.
              </p>
            </div>
          </div>

          {/* LOR Cards */}
          <div className="space-y-4">
            {lors.length === 0 ? (
              <Card className="bg-zinc-900/50 border-zinc-800 p-12 text-center text-zinc-500 font-mono text-xs">
                No formal Letters of Recommendation have been issued to your roll ID yet.
              </Card>
            ) : (
              lors.map((lor) => {
                const avgRating = (
                  Object.values(lor.metricRatings).reduce((a, b) => a + b, 0) / 5
                ).toFixed(1);

                const isDisplayed = lor.displayOnPortfolio !== false;

                return (
                  <Card key={lor.id} className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
                    <CardHeader className="border-b border-zinc-800 pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded border border-zinc-800 bg-zinc-900 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
                            <Award className="h-4 w-4" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                              <span>Recommendation by {lor.evaluatorName}</span>
                              <Badge variant="outline" className="font-mono text-[10px] border-emerald-500/30 text-emerald-400">
                                {lor.verificationBadgeToken}
                              </Badge>
                            </CardTitle>
                            <p className="text-[11px] text-zinc-400">
                              {lor.evaluatorTitle} • {lor.companyOrDept}
                            </p>
                          </div>
                        </div>

                        {/* Public Portfolio Visibility Toggle */}
                        <div className="flex items-center gap-2 pt-2 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => toggleLORPortfolioDisplay(lor.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono transition-colors cursor-pointer ${
                              isDisplayed
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            {isDisplayed ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                            <span>{isDisplayed ? "Visible on /p/arjun-kumar" : "Hidden from Showcase"}</span>
                          </button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4 space-y-4 text-xs">
                      {/* Metadata Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                        <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80">
                          <span className="text-[10px] uppercase text-zinc-500 block">Aggregate Rating</span>
                          <span className="text-sm font-bold text-emerald-400">{avgRating} / 5.0</span>
                        </div>
                        <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80">
                          <span className="text-[10px] uppercase text-zinc-500 block">Candidate ID</span>
                          <span className="text-xs font-bold text-zinc-200">{lor.studentId}</span>
                        </div>
                        <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80">
                          <span className="text-[10px] uppercase text-zinc-500 block">Date Issued</span>
                          <span className="text-xs text-zinc-300 flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-zinc-500" />
                            {new Date(lor.issuedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80">
                          <span className="text-[10px] uppercase text-zinc-500 block">Institution</span>
                          <span className="text-xs text-zinc-300 truncate block">IIT Madras</span>
                        </div>
                      </div>

                      {/* 5-Axis Score Breakdown */}
                      <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block mb-2">
                          Evaluated Rubric Dimensions:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px]">
                          <div>
                            <span className="text-zinc-500 text-[10px] block">Tech Proficiency</span>
                            <span className="text-zinc-200 font-bold">{lor.metricRatings.technicalProficiency}/5</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 text-[10px] block">Architecture</span>
                            <span className="text-zinc-200 font-bold">{lor.metricRatings.systemArchitecture}/5</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 text-[10px] block">Problem Solving</span>
                            <span className="text-zinc-200 font-bold">{lor.metricRatings.problemSolving}/5</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 text-[10px] block">Communication</span>
                            <span className="text-zinc-200 font-bold">{lor.metricRatings.communicationCollab}/5</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 text-[10px] block">Initiative</span>
                            <span className="text-zinc-200 font-bold">{lor.metricRatings.innovationInitiative}/5</span>
                          </div>
                        </div>
                      </div>

                      {/* Letter Appraisal Preview */}
                      <div className="p-4 rounded-md bg-zinc-950 border border-zinc-800 space-y-3 font-serif text-zinc-300 leading-relaxed text-xs">
                        <p className="whitespace-pre-line">{lor.recommendationBody}</p>
                      </div>

                      {/* Cryptographic SHA-256 Receipt */}
                      <div className="p-3 rounded-md bg-zinc-950 border border-zinc-800 space-y-1.5 font-mono text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase text-zinc-400 tracking-wider flex items-center gap-1.5 font-bold">
                            <Hash className="h-3 w-3 text-emerald-400" />
                            <span>Tamper-Proof Receipt (SHA-256):</span>
                          </span>
                          <button
                            onClick={() => handleCopy(lor.cryptographicHash)}
                            className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedHash ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedHash ? "Copied" : "Copy Checksum"}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-400 break-all bg-zinc-900 p-2 rounded border border-zinc-800/80">
                          {lor.cryptographicHash}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE 3: RECRUITER PERSONA (Vikram Malhotra) — TAMPER AUDIT VIEW          */}
      {/* ========================================================================= */}
      {isRecruiter && (
        <div className="space-y-6">
          <PageHeader
            title="Recruiter Tamper Audit Console"
            subtitle="Zero-Trust Document Authenticity & Cryptographic Checksum Verifier."
          >
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                Active Auditor: Vikram Malhotra (Razorpay / Cred Labs)
              </Badge>
            </div>
          </PageHeader>

          {/* Audit Instructions */}
          <div className="p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-start gap-3 text-xs">
            <div className="p-1.5 rounded bg-zinc-800 text-zinc-300 shrink-0">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-zinc-200">
                Mathematical Proof of Authenticity (SHA-256 Invariance)
              </p>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                SkillNexus protects against credential fraud by cryptographically hashing the candidate roll ID, evaluator authority, rubric ratings, and timestamp. You can verify document integrity in real-time or simulate tampering to confirm mathematical invariance.
              </p>
            </div>
          </div>

          {/* Audit Verification Inspector */}
          {selectedAuditLor ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Document Overview */}
              <div className="lg:col-span-6 space-y-4">
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader className="border-b border-zinc-800 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                        <FileCheck2 className="h-4 w-4 text-emerald-400" />
                        <span>Target Credential Under Audit</span>
                      </CardTitle>
                      <Badge variant="outline" className="font-mono text-[10px] border-zinc-800 text-zinc-400">
                        {selectedAuditLor.id}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase block">Candidate</span>
                        <span className="text-zinc-100 font-bold">{selectedAuditLor.studentName}</span>
                      </div>
                      <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase block">Roll ID</span>
                        <span className="text-emerald-400 font-bold">{selectedAuditLor.studentId}</span>
                      </div>
                      <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase block">Issuer</span>
                        <span className="text-zinc-200">{selectedAuditLor.evaluatorName}</span>
                      </div>
                      <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase block">Accreditation</span>
                        <span className="text-zinc-200">{selectedAuditLor.college}</span>
                      </div>
                    </div>

                    {/* Canonical Payload Breakdown */}
                    <div className="p-3 rounded bg-zinc-950 border border-zinc-800 space-y-1.5">
                      <span className="text-[10px] uppercase text-zinc-400 tracking-wider font-bold block">
                        Canonical Data Payload (Pre-Hash):
                      </span>
                      <pre className="p-2 rounded bg-zinc-900 border border-zinc-800/80 text-[10px] text-zinc-300 overflow-x-auto leading-normal">
{`student: "${selectedAuditLor.studentName}"
studentId: "${selectedAuditLor.studentId}"
evaluator: "${selectedAuditLor.evaluatorName}"
ratings: ${JSON.stringify(selectedAuditLor.metricRatings)}
timestamp: "${selectedAuditLor.issuedAt}"`}
                      </pre>
                    </div>

                    {/* Stored Ledger Hash */}
                    <div className="p-3 rounded bg-zinc-950 border border-zinc-800 space-y-1">
                      <span className="text-[10px] uppercase text-zinc-400 tracking-wider font-bold block">
                        Committed Ledger Hash (SHA-256):
                      </span>
                      <p className="text-[11px] text-emerald-400 break-all bg-zinc-900 p-2 rounded border border-zinc-800">
                        {selectedAuditLor.cryptographicHash}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="primary"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold font-mono text-xs h-9 cursor-pointer"
                        onClick={() => handleVerifyIntegrity(false)}
                        isLoading={isVerifying && !isSimulatingTampering}
                      >
                        <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isVerifying && !isSimulatingTampering ? "animate-spin" : ""}`} />
                        Verify Document Integrity
                      </Button>

                      <Button
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-mono text-xs h-9 cursor-pointer"
                        onClick={() => handleVerifyIntegrity(true)}
                        isLoading={isVerifying && isSimulatingTampering}
                      >
                        <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                        Simulate Tampering
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Verification Results Panel */}
              <div className="lg:col-span-6 space-y-4">
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader className="border-b border-zinc-800 pb-3">
                    <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>Cryptographic Audit Output</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-4 text-xs font-mono">
                    {verificationResult ? (
                      <div className="space-y-4">
                        {/* Status Alert */}
                        {verificationResult.isAuthentic ? (
                          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>CRYPTOGRAPHIC INTEGRITY: 100% VERIFIED</span>
                            </div>
                            <p className="text-zinc-300 text-[11px] leading-relaxed">
                              Zero tampering detected. The computed SHA-256 checksum matches the institutional record registered on the ledger character-for-character.
                            </p>
                            <span className="text-[10px] text-zinc-500 block">
                              Verified at: {verificationResult.timestampChecked}
                            </span>
                          </div>
                        ) : (
                          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 space-y-1.5">
                            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                              <AlertTriangle className="h-4 w-4" />
                              <span>TAMPERING DETECTED: CHECKSUM MISMATCH</span>
                            </div>
                            <p className="text-zinc-300 text-[11px] leading-relaxed">
                              Warning: The payload was altered (e.g. modified rubric scores). The avalanche effect caused a completely divergent SHA-256 hash, invalidating the credential.
                            </p>
                            <span className="text-[10px] text-zinc-500 block">
                              Audit flag raised at: {verificationResult.timestampChecked}
                            </span>
                          </div>
                        )}

                        {/* Hash Comparison Matrix */}
                        <div className="space-y-2">
                          <div>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                              Stored Ledger Checksum:
                            </span>
                            <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 break-all">
                              {selectedAuditLor.cryptographicHash}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                              Live In-Browser Calculated Hash:
                            </span>
                            <div className={`p-2 rounded bg-zinc-950 border text-[11px] break-all ${
                              verificationResult.isAuthentic
                                ? "border-emerald-500/40 text-emerald-400"
                                : "border-red-500/40 text-red-400"
                            }`}>
                              {verificationResult.calculatedHash}
                            </div>
                          </div>
                        </div>

                        {/* Audit Verification Details */}
                        <div className="p-3 rounded bg-zinc-950 border border-zinc-800 space-y-1 text-[11px] text-zinc-400">
                          <p className="text-zinc-200 font-semibold">Audit Check Summary:</p>
                          <p>• Algorithm: SHA-256 (NIST FIPS 180-4)</p>
                          <p>• Issuing Public Key: Dr. Sunita Rao (IITM Placements Authority)</p>
                          <p>• Token Identity: {selectedAuditLor.verificationBadgeToken}</p>
                          <p>• Verification Result: {verificationResult.isAuthentic ? "PASS (Authentic)" : "FAIL (Tampered)"}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-zinc-500 space-y-2">
                        <ShieldCheck className="h-8 w-8 mx-auto text-zinc-600" />
                        <p>Click &quot;Verify Document Integrity&quot; to execute live cryptographic validation.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="p-12 text-center text-zinc-500 font-mono text-xs bg-zinc-900/50 border-zinc-800">
              No LOR records found for audit verification.
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function LORGeneratorPage() {
  return (
    <Suspense fallback={<div className="p-6 text-zinc-400 font-mono text-xs">Loading LOR Vault...</div>}>
      <LORContent />
    </Suspense>
  );
}
