"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { Progress } from "@/components/ui/progress";
import { Tooltip } from "@/components/ui/tooltip";
import { useStudentContext } from "@/context/student-context";
import { CertificateRecord } from "@/lib/types";
import { truncateAddress } from "@/lib/utils";

export default function CertificatesPage() {
  const { currentPersona, certificates, addVerifiedCertificate } = useStudentContext();
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentResult, setCurrentResult] = useState<CertificateRecord | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsVerifying(true);
    setCurrentResult(null);
    setAddedSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentName", currentPersona.name);

      const res = await fetch("/api/verify-certificate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.certificate) {
        setCurrentResult(data.certificate);
      }
    } catch (err) {
      console.error("Verification failed", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCommitToProfile = () => {
    if (!currentResult) return;
    addVerifiedCertificate(currentResult);
    setAddedSuccess(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Certificate Authenticator"
        subtitle="Automated anti-tamper forensics engine. Digital PDF text extraction, OCR parsing, live issuer registry verification, and identity spoofing detection."
      >
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            Module 01: Forensic OCR Pipeline
          </Badge>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload & Quick Samples */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="border-b border-zinc-800 pb-3">
              <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span>Upload Credential Document</span>
              </CardTitle>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Upload original PDF or image certificates (NPTEL, Coursera, AWS, HackerRank) for live inspection.
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <FileDropzone onFileSelect={handleFileSelect} isLoading={isVerifying} />
            </CardContent>
          </Card>

          {/* Verification Pipeline Explainer */}
          <Card className="bg-zinc-900/40 border-zinc-800/60 font-mono text-xs">
            <CardHeader className="pb-2 border-b border-zinc-800/80">
              <CardTitle className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                Four-Tier Verification Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-3 text-[11px] text-zinc-400">
              <div className="flex items-start gap-2">
                <span className="h-4 w-4 rounded bg-zinc-800 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong className="text-zinc-200">Digital Stream & OCR:</strong> Instant PDF stream extraction via pdf-parse with fallback to tesseract.js for raster images.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="h-4 w-4 rounded bg-zinc-800 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong className="text-zinc-200">Regex Identifier Scanners:</strong> Locates official serial codes (NPTEL, Credly, Coursera, HackerRank).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="h-4 w-4 rounded bg-zinc-800 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong className="text-zinc-200">Live Issuer Ping & Identity Check:</strong> Probes public issuer registries with a 3.5s timeout and checks for name-splicing identity theft.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="h-4 w-4 rounded bg-zinc-800 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  4
                </span>
                <span>
                  <strong className="text-zinc-200">Taxonomy & Readiness Sync:</strong> Automatically awards validated skills to Skill Radar and updates student readiness score.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Dynamic Live Analysis Card */}
        <div className="lg:col-span-7 space-y-4">
          {isVerifying ? (
            <Card className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4 border-emerald-500/30 bg-zinc-900/50">
              <div className="h-10 w-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
              <div className="w-full max-w-xs space-y-2 font-mono">
                <p className="text-xs font-bold text-zinc-100">Running Multi-Spectral Forensics...</p>
                <Progress value={82} className="h-1.5 bg-zinc-800" />
                <p className="text-[10px] text-zinc-400">
                  Parsing Text Stream • Verifying Registry Signatures
                </p>
              </div>
            </Card>
          ) : currentResult ? (
            <Card className="bg-zinc-900/50 border-zinc-800 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Credential Forensic Report</span>
                  </CardTitle>
                  <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                    ID: {currentResult.id} • Processed: {currentResult.issueDate}
                  </p>
                </div>
                <Badge
                  variant={
                    currentResult.status === "verified"
                      ? "success"
                      : currentResult.status === "flagged"
                      ? "danger"
                      : "warning"
                  }
                  className="font-mono text-xs"
                  dot
                >
                  {currentResult.status.toUpperCase()}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4 pt-4 text-xs font-mono">
                {/* Confidence & Quick Meta */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-zinc-500">Issuing Authority</p>
                    <p className="text-sm font-bold text-zinc-100">{currentResult.issuer}</p>
                    <p className="text-xs text-zinc-300 font-medium font-sans">{currentResult.courseTitle}</p>
                  </div>
                  <Tooltip content="Calculated by cross-referencing issuer registry, EXIF authoring tags, and candidate identity match">
                    <div className="cursor-pointer">
                      <ScoreRing
                        score={currentResult.confidenceScore}
                        size={74}
                        strokeWidth={6}
                        label="Confidence"
                        colorScheme={
                          currentResult.confidenceScore >= 80
                            ? "emerald"
                            : currentResult.confidenceScore >= 50
                            ? "amber"
                            : "rose"
                        }
                      />
                    </div>
                  </Tooltip>
                </div>

                {/* Extracted Telemetry Card */}
                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Extracted Certificate Telemetry</span>
                    </span>
                    {currentResult.registryConfirmed ? (
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                        REGISTRY CONFIRMED (HTTP 200)
                      </Badge>
                    ) : currentResult.status === "flagged" ? (
                      <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10 text-[10px]">
                        REGISTRY REJECTED / TAMPERED
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-[10px]">
                        REGISTRY UNVERIFIED
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Certificate Serial / Credential ID:</span>
                      <span className="font-bold text-zinc-200">
                        {currentResult.credentialId || "N/A"}
                      </span>
                    </div>

                    {currentResult.verificationUrl && (
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Issuer Verification Portal:</span>
                        <a
                          href={currentResult.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px] truncate"
                        >
                          <span className="truncate">{currentResult.verificationUrl}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>

                  {currentResult.rawExtractedText && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-zinc-500 block">Raw Parsed Text Snippet (OCR/PDF Stream):</span>
                      <pre className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 overflow-x-auto max-h-24 whitespace-pre-wrap leading-relaxed">
                        {currentResult.rawExtractedText}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Candidate & Verification Hash */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase block">Candidate Name</span>
                    <span className="font-bold text-zinc-200">{currentResult.studentName}</span>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase block">Cryptographic Checksum</span>
                    <span className="font-mono text-emerald-400 truncate block">
                      {truncateAddress(currentResult.verificationHash, 8)}
                    </span>
                  </div>
                </div>

                {/* Tampering Flags if any */}
                {currentResult.tamperingFlags.length > 0 ? (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 space-y-1.5 font-mono">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>Tamper-Proofing Violations Detected ({currentResult.tamperingFlags.length})</span>
                    </div>
                    <ul className="space-y-1 text-[10px] text-red-300 pl-5 list-disc leading-normal">
                      {currentResult.tamperingFlags.map((flag, i) => (
                        <li key={i}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 font-mono">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Integrity Verified: Zero photoshop splicing, signature hash matches registry.</span>
                  </div>
                )}

                {/* Skills Awarded */}
                {currentResult.skillsAwarded.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                      Verified Skills to Credit:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentResult.skillsAwarded.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded bg-zinc-950 border border-emerald-500/40 text-emerald-400 font-mono text-[11px]"
                        >
                          + {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {currentResult.status === "verified" && (
                  <div className="pt-2">
                    {addedSuccess ? (
                      <div className="p-3 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-center text-xs font-semibold text-emerald-300 flex items-center justify-center gap-2 font-mono">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Successfully added! Skill Radar & Readiness Score have updated.</span>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold font-mono text-xs h-9 cursor-pointer"
                        variant="primary"
                        onClick={handleCommitToProfile}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Add Verified Credential to Skill Radar
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-20 text-center space-y-3 bg-zinc-900/30 border-dashed border-zinc-800">
              <div className="p-3 rounded-full bg-zinc-900 text-zinc-600 border border-zinc-800">
                <Search className="h-6 w-6" />
              </div>
              <div className="font-mono">
                <p className="text-xs font-semibold text-zinc-300">Awaiting Certificate Upload</p>
                <p className="text-[10px] text-zinc-500 mt-1 max-w-xs">
                  Upload a PDF/Image or click one of the preset buttons on the left to test live verification.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Verified Certificates History Table */}
      <div className="space-y-3 pt-6 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-zinc-100">Student Authenticated Credential Ledger</h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            {certificates.length} Total Registered Credentials
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/60">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-zinc-800 bg-zinc-950 text-[10px] uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-2.5">Credential ID</th>
                <th className="px-4 py-2.5">Issuing Authority</th>
                <th className="px-4 py-2.5">Course / Exam Title</th>
                <th className="px-4 py-2.5">Issue Date</th>
                <th className="px-4 py-2.5">Confidence</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Cryptographic Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-4 py-3 font-semibold text-emerald-400">
                    {cert.id}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-100">{cert.issuer}</td>
                  <td className="px-4 py-3 text-zinc-300 font-sans text-[11px]">{cert.courseTitle}</td>
                  <td className="px-4 py-3 text-zinc-400">{cert.issueDate}</td>
                  <td className="px-4 py-3 font-bold text-emerald-400">
                    {cert.confidenceScore}%
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={cert.status === "verified" ? "success" : "danger"} size="sm" dot>
                      {cert.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-zinc-400">
                    {truncateAddress(cert.verificationHash, 8)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
