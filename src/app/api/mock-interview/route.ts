import { NextRequest, NextResponse } from "next/server";
import { MockInterviewQuestion, MockInterviewFeedback } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || "generate"; // "generate" | "evaluate"
    const company = body.company || "Razorpay";
    const roleTitle = body.roleTitle || "Backend Platform Engineer";
    const gaps: string[] = body.gaps || ["Distributed Systems", "PostgreSQL & Redis"];

    if (action === "generate") {
      const questions: MockInterviewQuestion[] = [
        {
          id: 1,
          skill: gaps[0] || "Distributed Systems",
          question: `In ${company}'s core transaction processing service, how would you design an idempotency layer to guarantee that duplicate HTTP POST payments with the same idempotency-key never produce duplicate bank debits?`,
          context: "Focus on atomic locking, database unique constraints, and Redis lease expirations.",
          expectedKeypoints: ["Distributed lock (Redis SETNX or Redlock)", "Unique DB constraint", "Lease timeout", "Replay cached response"],
        },
        {
          id: 2,
          skill: gaps[1] || "PostgreSQL & Redis",
          question: `When executing a high-traffic database migration on a table with 200 million rows, how do you add a new column and composite index in PostgreSQL without table locks locking active checkout queries?`,
          context: "Discuss LOCK levels, CREATE INDEX CONCURRENTLY, and default value backfills.",
          expectedKeypoints: ["CREATE INDEX CONCURRENTLY", "Avoid table rewrite", "Zero downtime batched backfill", "Lock timeout safety"],
        },
        {
          id: 3,
          skill: "Resilience & Fallback Architecture",
          question: `If a third-party banking partner's webhook endpoint begins returning 504 Gateway Timeouts at peak load, how do you prevent cascading thread starvation in your core application servers?`,
          context: "Discuss Circuit Breaker patterns, dead letter queues (DLQs), and exponential backoff.",
          expectedKeypoints: ["Circuit Breaker", "Dead Letter Queue (DLQ)", "Thread pool isolation / bulkhead", "Exponential backoff with jitter"],
        },
      ];

      return NextResponse.json({
        success: true,
        questions,
      });
    }

    // Evaluate answers
    const answers: { questionId: number; answerText: string }[] = body.answers || [];

    // Simulate AI grading inference latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const feedbackList: MockInterviewFeedback[] = answers.map((ans) => {
      const text = ans.answerText.trim().toLowerCase();
      const wordCount = text.split(/\s+/).length;

      // Keyword evaluation
      let score = 50;
      const strengths: string[] = [];
      const missing: string[] = [];

      if (ans.questionId === 1) {
        if (text.includes("redis") || text.includes("lock") || text.includes("setnx")) {
          score += 20;
          strengths.push("Correctly identified distributed locking using Redis");
        } else {
          missing.push("Mention distributed mutex or Redis SETNX lease");
        }
        if (text.includes("unique") || text.includes("constraint") || text.includes("atomic")) {
          score += 20;
          strengths.push("Emphasized atomic database constraints to prevent race condition replays");
        } else {
          missing.push("Clarify database-level unique constraint on idempotency key");
        }
      } else if (ans.questionId === 2) {
        if (text.includes("concurrently") || text.includes("concurrent")) {
          score += 25;
          strengths.push("Prescribed CREATE INDEX CONCURRENTLY to avoid blocking DDL locks");
        } else {
          missing.push("Essential: specify CREATE INDEX CONCURRENTLY");
        }
        if (text.includes("backfill") || text.includes("batch")) {
          score += 15;
          strengths.push("Addressed batched backfill to keep write IOPS manageable");
        }
      } else {
        if (text.includes("circuit") || text.includes("breaker") || text.includes("bulkhead")) {
          score += 20;
          strengths.push("Demonstrated mastery of circuit breakers and thread isolation");
        }
        if (text.includes("queue") || text.includes("dlq") || text.includes("backoff")) {
          score += 20;
          strengths.push("Incorporated asynchronous dead-letter queues and jitter backoff");
        }
      }

      if (wordCount < 15) {
        score = Math.max(35, score - 25);
        missing.push("Answer is overly brief. Elaborate on edge case trade-offs and network partitions.");
      }

      const finalScore = Math.min(96, Math.max(40, score));

      return {
        questionId: ans.questionId,
        score: finalScore,
        critique:
          finalScore >= 80
            ? "Strong architectural explanation with sound production awareness."
            : "Satisfactory fundamentals, but lacks depth regarding failure domain recovery.",
        strengthPoints: strengths.length > 0 ? strengths : ["Communicated core high-level intent"],
        missingKeypoints: missing.length > 0 ? missing : ["None — thorough coverage"],
      };
    });

    const averageScore = Math.round(
      feedbackList.reduce((acc, f) => acc + f.score, 0) / (feedbackList.length || 1)
    );

    return NextResponse.json({
      success: true,
      averageScore,
      feedbackList,
      overallRating:
        averageScore >= 85
          ? "Exceeds Expectations (Tier 1 Ready)"
          : averageScore >= 70
          ? "Meets Engineering Standards"
          : "Needs Focused Architectural Review",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Evaluation error" },
      { status: 500 }
    );
  }
}
