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
  GitCommit,
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
    <div className="space-y-4">
      {/* Cockpit Page Header */}
      <PageHeader
        title={`Cockpit • ${currentPersona.name}`}
        subtitle="Autonomous multi-source evidence verification loop. All skills backed by cryptographic signatures, AST analysis, or tamper-tested certificates."
        badgeText="PS: 26044"
      >
        <Link href="/p/arjun-kumar">
          <Button variant="primary" size="sm" className="gap-1.5">
            <span>View Public Portfolio</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
      </PageHeader>

      {/* Top 4-KPI Stats Strip (Dense Raycast/Linear format) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <StatCard
          icon={<ShieldCheck />}
          label="Readiness Index"
          value={`${readinessScore}%`}
          delta="+8% Delta"
          deltaPositive={true}
          trend={[62, 70, 75, 80, readinessScore]}
        />
        <StatCard
          icon={<Award />}
          label="Verified Certs"
          value={verifiedCertCount}
          delta={`${verifiedCertCount}/${certificates.length} Auth`}
          deltaPositive={true}
          trend={[1, 2, 2, 3, verifiedCertCount]}
        />
        <StatCard
          icon={<Briefcase />}
          label="Bounties Merged"
          value={completedBountyCount}
          delta="+1 Won"
          deltaPositive={true}
          trend={[0, 1, 1, 2, Math.max(completedBountyCount, 2)]}
        />
        <StatCard
          icon={<GitCommit />}
          label="GitHub DevTier"
          value={github.devTier}
          delta={github.isLive ? "Live Sync" : "Sandbox"}
          deltaPositive={true}
          trend={[50, 70, 82, 90, 95]}
        />
      </div>

      {/* Aggregate Readiness Score Card (Dense) */}
      <ReadinessScoreCard />

      {/* Radar Chart & Fast-Track Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Radar Card */}
        <Card className="lg:col-span-7">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800">
            <div>
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                <RadarIcon className="h-3.5 w-3.5 text-zinc-300" />
                <span>Skill Evidence Radar</span>
              </CardTitle>
              <CardDescription className="text-[11px] text-zinc-500">
                Multi-dimensional polygon verified across GitHub, NPTEL, and Bounties
              </CardDescription>
            </div>
            {/* Benchmark Selector */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Benchmark:</span>
              <select
                value={selectedRoleBenchmark}
                onChange={(e) => setSelectedRoleBenchmark(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer"
              >
                {INTERNSHIP_LISTINGS.map((intern) => (
                  <option key={intern.id} value={intern.id}>
                    {intern.company} – {intern.title.slice(0, 16)}...
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between px-2.5 py-1.5 mb-2 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-zinc-300 text-[11px]">Verified Polygon</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full border border-dashed border-zinc-500" />
                <span className="text-zinc-500 text-[11px]">
                  {activeInternship?.company} Target (85%)
                </span>
              </div>
            </div>
            <SkillRadar skills={skills} targetRoleBenchmark={targetBenchmarks} height={320} />
          </CardContent>
        </Card>

        {/* Action Panel & Credentials */}
        <div className="lg:col-span-5 space-y-3">
          {/* Active Credentials Card */}
          <Card>
            <CardHeader className="pb-2 border-b border-zinc-800">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Verified Credentials</span>
              </CardTitle>
              <CardDescription className="text-[11px] text-zinc-500">
                {verifiedBadges.length} cryptographically backed proofs active
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-wrap gap-1.5">
                {verifiedBadges.map((badge, idx) => (
                  <Badge key={idx} variant="default" size="sm" dot>
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fast-Track Actions (Linear/Raycast style dense checklist) */}
          <Card>
            <CardHeader className="pb-2 border-b border-zinc-800">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                <span>Fast-Track Evidence Pipeline</span>
              </CardTitle>
              <CardDescription className="text-[11px] text-zinc-500">
                Execute actions to upgrade your verified polygon
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-zinc-800 pt-0">
              <Link
                href="/dashboard/certificates"
                className="flex items-center justify-between py-2.5 px-2 hover:bg-zinc-900/60 rounded transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-200" />
                  <div>
                    <p className="text-xs font-medium text-zinc-200 group-hover:text-zinc-100">
                      Authenticate Certificate
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">Run OCR & Photoshop tamper scan</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-zinc-500">{certificates.length} certs</span>
                  <kbd className="text-[9px]">2</kbd>
                </div>
              </Link>

              <Link
                href="/dashboard/skill-check"
                className="flex items-center justify-between py-2.5 px-2 hover:bg-zinc-900/60 rounded transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Code2 className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-200" />
                  <div>
                    <p className="text-xs font-medium text-zinc-200 group-hover:text-zinc-100">
                      Timed Sandbox Challenge
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">3-min concurrency & SQL challenge</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-zinc-500">3 min</span>
                  <kbd className="text-[9px]">4</kbd>
                </div>
              </Link>

              <Link
                href="/dashboard/mock-interview"
                className="flex items-center justify-between py-2.5 px-2 hover:bg-zinc-900/60 rounded transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Bot className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-200" />
                  <div>
                    <p className="text-xs font-medium text-zinc-200 group-hover:text-zinc-100">
                      Targeted Mock AI Interview
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">Screening on benchmark delta skills</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-zinc-500">3 Qs</span>
                  <kbd className="text-[9px]">7</kbd>
                </div>
              </Link>

              <Link
                href="/bounties"
                className="flex items-center justify-between py-2.5 px-2 hover:bg-zinc-900/60 rounded transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-200" />
                  <div>
                    <p className="text-xs font-medium text-zinc-200 group-hover:text-zinc-100">
                      Company Bounty Sprints
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">Submit PR to earn grants & CTC boosts</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-zinc-500">{bounties.length} open</span>
                  <kbd className="text-[9px]">9</kbd>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Verified Skills Breakdown: Dense Linear-Style Data Rows */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <SectionHeader
          title="Verified Competencies"
          subtitle="Direct proof items mapped across GitHub repos, NPTEL certificates, and live bounties"
          badge={
            <span className="text-[10px] font-mono text-zinc-400 border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 rounded">
              {verifiedSkillCount}/{skills.length} Verified
            </span>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3 hover:bg-zinc-900/70 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                      skill.verified ? "bg-emerald-500" : "bg-zinc-600"
                    }`}
                  />
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-200">{skill.name}</h4>
                    <span className="text-[9px] font-mono text-zinc-500">{skill.category}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-100">{skill.score}/100</span>
              </div>

              {/* Minimal 1.5px Progress Bar */}
              <div className="mt-2.5">
                <Progress
                  value={skill.score}
                  className="h-1 bg-zinc-800"
                  indicatorClassName={skill.verified ? "bg-emerald-500" : "bg-zinc-500"}
                />
              </div>

              {/* Micro details: source chips & evidence count */}
              <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <div className="flex items-center gap-1">
                  {skill.sources.map((src) => (
                    <span
                      key={src}
                      className="px-1 py-0.2 rounded text-[8px] bg-zinc-900 text-zinc-400 border border-zinc-800"
                    >
                      {src}
                    </span>
                  ))}
                </div>
                <span>{skill.evidenceCount} proofs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

