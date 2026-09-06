"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  Award,
  Briefcase,
  FileCheck2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  GitBranch,
  Terminal,
  Hash,
  Copy,
  Check,
  Share2,
  Building,
} from "lucide-react";
import { Github } from "@/components/ui/icons";
import { Navbar } from "@/components/layout/navbar";
import { SkillRadar } from "@/components/charts/skill-radar";
import { ScoreRing } from "@/components/ui/score-ring";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStudentContext } from "@/context/student-context";
import { truncateAddress } from "@/lib/utils";

export default function PublicPortfolioPage() {
  const params = useParams();
  const username = params?.username as string;

  const {
    currentPersona,
    skills,
    github,
    certificates,
    bounties,
    lors,
    verifiedBadges,
    readinessScore,
  } = useStudentContext();

  const [copiedLink, setCopiedLink] = useState(false);

  const completedBounties = bounties.filter((b) => b.status === "Completed");

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Verification Trust Seal Banner */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/30 to-slate-900 border border-emerald-500/40 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-white">Cryptographically Authenticated Applicant Profile</span>
              <span className="text-slate-400 hidden sm:inline">
                {" "}• Zero self-reported claims; all metrics verified via SIH Ground-Truth Engine
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleShare}>
            {copiedLink ? <Check className="h-3.5 w-3.5 mr-1" /> : <Share2 className="h-3.5 w-3.5 mr-1" />}
            <span>{copiedLink ? "Link Copied!" : "Share Profile"}</span>
          </Button>
        </div>

        {/* Hero Showcase Card */}
        <Card className="border-indigo-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPersona.avatar}
                alt={currentPersona.name}
                className="h-24 w-24 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-xl"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {currentPersona.name}
                  </h1>
                  <Badge variant="success" dot size="sm">
                    Verified Dev: {github.devTier}
                  </Badge>
                </div>
                <p className="text-sm text-indigo-300 font-medium">{currentPersona.title}</p>
                <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                  <Building className="h-3.5 w-3.5" />
                  <span>{currentPersona.organization}</span>
                </p>

                {/* Social links */}
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-2 text-xs font-mono">
                  <a
                    href={`https://github.com/${github.handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
                  >
                    <Github className="h-3.5 w-3.5 text-indigo-400" />
                    <span>@{github.handle}</span>
                  </a>
                  <span className="text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                    {github.contributionsThisYear} Commits / Yr
                  </span>
                </div>
              </div>
            </div>

            {/* Score Ring */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/70 border border-slate-800 shrink-0">
              <ScoreRing
                score={readinessScore}
                size={110}
                strokeWidth={9}
                label="Readiness"
                colorScheme="emerald"
              />
              <span className="text-[10px] font-mono text-slate-400 mt-2">
                Multi-Source Aggregated
              </span>
            </div>
          </div>

          {/* Verified Badges Carousel Strip */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-2">
              Verified Badges & Credentials:
            </span>
            <div className="flex flex-wrap gap-2">
              {verifiedBadges.map((badge, i) => (
                <Badge key={i} variant="purple" size="sm">
                  ★ {badge}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Core Radar & GitHub Ground-Truth Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Skill Radar */}
          <Card className="lg:col-span-6">
            <CardHeader className="pb-2 border-b border-slate-800">
              <CardTitle className="text-sm">Verified Competence Polygon</CardTitle>
              <CardDescription>
                Calculated from merged GitHub PRs, sandbox tests, and NPTEL certs
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <SkillRadar skills={skills} height={320} />
            </CardContent>
          </Card>

          {/* GitHub Telemetry */}
          <Card className="lg:col-span-6">
            <CardHeader className="pb-2 border-b border-slate-800">
              <CardTitle className="text-sm flex items-center gap-2">
                <Github className="h-4 w-4 text-indigo-400" />
                <span>Codebase Ground-Truth Telemetry</span>
              </CardTitle>
              <CardDescription>Direct AST extraction from public repositories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-base font-bold font-mono text-white block">
                    {github.totalRepos}
                  </span>
                  <span className="text-[10px] text-slate-400">Repositories</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-base font-bold font-mono text-amber-400 block">
                    {github.starsCount}
                  </span>
                  <span className="text-[10px] text-slate-400">Stars</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-base font-bold font-mono text-emerald-400 block">
                    {github.codeQualityScore}%
                  </span>
                  <span className="text-[10px] text-slate-400">Code Health</span>
                </div>
              </div>

              {/* Detected Stack */}
              <div>
                <span className="text-slate-400 text-[11px] font-semibold block mb-1.5">
                  Verified AST Framework Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {github.detectedStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <span className="text-slate-400 text-[11px] font-semibold block mb-1.5">
                  Language Distribution:
                </span>
                <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-800">
                  {github.topLanguages.map((l) => (
                    <div
                      key={l.name}
                      style={{ width: `${l.percentage}%`, backgroundColor: l.color }}
                      className="h-full"
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Authenticated Certificates Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-indigo-400" />
              <span>Authentic Verified Credentials & Badges</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Anti-Tamper Inspected</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <Card key={cert.id} className="p-4 bg-slate-900/70 border-slate-800 space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-400">
                      {cert.issuer}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-0.5 leading-snug">
                      {cert.courseTitle}
                    </h4>
                  </div>
                  <Badge variant={cert.status === "verified" ? "success" : "danger"} size="sm">
                    {cert.confidenceScore}% Valid
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  {cert.skillsAwarded.map((s) => (
                    <span
                      key={s}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      +{s}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono text-[10px] text-slate-400">
                  <span>Issued: {cert.issueDate}</span>
                  <span className="text-indigo-400 truncate max-w-[120px]">
                    {truncateAddress(cert.verificationHash, 6)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Solved Industry Bounties */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-emerald-400" />
            <span>Solved Industry Micro-Bounties ({completedBounties.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedBounties.map((b) => (
              <Card key={b.id} className="p-4 bg-slate-900/60 border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400 text-xs">{b.company}</span>
                  <Badge variant="success" size="sm" dot>
                    Automated Test Score: {b.autoScorePreview}%
                  </Badge>
                </div>
                <h4 className="font-bold text-white text-sm">{b.title}</h4>
                <p className="text-slate-300 leading-relaxed text-[11px]">{b.description}</p>
                {b.submittedPrUrl && (
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <a
                      href={b.submittedPrUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span>View Merged PR</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Sealed Letters of Recommendation */}
        {lors.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-purple-400" />
              <span>Cryptographically Sealed Letters of Recommendation</span>
            </h3>

            {lors.map((lor) => (
              <Card key={lor.id} className="p-6 bg-slate-900/80 border-slate-800 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      Recommendation by {lor.evaluatorName}
                    </h4>
                    <p className="text-slate-400 text-[11px]">
                      {lor.evaluatorTitle} • {lor.companyOrDept}
                    </p>
                  </div>
                  <Badge variant="purple" size="sm">
                    {lor.verificationBadgeToken}
                  </Badge>
                </div>

                <p className="font-serif text-slate-200 leading-relaxed text-sm whitespace-pre-line italic">
                  &ldquo;{lor.recommendationBody}&rdquo;
                </p>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400">SHA-256 Checksum:</span>
                  <span className="text-indigo-400 truncate max-w-sm">
                    {lor.cryptographicHash}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
