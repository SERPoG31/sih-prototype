import { NextRequest, NextResponse } from "next/server";
import { CAPSTONE_PEERS } from "@/lib/mock-data";
import { CapstoneSquad, CapstoneStudent } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const domainPreference = body.domainPreference || "Fintech Distributed Ledger";

    // Simulate matchmaker graph traversal
    await new Promise((resolve) => setTimeout(resolve, 700));

    // Form balanced squads
    const squad1Members: CapstoneStudent[] = [
      CAPSTONE_PEERS[0], // Arjun Kumar (Backend)
      CAPSTONE_PEERS[1], // Ananya Deshmukh (Frontend)
      CAPSTONE_PEERS[2], // Rohan Varma (AI/ML)
      CAPSTONE_PEERS[3], // Sneha Nair (Cloud & DevOps)
    ];

    const squad1: CapstoneSquad = {
      id: "SQUAD-ALPHA-01",
      projectDomain: domainPreference,
      recommendedTopic:
        domainPreference === "Fintech Distributed Ledger"
          ? "High-Throughput Distributed Micro-Payment Settlement Ledger with Sub-5ms Idempotency"
          : domainPreference === "Healthcare AI"
          ? "Federated Edge-Vision Diagnosis Network with Cryptographic Patient Privacy Enclaves"
          : "Real-Time Telemetry Mesh for Grid Load Balancing & Peak Shaving",
      synergyScore: 96,
      members: squad1Members,
      coverageMap: [
        { domain: "Distributed Backend & DB", covered: true, responsibleStudent: "Arjun Kumar (IIT Madras)" },
        { domain: "Responsive UI & WebGL", covered: true, responsibleStudent: "Ananya Deshmukh (BITS Pilani)" },
        { domain: "AI RAG / Vector Engine", covered: true, responsibleStudent: "Rohan Varma (NIT Trichy)" },
        { domain: "Kubernetes & Cloud Infra", covered: true, responsibleStudent: "Sneha Nair (VIT Vellore)" },
      ],
    };

    const squad2Members: CapstoneStudent[] = [
      CAPSTONE_PEERS[5], // Meera Iyer (Backend)
      CAPSTONE_PEERS[4], // Tanmay Bansal (UI/UX)
      CAPSTONE_PEERS[2], // Rohan Varma (AI)
    ];

    const squad2: CapstoneSquad = {
      id: "SQUAD-BETA-02",
      projectDomain: "Enterprise Workflow Copilot",
      recommendedTopic: "Zero-Latency Collaborative Whiteboarding Canvas with Real-Time AST Diffing",
      synergyScore: 89,
      members: squad2Members,
      coverageMap: [
        { domain: "Event-Driven Backend", covered: true, responsibleStudent: "Meera Iyer (IIIT Hyderabad)" },
        { domain: "Design Systems & UX", covered: true, responsibleStudent: "Tanmay Bansal (DTU Delhi)" },
        { domain: "AI Inference & Models", covered: true, responsibleStudent: "Rohan Varma (NIT Trichy)" },
        { domain: "DevOps & Deployment", covered: false, responsibleStudent: "Position Vacant (Auto-Paging)" },
      ],
    };

    return NextResponse.json({
      success: true,
      squads: [squad1, squad2],
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Matchmaker failed" },
      { status: 500 }
    );
  }
}
