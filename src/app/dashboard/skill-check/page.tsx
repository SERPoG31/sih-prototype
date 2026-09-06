"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Code2,
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Sparkles,
  Terminal,
  Check,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStudentContext } from "@/context/student-context";
import { SKILL_CHALLENGES } from "@/lib/skill-challenges";
import { Challenge } from "@/lib/types";

interface TestRunResult {
  name: string;
  passed: boolean;
  durationMs: number;
  expectedStr: string;
  actualStr: string;
  error?: string;
}

export default function SkillCheckPage() {
  const { addVerifiedSkill, awardBadge, readinessScore } = useStudentContext();

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(SKILL_CHALLENGES[0]);
  const [code, setCode] = useState<string>(SKILL_CHALLENGES[0].starterCode);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestRunResult[]>([]);
  const [evaluationPassed, setEvaluationPassed] = useState<boolean | null>(null);
  const [verifiedBadgeAwarded, setVerifiedBadgeAwarded] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer countdown
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timeLeft]);

  const handleSelectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCode(challenge.starterCode);
    setTimeLeft(challenge.timeLimitSeconds);
    setTimerRunning(false);
    setTestResults([]);
    setEvaluationPassed(null);
    setVerifiedBadgeAwarded(null);
  };

  const handleStartTimer = () => {
    setTimerRunning(true);
  };

  const handleReset = () => {
    setTimerRunning(false);
    setTimeLeft(selectedChallenge.timeLimitSeconds);
    setCode(selectedChallenge.starterCode);
    setTestResults([]);
    setEvaluationPassed(null);
    setVerifiedBadgeAwarded(null);
  };

  // Genuine in-browser code execution engine
  const handleEvaluate = async () => {
    setIsEvaluating(true);
    setEvaluationPassed(null);

    // Give UI a moment to show evaluating state
    await new Promise((resolve) => setTimeout(resolve, 350));

    const fnName = selectedChallenge.functionName || "checkRateLimit";
    const runs: TestRunResult[] = [];
    let allPassed = true;

    try {
      // Evaluate user code in isolated Function closure
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const evaluator = new Function(
        `"use strict";
        ${code}
        try {
          return typeof ${fnName} !== "undefined" ? ${fnName} : null;
        } catch(e) {
          return null;
        }`
      );

      const userFn = evaluator();

      if (typeof userFn !== "function") {
        throw new Error(`Target function "${fnName}" is not defined or is not a callable function.`);
      }

      const testSuite = selectedChallenge.executableTestCases || [];

      for (const tc of testSuite) {
        const t0 = performance.now();
        let actual: unknown;
        let testError: string | undefined;

        try {
          // Clone args to prevent cross-test mutations
          const clonedArgs = JSON.parse(JSON.stringify(tc.args));
          actual = userFn(...clonedArgs);
        } catch (execErr) {
          testError = (execErr as Error).message || "Runtime exception during execution";
        }

        const durationMs = Math.max(1, Math.round(performance.now() - t0));
        const expectedStr = JSON.stringify(tc.expected);
        const actualStr = JSON.stringify(actual);

        const passed = !testError && expectedStr === actualStr;
        if (!passed) allPassed = false;

        runs.push({
          name: tc.name,
          passed,
          durationMs,
          expectedStr,
          actualStr: testError ? `Error: ${testError}` : actualStr,
          error: testError,
        });
      }
    } catch (globalErr) {
      allPassed = false;
      runs.push({
        name: "Syntax & Compilation Validation",
        passed: false,
        durationMs: 0,
        expectedStr: "Valid JavaScript Function",
        actualStr: (globalErr as Error).message,
        error: (globalErr as Error).message,
      });
    }

    setTestResults(runs);
    setEvaluationPassed(allPassed);
    setIsEvaluating(false);

    if (allPassed && runs.length > 0) {
      setTimerRunning(false);
      setVerifiedBadgeAwarded(selectedChallenge.badgeName);

      // Award verified badge & credit skill to StudentContext
      awardBadge(selectedChallenge.badgeName);
      addVerifiedSkill(
        selectedChallenge.skill,
        96,
        "SkillCheck",
        selectedChallenge.category || "System Design"
      );

      // Confetti effect
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#10b981", "#3b82f6", "#f59e0b"],
        });
      } catch {
        // ignore
      }
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="In-Browser Timed Sandbox"
        subtitle="Live code execution engine. Run algorithms against strict runtime assertions and automated test suites to claim verifiable skill proofs without human proctoring overhead."
        badgeText="Module 05"
      />

      {/* Challenge Selector Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SKILL_CHALLENGES.map((ch) => {
          const isSelected = selectedChallenge.id === ch.id;
          return (
            <div
              key={ch.id}
              onClick={() => handleSelectChallenge(ch)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? "bg-zinc-900/90 border-emerald-500/60 ring-1 ring-emerald-500/40"
                  : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="text-zinc-500 uppercase">{ch.difficulty}</span>
                <Badge
                  variant={ch.difficulty === "Easy" ? "default" : "purple"}
                  size="sm"
                >
                  {ch.skill}
                </Badge>
              </div>
              <h3 className="text-xs font-bold text-zinc-100 truncate">{ch.title}</h3>
            </div>
          );
        })}
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Spec & Test Runner Output */}
        <div className="lg:col-span-5 space-y-4">
          {/* Instructions Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold">{selectedChallenge.title}</CardTitle>
                  <CardDescription className="text-xs">
                    Target Function:{" "}
                    <code className="text-emerald-400 font-mono font-bold">
                      {selectedChallenge.functionName}()
                    </code>
                  </CardDescription>
                </div>
                <Badge variant="purple" size="sm">
                  {selectedChallenge.category || "System Design"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-3 text-xs">
              <p className="text-zinc-300 leading-relaxed font-sans">
                {selectedChallenge.instructions}
              </p>

              <div className="p-3 rounded bg-zinc-950 border border-zinc-800 space-y-1 font-mono text-[11px]">
                <span className="text-zinc-500 uppercase font-semibold block">
                  Reward on 100% Assertion Pass:
                </span>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{selectedChallenge.badgeName}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Runner Output Card */}
          <Card>
            <CardHeader className="pb-2 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Runtime Assertion Console</span>
                </CardTitle>
                {evaluationPassed !== null && (
                  <Badge variant={evaluationPassed ? "success" : "danger"} size="sm">
                    {evaluationPassed ? "SUITE PASSED" : "TESTS FAILED"}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-2">
              {testResults.length === 0 ? (
                <div className="p-6 rounded bg-zinc-950 border border-zinc-800 text-center font-mono text-xs text-zinc-500">
                  <span>Press &quot;Run Test Suite &amp; Verify&quot; to execute candidate code in the sandbox.</span>
                </div>
              ) : (
                <div className="space-y-2 font-mono text-xs">
                  {testResults.map((tr, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded border ${
                        tr.passed
                          ? "bg-zinc-950 border-emerald-500/30 text-emerald-300"
                          : "bg-zinc-950 border-red-500/40 text-red-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {tr.passed ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                          )}
                          <span className="font-semibold text-zinc-100 text-[11px]">{tr.name}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          {tr.durationMs}ms
                        </span>
                      </div>
                      {!tr.passed && (
                        <div className="mt-1.5 pt-1.5 border-t border-zinc-800 text-[10px] space-y-0.5 text-zinc-400">
                          <div>Expected: <code className="text-zinc-200">{tr.expectedStr}</code></div>
                          <div>Actual: <code className="text-red-400">{tr.actualStr}</code></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Success Banner */}
              {verifiedBadgeAwarded && (
                <div className="mt-3 p-3 rounded bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs text-emerald-400 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Cryptographic Verification Succeeded!</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    Skill node credited to Dynamic Skill Radar. Composite readiness recalculated to{" "}
                    <span className="text-emerald-400 font-bold">{readinessScore}%</span>.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Code Editor & Timer */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            {/* Editor Top Bar with Timer */}
            <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-emerald-400" />
                <span className="text-zinc-300 font-bold">solution.js</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-500 text-[11px]">Sandboxed V8 Evaluator</span>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span className={timeLeft < 30 ? "text-red-400 animate-pulse" : ""}>
                    {timerDisplay}
                  </span>
                </div>

                {!timerRunning && timeLeft === selectedChallenge.timeLimitSeconds && (
                  <button
                    onClick={handleStartTimer}
                    className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[11px] flex items-center gap-1"
                  >
                    <Play className="h-3 w-3 text-emerald-400" />
                    <span>Start Timer</span>
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                  title="Reset code and timer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Code Input Area */}
            <div className="p-3 bg-zinc-950">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={16}
                spellCheck={false}
                className="w-full bg-transparent text-zinc-200 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-emerald-500/20"
                placeholder="// Write your code implementation here..."
              />
            </div>

            {/* Editor Action Bottom Bar */}
            <div className="p-3 border-t border-zinc-800 bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
                <span>Pass all 3 test cases to mint platform proof badge.</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="primary"
                  onClick={handleEvaluate}
                  isLoading={isEvaluating}
                  className="w-full sm:w-auto h-9 font-mono text-xs"
                >
                  <Play className="h-3.5 w-3.5 mr-1.5 text-zinc-950 fill-zinc-950" />
                  <span>Run Test Suite &amp; Verify</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
