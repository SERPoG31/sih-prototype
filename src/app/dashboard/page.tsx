"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Radar as RadarIcon,
  Award,
  GitBranch,
  Code2,
  Bot,
  Briefcase,
  Users,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useStudentContext } from "@/context/student-context";
import { PageHeader } from "@/components/layout/page-header";
import { SkillRadar } from "@/components/charts/skill-radar";
import { ReadinessScoreCard } from "@/components/charts/readiness-score";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INTERNSHIP_LISTINGS } from "@/lib/mock-data";

export default function DashboardOverviewPage() {
  const { currentPersona, skills, certificates, github, bounties, verifiedBadges } =
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

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${currentPersona.name.split(" ")[0]}!`}
        subtitle="Your autonomous, multi-source evidence verification cockpit. All skills below are backed by cryptographic signatures, code ASTs, or tamper-tested certificates."
        badgeText="SIH Ground-Truth Engine"
      >
        <Link href="/p/arjun-kumar">
          <Button variant="accent" size="sm" className="gap-2">
            <span>View Public Portfolio</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </PageHeader>

      {/* Aggregate Readiness Score Card */}
      <ReadinessScoreCard />

      {/* Radar Chart & Benchmark Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Card className="lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
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
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Compare with:</span>
              <select
                value={selectedRoleBenchmark}
                onChange={(e) => setSelectedRoleBenchmark(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-indigo-300 font-semibold focus:outline-none focus:border-indigo-500"
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
            <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-slate-950/70 border border-slate-800 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-indigo-500" />
                <span className="text-slate-300">Your Verified Polygon</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border border-emerald-500 border-dashed" />
                <span className="text-emerald-400 font-medium">
                  {activeInternship?.company} Target Benchmark
                </span>
              </div>
            </div>
            <SkillRadar skills={skills} targetRoleBenchmark={targetBenchmarks} height={340} />
          </CardContent>
        </Card>

        {/* Verified Badges & Quick Action Panel */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
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

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                <span>Fast-Track Evidence Actions</span>
              </CardTitle>
              <CardDescription>
                Boost your polygon and readiness score with live verifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Link
                href="/dashboard/certificates"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-slate-200">Authenticate a Certificate</p>
                    <p className="text-[10px] text-slate-400">Run OCR and Photoshop tamper scans</p>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/dashboard/skill-check"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <Code2 className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-slate-200">Take 3-Min Code Sandbox</p>
                    <p className="text-[10px] text-slate-400">Prove concurrency & SQL skills live</p>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/dashboard/mock-interview"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <Bot className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-slate-200">Gap-Targeted Mock AI Interview</p>
                    <p className="text-[10px] text-slate-400">Technical screening on delta requirements</p>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/bounties"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-slate-200">Solve 48h Company Bounty</p>
                    <p className="text-[10px] text-slate-400">Submit GitHub PR to earn rewards & CTC boosts</p>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Verified Skills Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Platform Verified Skills Breakdown</h3>
          <span className="text-xs text-slate-400">
            {skills.filter((s) => s.verified).length} of {skills.length} verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <Card key={skill.name} className="p-4 bg-slate-900/70 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-100">{skill.name}</h4>
                  <span className="text-[10px] font-mono text-indigo-400">{skill.category}</span>
                </div>
                <Badge variant={skill.verified ? "success" : "warning"} size="sm">
                  {skill.verified ? "Verified" : "Unverified"}
                </Badge>
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Proficiency</span>
                  <span className="font-bold text-slate-200">{skill.score}/100</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Sources: {skill.sources.join(", ")}</span>
                <span className="font-mono text-emerald-400">{skill.evidenceCount} proof items</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
