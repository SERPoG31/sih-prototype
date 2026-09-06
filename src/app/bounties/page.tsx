"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Clock,
  ExternalLink,
  GitPullRequest,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Search,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useStudentContext } from "@/context/student-context";
import { Bounty, BountyGradingResult } from "@/lib/types";

export default function BountyBoardPage() {
  const { currentPersona, recordBountyScore, bounties: contextBounties } = useStudentContext();

  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [source, setSource] = useState<"live_github_issues" | "simulated_fallback">("simulated_fallback");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "open" | "claimed" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Claim tracking: bountyId -> timestamp
  const [claimedBounties, setClaimedBounties] = useState<Record<string, number>>({});

  // Submission modal state
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [prUrl, setPrUrl] = useState<string>("");
  const [submissionStep, setSubmissionStep] = useState<number>(0);
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradingResult, setGradingResult] = useState<BountyGradingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchBounties() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/bounties");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setSource(data.source || "simulated_fallback");
            setBounties(data.bounties || []);
          }
        }
      } catch (err) {
        console.error("Failed to load bounties:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchBounties();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClaim = (bountyId: string) => {
    setClaimedBounties((prev) => ({
      ...prev,
      [bountyId]: Date.now(),
    }));
    setBounties((prev) =>
      prev.map((b) => (b.id === bountyId ? { ...b, status: "claimed" } : b))
    );
  };

  const handleOpenSubmit = (bounty: Bounty) => {
    setSelectedBounty(bounty);
    setPrUrl(`https://github.com/${bounty.company.toLowerCase().replace(/[^a-z0-9]/g, "")}/project/pull/42`);
    setGradingResult(null);
    setErrorMessage(null);
    setSubmissionStep(0);
    setIsSubmitModalOpen(true);
  };

  const handleRunCiGrading = async () => {
    if (!selectedBounty) return;
    setIsGrading(true);
    setErrorMessage(null);
    setGradingResult(null);

    // Multi-step validation loader
    setSubmissionStep(1); // Inspecting PR diff
    await new Promise((r) => setTimeout(r, 450));

    setSubmissionStep(2); // Running AST compliance
    await new Promise((r) => setTimeout(r, 650));

    setSubmissionStep(3); // Verifying SHA-256 hash
    await new Promise((r) => setTimeout(r, 450));

    try {
      const res = await fetch("/api/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bountyId: selectedBounty.id,
          prUrl: prUrl.trim(),
          studentId: currentPersona.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Validation failed. Please verify the PR link.");
        setSubmissionStep(0);
        return;
      }

      setGradingResult(data);
      setSubmissionStep(4); // Finished

      // Mark bounty as completed locally
      setBounties((prev) =>
        prev.map((b) => (b.id === selectedBounty.id ? { ...b, status: "completed" } : b))
      );

      // Wire into StudentContext for global readiness score & verified badge persistence
      recordBountyScore(selectedBounty.id, data.score, prUrl, selectedBounty.tags, selectedBounty.company);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10b981", "#71717a", "#27272a"],
        });
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || "Submission failed due to network error.");
      setSubmissionStep(0);
    } finally {
      setIsGrading(false);
    }
  };

  // Merge with completed statuses from context if user completed previously
  const resolvedBounties = bounties.map((b) => {
    const isCompletedInContext = contextBounties.some(
      (cb) => cb.id === b.id && cb.status === "Completed"
    );
    if (isCompletedInContext) return { ...b, status: "completed" as const };
    return b;
  });

  const filteredBounties = resolvedBounties.filter((b) => {
    if (activeFilter !== "all" && b.status !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.company.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col text-zinc-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6 space-y-4">
        {/* Header with Live Telemetry Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-zinc-100">
                Module 07 • Industry Micro-Bounty Board
              </h1>
              {source === "live_github_issues" ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/30 bg-zinc-900 text-emerald-400 font-mono text-[10px] font-semibold tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE GITHUB BOUNTY STREAM
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 font-mono text-[10px] font-medium tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                  BENCHMARK CACHE
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Production bug fixes & engineering challenges with cash grants and pre-placement interviews (PPI). Submit pull requests with automated test grading.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 shrink-0">
            <span>Sprint Limit: 48h</span>
            <kbd className="text-[9px]">9</kbd>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded text-xs font-mono">
            {(["all", "open", "claimed", "completed"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded transition-colors uppercase text-[10px] tracking-wider font-semibold ${
                  activeFilter === filter
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search stack, company, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs bg-zinc-900 border-zinc-800 h-8 font-mono text-zinc-200 focus:border-zinc-700"
            />
          </div>
        </div>

        {/* Bounties Grid */}
        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-xs font-mono text-zinc-500">
            <RefreshCw className="h-4 w-4 animate-spin mr-2 text-zinc-400" />
            Ingesting live GitHub bounty issues...
          </div>
        ) : filteredBounties.length === 0 ? (
          <div className="h-48 rounded border border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-xs text-zinc-500 font-mono">
            <span>No bounties found matching filter criteria.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredBounties.map((bounty) => {
              const isClaimed = bounty.status === "claimed" || !!claimedBounties[bounty.id];
              const isCompleted = bounty.status === "completed";

              return (
                <Card
                  key={bounty.id}
                  className={`flex flex-col justify-between transition-colors ${
                    isCompleted
                      ? "border-emerald-500/40 bg-zinc-900/60"
                      : isClaimed
                      ? "border-amber-500/40 bg-zinc-900/50"
                      : "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70"
                  }`}
                >
                  <div>
                    <CardHeader className="pb-2 border-b border-zinc-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-zinc-200">
                          {bounty.company}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-zinc-800 bg-zinc-900 text-zinc-400">
                            {bounty.difficulty}
                          </span>
                          {isCompleted ? (
                            <Badge variant="success" size="sm" dot>
                              Merged
                            </Badge>
                          ) : isClaimed ? (
                            <Badge variant="warning" size="sm" dot>
                              In Sprint
                            </Badge>
                          ) : (
                            <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {bounty.timeLimitHours}h
                            </span>
                          )}
                        </div>
                      </div>

                      <CardTitle className="text-sm font-semibold text-zinc-100 pt-1 leading-snug">
                        {bounty.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-2 text-xs">
                      <p className="text-zinc-400 line-clamp-3 leading-relaxed">
                        {bounty.description}
                      </p>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                          Tags:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {bounty.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                    <div className="font-mono">
                      <span className="text-[10px] text-zinc-500 block uppercase">Reward</span>
                      <span className="text-xs font-bold text-emerald-400">{bounty.reward}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={bounty.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                        title="View issue on GitHub"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>

                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 font-semibold px-2 py-1 bg-zinc-900 border border-emerald-500/30 rounded">
                          <Check className="h-3 w-3" />
                          Earned
                        </span>
                      ) : isClaimed ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenSubmit(bounty)}
                          className="font-mono text-xs gap-1"
                        >
                          <GitPullRequest className="h-3 w-3" />
                          Submit PR
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleClaim(bounty.id)}
                          className="font-mono text-xs"
                        >
                          Claim (48h)
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Submission & CI Auto-Grading Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={selectedBounty ? `CI Verification • ${selectedBounty.company}` : "Bounty Submission"}
        description="Submit your open-source GitHub pull request URL for AST analysis and cryptographic verification."
      >
        <div className="space-y-4 font-mono text-zinc-100">

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase text-zinc-400 tracking-wider">
              GitHub Pull Request URL:
            </label>
            <Input
              type="url"
              placeholder="https://github.com/:owner/:repo/pull/:number"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              className="text-xs font-mono bg-zinc-950 border-zinc-800 h-9"
              disabled={isGrading}
            />
          </div>

          {/* Validation Pipeline Steps Indicator */}
          {submissionStep > 0 && (
            <div className="space-y-2 p-3 rounded border border-zinc-800 bg-zinc-950/80 text-xs">
              <div className="flex items-center gap-2">
                {submissionStep > 1 ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5 text-zinc-400 animate-spin shrink-0" />
                )}
                <span className={submissionStep === 1 ? "text-zinc-100 font-semibold" : "text-zinc-500"}>
                  1. Inspecting PR diff and branch tree...
                </span>
              </div>

              <div className="flex items-center gap-2">
                {submissionStep > 2 ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                ) : submissionStep === 2 ? (
                  <RefreshCw className="h-3.5 w-3.5 text-zinc-400 animate-spin shrink-0" />
                ) : (
                  <span className="h-3.5 w-3.5 rounded-full border border-zinc-800 shrink-0" />
                )}
                <span className={submissionStep === 2 ? "text-zinc-100 font-semibold" : "text-zinc-500"}>
                  2. Running AST compliance and coverage matrix...
                </span>
              </div>

              <div className="flex items-center gap-2">
                {submissionStep > 3 ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                ) : submissionStep === 3 ? (
                  <RefreshCw className="h-3.5 w-3.5 text-zinc-400 animate-spin shrink-0" />
                ) : (
                  <span className="h-3.5 w-3.5 rounded-full border border-zinc-800 shrink-0" />
                )}
                <span className={submissionStep === 3 ? "text-zinc-100 font-semibold" : "text-zinc-500"}>
                  3. Verifying cryptographic SHA-256 receipt...
                </span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-2.5 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Grading Passed Result Box */}
          {gradingResult && (
            <div className="p-3 rounded border border-emerald-500/30 bg-zinc-950 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  VERIFIED GRADE: {gradingResult.score}%
                </span>
                <span className="text-[10px] text-zinc-400">+15% Readiness Factor</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="border border-zinc-800 p-1.5 rounded">
                  <span className="text-zinc-500 block">Branch Coverage</span>
                  <span className="font-bold text-zinc-200">
                    {gradingResult.checks.branchCoverage}%
                  </span>
                </div>
                <div className="border border-zinc-800 p-1.5 rounded">
                  <span className="text-zinc-500 block">Cleanliness Score</span>
                  <span className="font-bold text-zinc-200">
                    {gradingResult.checks.codeCleanlinessScore}/100
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[9px] text-zinc-500 block uppercase">SHA-256 Receipt</span>
                <span className="text-[8px] text-zinc-400 break-all font-mono">
                  {gradingResult.txHash}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitModalOpen(false)}
              disabled={isGrading}
            >
              {gradingResult ? "Done" : "Cancel"}
            </Button>
            {!gradingResult && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleRunCiGrading}
                isLoading={isGrading}
              >
                Run CI Auto-Grading
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}