"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  ExternalLink,
  GitPullRequest,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Filter,
  DollarSign,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { Tooltip } from "@/components/ui/tooltip";
import { useStudentContext } from "@/context/student-context";
import { formatINR } from "@/lib/utils";
import { BountyChallenge } from "@/lib/types";

export default function BountyBoardPage() {
  const { bounties, recordBountyScore } = useStudentContext();

  const [activeFilter, setActiveFilter] = useState<"All" | "Open" | "Completed">("All");
  const [selectedBounty, setSelectedBounty] = useState<BountyChallenge | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [prUrl, setPrUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    score: number;
    critique: string;
    coveragePct: number;
  } | null>(null);

  const filteredBounties = bounties.filter((b) => {
    if (activeFilter === "All") return true;
    return b.status === activeFilter;
  });

  const handleOpenSubmit = (bounty: BountyChallenge) => {
    setSelectedBounty(bounty);
    setPrUrl(`https://github.com/${bounty.company.toLowerCase().replace(/[^a-z]/g, "")}/sandbox/pull/42`);
    setSubmissionFeedback(null);
    setIsSubmitModalOpen(true);
  };

  const handleRunCiAndSubmit = async () => {
    if (!selectedBounty) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bountyId: selectedBounty.id,
          prUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmissionFeedback({
          score: data.score,
          critique: data.automatedReviewCritique,
          coveragePct: data.testSuiteResults.coveragePct,
        });

        // Record in student context
        recordBountyScore(selectedBounty.id, data.score, prUrl);

        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ["#10b981", "#6366f1", "#f59e0b"],
          });
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <PageHeader
          title="Industry Micro-Bounty Board"
          subtitle="Real-world, 48-hour scoped production challenges published by engineering teams at Razorpay, Zerodha, PhonePe, and Hasura. Submit verified pull requests with automated test grading."
          badgeText="Module 07"
        />

        {/* Filter Bar & Metric Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 p-1">
            {(["All", "Open", "Completed"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === filter
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>
              Total Bounty Pool: <strong className="text-emerald-400">₹65,000 INR</strong>
            </span>
            <span>•</span>
            <span>Zero Unverified Resumes Allowed</span>
          </div>
        </div>

        {/* Bounties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBounties.map((bounty) => (
            <Card
              key={bounty.id}
              className={`flex flex-col justify-between transition-all ${
                bounty.status === "Completed"
                  ? "border-emerald-500/40 bg-emerald-950/10"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div>
                <CardHeader className="pb-3 border-b border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-indigo-400">{bounty.company}</span>
                      <Badge
                        variant={
                          bounty.difficulty === "Expert"
                            ? "danger"
                            : bounty.difficulty === "Hard"
                            ? "warning"
                            : "default"
                        }
                        size="sm"
                      >
                        {bounty.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {bounty.status === "Completed" ? (
                        <Badge variant="success" dot>
                          Completed (PR Merged)
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{bounty.timeRemainingHours}h Left</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <CardTitle className="text-base text-white pt-2 leading-snug">
                    {bounty.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 pt-4 text-xs">
                  <p className="text-slate-300 leading-relaxed">{bounty.description}</p>

                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                      Required Stack:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {bounty.requiredSkills.map((sk) => (
                        <Badge key={sk} variant="outline" size="sm">
                          {sk}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-300">
                      CI Automated Test Requirements:
                    </span>
                    <ul className="space-y-1 text-slate-400 list-disc pl-4 text-[11px]">
                      {bounty.testChecklist.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {bounty.status === "Completed" && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between font-mono text-xs">
                      <span className="text-emerald-300">
                        Auto-Score: <strong>{bounty.autoScorePreview}%</strong>
                      </span>
                      <a
                        href={bounty.submittedPrUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <span>View PR</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </div>

              <CardFooter className="flex items-center justify-between pt-4 border-t border-slate-800">
                <Tooltip content="Direct industry grant disbursed upon automated CI assertion validation and employer PR merge">
                  <div className="cursor-pointer">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      Bounty Grant
                    </span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {formatINR(bounty.rewardINR)}
                    </span>
                  </div>
                </Tooltip>

                {bounty.status === "Completed" ? (
                  <Badge variant="success" size="md">
                    Verified on Ledger
                  </Badge>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenSubmit(bounty)}
                  >
                    <GitPullRequest className="h-3.5 w-3.5 mr-1.5" />
                    Submit Pull Request
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* PR Submission Modal */}
        <Modal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          title={`Submit PR: ${selectedBounty?.title}`}
          description={`Submit your open pull request link for ${selectedBounty?.company}. The automated CI harness will build your branch, verify test assertions, and calculate your score preview.`}
          maxWidth="lg"
        >
          {submissionFeedback ? (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <h4 className="font-bold text-sm">CI/CD Automated Test Suite Succeeded!</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {submissionFeedback.critique}
                </p>
                <div className="space-y-2 pt-2 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-emerald-300">Auto-Score Preview</span>
                      <strong className="text-emerald-400">{submissionFeedback.score}%</strong>
                    </div>
                    <Progress value={submissionFeedback.score} className="h-1.5" indicatorClassName="bg-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Branch Test Coverage</span>
                      <strong className="text-slate-200">{submissionFeedback.coveragePct}%</strong>
                    </div>
                    <Progress value={submissionFeedback.coveragePct} className="h-1.5" indicatorClassName="bg-indigo-500" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-400">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Credited to Skill Radar & Public Portfolio</span>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" onClick={() => setIsSubmitModalOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <Input
                label="GitHub Pull Request URL"
                value={prUrl}
                onChange={(e) => setPrUrl(e.target.value)}
                placeholder="https://github.com/company/sandbox/pull/123"
              />

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-slate-200">Pre-flight checklist:</p>
                <p>• Clean git history without merge conflict artifacts</p>
                <p>• All benchmark unit tests passing locally</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsSubmitModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleRunCiAndSubmit}
                  isLoading={isSubmitting}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Run CI & Verify PR
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
