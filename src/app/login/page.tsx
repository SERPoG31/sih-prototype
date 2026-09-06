"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  UserCheck,
  GraduationCap,
  Building2,
  Briefcase,
  Terminal,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { useStudentContext } from "@/context/student-context";
import { UserAvatar } from "@/components/ui/avatar";

export default function LoginPage() {
  const router = useRouter();
  const { currentPersona, personas, switchPersona } = useStudentContext();

  const [selectedRole, setSelectedRole] = useState<string>(currentPersona.id);
  const [customEmail, setCustomEmail] = useState<string>("arjun.kumar@nitk.edu.in");
  const [customPassword, setCustomPassword] = useState<string>("••••••••••••");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const handleQuickLogin = (personaId: string, targetPath: string) => {
    switchPersona(personaId);
    setAuthSuccess(personaId);
    setTimeout(() => {
      router.push(targetPath);
    }, 350);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    switchPersona(selectedRole);

    let targetPath = "/dashboard";
    if (selectedRole === "sunita-rao") {
      targetPath = "/dashboard/evaluator";
    } else if (selectedRole === "vikram-malhotra") {
      targetPath = "/dashboard/lor";
    }

    setTimeout(() => {
      setIsSubmitting(false);
      router.push(targetPath);
    }, 400);
  };

  const personaMeta: Record<
    string,
    {
      scopeTag: string;
      redirectPath: string;
      roleIcon: React.ElementType;
      permissions: string[];
      accentBorder: string;
    }
  > = {
    "arjun-kumar": {
      scopeTag: "STUDENT PORTAL",
      redirectPath: "/dashboard",
      roleIcon: GraduationCap,
      permissions: [
        "View verified proof portfolio",
        "Solve algorithmic sandbox challenges",
        "Claim GitHub PR bounties",
        "Inspect received cryptographic LORs",
      ],
      accentBorder: "border-zinc-800 hover:border-emerald-500/60",
    },
    "sunita-rao": {
      scopeTag: "EVALUATOR & TPO HUB",
      redirectPath: "/dashboard/evaluator",
      roleIcon: Building2,
      permissions: [
        "Monitor cohort readiness roster",
        "Audit live curriculum misalignment radar",
        "Grade student capstones with 5-axis rubric",
        "Cryptographically seal SHA-256 LORs",
      ],
      accentBorder: "border-zinc-800 hover:border-emerald-500/60",
    },
    "vikram-malhotra": {
      scopeTag: "RECRUITER SUITE",
      redirectPath: "/dashboard/lor",
      roleIcon: Briefcase,
      permissions: [
        "Verify candidate tamper-proof audit trails",
        "Run cryptographic SHA-256 integrity verifier",
        "Publish industry engineering bounties",
        "Export verified candidate ATS dossiers",
      ],
      accentBorder: "border-zinc-800 hover:border-emerald-500/60",
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-300 font-sans">
      {/* Top micro bar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-300">
            <Terminal className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-sm text-zinc-100">SkillNexus</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-900 text-zinc-400 rounded border border-zinc-800">
              SIH 2026 • PS: 26044
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span className="hidden sm:inline">Zero Self-Reported Claims</span>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-300">Auth Gateway</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8 flex flex-col justify-center">
        {/* Header Title */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Cryptographically Verified Evaluation Environment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Select Evaluation Persona
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-mono">
            Experience SkillNexus from any stakeholder perspective. Role transitions immediately
            synchronize shared ledger state, LOR issuances, and readiness metrics across all sessions.
          </p>
        </div>

        {/* 1-Click Judge Access Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-semibold">
              Option A: 1-Click Judge & Evaluator Demo Access
            </span>
            <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline">
              Instant Session Authorization
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personas.map((persona) => {
              const meta = personaMeta[persona.id] || {
                scopeTag: "DEMO PORTAL",
                redirectPath: "/dashboard",
                roleIcon: UserCheck,
                permissions: ["Standard access"],
                accentBorder: "border-zinc-800",
              };
              const isSelected = currentPersona.id === persona.id;
              const isTriggered = authSuccess === persona.id;

              return (
                <div
                  key={persona.id}
                  onClick={() => handleQuickLogin(persona.id, meta.redirectPath)}
                  className={`group relative flex flex-col justify-between p-4 rounded-lg bg-zinc-900/50 border transition-all cursor-pointer ${
                    meta.accentBorder
                  } ${
                    isSelected
                      ? "ring-1 ring-emerald-500/50 bg-zinc-900/80"
                      : "hover:bg-zinc-900"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Tag & Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 font-semibold">
                        [{meta.scopeTag}]
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    {/* Persona Identity */}
                    <div className="flex items-center gap-3 pt-1">
                      <UserAvatar
                        src={persona.avatar}
                        name={persona.name}
                        size="md"
                        className="border-zinc-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-zinc-100 truncate group-hover:text-emerald-300 transition-colors">
                          {persona.name}
                        </h3>
                        <p className="text-[11px] text-zinc-400 truncate">{persona.title}</p>
                        <p className="text-[10px] text-zinc-500 truncate font-mono">
                          {persona.organization}
                        </p>
                      </div>
                    </div>

                    {/* Permission Checklist */}
                    <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                        Capabilities:
                      </span>
                      <ul className="space-y-1">
                        {meta.permissions.map((perm, idx) => (
                          <li
                            key={idx}
                            className="text-[11px] text-zinc-300 flex items-start gap-1.5"
                          >
                            <span className="text-emerald-500 text-[10px] mt-0.5">▪</span>
                            <span className="leading-tight">{perm}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Primary CTA inside card */}
                  <div className="pt-4 mt-3 border-t border-zinc-800/60">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-3 py-2 rounded bg-zinc-950 hover:bg-zinc-800 text-zinc-200 text-xs font-mono font-medium border border-zinc-800 transition-colors group-hover:border-zinc-700"
                    >
                      <span>
                        {isTriggered ? "Authenticating Session..." : `Enter as ${persona.name.split(" ")[0]}`}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Email / Role Form Option */}
        <div className="rounded-lg bg-zinc-900/40 border border-zinc-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
            <span className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-zinc-400" />
              <span>Option B: Simulated Credential Authentication</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500">SSO / Identity Provider Mock</span>
          </div>

          <form onSubmit={handleFormLogin} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-4 space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Institutional / Corporate Email
              </label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full rounded bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="evaluator@institution.edu"
                required
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Security Passcode
              </label>
              <input
                type="password"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                className="w-full rounded bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••••••"
                required
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Role Identity
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="arjun-kumar">Arjun Kumar — Student (Full-Stack & Cloud)</option>
                <option value="sunita-rao">Dr. Sunita Rao — Dean of Academics / Evaluator</option>
                <option value="vikram-malhotra">Vikram Malhotra — VP Eng @ Razorpay / Recruiter</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-8 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-3 w-3" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 px-4 py-3 text-center text-xs font-mono text-zinc-500">
        SkillNexus Identity Gateway • SIH 2026 Problem Statement 26044 • Next.js 16 + Turbopack
      </footer>
    </div>
  );
}
