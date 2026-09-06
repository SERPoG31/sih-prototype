"use client";

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AuditEvidenceClaim,
  BountyChallenge,
  CertificateRecord,
  CohortStudent,
  DepartmentSkillGap,
  GitHubTelemetry,
  InstitutionalMetrics,
  LetterOfRecommendation,
  PersonaProfile,
  RecruiterAuditLog,
  SkillNode,
} from "@/lib/types";
import {
  COHORT_STUDENTS,
  DEMO_PERSONAS,
  INITIAL_AUDIT_CLAIMS,
  INITIAL_BOUNTIES,
  INITIAL_CERTIFICATES,
  INITIAL_DEPARTMENT_SKILL_GAPS,
  INITIAL_FACULTY_DIRECTIVE,
  INITIAL_GITHUB,
  INITIAL_INSTITUTIONAL_METRICS,
  INITIAL_LORS,
  INITIAL_RECRUITER_AUDIT_LOGS,
  INITIAL_SKILLS,
} from "@/lib/mock-data";

export interface StudentContextType {
  currentPersona: PersonaProfile;
  personas: PersonaProfile[];
  switchPersona: (personaId: string, options?: { redirect?: boolean }) => void;
  // Student active states
  skills: SkillNode[];
  certificates: CertificateRecord[];
  github: GitHubTelemetry;
  bounties: BountyChallenge[];
  lors: LetterOfRecommendation[];
  cohortStudents: CohortStudent[];
  verifiedBadges: string[];
  readinessScore: number;

  // Evaluator-specific states
  pendingAudits: AuditEvidenceClaim[];
  institutionalMetrics: InstitutionalMetrics;
  departmentSkillGaps: DepartmentSkillGap[];
  facultyDirective: string;

  // Recruiter-specific states
  activeBountiesPosted: BountyChallenge[];
  talentShortlist: CohortStudent[];
  auditLogs: RecruiterAuditLog[];

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
  toggleLORPortfolioDisplay: (lorId: string) => void;
  updateCohortStudent: (studentId: string, updates: Partial<CohortStudent>) => void;
  approveAuditClaim: (claimId: string) => void;
  flagAuditClaim: (claimId: string, reason?: string) => void;
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

interface StudentStore {
  skills: SkillNode[];
  certificates: CertificateRecord[];
  github: GitHubTelemetry;
  bounties: BountyChallenge[];
  lors: LetterOfRecommendation[];
  verifiedBadges: string[];
}

interface EvaluatorStore {
  cohortStudents: CohortStudent[];
  pendingAudits: AuditEvidenceClaim[];
  institutionalMetrics: InstitutionalMetrics;
  departmentSkillGaps: DepartmentSkillGap[];
  facultyDirective: string;
}

interface RecruiterStore {
  activeBountiesPosted: BountyChallenge[];
  talentShortlist: CohortStudent[];
  auditLogs: RecruiterAuditLog[];
}

const DEFAULT_STUDENT_STORE: StudentStore = {
  skills: INITIAL_SKILLS,
  certificates: INITIAL_CERTIFICATES,
  github: INITIAL_GITHUB,
  bounties: INITIAL_BOUNTIES,
  lors: INITIAL_LORS,
  verifiedBadges: INITIAL_BADGES,
};

const DEFAULT_EVALUATOR_STORE: EvaluatorStore = {
  cohortStudents: COHORT_STUDENTS,
  pendingAudits: INITIAL_AUDIT_CLAIMS,
  institutionalMetrics: INITIAL_INSTITUTIONAL_METRICS,
  departmentSkillGaps: INITIAL_DEPARTMENT_SKILL_GAPS,
  facultyDirective: INITIAL_FACULTY_DIRECTIVE,
};

const DEFAULT_RECRUITER_STORE: RecruiterStore = {
  activeBountiesPosted: INITIAL_BOUNTIES,
  talentShortlist: COHORT_STUDENTS.filter((s) => s.readinessScore >= 85),
  auditLogs: INITIAL_RECRUITER_AUDIT_LOGS,
};

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Persona State
  const [currentPersona, setCurrentPersona] = useState<PersonaProfile>(DEMO_PERSONAS[0]);

  // Isolated Stores
  const [studentStore, setStudentStore] = useState<StudentStore>(DEFAULT_STUDENT_STORE);
  const [evaluatorStore, setEvaluatorStore] = useState<EvaluatorStore>(DEFAULT_EVALUATOR_STORE);
  const [recruiterStore, setRecruiterStore] = useState<RecruiterStore>(DEFAULT_RECRUITER_STORE);

  // Persistence Helper
  const persistState = useCallback((key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("skillnexus_state_sync", { detail: { key } }));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Hydrate all isolated stores on client mount
  useEffect(() => {
    try {
      // 1. Resolve Persona
      const savedPersonaId =
        localStorage.getItem("skillnexus_active_persona") ||
        localStorage.getItem("skillnexus_persona") ||
        localStorage.getItem("active_persona_id");

      if (savedPersonaId) {
        const normalized = savedPersonaId === "sunita-rao" ? "dr-sunita-rao" : savedPersonaId;
        const found =
          DEMO_PERSONAS.find((p) => p.id === normalized) ||
          DEMO_PERSONAS.find((p) => p.id.includes(normalized.replace("dr-", "")));
        if (found) setCurrentPersona(found);
      }

      // 2. Hydrate Student Store
      const savedStudent = localStorage.getItem("skillnexus_student_data");
      if (savedStudent) {
        setStudentStore(JSON.parse(savedStudent));
      } else {
        // Check legacy single-keys if available
        const legacySkills = localStorage.getItem("skillnexus_skills");
        const legacyCerts = localStorage.getItem("skillnexus_certs");
        const legacyGithub = localStorage.getItem("skillnexus_github");
        const legacyBounties = localStorage.getItem("skillnexus_bounties");
        const legacyLors = localStorage.getItem("skillnexus_lors");
        const legacyBadges = localStorage.getItem("skillnexus_badges");

        if (legacySkills || legacyCerts || legacyGithub || legacyBounties || legacyLors) {
          setStudentStore({
            skills: legacySkills ? JSON.parse(legacySkills) : INITIAL_SKILLS,
            certificates: legacyCerts ? JSON.parse(legacyCerts) : INITIAL_CERTIFICATES,
            github: legacyGithub ? JSON.parse(legacyGithub) : INITIAL_GITHUB,
            bounties: legacyBounties ? JSON.parse(legacyBounties) : INITIAL_BOUNTIES,
            lors: legacyLors ? JSON.parse(legacyLors) : INITIAL_LORS,
            verifiedBadges: legacyBadges ? JSON.parse(legacyBadges) : INITIAL_BADGES,
          });
        }
      }

      // 3. Hydrate Evaluator Store
      const savedEvaluator = localStorage.getItem("skillnexus_evaluator_data");
      if (savedEvaluator) {
        setEvaluatorStore(JSON.parse(savedEvaluator));
      } else {
        const legacyCohort = localStorage.getItem("skillnexus_cohort");
        if (legacyCohort) {
          setEvaluatorStore((prev) => ({
            ...prev,
            cohortStudents: JSON.parse(legacyCohort),
          }));
        }
      }

      // 4. Hydrate Recruiter Store
      const savedRecruiter = localStorage.getItem("skillnexus_recruiter_data");
      if (savedRecruiter) {
        setRecruiterStore(JSON.parse(savedRecruiter));
      }
    } catch {
      // Ignore storage access issues in sandboxes
    }
  }, []);

  // Listen for state sync broadcast across tabs/windows
  useEffect(() => {
    const handleSync = () => {
      try {
        const savedPersonaId =
          localStorage.getItem("skillnexus_active_persona") ||
          localStorage.getItem("skillnexus_persona") ||
          localStorage.getItem("active_persona_id");

        if (savedPersonaId) {
          const normalized = savedPersonaId === "sunita-rao" ? "dr-sunita-rao" : savedPersonaId;
          const found =
            DEMO_PERSONAS.find((p) => p.id === normalized) ||
            DEMO_PERSONAS.find((p) => p.id.includes(normalized.replace("dr-", "")));
          if (found) setCurrentPersona(found);
        }

        const savedStudent = localStorage.getItem("skillnexus_student_data");
        if (savedStudent) setStudentStore(JSON.parse(savedStudent));

        const savedEvaluator = localStorage.getItem("skillnexus_evaluator_data");
        if (savedEvaluator) setEvaluatorStore(JSON.parse(savedEvaluator));

        const savedRecruiter = localStorage.getItem("skillnexus_recruiter_data");
        if (savedRecruiter) setRecruiterStore(JSON.parse(savedRecruiter));
      } catch {
        // Ignore
      }
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("skillnexus_state_sync", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("skillnexus_state_sync", handleSync);
    };
  }, []);

  // Switching Persona cleanly transitions datasets and redirects
  const switchPersona = useCallback(
    (personaId: string, options: { redirect?: boolean } = { redirect: true }) => {
      const normalized = personaId === "sunita-rao" ? "dr-sunita-rao" : personaId;
      const target =
        DEMO_PERSONAS.find((p) => p.id === normalized) ||
        DEMO_PERSONAS.find((p) => p.id.includes(normalized.replace("dr-", ""))) ||
        DEMO_PERSONAS[0];

      setCurrentPersona(target);

      try {
        localStorage.setItem("skillnexus_active_persona", target.id);
        localStorage.setItem("skillnexus_persona", target.id);
        localStorage.setItem("active_persona_id", target.id);
        window.dispatchEvent(
          new CustomEvent("skillnexus_state_sync", { detail: { personaId: target.id } })
        );
      } catch {
        // Ignore
      }

      // Automatic Redirection
      if (options.redirect !== false) {
        const isEvaluatorRole =
          target.role === "evaluator" ||
          target.role === "institutional" ||
          target.id.includes("sunita");
        const isRecruiterRole = target.role === "recruiter" || target.id.includes("vikram");

        const targetPath = isEvaluatorRole
          ? "/dashboard/evaluator"
          : isRecruiterRole
          ? "/bounties"
          : "/dashboard";

        try {
          router.push(targetPath);
        } catch {
          if (typeof window !== "undefined") {
            window.location.assign(targetPath);
          }
        }
      }
    },
    [router]
  );

  // Student Actions
  const addVerifiedSkill = useCallback(
    (
      skillName: string,
      score: number,
      source: "Certificate" | "GitHub" | "SkillCheck" | "Bounty" | "MockInterview",
      category: SkillNode["category"] = "Backend"
    ) => {
      setStudentStore((prev) => {
        const existing = prev.skills.find(
          (s) => s.name.toLowerCase() === skillName.toLowerCase()
        );
        let updated: SkillNode[];
        if (existing) {
          updated = prev.skills.map((s) => {
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
            ...prev.skills,
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
        const next = { ...prev, skills: updated };
        persistState("skillnexus_student_data", next);
        return next;
      });
    },
    [persistState]
  );

  const awardBadge = useCallback(
    (badgeName: string) => {
      setStudentStore((prev) => {
        if (prev.verifiedBadges.includes(badgeName)) return prev;
        const updated = [badgeName, ...prev.verifiedBadges];
        const next = { ...prev, verifiedBadges: updated };
        persistState("skillnexus_student_data", next);
        return next;
      });
    },
    [persistState]
  );

  const addVerifiedCertificate = useCallback(
    (cert: CertificateRecord) => {
      setStudentStore((prev) => {
        const updated = [cert, ...prev.certificates.filter((c) => c.id !== cert.id)];
        const next = { ...prev, certificates: updated };
        persistState("skillnexus_student_data", next);
        return next;
      });

      cert.skillsAwarded.forEach((skill) => {
        addVerifiedSkill(skill, cert.confidenceScore, "Certificate");
      });

      // Update Arjun in cohort roster
      setEvaluatorStore((prev) => {
        const updatedCohort = prev.cohortStudents.map((s) => {
          if (s.studentId === "2026-CS-041" || s.id === "arjun-kumar") {
            return {
              ...s,
              verificationStatus: {
                ...s.verificationStatus,
                certificatesVerified: s.verificationStatus.certificatesVerified + 1,
              },
            };
          }
          return s;
        });
        const next = { ...prev, cohortStudents: updatedCohort };
        persistState("skillnexus_evaluator_data", next);
        return next;
      });

      awardBadge(`${cert.issuer} Verified: ${cert.courseTitle.slice(0, 24)}...`);
    },
    [addVerifiedSkill, awardBadge, persistState]
  );

  const updateGitHubProfile = useCallback(
    (telemetry: Partial<GitHubTelemetry>) => {
      setStudentStore((prev) => {
        const updated = {
          ...prev.github,
          ...telemetry,
          verifiedAt: new Date().toISOString(),
        };
        const next = { ...prev, github: updated };
        persistState("skillnexus_student_data", next);
        return next;
      });

      if (telemetry.codeQualityScore || telemetry.devTier) {
        setEvaluatorStore((prev) => {
          const updatedCohort = prev.cohortStudents.map((s) => {
            if (s.studentId === "2026-CS-041" || s.id === "arjun-kumar") {
              return {
                ...s,
                devTier: telemetry.devTier || s.devTier,
                verificationStatus: {
                  ...s.verificationStatus,
                  githubQualityScore:
                    telemetry.codeQualityScore || s.verificationStatus.githubQualityScore,
                },
              };
            }
            return s;
          });
          const next = { ...prev, cohortStudents: updatedCohort };
          persistState("skillnexus_evaluator_data", next);
          return next;
        });
      }

      if (telemetry.devTier) {
        awardBadge(`GitHub Verified Dev: ${telemetry.devTier}`);
      }
    },
    [awardBadge, persistState]
  );

  const recordBountyScore = useCallback(
    (
      bountyId: string,
      score: number,
      prUrl: string,
      tags: string[] = ["TypeScript", "Next.js"],
      company: string = "Industry Partner"
    ) => {
      setStudentStore((prev) => {
        const exists = prev.bounties.some((b) => b.id === bountyId);
        let updated: BountyChallenge[];
        if (exists) {
          updated = prev.bounties.map((b) => {
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
          updated = [newChallenge, ...prev.bounties];
        }
        const next = { ...prev, bounties: updated };
        persistState("skillnexus_student_data", next);
        return next;
      });

      const skillsToAward = tags && tags.length > 0 ? tags : ["Full-Stack Architecture", "TypeScript"];
      skillsToAward.forEach((skill) => {
        addVerifiedSkill(skill, score, "Bounty");
      });
      awardBadge(`Bounty Victor: ${company} (${score}%)`);
    },
    [addVerifiedSkill, awardBadge, persistState]
  );

  const addIssuedLOR = useCallback(
    (lor: LetterOfRecommendation) => {
      setStudentStore((prev) => {
        const updated = [lor, ...prev.lors];
        const next = { ...prev, lors: updated };
        persistState("skillnexus_student_data", next);
        return next;
      });

      setEvaluatorStore((prev) => {
        const updated = prev.cohortStudents.map((s) => {
          if (
            s.studentId === lor.studentId ||
            s.name.toLowerCase() === lor.studentName.toLowerCase() ||
            (lor.studentId === "2026-CS-041" && s.id === "arjun-kumar")
          ) {
            return {
              ...s,
              readinessScore: Math.min(99, s.readinessScore + 2),
              lorsIssuedCount: (s.lorsIssuedCount || 0) + 1,
            };
          }
          return s;
        });
        const next = {
          ...prev,
          cohortStudents: updated,
          institutionalMetrics: {
            ...prev.institutionalMetrics,
            lorsMinted: prev.institutionalMetrics.lorsMinted + 1,
          },
        };
        persistState("skillnexus_evaluator_data", next);
        return next;
      });

      if (lor.metricRatings.technicalProficiency >= 4) {
        addVerifiedSkill("Full-Stack Architecture", 94, "Certificate", "Backend");
      }
      if (lor.metricRatings.systemArchitecture >= 4) {
        addVerifiedSkill("System Design", 92, "Certificate", "System Design");
      }

      awardBadge(`Cryptographic LOR by ${lor.evaluatorName}`);
    },
    [addVerifiedSkill, awardBadge, persistState]
  );

  const toggleLORPortfolioDisplay = useCallback(
    (lorId: string) => {
      setStudentStore((prev) => {
        const updated = prev.lors.map((lor) => {
          if (lor.id === lorId) {
            return {
              ...lor,
              displayOnPortfolio: lor.displayOnPortfolio === false ? true : false,
            };
          }
          return lor;
        });
        const next = { ...prev, lors: updated };
        persistState("skillnexus_student_data", next);
        return next;
      });
    },
    [persistState]
  );

  const updateCohortStudent = useCallback(
    (studentId: string, updates: Partial<CohortStudent>) => {
      setEvaluatorStore((prev) => {
        const updated = prev.cohortStudents.map((s) => {
          if (s.studentId === studentId || s.id === studentId) {
            return { ...s, ...updates };
          }
          return s;
        });
        const next = { ...prev, cohortStudents: updated };
        persistState("skillnexus_evaluator_data", next);
        return next;
      });
    },
    [persistState]
  );

  // Evaluator Hub Actions: Approve & Flag
  const approveAuditClaim = useCallback(
    (claimId: string) => {
      setEvaluatorStore((prev) => {
        const claim = prev.pendingAudits.find((c) => c.id === claimId);
        if (!claim) return prev;

        const updatedAudits = prev.pendingAudits.map((c) =>
          c.id === claimId
            ? {
                ...c,
                status: "approved" as const,
                confidenceScore: Math.max(c.confidenceScore, 96),
              }
            : c
        );

        // Update student in cohort roster
        let updatedCohort = prev.cohortStudents;
        if (claim.studentId === "2026-CS-041") {
          updatedCohort = prev.cohortStudents.map((s) => {
            if (s.studentId === "2026-CS-041" || s.id === "arjun-kumar") {
              return {
                ...s,
                readinessScore: 96,
                verificationStatus: {
                  ...s.verificationStatus,
                  certificatesVerified: Math.max(
                    s.verificationStatus.certificatesVerified + 1,
                    s.verificationStatus.totalCertificates
                  ),
                  sandboxPassed: true,
                  githubQualityScore: Math.max(s.verificationStatus.githubQualityScore, 94),
                },
              };
            }
            return s;
          });

          // Cross-Persona Write-through: Commit directly to Arjun's isolated student profile
          setStudentStore((sPrev) => {
            let updatedSkills = [...sPrev.skills];
            claim.skills.forEach((skName) => {
              const ex = updatedSkills.find(
                (s) => s.name.toLowerCase() === skName.toLowerCase()
              );
              if (ex) {
                updatedSkills = updatedSkills.map((s) =>
                  s.name.toLowerCase() === skName.toLowerCase()
                    ? {
                        ...s,
                        score: Math.max(s.score, 95),
                        verified: true,
                        evidenceCount: s.evidenceCount + 1,
                      }
                    : s
                );
              } else {
                updatedSkills.push({
                  name: skName,
                  category: "Cloud/DevOps",
                  score: 95,
                  verified: true,
                  evidenceCount: 1,
                  sources: ["Certificate"],
                });
              }
            });

            const newCert: CertificateRecord = {
              id: `cert-approved-${Date.now()}`,
              studentName: claim.studentName,
              issuer: claim.issuer,
              courseTitle: claim.title,
              issueDate: "2026-09-06",
              verificationHash: `sha256-approved-dean-${Date.now()}`,
              confidenceScore: 98,
              status: "verified",
              tamperingFlags: [],
              skillsAwarded: claim.skills,
              credentialId: claim.credentialId,
              registryConfirmed: true,
            };

            const updatedCerts = [
              newCert,
              ...sPrev.certificates.filter((c) => c.credentialId !== claim.credentialId),
            ];
            const updatedBadges = Array.from(
              new Set([`${claim.issuer} Verified Credential`, ...sPrev.verifiedBadges])
            );

            const nextStudentStore = {
              ...sPrev,
              skills: updatedSkills,
              certificates: updatedCerts,
              verifiedBadges: updatedBadges,
            };
            persistState("skillnexus_student_data", nextStudentStore);
            return nextStudentStore;
          });
        }

        const nextEvaluatorStore = {
          ...prev,
          pendingAudits: updatedAudits,
          cohortStudents: updatedCohort,
          institutionalMetrics: {
            ...prev.institutionalMetrics,
            cohortMeanReadiness: 86.8,
          },
        };
        persistState("skillnexus_evaluator_data", nextEvaluatorStore);
        return nextEvaluatorStore;
      });
    },
    [persistState]
  );

  const flagAuditClaim = useCallback(
    (claimId: string, reason: string = "Suspected splicing or non-matching registry ID") => {
      setEvaluatorStore((prev) => {
        const updatedAudits = prev.pendingAudits.map((c) =>
          c.id === claimId
            ? {
                ...c,
                status: "flagged" as const,
                confidenceScore: 42,
                flagReason: reason,
                securityAuditTrail: `Dean Flagged on ${new Date().toLocaleTimeString()} - Reason: ${reason}`,
              }
            : c
        );

        const nextEvaluatorStore = {
          ...prev,
          pendingAudits: updatedAudits,
        };
        persistState("skillnexus_evaluator_data", nextEvaluatorStore);
        return nextEvaluatorStore;
      });
    },
    [persistState]
  );

  const resetToDefaults = useCallback(() => {
    setCurrentPersona(DEMO_PERSONAS[0]);
    setStudentStore(DEFAULT_STUDENT_STORE);
    setEvaluatorStore(DEFAULT_EVALUATOR_STORE);
    setRecruiterStore(DEFAULT_RECRUITER_STORE);
    try {
      localStorage.clear();
      localStorage.setItem("skillnexus_active_persona", "arjun-kumar");
      localStorage.setItem("skillnexus_persona", "arjun-kumar");
      localStorage.setItem("active_persona_id", "arjun-kumar");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("skillnexus_state_sync", { detail: { key: "all" } }));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Compute Persona-Specific Readiness Score
  // Student: (0.40 * Skills) + (0.25 * GitHub AST) + (0.20 * Certs) + (0.15 * Bounties)
  // Evaluator: Institutional Cohort Mean Readiness (86.4%)
  // Recruiter: Tier-1 Talent Pool Benchmark (91.2%)
  const readinessScore = useMemo(() => {
    const isEvaluatorRole =
      currentPersona.role === "evaluator" ||
      currentPersona.role === "institutional" ||
      currentPersona.id.includes("sunita");

    if (isEvaluatorRole) {
      return evaluatorStore.institutionalMetrics.cohortMeanReadiness;
    }

    const isRecruiterRole =
      currentPersona.role === "recruiter" || currentPersona.id.includes("vikram");

    if (isRecruiterRole) {
      return 91.2;
    }

    // Student Composite Readiness Formula
    const verifiedSkillsList = studentStore.skills.filter((s) => s.verified);
    const avgSkillScore =
      verifiedSkillsList.length > 0
        ? verifiedSkillsList.reduce((acc, s) => acc + s.score, 0) / verifiedSkillsList.length
        : 60;

    const githubWeight = studentStore.github.codeQualityScore;

    const verifiedCertList = studentStore.certificates.filter((c) => c.status === "verified");
    const avgCertScore =
      verifiedCertList.length > 0
        ? verifiedCertList.reduce((acc, c) => acc + c.confidenceScore, 0) /
          verifiedCertList.length
        : 75;

    const completedBounties = studentStore.bounties.filter((b) => b.status === "Completed");
    const bountyBonus = Math.min(100, completedBounties.length * 28 + 40);

    const aggregate = Math.round(
      avgSkillScore * 0.4 + githubWeight * 0.25 + avgCertScore * 0.2 + bountyBonus * 0.15
    );

    return Math.min(99, Math.max(10, aggregate));
  }, [currentPersona, evaluatorStore.institutionalMetrics, studentStore]);

  // Context Values scoped by Persona
  const isEvaluatorRole =
    currentPersona.role === "evaluator" ||
    currentPersona.role === "institutional" ||
    currentPersona.id.includes("sunita");
  const isRecruiterRole =
    currentPersona.role === "recruiter" || currentPersona.id.includes("vikram");

  return (
    <StudentContext.Provider
      value={{
        currentPersona,
        personas: DEMO_PERSONAS,
        switchPersona,
        skills: studentStore.skills,
        certificates: isEvaluatorRole || isRecruiterRole ? [] : studentStore.certificates,
        github: studentStore.github,
        bounties: isRecruiterRole ? recruiterStore.activeBountiesPosted : studentStore.bounties,
        lors: studentStore.lors,
        cohortStudents: isRecruiterRole
          ? recruiterStore.talentShortlist
          : evaluatorStore.cohortStudents,
        verifiedBadges: isEvaluatorRole
          ? ["Dean Verified Authority", "BOS Chair", "Institutional Gatekeeper"]
          : isRecruiterRole
          ? ["Verified Talent Partner", "Razorpay Tech Sponsor"]
          : studentStore.verifiedBadges,
        readinessScore,
        pendingAudits: evaluatorStore.pendingAudits,
        institutionalMetrics: evaluatorStore.institutionalMetrics,
        departmentSkillGaps: evaluatorStore.departmentSkillGaps,
        facultyDirective: evaluatorStore.facultyDirective,
        activeBountiesPosted: recruiterStore.activeBountiesPosted,
        talentShortlist: recruiterStore.talentShortlist,
        auditLogs: recruiterStore.auditLogs,
        addVerifiedSkill,
        addVerifiedCertificate,
        updateGitHubProfile,
        recordBountyScore,
        awardBadge,
        addIssuedLOR,
        toggleLORPortfolioDisplay,
        updateCohortStudent,
        approveAuditClaim,
        flagAuditClaim,
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

export const useStudentProfile = useStudentContext;
export const useStudent = useStudentContext;
