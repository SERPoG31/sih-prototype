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
  Hash,
  Copy,
  Check,
  Share2,
  Building,
  Download,
  Printer,
  Code2,
  Terminal,
} from "lucide-react";
import { Github } from "@/components/ui/icons";
import { Navbar } from "@/components/layout/navbar";
import { SkillRadar } from "@/components/charts/skill-radar";
import { ScoreRing } from "@/components/ui/score-ring";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { useStudentContext } from "@/context/student-context";
import { truncateAddress } from "@/lib/utils";

export default function PublicPortfolioPage() {
  const params = useParams();
  const username = (params?.username as string) || "arjun-kumar";

  const {
    skills,
    github,
    certificates,
    bounties,
    lors,
    verifiedBadges,
    readinessScore,
  } = useStudentContext();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDossier, setCopiedDossier] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Candidate metadata
  const candidateName = "Arjun Kumar";
  const candidateTitle = "Full-Stack Engineer & Cloud Systems Specialist";
  const candidateOrg = "National Institute of Technology Karnataka (NITK Surathkal)";
  const candidateAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

  const completedBounties = bounties.filter((b) => b.status === "Completed");
  const visibleLors = lors.filter((lor) => lor.displayOnPortfolio !== false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyHash = (hash: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  const handleExportDossier = () => {
    const dossierData = {
      specVersion: "SIH-2026-ATS-1.0",
      generatedAt: new Date().toISOString(),
      applicant: {
        id: "2026-CS-041",
        username,
        name: candidateName,
        title: candidateTitle,
        institution: candidateOrg,
        githubHandle: github.handle,
        compositeReadinessScore: readinessScore,
        devTier: github.devTier,
      },
      verifiedCompetencies: skills.map((s) => ({
        skill: s.name,
        category: s.category,
        score: s.score,
        verifiedSources: s.sources,
      })),
      codebaseGroundTruth: {
        totalRepos: github.totalRepos,
        starsCount: github.starsCount,
        commitsThisYear: github.contributionsThisYear,
        astHealthScore: github.codeQualityScore,
        productionSignals: github.productionSignals,
        topLanguages: github.topLanguages,
        detectedStack: github.detectedStack,
      },
      verifiedCertificates: certificates.map((c) => ({
        issuer: c.issuer,
        title: c.courseTitle,
        credentialId: c.credentialId || "N/A",
        verificationUrl: c.verificationUrl || "N/A",
        status: c.status,
        confidenceScore: c.confidenceScore,
        shaVerificationHash: c.verificationHash,
      })),
      industryBounties: completedBounties.map((b) => ({
        bountyId: b.id,
        company: b.company,
        title: b.title,
        autoGradingScore: b.autoScorePreview,
        prUrl: b.submittedPrUrl,
        txReceipt: `0x7f9a2b8e3c1d4a5f6e7b8c9d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b`,
      })),
      institutionalRecommendations: visibleLors.map((l) => ({
        evaluatorName: l.evaluatorName,
        evaluatorTitle: l.evaluatorTitle,
        organization: l.companyOrDept,
        metricRatings: l.metricRatings,
        sha256Seal: l.cryptographicHash,
        issuedAt: l.issuedAt,
      })),
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${username}-verified-dossier.json`;
    link.click();
    URL.revokeObjectURL(url);

    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300 print:bg-white print:text-black">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Verification Trust Seal Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-lg bg-zinc-900/60 border border-emerald-500/40 text-xs gap-3 print:border-zinc-400">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-zinc-100 print:text-black">
                Cryptographically Authenticated Applicant Profile
              </span>
              <span className="text-zinc-400 hidden sm:inline print:text-zinc-600">
                {" "}• Zero self-reported claims; all metrics verified via SIH Ground-Truth Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end print:hidden">
            <Button variant="outline" size="sm" onClick={handleExportDossier} className="h-8 text-xs font-mono">
              {copiedDossier ? (
                <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
              ) : (
                <Download className="h-3.5 w-3.5 mr-1" />
              )}
              <span>{copiedDossier ? "Dossier Downloaded!" : "Export Verified Dossier (JSON)"}</span>
            </Button>

            <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 text-xs font-mono">
              <Printer className="h-3.5 w-3.5 mr-1" />
              <span>Print / PDF</span>
            </Button>

            <Button variant="outline" size="sm" onClick={handleShare} className="h-8 text-xs font-mono">
              {copiedLink ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5 mr-1" />}
              <span>{copiedLink ? "Copied" : "Share"}</span>
            </Button>
          </div>
        </div>

        {/* Hero Showcase Card */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <UserAvatar
                src={candidateAvatar}
                name={candidateName}
                size="xl"
                className="h-20 w-20 rounded-lg border border-zinc-700 shadow-md shrink-0"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
                    {candidateName}
                  </h1>
                  <Badge variant="success" dot size="sm">
                    Verified Dev: {github.devTier}
                  </Badge>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                    Roll ID: 2026-CS-041
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 font-medium">{candidateTitle}</p>
                <p className="text-xs text-zinc-500 flex items-center justify-center sm:justify-start gap-1 font-mono">
                  <Building className="h-3.5 w-3.5" />
                  <span>{candidateOrg}</span>
                </p>

                {/* Social & Telemetry Tags */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2 text-xs font-mono">
                  <a
                    href={`https://github.com/${github.handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-zinc-300 hover:text-white bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800 transition-colors"
                  >
                    <Github className="h-3.5 w-3.5 text-emerald-400" />
                    <span>@{github.handle}</span>
                  </a>
                  <span className="text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded border border-emerald-800/40 text-[11px]">
                    {github.contributionsThisYear} Commits / Yr
                  </span>
                  <span className="text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-[11px]">
                    AST Quality: {github.codeQualityScore}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Score Ring */}
            <Tooltip content="Composite Readiness: (0.40 * Skills) + (0.25 * GitHub) + (0.20 * Certs) + (0.15 * Bounties)">
              <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-zinc-950 border border-zinc-800 shrink-0 cursor-default">
                <ScoreRing
                  score={readinessScore}
                  size={100}
                  strokeWidth={8}
                  label="Readiness"
                  colorScheme="emerald"
                />
                <span className="text-[10px] font-mono text-zinc-500 mt-1">
                  SIH 2026 Composite
                </span>
              </div>
            </Tooltip>
          </div>

          {/* Verified Badges Strip */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80">
            <span className="text-[10px] uppercase font-mono font-semibold text-zinc-500 block mb-2">
              Verified Credential Tokens:
            </span>
            <div className="flex flex-wrap gap-1.5">
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
            <CardHeader className="pb-2 border-b border-zinc-800">
              <CardTitle className="text-sm">Verified Competence Polygon</CardTitle>
              <CardDescription>
                Calculated from merged GitHub PRs, sandbox tests, and NPTEL certs
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <SkillRadar skills={skills} height={300} />
            </CardContent>
          </Card>

          {/* GitHub Telemetry */}
          <Card className="lg:col-span-6">
            <CardHeader className="pb-2 border-b border-zinc-800">
              <CardTitle className="text-sm flex items-center gap-2">
                <Github className="h-4 w-4 text-emerald-400" />
                <span>Codebase Ground-Truth Telemetry</span>
              </CardTitle>
              <CardDescription>Direct AST extraction from public repositories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs font-mono">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                  <span className="text-base font-bold text-zinc-100 block">
                    {github.totalRepos}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase">Repositories</span>
                </div>
                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                  <span className="text-base font-bold text-amber-400 block">
                    {github.starsCount}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase">Stars</span>
                </div>
                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                  <span className="text-base font-bold text-emerald-400 block">
                    {github.codeQualityScore}%
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase">AST Health</span>
                </div>
              </div>

              {/* Detected Stack */}
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-semibold block mb-1.5">
                  Verified AST Framework Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {github.detectedStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-semibold block mb-1.5">
                  Language Proportions:
                </span>
                <div className="h-2 w-full rounded-full overflow-hidden flex bg-zinc-900 border border-zinc-800">
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
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-400 flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <span>Authentic Verified Credentials ({certificates.length})</span>
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">OCR &amp; Registry Inspected</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {certificates.map((cert) => (
              <Card key={cert.id} className="p-3.5 space-y-2.5 text-xs font-mono">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-emerald-400 block truncate">
                      {cert.issuer}
                    </span>
                    <h4 className="font-bold text-zinc-100 text-xs mt-0.5 leading-snug line-clamp-2">
                      {cert.courseTitle}
                    </h4>
                  </div>
                  <Badge variant={cert.status === "verified" ? "success" : "danger"} size="sm">
                    {cert.confidenceScore}% Valid
                  </Badge>
                </div>

                {cert.credentialId && (
                  <div className="text-[10px] text-zinc-500">
                    ID: <code className="text-zinc-300 font-bold">{cert.credentialId}</code>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {cert.skillsAwarded.map((s) => (
                    <span
                      key={s}
                      className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-950 text-zinc-400 border border-zinc-800"
                    >
                      +{s}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500">
                  <span>Issued: {cert.issueDate}</span>
                  {cert.verificationUrl ? (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Registry</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  ) : (
                    <span className="text-zinc-500">
                      {truncateAddress(cert.verificationHash, 4)}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Solved Industry Bounties */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-400 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-emerald-400" />
              <span>Completed Industry Micro-Bounties ({completedBounties.length})</span>
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Auto-Graded via GitHub PR</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {completedBounties.map((b) => (
              <Card key={b.id} className="p-4 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-xs">{b.company}</span>
                  <Badge variant="success" size="sm" dot>
                    Test Score: {b.autoScorePreview}%
                  </Badge>
                </div>
                <h4 className="font-bold text-zinc-100 text-sm font-sans">{b.title}</h4>
                <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">{b.description}</p>
                
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px]">
                  <span className="text-zinc-500">Receipt: 0x7f9a...3d4e</span>
                  {b.submittedPrUrl && (
                    <a
                      href={b.submittedPrUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>View Merged PR</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sealed Letters of Recommendation */}
        {visibleLors.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-400 flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-emerald-400" />
                <span>Cryptographically Sealed Letters of Recommendation ({visibleLors.length})</span>
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">SHA-256 PKI Verified</span>
            </div>

            {visibleLors.map((lor) => (
              <Card key={lor.id} className="p-5 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                  <div>
                    <h4 className="font-bold text-zinc-100 text-sm">
                      Recommendation by {lor.evaluatorName}
                    </h4>
                    <p className="text-zinc-400 text-[11px] font-mono">
                      {lor.evaluatorTitle} • {lor.companyOrDept}
                    </p>
                  </div>
                  <Badge variant="purple" size="sm">
                    {lor.verificationBadgeToken}
                  </Badge>
                </div>

                <p className="text-zinc-300 leading-relaxed text-xs italic font-serif">
                  &ldquo;{lor.recommendationBody}&rdquo;
                </p>

                {/* Rubric scores */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-zinc-800 text-[10px] font-mono">
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
                    <span className="text-zinc-500 block">Tech</span>
                    <span className="font-bold text-emerald-400">{lor.metricRatings.technicalProficiency}/5</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
                    <span className="text-zinc-500 block">Architecture</span>
                    <span className="font-bold text-emerald-400">{lor.metricRatings.systemArchitecture}/5</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
                    <span className="text-zinc-500 block">Problem Solv</span>
                    <span className="font-bold text-emerald-400">{lor.metricRatings.problemSolving}/5</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
                    <span className="text-zinc-500 block">Collab</span>
                    <span className="font-bold text-emerald-400">{lor.metricRatings.communicationCollab}/5</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
                    <span className="text-zinc-500 block">Initiative</span>
                    <span className="font-bold text-emerald-400">{lor.metricRatings.innovationInitiative}/5</span>
                  </div>
                </div>

                {/* SHA-256 Checksum receipt */}
                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-between font-mono text-[11px] gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-zinc-500 text-[10px] uppercase">SHA-256 Seal:</span>
                    <code className="text-emerald-400 truncate">{lor.cryptographicHash}</code>
                  </div>
                  <button
                    onClick={() => handleCopyHash(lor.cryptographicHash)}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 shrink-0"
                    title="Copy Checksum"
                  >
                    {copiedHash === lor.cryptographicHash ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
