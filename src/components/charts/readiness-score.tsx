"use client";

import React from "react";
import { ShieldCheck, Code, Award, Target, Activity } from "lucide-react";
import { ScoreRing } from "@/components/ui/score-ring";
import { Tooltip } from "@/components/ui/tooltip";
import { useStudentContext } from "@/context/student-context";
import { Badge } from "@/components/ui/badge";

export function ReadinessScoreCard() {
  const { readinessScore, skills, github, certificates, bounties } = useStudentContext();

  const verifiedSkillsCount = skills.filter((s) => s.verified).length;
  const completedBountiesCount = bounties.filter((b) => b.status === "Completed").length;
  const verifiedCertsCount = certificates.filter((c) => c.status === "verified").length;

  const tier =
    readinessScore >= 90
      ? "Elite Industry Ready"
      : readinessScore >= 75
      ? "Advanced Placement Ready"
      : readinessScore >= 60
      ? "Internship Ready"
      : "Foundation Building";

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 shadow-none">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-zinc-100">Aggregate Readiness Engine</h3>
        </div>
        <Badge variant={readinessScore >= 75 ? "success" : "default"} dot>
          {tier}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-4">
        {/* Circular Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-1">
          <Tooltip
            content={
              <div className="space-y-1 text-[11px] font-mono">
                <p className="font-bold text-zinc-100">SIH Ground-Truth Weights:</p>
                <p>40% Verified Skill Scores</p>
                <p>25% GitHub Telemetry & AST</p>
                <p>20% Tamper-Proof Certs</p>
                <p>15% Completed Bounties</p>
              </div>
            }
          >
            <div className="cursor-pointer">
              <ScoreRing
                score={readinessScore}
                size={110}
                strokeWidth={8}
                label="Readiness"
                colorScheme="emerald"
              />
            </div>
          </Tooltip>
          <p className="mt-2 text-[10px] text-zinc-500 text-center font-mono">
            Hover ring for breakdown
          </p>
        </div>

        {/* 4 Pillars Breakdown (Dense 1px border list) */}
        <div className="md:col-span-8 space-y-1.5">
          <Tooltip content="Computed across all platform-verified skill challenges and assessments">
            <div className="flex items-center justify-between px-3 py-2 rounded border border-zinc-800 bg-zinc-950/60 cursor-default hover:bg-zinc-900/80 transition-colors">
              <div className="flex items-center gap-2.5">
                <Target className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-zinc-200">Verified Skill Nodes</p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {verifiedSkillsCount} of {skills.length} skills verified
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-medium text-zinc-300">40%</span>
            </div>
          </Tooltip>

          <Tooltip content="Analyzes repository health, commit velocity, and language diversity via GitHub API">
            <div className="flex items-center justify-between px-3 py-2 rounded border border-zinc-800 bg-zinc-950/60 cursor-default hover:bg-zinc-900/80 transition-colors">
              <div className="flex items-center gap-2.5">
                <Code className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-zinc-200">GitHub Ground-Truth</p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Tier: {github.devTier} â€¢ Quality: {github.codeQualityScore}%
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-medium text-zinc-300">25%</span>
            </div>
          </Tooltip>

          <Tooltip content="Authenticated against institutional registries with cryptographic metadata tamper-checks">
            <div className="flex items-center justify-between px-3 py-2 rounded border border-zinc-800 bg-zinc-950/60 cursor-default hover:bg-zinc-900/80 transition-colors">
              <div className="flex items-center gap-2.5">
                <Award className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-zinc-200">Tamper-Proof Certs</p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {verifiedCertsCount} authentic credentials (0 flags)
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-medium text-zinc-300">20%</span>
            </div>
          </Tooltip>

          <Tooltip content="Real-world bug fixes & features submitted and merged on industry partner repositories">
            <div className="flex items-center justify-between px-3 py-2 rounded border border-zinc-800 bg-zinc-950/60 cursor-default hover:bg-zinc-900/80 transition-colors">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-zinc-200">Industry Bounties</p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {completedBountiesCount} verified PRs merged
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-medium text-zinc-300">15%</span>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
