"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Radar as RadarIcon,
  Award,
  Code2,
  Bot,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Sparkles,
  GitCommit,
  CheckCircle,
} from "lucide-react";
import { useStudentContext } from "@/context/student-context";
import { PageHeader } from "@/components/layout/page-header";
import { SkillRadar } from "@/components/charts/skill-radar";
import { ReadinessScoreCard } from "@/components/charts/readiness-score";
import { StatCard } from "@/components/ui/stat-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INTERNSHIP_LISTINGS } from "@/lib/mock-data";

export default function DashboardOverviewPage() {
  const { currentPersona, skills, certificates, github, bounties, verifiedBadges, readinessScore } =
    useStudentContext();

  const [selectedRoleBenchmark, setSelectedRoleBenchmark] = useState<string>("intern-rzp-01");

  const activeInternship = INTERNSHIP_LISTINGS.find((i) => i.id === selectedRoleBenchmark);

  // Generate benchmark requirements based on selected internship
  const targetBenchmarks = skills.map((s) => {
    const isRequired = activeInternship?.requiredSkills.some(
      (req) => req.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(req.toLowerCase())
    );
    return {
      name: s.name,
      requiredScore: isRequired ? 85 : 50,
    };
  });

  const verifiedCertCount = certificates.filter((c) => c.status === "verified").length;
  const completedBountyCount = bounties.filter((b) => b.status === "Completed").length;
  const verifiedSkillCount = skills.filter((s) => s.verified).length;

  return (
    <div className="space-y-8 animate-fade-slide-up">
      {/* Cockpit Page Header */}
      <PageHeader
        title={`Welcome back, ${currentPersona.name.split(" ")[0]}!`}
        subtitle="Your autonomous, multi-source evidence verification cockpit. All competencies below are mathematically verified via cryptographic signatures, code ASTs, or tamper-tested certificates."
        badgeText="SIH Ground-Truth Engine"
      >
        <Link href="/p/arjun-kumar">
          <Button variant="accent" size="sm" className="gap-2 shadow-emerald-500/20">
            <span>View Public Portfolio</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </PageHeader>

      {/* Top 4-KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Sparkles />}
          label="Composite Readiness Score"
          value={`${readinessScore}%`}
          delta="+8% delta"
          deltaPositive={true}
          accentColor="emerald"
          trend={[62, 70, 75, 80, readinessScore]}
          animationClass="animate-fade-slide-up stagger-1"
        />
        <StatCard
          icon={<Award />}
          label="Tamper-Tested Credentials"
          value={verifiedCertCount}
          delta={`${verifiedCertCount} of ${certificates.length} verified`}
          deltaPositive={true}
          accentColor="indigo"
          trend={[1, 2, 2, 3, verifiedCertCount]}
          animationClass="animate-fade-slide-up stagger-2"
        />
        <StatCard
          icon={<Briefcase />}
          label="Industry Bounties Solved"
          value={completedBountyCount}
          delta="+1 this sprint"
          deltaPositive={true}
          accentColor="amber"
          trend={[0, 1, 1, 2, Math.max(completedBountyCount, 2)]}
          animationClass="animate-fade-slide-up stagger-3"
        />
        <StatCard
          icon={<GitCommit />}
          label="GitHub DevTier Grade"
          value={github.devTier}
          delta={github.isLive ? "Live Sync" : "Sandbox"}
          deltaPositive={true}
          accentColor="purple"
          trend={[50, 70, 82, 90, 95]}
          animationClass="animate-fade-slide-up stagger-4"
        />
      </div>

      {/* Aggregate Readiness Score Card */}
      <div className="animate-fade-slide-up stagger-2">
        <ReadinessScoreCard />
      </div>

      {/* Radar Chart & Benchmark Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Card className="lg:col-span-7 animate-fade-slide-up stagger-3" glow>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <CardTitle className="text-base">
                <RadarIcon className="h-4 w-4 text-indigo-400" />
                <span>Dynamic Skill Radar</span>
              </CardTitle>
              <CardDescription>
                Multi-dimensional polygon reflecting real evidence from GitHub, NPTEL, and Bounties
              </CardDescription>
            </div>
            {/* Benchmark Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-slate-400 font-medium">Compare with:</span>
              <select
                value={selectedRoleBenchmark}
                onChange={(e) => setSelectedRoleBenchmark(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-indigo-300 font-semibold focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                {INTERNSHIP_LISTINGS.map((intern) => (
                  <option key={intern.id} value={intern.id}>
                    {intern.company} – {intern.title.slice(0, 18)}...
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 mb-2 bg-slate-950/70 border border-slate-800 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-indigo-500" />
                <span className="text-slate-300 font-medium">Your Verified Polygon</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border-2 border-emerald-400 border-dashed" />
                <span className="text-emerald-400 font-medium">
                  {activeInternship?.company} Target Benchmark
                </span>
              </div>
            </div>
            <SkillRadar skills={skills} targetRoleBenchmark={targetBenchmarks} height={340} />
          </CardContent>
        </Card>

        {/* Verified Badges & Fast-Track Actions */}
        <div className="lg:col-span-5 space-y-6 animate-fade-slide-up stagger-4">
          <Card glow>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Verified Credentials & Badges</span>
              </CardTitle>
              <CardDescription>
                Earned via automated proof checks ({verifiedBadges.length} Active Badges)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {verifiedBadges.map((badge, idx) => (
                  <Badge key={idx} variant="success" size="sm" dot>
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upgraded Fast-Track Action Cards */}
          <Card glow>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                <span>Fast-Track Evidence Actions</span>
              </CardTitle>
              <CardDescription>
                Boost your polygon and readiness score with live verifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/dashboard/certificates"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      Authenticate a Certificate
                    </p>
                    <p className="text-[10px] text-slate-400">Run OCR and Photoshop tamper scans</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="indigo" size="sm">
                    {certificates.length} certs
                  </Badge>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/dashboard/skill-check"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                    <Code2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
                      Take 3-Min Code Sandbox
                    </p>
                    <p className="text-[10px] text-slate-400">Prove concurrency & SQL skills live</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="success" size="sm">
                    3 min
                  </Badge>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/dashboard/mock-interview"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
                      Gap-Targeted Mock AI Interview
                    </p>
                    <p className="text-[10px] text-slate-400">Technical screening on delta requirements</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="purple" size="sm">
                    3 questions
                  </Badge>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/bounties"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
                      Solve 48h Company Bounty
                    </p>
                    <p className="text-[10px] text-slate-400">Submit GitHub PR to earn rewards & CTC boosts</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="amber" size="sm">
                    {bounties.length} open
                  </Badge>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Verified Skills Grid with Progress component and Source Badges */}
      <div className="space-y-4 animate-fade-slide-up stagger-5">
        <SectionHeader
          title="Platform Verified Skills Breakdown"
          subtitle="Direct proof items mapped across GitHub repos, NPTEL certificates, and live bounties"
          badge={
            <Badge variant="indigo" size="sm">
              {verifiedSkillCount} of {skills.length} verified
            </Badge>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <Card
              key={skill.name}
              className={`p-4 transition-all card-glow ${
                skill.verified ? "border-l-4 border-l-indigo-500" : "border-l-4 border-l-amber-500/70"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                    <span>{skill.name}</span>
                    {skill.verified && <CheckCircle className="h-3.5 w-3.5 text-indigo-400 shrink-0" />}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">{skill.category}</span>
                </div>
                <Badge variant={skill.verified ? "success" : "warning"} size="sm" dot>
                  {skill.verified ? "Verified" : "Pending"}
                </Badge>
              </div>

              {/* Radix Progress Bar */}
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Proficiency Score</span>
                  <span className="font-bold text-slate-200">{skill.score}/100</span>
                </div>
                <Progress
                  value={skill.score}
                  indicatorClassName={
                    skill.score >= 80
                      ? "bg-gradient-to-r from-indigo-500 to-emerald-400"
                      : "bg-gradient-to-r from-amber-500 to-indigo-500"
                  }
                />
              </div>

              {/* Source chips */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex flex-wrap items-center gap-1">
                  {skill.sources.map((src) => (
                    <span
                      key={src}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {src}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {skill.evidenceCount} proof items
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}



