"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  ShieldCheck,
  Award,
  Hash,
  Copy,
  Check,
  Sparkles,
  Building,
  User,
  GraduationCap,
  Download,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudentContext } from "@/context/student-context";
import { LetterOfRecommendation } from "@/lib/types";
import { truncateAddress } from "@/lib/utils";

export default function LORGeneratorPage() {
  const { currentPersona, lors, addIssuedLOR } = useStudentContext();

  const [studentName, setStudentName] = useState("Arjun Kumar");
  const [studentId, setStudentId] = useState("CS23B044");
  const [college, setCollege] = useState("Indian Institute of Technology, Madras");
  const [evaluatorName, setEvaluatorName] = useState("Dr. K. Ramanathan");
  const [evaluatorTitle, setEvaluatorTitle] = useState("Head of Training & Placements");
  const [companyOrDept, setCompanyOrDept] = useState("Dept of Computer Science & Engineering");

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
  const [currentLor, setCurrentLor] = useState<LetterOfRecommendation | null>(lors[0] || null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleRatingChange = (field: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/generate-lor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          studentId,
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
        setCurrentLor(data.lor);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCommitToLedger = () => {
    if (!currentLor) return;
    addIssuedLOR(currentLor);
    setSavedSuccess(true);
  };

  const handleCopyHash = () => {
    if (!currentLor) return;
    navigator.clipboard.writeText(currentLor.cryptographicHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Presets
  const loadPreset = (role: "faculty" | "recruiter") => {
    if (role === "faculty") {
      setEvaluatorName("Dr. K. Ramanathan");
      setEvaluatorTitle("Head of Training & Placements");
      setCompanyOrDept("IIT Madras CSE Dept");
      setRatings({
        technicalProficiency: 5,
        systemArchitecture: 5,
        problemSolving: 5,
        communicationCollab: 4,
        innovationInitiative: 5,
      });
      setCustomNotes("Top 1% engineering candidate in our research lab. Exceptional systems understanding.");
    } else {
      setEvaluatorName("Priya Sharma");
      setEvaluatorTitle("Senior Engineering Manager");
      setCompanyOrDept("Razorpay Fintech Core Systems");
      setRatings({
        technicalProficiency: 5,
        systemArchitecture: 4,
        problemSolving: 5,
        communicationCollab: 5,
        innovationInitiative: 5,
      });
      setCustomNotes("Built an idempotent webhook consumer solving high-traffic race conditions with zero duplicate debits.");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tamper-Proof AI Letter of Recommendation (LOR)"
        subtitle="Cryptographically sealed academic and industry recommendations. Evaluator rubric scores are embedded into structured appraisals and hashed with SHA-256 for instant public verification."
        badgeText="Module 09"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Evaluation Rubric Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  <FileCheck2 className="h-4 w-4 text-indigo-400" />
                  <span>Employer / Faculty Evaluation Rubric</span>
                </CardTitle>
              </div>
              <CardDescription>
                Fill rubric dimensions to generate an official cryptographic appraisal
              </CardDescription>

              {/* Quick Presets */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => loadPreset("faculty")}
                  className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold"
                >
                  Load IIT Madras Faculty Rubric
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset("recruiter")}
                  className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold"
                >
                  Load Razorpay Recruiter Rubric
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Candidate Name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
                <Input
                  label="Student / Roll ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>

              <Input
                label="Institution / University"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Evaluator Name"
                  value={evaluatorName}
                  onChange={(e) => setEvaluatorName(e.target.value)}
                />
                <Input
                  label="Evaluator Title"
                  value={evaluatorTitle}
                  onChange={(e) => setEvaluatorTitle(e.target.value)}
                />
              </div>

              <Input
                label="Company / Department"
                value={companyOrDept}
                onChange={(e) => setCompanyOrDept(e.target.value)}
              />

              {/* 5-Star Metric Rubrics */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
                  Evaluation Metrics (1-5 Scale):
                </span>

                {(
                  [
                    { key: "technicalProficiency", label: "Technical & Language Proficiency" },
                    { key: "systemArchitecture", label: "System Design & Architecture" },
                    { key: "problemSolving", label: "Algorithmic & Problem Solving" },
                    { key: "communicationCollab", label: "Communication & Collaboration" },
                    { key: "innovationInitiative", label: "Initiative & Autonomous Execution" },
                  ] as const
                ).map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-slate-300">{label}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleRatingChange(key, val)}
                          className={`h-7 w-7 rounded font-mono font-bold text-xs transition-colors ${
                            ratings[key] >= val
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-800 text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
                  Specific Project Deliverable Note:
                </label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700/80 p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleGenerate}
                isLoading={isGenerating}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate & Cryptographically Sign LOR
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Styled Tamper-Proof Certificate */}
        <div className="lg:col-span-7 space-y-6">
          {currentLor ? (
            <Card className="border-indigo-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl relative overflow-hidden">
              {/* Background Seal Watermark */}
              <div className="absolute right-6 top-6 opacity-5 pointer-events-none">
                <ShieldCheck className="h-64 w-64 text-white" />
              </div>

              <CardHeader className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">
                        Cryptographic Letter of Recommendation
                      </h3>
                      <p className="text-[11px] font-mono text-indigo-400">
                        Token: {currentLor.verificationBadgeToken}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" dot>
                    SHA-256 Verified
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6 text-xs">
                {/* Official Letter Body */}
                <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-4 font-serif text-slate-200 leading-relaxed text-sm">
                  <div className="flex justify-between border-b border-slate-800 pb-3 font-sans text-xs">
                    <div>
                      <p className="font-bold text-white">{currentLor.evaluatorName}</p>
                      <p className="text-slate-400">{currentLor.evaluatorTitle}</p>
                      <p className="text-slate-400">{currentLor.companyOrDept}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400">Issue Date:</p>
                      <p className="font-mono text-slate-300">
                        {new Date(currentLor.issuedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <p className="whitespace-pre-line">{currentLor.recommendationBody}</p>

                  <div className="pt-4 border-t border-slate-800 flex items-end justify-between font-sans">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                        Authorized Digital Signature:
                      </p>
                      <p className="font-mono text-xs font-bold text-indigo-400">
                        {currentLor.evaluatorName} (Verified PKI)
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" size="sm">
                        IITM / Industry Accreditation
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Cryptographic Hash Box */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Tamper-Proof Ledger Hash (SHA-256)</span>
                    </span>
                    <button
                      onClick={handleCopyHash}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      {copiedHash ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedHash ? "Copied!" : "Copy Hash"}</span>
                    </button>
                  </div>
                  <p className="font-mono text-xs text-indigo-300 break-all bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    {currentLor.cryptographicHash}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Any modification to letter text or evaluation scores will instantly invalidate this checksum.
                  </p>
                </div>

                {/* Ledger Commitment */}
                {savedSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center text-xs font-semibold text-emerald-300">
                    ✓ Letter of Recommendation permanently sealed and added to applicant showcase!
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleCommitToLedger}
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Commit Verified LOR to Public Portfolio
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="py-20 text-center text-slate-500">
              <p>Configure rubric and click Generate to preview signed recommendation.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
