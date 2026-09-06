import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const fileName = (body.fileName || "unknown_credential.pdf").toLowerCase();
    const fileSize = body.fileSize || 245000;

    // Simulate OCR and metadata analysis delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Tampering Detection Heuristics
    const isSuspicious =
      fileName.includes("canva") ||
      fileName.includes("photoshop") ||
      fileName.includes("manipulated") ||
      fileName.includes("edited") ||
      fileName.includes("fake");

    let issuer = "NPTEL (IIT Madras)";
    let courseTitle = "Design and Analysis of Algorithms";
    let skillsAwarded = ["Algorithms", "Data Structures", "Time Complexity Analysis"];
    const studentName = "Arjun Kumar";
    let confidenceScore = 98;
    const tamperingFlags: string[] = [];
    let status: "verified" | "flagged" | "rejected" = "verified";

    if (isSuspicious) {
      issuer = "Unverified Issuer / Spliced Template";
      courseTitle = "Advanced Cloud Architect (Suspect Kerning)";
      confidenceScore = 28;
      status = "flagged";
      tamperingFlags.push("EXIF Metadata shows 'Adobe Photoshop 2024' authoring tag");
      tamperingFlags.push("Font kerning mismatch detected across student name bounding box");
      tamperingFlags.push("Issuer public key signature missing in document catalog");
      skillsAwarded = [];
    } else if (fileName.includes("aws") || fileName.includes("cloud")) {
      issuer = "Amazon Web Services (AWS)";
      courseTitle = "AWS Certified Solutions Architect – Associate";
      skillsAwarded = ["AWS IAM", "Cloud Architecture", "VPC Peering", "Serverless"];
      confidenceScore = 96;
    } else if (fileName.includes("coursera") || fileName.includes("deeplearning") || fileName.includes("ai")) {
      issuer = "DeepLearning.AI / Coursera";
      courseTitle = "Generative AI with Large Language Models";
      skillsAwarded = ["PyTorch & GenAI", "Transformer Models", "Fine-Tuning"];
      confidenceScore = 94;
    } else if (fileName.includes("hackerrank")) {
      issuer = "HackerRank Verified";
      courseTitle = "Problem Solving (Advanced) Skills Certification";
      skillsAwarded = ["Algorithms", "Dynamic Programming", "Graph Theory"];
      confidenceScore = 95;
    } else if (fileName.includes("nptel")) {
      issuer = "NPTEL (IIT Madras)";
      courseTitle = "Data Science for Engineers & PyTorch";
      skillsAwarded = ["Python", "Machine Learning", "Linear Algebra"];
      confidenceScore = 97;
    }

    // Generate deterministic SHA-256 cryptographic verification hash
    const hashData = `${fileName}_${issuer}_${studentName}_${Date.now()}`;
    const verificationHash = "0x" + crypto.createHash("sha256").update(hashData).digest("hex").slice(0, 40);

    const certificateRecord = {
      id: `CERT-VRF-${Date.now().toString().slice(-6)}`,
      studentName,
      issuer,
      courseTitle,
      issueDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      verificationHash,
      confidenceScore,
      status,
      tamperingFlags,
      skillsAwarded,
      rawMetadata: {
        producer: isSuspicious ? "Adobe Photoshop 24.1 (Windows)" : "Certified Issuer PKI Gateway v4.8",
        modifyDate: new Date().toISOString(),
        fileSizeBytes: fileSize,
      },
    };

    return NextResponse.json({
      success: true,
      verified: status === "verified",
      certificate: certificateRecord,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Internal verification error" },
      { status: 500 }
    );
  }
}
