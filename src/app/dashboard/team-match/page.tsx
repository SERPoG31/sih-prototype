"use client";

import React, { useState } from "react";
import {
  Users,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { CAPSTONE_PEERS } from "@/lib/mock-data";
import { CapstoneSquad } from "@/lib/types";

export default function TeamMatchmakerPage() {
  const [selectedDomain, setSelectedDomain] = useState("Fintech Distributed Ledger");
  const [squads, setSquads] = useState<CapstoneSquad[] | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  const domains = [
    "Fintech Distributed Ledger",
    "Healthcare AI",
    "AgriTech IoT Telemetry",
    "Enterprise Workflow Copilot",
  ];

  const handleMatch = async () => {
    setIsMatching(true);
    try {
      const res = await fetch("/api/team-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainPreference: selectedDomain }),
      });
      const data = await res.json();
      if (data.success && data.squads) {
        setSquads(data.squads);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Collaborative Capstone Team Matchmaker"
        subtitle="Graph-matching algorithm grouping complementary engineering profiles (Frontend + Backend + AI/ML + Cloud/DevOps) into balanced project squads based on verified evidence."
        badgeText="Module 08"
      />

      {/* Control Strip */}
      <Card className="border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Capstone Problem Domain
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {domains.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDomain(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedDomain === d
                        ? "bg-indigo-600 text-white shadow border border-indigo-500"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleMatch}
              isLoading={isMatching}
              className="shrink-0"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Synthesize Optimal Squads
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Formed Squads View */}
      {squads && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">AI-Formed High-Synergy Squads</h3>
            <span className="text-xs text-slate-400">
              Balanced across skill vectors and college hubs
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {squads.map((squad) => (
              <Card
                key={squad.id}
                className="border-indigo-500/40 bg-slate-900/90 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <CardHeader className="pb-3 border-b border-slate-800">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-400 text-xs">
                            {squad.id}
                          </span>
                          <Badge variant="purple" size="sm">
                            {squad.projectDomain}
                          </Badge>
                        </div>
                        <CardTitle className="text-base text-white mt-1 leading-snug">
                          {squad.recommendedTopic}
                        </CardTitle>
                      </div>

                      <ScoreRing
                        score={squad.synergyScore}
                        size={75}
                        strokeWidth={7}
                        label="Synergy"
                        colorScheme="emerald"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-4 text-xs">
                    {/* Squad Members */}
                    <div className="space-y-2">
                      <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                        Squad Members ({squad.members.length} Engineers):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {squad.members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950 border border-slate-800"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="h-9 w-9 rounded-lg object-cover border border-slate-700 shrink-0"
                            />
                            <div className="truncate">
                              <p className="font-bold text-slate-200 truncate">{member.name}</p>
                              <p className="text-[10px] text-indigo-400 truncate">
                                {member.primaryRole}
                              </p>
                              <p className="text-[9px] text-slate-400 truncate font-mono">
                                {member.college} • {member.readinessScore}% Ready
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Architectural Stack Coverage Checklist */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                      <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block">
                        Full-Stack Architecture Coverage:
                      </span>
                      <div className="space-y-1 text-[11px]">
                        {squad.coverageMap.map((cov, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {cov.covered ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                              )}
                              <span className={cov.covered ? "text-slate-200" : "text-rose-400"}>
                                {cov.domain}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {cov.responsibleStudent}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    Deterministic Graph Synergy Match
                  </span>
                  <Button variant="outline" size="sm">
                    <span>Initialize Squad Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Student Pool */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Verified Student Candidate Pool (Indian Universities)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPSTONE_PEERS.map((peer) => (
            <Card key={peer.id} className="p-4 bg-slate-900/50">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={peer.avatarUrl}
                  alt={peer.name}
                  className="h-11 w-11 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="truncate">
                  <h4 className="font-bold text-sm text-white truncate">{peer.name}</h4>
                  <p className="text-xs text-indigo-400 font-medium">{peer.primaryRole}</p>
                  <p className="text-[10px] font-mono text-slate-400">{peer.college}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {peer.verifiedSkills.map((sk) => (
                  <span
                    key={sk}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Readiness Score</span>
                <span className="font-bold text-emerald-400">{peer.readinessScore}%</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
