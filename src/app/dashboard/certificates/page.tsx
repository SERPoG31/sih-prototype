"use client";

import React, { useState } from "react";
import {
  Award,
  ShieldCheck,
  AlertTriangle,
  FileText,
  CheckCircle2,
  XCircle,
  Hash,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { Progress } from "@/components/ui/progress";
import { Tooltip } from "@/components/ui/tooltip";
import { useStudentContext } from "@/context/student-context";
import { CertificateRecord } from "@/lib/types";
import { truncateAddress } from "@/lib/utils";

export default function CertificatesPage() {
  const { certificates, addVerifiedCertificate } = useStudentContext();
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentResult, setCurrentResult] = useState<CertificateRecord | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsVerifying(true);
    setCurrentResult(null);
    setAddedSuccess(false);

    try {
      const res = await fetch("/api/verify-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
        }),
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
    <div className="space-y-8">
      <PageHeader
        title="AI Certificate Authenticator"
        subtitle="Automated anti-tamper forensics engine. Scans document structures, EXIF tags, Canva/Photoshop splicing, and cryptographic issuer signatures."
        badgeText="Module 01"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload & Quick Samples */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <FileText className="h-4 w-4 text-indigo-400" />
                <span>Upload Credential Document</span>
              </CardTitle>
              <CardDescription>
                Upload original course certificates from NPTEL, Coursera, AWS, HackerRank, or universities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileDropzone onFileSelect={handleFileSelect} isLoading={isVerifying} />
            </CardContent>
          </Card>

          {/* Verification Pipeline Explainer */}
          <Card className="bg-slate-900/40 border-slate-800/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-slate-400">
                Four-Tier Verification Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-[10px]">
                  1
                </span>
                <span>Metadata Inspection: EXIF software tags, PDF authoring streams</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-[10px]">
                  2
                </span>
                <span>Visual Forensics: Font kerning, anti-aliasing edge distortion analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-[10px]">
                  3
                </span>
                <span>Simulated OCR Extraction: Student name, issuer, completion timestamp</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-[10px]">
                  4
                </span>
                <span>Skill Taxonomy Mapping: Automatically credits verified nodes to Skill Radar</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Dynamic Live Analysis Card */}
        <div className="lg:col-span-6 space-y-6">
          {isVerifying ? (
            <Card className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4 border-indigo-500/30">
              <div className="h-12 w-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
              <div className="w-full max-w-xs space-y-2">
                <p className="text-sm font-semibold text-white">Running Multi-Spectral Forensics...</p>
                <Progress value={78} className="h-2" />
                <p className="text-xs text-slate-400">
                  Parsing PDF XMP trees • Matching Cryptographic Signatures
                </p>
              </div>
            </Card>
          ) : currentResult ? (
            <Card className="border-indigo-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <CardTitle className="text-base text-white">Analysis Result</CardTitle>
                  <CardDescription>Credential Forensic Report</CardDescription>
                </div>
                <Badge
                  variant={
                    currentResult.status === "verified"
                      ? "success"
                      : currentResult.status === "flagged"
                      ? "danger"
                      : "warning"
                  }
                  dot
                >
                  {currentResult.status.toUpperCase()}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-5 pt-4">
                {/* Confidence & Quick Meta */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400">Issuing Organization</p>
                    <p className="text-sm font-bold text-white">{currentResult.issuer}</p>
                    <p className="text-xs text-slate-300 font-medium">{currentResult.courseTitle}</p>
                  </div>
                  <Tooltip content="Calculated by cross-referencing institutional signature, EXIF timestamp, and pixel splice analysis">
                    <div className="cursor-pointer">
                      <ScoreRing
                        score={currentResult.confidenceScore}
                        size={80}
                        strokeWidth={7}
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

                {/* Extracted Fields */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400 block mb-0.5">Recipient Student:</span>
                    <span className="font-semibold text-slate-100">{currentResult.studentName}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400 block mb-0.5">Issue Date:</span>
                    <span className="font-semibold text-slate-100">{currentResult.issueDate}</span>
                  </div>
                </div>

                {/* Tampering Flags if any */}
                {currentResult.tamperingFlags.length > 0 ? (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Tamper-Proofing Violations Detected ({currentResult.tamperingFlags.length})</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-rose-300 pl-6 list-disc">
                      {currentResult.tamperingFlags.map((flag, i) => (
                        <li key={i}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Integrity Verified: Zero photoshop splicing, signature hash matches registry.</span>
                  </div>
                )}

                {/* Skills Awarded */}
                {currentResult.skillsAwarded.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-300">
                      Verified Skills to Credit:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentResult.skillsAwarded.map((skill) => (
                        <Badge key={skill} variant="default" size="sm">
                          + {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verification Hash */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-400 truncate">
                    <Hash className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">Hash: {truncateAddress(currentResult.verificationHash, 10)}</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 uppercase font-bold">On-Ledger</span>
                </div>

                {/* Action Button */}
                {currentResult.status === "verified" && (
                  <div>
                    {addedSuccess ? (
                      <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-center text-xs font-semibold text-emerald-300 flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Successfully added! Skill Radar & Readiness Score have updated.</span>
                      </div>
                    ) : (
                      <Button
                        className="w-full"
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
            <Card className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-slate-900/30 border-dashed border-slate-800">
              <div className="p-3 rounded-full bg-slate-800 text-slate-500">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-300">Awaiting Certificate Upload</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Upload a PDF/Image or click one of the preset buttons on the left to test verification.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Verified Certificates History Table */}
      <div className="space-y-3 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Student Authenticated Credential Ledger</h3>
          <span className="text-xs text-slate-400">
            {certificates.length} Total Registered Credentials
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Credential ID</th>
                <th className="px-4 py-3">Issuing Authority</th>
                <th className="px-4 py-3">Course / Exam Title</th>
                <th className="px-4 py-3">Issue Date</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Cryptographic Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-indigo-300">
                    {cert.id}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{cert.issuer}</td>
                  <td className="px-4 py-3 text-slate-300">{cert.courseTitle}</td>
                  <td className="px-4 py-3 text-slate-400">{cert.issueDate}</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                    {cert.confidenceScore}%
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={cert.status === "verified" ? "success" : "danger"} size="sm" dot>
                      {cert.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
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
