import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { LetterOfRecommendation } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const studentName = body.studentName || "Arjun Kumar";
    const studentId = body.studentId || "CS23B044";
    const college = body.college || "Indian Institute of Technology, Madras";
    const evaluatorName = body.evaluatorName || "Dr. K. Ramanathan";
    const evaluatorTitle = body.evaluatorTitle || "Head of Training & Placements";
    const companyOrDept = body.companyOrDept || "Department of Computer Science and Engineering";
    const ratings = body.ratings || {
      technicalProficiency: 5,
      systemArchitecture: 5,
      problemSolving: 5,
      communicationCollab: 4,
      innovationInitiative: 5,
    };
    const customNotes = body.customNotes || "";

    // Generate structured appraisal text
    const avgScore = (
      Object.values(ratings).reduce((a: number, b: unknown) => a + (Number(b) || 0), 0) / 5
    ).toFixed(1);

    const recommendationBody = `It is with immense conviction that I issue this Cryptographically Authenticated Letter of Recommendation for ${studentName} (${studentId}) from ${college}. 

Having closely evaluated ${studentName}'s engineering contributions across complex coursework, real-world hackathons, and systems architecture challenges, I can attest to their stellar technical acumen. Across our formal evaluation rubric, ${studentName} secured an aggregate rating of ${avgScore}/5.0.

In the realm of System Architecture (Rating: ${ratings.systemArchitecture}/5) and Technical Proficiency (Rating: ${ratings.technicalProficiency}/5), they have demonstrated rare precision—consistently architecting fault-tolerant backend pipelines, low-latency microservices, and clean, typed interfaces. Their problem-solving rigor (${ratings.problemSolving}/5) combined with their collaborative ethos (${ratings.communicationCollab}/5) makes them an exceptional multiplier in any high-velocity product engineering team.

${customNotes ? `Special Project Note: ${customNotes}\n\n` : ""}I recommend ${studentName} with the highest tier of endorsement for senior internship and software engineering roles at premier technology companies.`;

    // Compute Cryptographic SHA-256 Hash
    const timestamp = new Date().toISOString();
    const payloadToHash = `${studentName}_${studentId}_${evaluatorName}_${JSON.stringify(ratings)}_${timestamp}`;
    const cryptographicHash = crypto.createHash("sha256").update(payloadToHash).digest("hex");
    const verificationBadgeToken = `SKILLNEXUS-VRF-${Date.now().toString().slice(-6)}`;

    const lorRecord: LetterOfRecommendation = {
      id: `LOR-${Date.now().toString().slice(-6)}`,
      studentName,
      studentId,
      college,
      evaluatorName,
      evaluatorTitle,
      companyOrDept,
      metricRatings: ratings,
      recommendationBody,
      issuedAt: timestamp,
      cryptographicHash,
      verificationBadgeToken,
    };

    return NextResponse.json({
      success: true,
      lor: lorRecord,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to generate LOR" },
      { status: 500 }
    );
  }
}
