"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GitBranch,
  Target,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code2,
  Sparkles,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStudentContext } from "@/context/student-context";
import { INTERNSHIP_LISTINGS } from "@/lib/mock-data";
import { BridgePathway } from "@/lib/types";

export default function BridgePathwaysPage() {
  const { skills } = useStudentContext();
  const [selectedRole, setSelectedRole] = useState(INTERNSHIP_LISTINGS[0]);
  const [activePathway, setActivePathway] = useState<BridgePathway | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeDay, setActiveDay] = useState(1);

  // Compute live match details
  const verifiedSkillNames = skills.filter((s) => s.verified).map((s) => s.name.toLowerCase());
  const missingSkills = selectedRole.requiredSkills.filter(
    (req) => !verifiedSkillNames.some((v) => v.includes(req.toLowerCase()) || req.toLowerCase().includes(v))
  );
  const matchPct = Math.round(
    ((selectedRole.requiredSkills.length - missingSkills.length) / selectedRole.requiredSkills.length) * 100
  );

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-pathway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleTitle: selectedRole.title,
          company: selectedRole.company,
          requiredSkills: selectedRole.requiredSkills,
          studentSkills: skills.filter((s) => s.verified).map((s) => s.name),
        }),
      });
      const data = await res.json();
      if (data.success && data.pathway) {
        setActivePathway(data.pathway);
        setActiveDay(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dynamic Bridge Pathway Generator"
        subtitle="Automated delta detection between student verified nodes and Tier-1 employer specifications. Generates hyper-focused 5-day sprints with verified sandbox evaluations."
        badgeText="Module 04"
      />

      {/* Role Selection Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          1. Select Target Placement / Internship Requirement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INTERNSHIP_LISTINGS.map((role) => {
            const isSelected = selectedRole.id === role.id;
            return (
              <button
                key={role.id}
                onClick={() => {
                  setSelectedRole(role);
                  setActivePathway(null);
                }}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10 text-white"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-indigo-400">{role.company}</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    ₹{(role.stipendINR / 1000).toFixed(0)}k/mo
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-white leading-snug line-clamp-2">
                  {role.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">{role.location}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gap Analysis Card */}
      <Card className="border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20">
        <CardHeader className="pb-3 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base text-white">
              <Briefcase className="h-4 w-4 text-indigo-400" />
              <span>
                Gap Delta Analysis: {selectedRole.company} – {selectedRole.title}
              </span>
            </CardTitle>
            <CardDescription>{selectedRole.description}</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block">Current Match Rate</span>
              <span className="text-lg font-bold font-mono text-emerald-400">{matchPct}%</span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerate}
              isLoading={isGenerating}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate 5-Day Sprint
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Verified Skills */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified Match Requirements:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedRole.requiredSkills
                  .filter((req) => !missingSkills.includes(req))
                  .map((skill) => (
                    <Badge key={skill} variant="success" size="sm" dot>
                      {skill}
                    </Badge>
                  ))}
                {selectedRole.requiredSkills.filter((req) => !missingSkills.includes(req)).length ===
                  0 && <span className="text-slate-500 italic">No verified matches yet</span>}
              </div>
            </div>

            {/* Gap Delta Skills */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <AlertCircle className="h-4 w-4" />
                <span>Skill Gaps Requiring Sprints ({missingSkills.length}):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((skill) => (
                  <Badge key={skill} variant="danger" size="sm" dot>
                    Missing: {skill}
                  </Badge>
                ))}
                {missingSkills.length === 0 && (
                  <span className="text-emerald-400 font-medium">100% Requirements Fulfilled!</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5-Day Sprint Plan Interactive Widget */}
      {activePathway && (
        <Card className="border-indigo-500/40 bg-slate-900 shadow-2xl">
          <CardHeader className="border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-indigo-400" />
                  <span>5-Day Fast-Track Sprint Curriculum</span>
                </CardTitle>
                <CardDescription>
                  Curated specifically to close your {activePathway.missingSkills.join(", ")} gap for {activePathway.companyName}
                </CardDescription>
              </div>
              <Badge variant="purple">AI Generated Sprint</Badge>
            </div>

            {/* Day Selector Buttons */}
            <div className="flex items-center gap-2 pt-4 overflow-x-auto pb-1">
              {activePathway.sprintPlan.map((plan) => {
                const isCurrent = activeDay === plan.day;
                return (
                  <button
                    key={plan.day}
                    onClick={() => setActiveDay(plan.day)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isCurrent
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500"
                        : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>Day {plan.day}</span>
                    <span className="text-[10px] opacity-80">
                      {plan.day === 5 ? "(Skill Check)" : "(Deep Dive)"}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {(() => {
              const currentPlan = activePathway.sprintPlan.find((p) => p.day === activeDay);
              if (!currentPlan) return null;
              return (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-indigo-400">
                        DAY {currentPlan.day} OBJECTIVE:
                      </span>
                      <h4 className="text-base font-bold text-white">{currentPlan.topic}</h4>
                    </div>
                  </div>

                  {/* Curated Docs & RFCs */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Curated Production Documentation & System Papers</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentPlan.curatedDocs.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-xs group"
                        >
                          <span className="font-medium text-slate-200 group-hover:text-indigo-300 truncate pr-2">
                            {doc.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {doc.timeEstimate}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Daily Engineering Task */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Daily Engineering Deliverable</span>
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono">
                      {currentPlan.dailyTask}
                    </p>
                  </div>

                  {/* Day 5 Capstone CTA */}
                  {currentPlan.day === 5 ? (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h5 className="font-bold text-white text-sm">
                          Sprint Capstone: Live In-Browser Sandbox Check
                        </h5>
                        <p className="text-xs text-slate-300">
                          Solve the 3-minute timed debugging test to earn a permanent Platform-Verified badge.
                        </p>
                      </div>
                      <Link href="/dashboard/skill-check">
                        <Button variant="accent" size="sm">
                          <Code2 className="h-4 w-4 mr-2" />
                          Launch Skill Check Sandbox
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setActiveDay((prev) => Math.min(5, prev + 1))}
                      >
                        <span>Next: Day {currentPlan.day + 1}</span>
                        <ArrowRight className="h-4 w-4 ml-1.5" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
