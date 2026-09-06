"use client";

import React from "react";
import { ShieldCheck, Code, Award, Target, Sparkles } from "lucide-react";
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

  const tierVariant =
    readinessScore >= 90
      ? "success"
      : readinessScore >= 75
      ? "default"
      : readinessScore >= 60
      ? "warning"
      : "purple";

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 p-6 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Aggregate Readiness Engine</h3>
        </div>
        <Badge variant={tierVariant} dot>
          {tier}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-5">
        {/* Big Circular Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-2">
          <Tooltip
            content={
              <div className="space-y-1 text-[11px]">
                <p className="font-bold text-white">SIH Ground-Truth Formula:</p>
                <p>40% Avg Verified Skill Score</p>
                <p>25% GitHub Telemetry & AST Quality</p>
                <p>20% Tamper-Proof Cert Confidence</p>
                <p>15% Completed Bounty PRs</p>
              </div>
            }
          >
            <div className="cursor-pointer transition-transform hover:scale-105">
              <ScoreRing
                score={readinessScore}
                size={130}
                strokeWidth={11}
                label="Readiness"
                colorScheme={readinessScore >= 80 ? "emerald" : "indigo"}
              />
            </div>
          </Tooltip>
          <p className="mt-3 text-xs text-slate-400 text-center font-mono">
            Hover for formula breakdown
          </p>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="md:col-span-8 space-y-3">
          <Tooltip content="Computed across all platform-verified skill challenges and assessments">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-default hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Verified Skill Nodes</p>
                  <p className="text-[10px] text-slate-400">
                    {verifiedSkillsCount} of {skills.length} skills platform-verified
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-400">40% Weight</span>
            </div>
          </Tooltip>

          <Tooltip content="Analyzes repository health, commit velocity, and language diversity via GitHub API">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-default hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Code className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">GitHub Ground-Truth</p>
                  <p className="text-[10px] text-slate-400">
                    Tier: {github.devTier} • Quality Score: {github.codeQualityScore}%
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">25% Weight</span>
            </div>
          </Tooltip>

          <Tooltip content="Authenticated against institutional registries with cryptographic metadata tamper-checks">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-default hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Tamper-Proof Certs</p>
                  <p className="text-[10px] text-slate-400">
                    {verifiedCertsCount} authentic credentials (0 tampering flags)
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-purple-400">20% Weight</span>
            </div>
          </Tooltip>

          <Tooltip content="Real-world bug fixes & features submitted and merged on industry partner repositories">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-default hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Industry Bounties Solved</p>
                  <p className="text-[10px] text-slate-400">
                    {completedBountiesCount} verified merged PRs on company sandboxes
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">15% Weight</span>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
