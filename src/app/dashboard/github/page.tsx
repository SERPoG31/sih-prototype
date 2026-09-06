"use client";

import React, { useState } from "react";
import {
  GitBranch,
  Star,
  GitCommit,
  Layers,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Code2,
  Terminal,
  Activity,
} from "lucide-react";
import { Github } from "@/components/ui/icons";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { useStudentContext } from "@/context/student-context";
import { GitHubTelemetry } from "@/lib/types";

export default function GitHubAnalyzerPage() {
  const { github, updateGitHubProfile, addVerifiedSkill } = useStudentContext();
  const [handleInput, setHandleInput] = useState(github.handle || "arjunkumar-dev");
  const [isLoading, setIsLoading] = useState(false);
  const [telemetry, setTelemetry] = useState<GitHubTelemetry>(github);
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  const handleAnalyze = async (handleToQuery?: string) => {
    const target = handleToQuery || handleInput;
    setIsLoading(true);
    setSyncedSuccess(false);

    try {
      const res = await fetch("/api/analyze-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: target }),
      });
      const data = await res.json();
      if (data.success && data.telemetry) {
        setTelemetry(data.telemetry);
      }
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncToProfile = () => {
    updateGitHubProfile(telemetry);

    // Boost verified skills based on detected languages and frameworks
    telemetry.topLanguages.forEach((lang) => {
      addVerifiedSkill(lang.name, Math.min(95, 75 + Math.round(lang.percentage / 2)), "GitHub");
    });
    telemetry.detectedStack.forEach((tech) => {
      addVerifiedSkill(tech, telemetry.codeQualityScore, "GitHub");
    });

    setSyncedSuccess(true);
  };

  const tierColors = {
    Novice: "warning",
    Intermediate: "purple",
    Advanced: "default",
    "Elite Architect": "success",
  } as const;

  return (
    <div className="space-y-8">
      <PageHeader
        title="GitHub & Codebase Ground-Truth Scraper"
        subtitle="Automated repository telemetry. Eliminates resume buzzwords by extracting real commit velocity, language proportions, AST framework markers, and code health metrics."
        badgeText="Module 02"
      />

      {/* Input / Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="flex flex-col sm:flex-row items-end gap-3"
          >
            <div className="flex-1 w-full">
              <Input
                label="GitHub Username / Organization Handle"
                placeholder="e.g. arjunkumar-dev or torvalds"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full sm:w-auto">
              <Github className="h-4 w-4 mr-2" />
              Analyze Codebase
            </Button>
          </form>

          {/* Quick Preset Handles */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Evaluator Test Handles:</span>
            <button
              type="button"
              onClick={() => {
                setHandleInput("arjunkumar-dev");
                handleAnalyze("arjunkumar-dev");
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono"
            >
              @arjunkumar-dev (Advanced)
            </button>
            <button
              type="button"
              onClick={() => {
                setHandleInput("kavya-systems-architect");
                handleAnalyze("kavya-systems-architect");
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono"
            >
              @kavya-systems (Elite)
            </button>
            <button
              type="button"
              onClick={() => {
                setHandleInput("dev-rookie-learner");
                handleAnalyze("dev-rookie-learner");
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono"
            >
              @dev-rookie (Novice)
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Main Telemetry Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stats & Dev Tier */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20">
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    src={telemetry.avatarUrl}
                    name={telemetry.handle}
                    size="md"
                    className="border-indigo-500/40 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">@{telemetry.handle}</h3>
                      {telemetry.isLive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live API
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-700">
                          Demo Sandbox
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">Verified code telemetry & commit stream</p>
                  </div>
                </div>
                <Tooltip content={`Evaluated based on ${telemetry.totalRepos} repositories, commit velocity, and language diversity.`}>
                  <div>
                    <Badge variant={tierColors[telemetry.devTier]} dot>
                      {telemetry.devTier}
                    </Badge>
                  </div>
                </Tooltip>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xl font-bold font-mono text-white block">
                    {telemetry.totalRepos}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    Repositories
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xl font-bold font-mono text-amber-400 block">
                    {telemetry.starsCount}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    Stars Earned
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xl font-bold font-mono text-emerald-400 block">
                    {telemetry.contributionsThisYear}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    Commits / Yr
                  </span>
                </div>
              </div>

              {/* Code Quality Bar */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Codebase Health Score</span>
                  <span className="font-bold text-emerald-400">
                    {telemetry.codeQualityScore}/100
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                    style={{ width: `${telemetry.codeQualityScore}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 pt-0.5">
                  Calculated from lint checks, commit message atomicity, and test branch coverage.
                </p>
              </div>

              {/* Action */}
              {syncedSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center text-xs font-semibold text-emerald-300 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Telemetry Synced to Skill Radar & Readiness Engine!</span>
                </div>
              ) : (
                <Button className="w-full" variant="primary" onClick={handleSyncToProfile}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sync Telemetry to Verified Profile
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Languages & Detected AST Stack */}
        <div className="lg:col-span-7 space-y-6">
          {/* Languages Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                <Code2 className="h-4 w-4 text-indigo-400" />
                <span>Bytecode & Language Distribution</span>
              </CardTitle>
              <CardDescription>
                Calculated from verified commits across public & invited private repositories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Multi-color language bar */}
              <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-800">
                {telemetry.topLanguages.map((lang) => (
                  <div
                    key={lang.name}
                    style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                    title={`${lang.name}: ${lang.percentage}%`}
                    className="h-full transition-all"
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {telemetry.topLanguages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800"
                  >
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: lang.color }}
                    />
                    <div className="truncate">
                      <p className="font-semibold text-slate-200 truncate">{lang.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">{lang.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detected Frameworks & Stack Chips */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>Detected Architecture Stack (AST Extraction)</span>
              </CardTitle>
              <CardDescription>
                Identified via package.json, Dockerfile, and import syntax analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {telemetry.detectedStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-medium text-slate-200"
                  >
                    <Terminal className="h-3 w-3 text-indigo-400" />
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Commits */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                <Activity className="h-4 w-4 text-purple-400" />
                <span>Recent Commit Telemetry Stream</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {telemetry.recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <GitCommit className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span className="font-mono text-indigo-300 shrink-0">{activity.repo}:</span>
                    <span className="text-slate-300 truncate">{activity.message}</span>
                  </div>
                  <span className="font-mono text-emerald-400 text-[10px] shrink-0">
                    +{activity.commits} commits
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
