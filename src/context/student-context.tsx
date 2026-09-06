"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import {
  BountyChallenge,
  CertificateRecord,
  GitHubTelemetry,
  LetterOfRecommendation,
  PersonaProfile,
  SkillNode,
} from "@/lib/types";
import {
  DEMO_PERSONAS,
  INITIAL_BOUNTIES,
  INITIAL_CERTIFICATES,
  INITIAL_GITHUB,
  INITIAL_LORS,
  INITIAL_SKILLS,
} from "@/lib/mock-data";

interface StudentContextType {
  currentPersona: PersonaProfile;
  personas: PersonaProfile[];
  switchPersona: (personaId: string) => void;
  skills: SkillNode[];
  certificates: CertificateRecord[];
  github: GitHubTelemetry;
  bounties: BountyChallenge[];
  lors: LetterOfRecommendation[];
  verifiedBadges: string[];
  readinessScore: number;
  // Actions
  addVerifiedSkill: (
    skillName: string,
    score: number,
    source: "Certificate" | "GitHub" | "SkillCheck" | "Bounty" | "MockInterview",
    category?: SkillNode["category"]
  ) => void;
  addVerifiedCertificate: (cert: CertificateRecord) => void;
  updateGitHubProfile: (telemetry: Partial<GitHubTelemetry>) => void;
  recordBountyScore: (
    bountyId: string,
    score: number,
    prUrl: string,
    tags?: string[],
    company?: string
  ) => void;
  awardBadge: (badgeName: string) => void;
  addIssuedLOR: (lor: LetterOfRecommendation) => void;
  resetToDefaults: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const INITIAL_BADGES = [
  "NPTEL Elite Silver (Algorithms)",
  "AWS Cloud Practitioner",
  "DeepLearning.AI Verified",
  "Razorpay Bounty Conqueror",
  "GitHub Verified Dev: Advanced",
];

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<PersonaProfile>(DEMO_PERSONAS[0]);
  const [skills, setSkills] = useState<SkillNode[]>(INITIAL_SKILLS);
  const [certificates, setCertificates] = useState<CertificateRecord[]>(INITIAL_CERTIFICATES);
  const [github, setGithub] = useState<GitHubTelemetry>(INITIAL_GITHUB);
  const [bounties, setBounties] = useState<BountyChallenge[]>(INITIAL_BOUNTIES);
  const [lors, setLors] = useState<LetterOfRecommendation[]>(INITIAL_LORS);
  const [verifiedBadges, setVerifiedBadges] = useState<string[]>(INITIAL_BADGES);

  // Hydrate from localStorage on client mount if available
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const savedSkills = localStorage.getItem("skillnexus_skills");
      if (savedSkills) setSkills(JSON.parse(savedSkills));

      const savedCerts = localStorage.getItem("skillnexus_certs");
      if (savedCerts) setCertificates(JSON.parse(savedCerts));

      const savedGithub = localStorage.getItem("skillnexus_github");
      if (savedGithub) setGithub(JSON.parse(savedGithub));

      const savedBounties = localStorage.getItem("skillnexus_bounties");
      if (savedBounties) setBounties(JSON.parse(savedBounties));

      const savedLors = localStorage.getItem("skillnexus_lors");
      if (savedLors) setLors(JSON.parse(savedLors));

      const savedBadges = localStorage.getItem("skillnexus_badges");
      if (savedBadges) setVerifiedBadges(JSON.parse(savedBadges));
    } catch {
      // ignore storage access issues
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Save changes to localStorage
  const persistState = (key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // ignore
    }
  };

  const switchPersona = (personaId: string) => {
    const found = DEMO_PERSONAS.find((p) => p.id === personaId);
    if (found) setCurrentPersona(found);
  };

  const addVerifiedSkill = (
    skillName: string,
    score: number,
    source: "Certificate" | "GitHub" | "SkillCheck" | "Bounty" | "MockInterview",
    category: SkillNode["category"] = "Backend"
  ) => {
    setSkills((prev) => {
      const existing = prev.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
      let updated: SkillNode[];
      if (existing) {
        updated = prev.map((s) => {
          if (s.name.toLowerCase() === skillName.toLowerCase()) {
            const sources = Array.from(new Set([...s.sources, source]));
            return {
              ...s,
              score: Math.min(100, Math.max(s.score, score)),
              verified: true,
              evidenceCount: s.evidenceCount + 1,
              sources,
            };
          }
          return s;
        });
      } else {
        updated = [
          ...prev,
          {
            name: skillName,
            category,
            score,
            verified: true,
            evidenceCount: 1,
            sources: [source],
          },
        ];
      }
      persistState("skillnexus_skills", updated);
      return updated;
    });
  };

  const awardBadge = (badgeName: string) => {
    setVerifiedBadges((prev) => {
      if (prev.includes(badgeName)) return prev;
      const updated = [badgeName, ...prev];
      persistState("skillnexus_badges", updated);
      return updated;
    });
  };

  const addVerifiedCertificate = (cert: CertificateRecord) => {
    setCertificates((prev) => {
      const updated = [cert, ...prev];
      persistState("skillnexus_certs", updated);
      return updated;
    });

    // Automatically boost related skills
    cert.skillsAwarded.forEach((skill) => {
      addVerifiedSkill(skill, cert.confidenceScore, "Certificate");
    });

    awardBadge(`${cert.issuer} Verified: ${cert.courseTitle.slice(0, 24)}...`);
  };

  const updateGitHubProfile = (telemetry: Partial<GitHubTelemetry>) => {
    setGithub((prev) => {
      const updated = { ...prev, ...telemetry, verifiedAt: new Date().toISOString() };
      persistState("skillnexus_github", updated);
      return updated;
    });
    if (telemetry.devTier) {
      awardBadge(`GitHub Verified Dev: ${telemetry.devTier}`);
    }
  };

  const recordBountyScore = (
    bountyId: string,
    score: number,
    prUrl: string,
    tags: string[] = ["TypeScript", "Next.js"],
    company: string = "Industry Partner"
  ) => {
    setBounties((prev) => {
      const exists = prev.some((b) => b.id === bountyId);
      let updated: BountyChallenge[];
      if (exists) {
        updated = prev.map((b) => {
          if (b.id === bountyId) {
            return {
              ...b,
              status: "Completed" as const,
              submittedPrUrl: prUrl,
              autoScorePreview: score,
            };
          }
          return b;
        });
      } else {
        const newChallenge: BountyChallenge = {
          id: bountyId,
          title: `Bounty: ${bountyId}`,
          company,
          rewardINR: 50000,
          timeRemainingHours: 0,
          difficulty: "Hard",
          requiredSkills: tags,
          description: "Completed industry bounty challenge verified via GitHub PR.",
          prSubmissionCount: 1,
          testChecklist: ["CI Test Suite Passed", "AST Compliance", "Zero Memory Leak"],
          status: "Completed",
          submittedPrUrl: prUrl,
          autoScorePreview: score,
        };
        updated = [newChallenge, ...prev];
      }
      persistState("skillnexus_bounties", updated);
      return updated;
    });

    const skillsToAward = tags && tags.length > 0 ? tags : ["Full-Stack Architecture", "TypeScript"];
    skillsToAward.forEach((skill) => {
      addVerifiedSkill(skill, score, "Bounty");
    });
    awardBadge(`Bounty Victor: ${company} (${score}%)`);
  };

  const addIssuedLOR = (lor: LetterOfRecommendation) => {
    setLors((prev) => {
      const updated = [lor, ...prev];
      persistState("skillnexus_lors", updated);
      return updated;
    });
    awardBadge(`Cryptographic LOR by ${lor.evaluatorName}`);
  };

  const resetToDefaults = () => {
    setCurrentPersona(DEMO_PERSONAS[0]);
    setSkills(INITIAL_SKILLS);
    setCertificates(INITIAL_CERTIFICATES);
    setGithub(INITIAL_GITHUB);
    setBounties(INITIAL_BOUNTIES);
    setLors(INITIAL_LORS);
    setVerifiedBadges(INITIAL_BADGES);
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
  };

  // Dynamically calculate aggregate Readiness Score (0-100)
  // Weighted:
  // - 40% Verified Skills average
  // - 25% GitHub Telemetry & Quality Score
  // - 20% Verified Certificates confidence
  // - 15% Completed Bounties
  const readinessScore = useMemo(() => {
    const verifiedSkillsList = skills.filter((s) => s.verified);
    const avgSkillScore =
      verifiedSkillsList.length > 0
        ? verifiedSkillsList.reduce((acc, s) => acc + s.score, 0) / verifiedSkillsList.length
        : 60;

    const githubWeight = github.codeQualityScore;

    const verifiedCertList = certificates.filter((c) => c.status === "verified");
    const avgCertScore =
      verifiedCertList.length > 0
        ? verifiedCertList.reduce((acc, c) => acc + c.confidenceScore, 0) / verifiedCertList.length
        : 75;

    const completedBounties = bounties.filter((b) => b.status === "Completed");
    const bountyBonus = Math.min(100, completedBounties.length * 28 + 40);

    const aggregate = Math.round(
      avgSkillScore * 0.4 + githubWeight * 0.25 + avgCertScore * 0.2 + bountyBonus * 0.15
    );

    return Math.min(99, Math.max(10, aggregate));
  }, [skills, github, certificates, bounties]);

  return (
    <StudentContext.Provider
      value={{
        currentPersona,
        personas: DEMO_PERSONAS,
        switchPersona,
        skills,
        certificates,
        github,
        bounties,
        lors,
        verifiedBadges,
        readinessScore,
        addVerifiedSkill,
        addVerifiedCertificate,
        updateGitHubProfile,
        recordBountyScore,
        awardBadge,
        addIssuedLOR,
        resetToDefaults,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudentContext must be used within a StudentProvider");
  }
  return context;
}

// Alias to adhere strictly to instructions
export const useStudentProfile = useStudentContext;
