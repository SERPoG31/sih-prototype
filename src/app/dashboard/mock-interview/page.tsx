"use client";

import React, { useState } from "react";
import {
  Bot,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Send,
  Building2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { Tooltip } from "@/components/ui/tooltip";
import { useStudentContext } from "@/context/student-context";
import { INTERNSHIP_LISTINGS } from "@/lib/mock-data";
import { MockInterviewQuestion, MockInterviewFeedback } from "@/lib/types";

export default function MockInterviewPage() {
  const { addVerifiedSkill, awardBadge } = useStudentContext();

  const [selectedRole, setSelectedRole] = useState(INTERNSHIP_LISTINGS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<MockInterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [interviewResult, setInterviewResult] = useState<{
    averageScore: number;
    feedbackList: MockInterviewFeedback[];
    overallRating: string;
  } | null>(null);
  const [creditedSuccess, setCreditedSuccess] = useState(false);

  const handleStartInterview = async () => {
    setIsLoadingQuestions(true);
    setIsModalOpen(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setInterviewResult(null);
    setCreditedSuccess(false);

    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          roleTitle: selectedRole.title,
          company: selectedRole.company,
          gaps: selectedRole.requiredSkills,
        }),
      });
      const data = await res.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleAnswerChange = (text: string) => {
    const qId = questions[currentQuestionIndex]?.id;
    if (!qId) return;
    setAnswers((prev) => ({ ...prev, [qId]: text }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmitInterview = async () => {
    setIsEvaluating(true);
    try {
      const payloadAnswers = questions.map((q) => ({
        questionId: q.id,
        answerText: answers[q.id] || "No response provided",
      }));

      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          company: selectedRole.company,
          answers: payloadAnswers,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInterviewResult({
          averageScore: data.averageScore,
          feedbackList: data.feedbackList,
          overallRating: data.overallRating,
        });

        // Award badge & boost skills
        awardBadge(`AI Mock Interview: ${selectedRole.company} (${data.averageScore}%)`);
        addVerifiedSkill("System Design", data.averageScore, "MockInterview");
        setCreditedSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Pre-fill realistic sample answers for quick evaluator testing
  const loadPresetAnswer = () => {
    const q = questions[currentQuestionIndex];
    if (!q) return;
    const presets: Record<number, string> = {
      1: "We use a distributed mutex via Redis SETNX with a lease TTL of 30 seconds combined with a PostgreSQL unique constraint on the idempotency_key column. If a duplicate request arrives while locked, we return 409 or await the key. Once committed, the successful transaction payload is cached in Redis with a 24-hour TTL to replay identically without debiting again.",
      2: "In PostgreSQL, running ALTER TABLE ADD COLUMN without default values is metadata-only and does not lock writes. For the index, we must run CREATE INDEX CONCURRENTLY to build the index structure in multiple passes without acquiring an exclusive table lock, and backfill any defaults in controlled batches of 10,000 rows to keep IOPS low.",
      3: "We wrap external webhook calls in a Circuit Breaker (e.g. Resilience4j state machine). If error rates exceed 50% in a rolling 10-second window, the circuit trips to OPEN and fast-fails immediate attempts. Failed dispatches are pushed into an asynchronous Dead Letter Queue (DLQ) with exponential backoff and randomized jitter to prevent thundering herds.",
    };
    handleAnswerChange(presets[q.id] || "Architectural solution utilizing circuit breakers and distributed locks.");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gap-Targeted AI Mock Interviewer"
        subtitle="Simulates realistic 3-question technical screening interviews focused exclusively on the delta gaps between student skills and job specifications. Provides actionable architectural feedback."
        badgeText="Module 06"
      />

      {/* Target Role Selector */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Select Hiring Company & Role Specification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INTERNSHIP_LISTINGS.map((role) => {
            const isSelected = selectedRole.id === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/10"
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-indigo-400">{role.company}</span>
                  <span className="text-[10px] font-mono text-slate-400">{role.duration}</span>
                </div>
                <h4 className="font-semibold text-xs text-white leading-snug line-clamp-2">
                  {role.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-2">
                  Key Focus: {role.requiredSkills[0]} & {role.requiredSkills[1]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Banner & Start Interview */}
      <Card className="border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-base text-white">
              <Building2 className="h-4 w-4 text-indigo-400" />
              <span>Target Role: {selectedRole.company} – {selectedRole.title}</span>
            </CardTitle>
            <CardDescription className="pt-1">
              AI will screen your understanding of: {selectedRole.requiredSkills.join(", ")}
            </CardDescription>
          </div>
          <Button variant="primary" onClick={handleStartInterview}>
            <Bot className="h-4 w-4 mr-2" />
            Launch 3-Question AI Screening
          </Button>
        </CardHeader>
      </Card>

      {/* Interview Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`AI Technical Screening: ${selectedRole.company}`}
        description="Answer the 3 gap-targeted questions below. Once submitted, the system will assess architectural depth and grade your response."
        maxWidth="2xl"
      >
        {isLoadingQuestions ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <p className="text-xs text-slate-400 font-mono">
              Synthesizing company interview questions...
            </p>
          </div>
        ) : interviewResult ? (
          /* Results View */
          <div className="space-y-6 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Screening Performance</p>
                <h4 className="text-base font-bold text-white">{interviewResult.overallRating}</h4>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">
                  Verified Score Awarded: +{interviewResult.averageScore}%
                </p>
              </div>
              <Tooltip content="Composite score derived from AST code structure, keyword coverage, and systems design depth">
                <div className="cursor-pointer">
                  <ScoreRing
                    score={interviewResult.averageScore}
                    size={75}
                    strokeWidth={7}
                    label="Score"
                    colorScheme="emerald"
                  />
                </div>
              </Tooltip>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detailed Question Breakdown
              </h5>
              {interviewResult.feedbackList.map((feedback, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-400">
                      Question #{feedback.questionId}
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      Score: {feedback.score}/100
                    </span>
                  </div>
                  <p className="text-slate-300 italic">{feedback.critique}</p>

                  <div className="pt-1">
                    <span className="text-[10px] text-emerald-400 font-semibold block">
                      Recognized Strengths:
                    </span>
                    <ul className="text-[11px] text-slate-400 list-disc pl-4 space-y-0.5">
                      {feedback.strengthPoints.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {feedback.missingKeypoints.length > 0 && feedback.missingKeypoints[0] !== "None — thorough coverage" && (
                    <div className="pt-1">
                      <span className="text-[10px] text-amber-400 font-semibold block">
                        Areas to Deepen:
                      </span>
                      <ul className="text-[11px] text-slate-400 list-disc pl-4 space-y-0.5">
                        {feedback.missingKeypoints.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Close & Return to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          /* Active Question Flow */
          questions.length > 0 && (
            <div className="space-y-4 pt-2">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-indigo-400 font-bold">
                  Focus: {questions[currentQuestionIndex].skill}
                </span>
              </div>
              <Progress
                value={((currentQuestionIndex + 1) / questions.length) * 100}
                className="h-1.5"
                indicatorClassName="bg-indigo-500"
              />

              {/* Question Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-200">
                    AI Lead Architect Screening Question:
                  </span>
                </div>
                <p className="text-sm font-medium text-white leading-relaxed">
                  {questions[currentQuestionIndex].question}
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  Tip: {questions[currentQuestionIndex].context}
                </p>
              </div>

              {/* Answer Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Your Technical Response:</label>
                  <button
                    type="button"
                    onClick={loadPresetAnswer}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-mono"
                  >
                    Quick Evaluator Answer Auto-Fill
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={answers[questions[currentQuestionIndex].id] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Explain your approach, architecture tradeoffs, and resilience safeguards..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-700/80 p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                />
              </div>

              {/* Modal Navigation Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                >
                  Previous
                </Button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <Button variant="primary" size="sm" onClick={handleNextQuestion}>
                    <span>Next Question</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={handleSubmitInterview}
                    isLoading={isEvaluating}
                  >
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Submit for AI Evaluation
                  </Button>
                )}
              </div>
            </div>
          )
        )}
      </Modal>
    </div>
  );
}
