export type DevTier = "Novice" | "Intermediate" | "Advanced" | "Elite Architect";

export type VerificationStatus = "verified" | "flagged" | "rejected" | "pending";

export interface SkillNode {
  name: string;
  category: "Frontend" | "Backend" | "Cloud/DevOps" | "AI/ML" | "System Design" | "Database";
  score: number; // 0 to 100
  verified: boolean;
  evidenceCount: number;
  sources: Array<"Certificate" | "GitHub" | "SkillCheck" | "Bounty" | "MockInterview">;
}

export interface CertificateRecord {
  id: string;
  studentName: string;
  issuer: string;
  courseTitle: string;
  issueDate: string;
  verificationHash: string;
  confidenceScore: number;
  status: VerificationStatus;
  tamperingFlags: string[];
  skillsAwarded: string[];
  rawMetadata?: {
    producer?: string;
    modifyDate?: string;
    software?: string;
    compressionHistory?: string;
    fileSizeBytes?: number;
  };
  credentialId?: string;
  verificationUrl?: string;
  rawExtractedText?: string;
  registryConfirmed?: boolean;
}

export interface ProductionSignals {
  hasTypeScript: boolean;
  hasCiCd: boolean;
  hasDocker: boolean;
  hasTesting: boolean;
}

export interface GitHubTelemetry {
  handle: string;
  avatarUrl?: string;
  isLive?: boolean;
  isBenchmarkCache?: boolean;
  totalRepos: number;
  starsCount: number;
  contributionsThisYear: number;
  topLanguages: { name: string; percentage: number; color: string }[];
  detectedStack: string[];
  devTier: DevTier;
  verifiedAt: string;
  codeQualityScore: number; // 0-100
  productionSignals?: ProductionSignals;
  recentActivity: { repo: string; commits: number; message: string }[];
}

export interface PathwayDayPlan {
  day: number;
  topic: string;
  curatedDocs: { title: string; url: string; timeEstimate: string }[];
  dailyTask: string;
  assessmentSnippetPrompt: string;
}

export interface BridgePathway {
  id: string;
  targetRole: string;
  companyName: string;
  missingSkills: string[];
  matchPercentage: number;
  sprintPlan: PathwayDayPlan[];
  createdAt: string;
}

export interface ChallengeTestCase {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expected: any;
  isSecret?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  skill: string;
  category?: "Frontend" | "Backend" | "Cloud/DevOps" | "AI/ML" | "System Design" | "Database";
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimitSeconds: number;
  instructions: string;
  starterCode: string;
  functionName?: string;
  testCases: { inputDescription: string; expectedKeywordPatterns: string[]; hint: string }[];
  executableTestCases?: ChallengeTestCase[];
  badgeName: string;
}

export interface MockInterviewQuestion {
  id: number;
  skill: string;
  question: string;
  context: string;
  expectedKeypoints: string[];
}

export interface MockInterviewFeedback {
  questionId: number;
  score: number; // 0-100
  critique: string;
  strengthPoints: string[];
  missingKeypoints: string[];
}

export interface BountyChallenge {
  id: string;
  title: string;
  company: string;
  logoUrl?: string;
  rewardINR: number;
  timeRemainingHours: number;
  difficulty: "Beginner" | "Intermediate" | "Hard" | "Expert";
  requiredSkills: string[];
  description: string;
  prSubmissionCount: number;
  testChecklist: string[];
  status: "Open" | "Reviewing" | "Completed";
  submittedPrUrl?: string;
  autoScorePreview?: number;
}

export interface Bounty {
  id: string;
  company: string;
  title: string;
  description: string;
  reward: string;
  difficulty: "Intermediate" | "Advanced" | "Elite Architect";
  tags: string[];
  repoUrl: string;
  timeLimitHours: number;
  status: "open" | "claimed" | "submitted" | "completed";
  claimedAt?: string;
}

export interface BountySubmissionRequest {
  bountyId: string;
  prUrl: string;
  studentId: string;
}

export interface BountyGradingResult {
  passed: boolean;
  score: number;
  checks: {
    branchCoverage: number;
    astStyleCompliance: boolean;
    codeCleanlinessScore: number;
    testSuitePassed: boolean;
  };
  readinessDelta: number;
  feedback: string;
  txHash: string;
}

export interface CapstoneStudent {
  id: string;
  name: string;
  college: string;
  primaryRole: "Frontend Engineer" | "Backend Engineer" | "AI/ML Specialist" | "Cloud & DevOps" | "UI/UX Designer";
  verifiedSkills: string[];
  readinessScore: number;
  avatarUrl: string;
}

export interface CapstoneSquad {
  id: string;
  projectDomain: string;
  recommendedTopic: string;
  synergyScore: number; // 0-100
  members: CapstoneStudent[];
  coverageMap: { domain: string; covered: boolean; responsibleStudent: string }[];
}

export interface LetterOfRecommendation {
  id: string;
  studentName: string;
  studentId: string;
  college: string;
  evaluatorName: string;
  evaluatorTitle: string;
  companyOrDept: string;
  metricRatings: {
    technicalProficiency: number; // 1-5
    systemArchitecture: number;
    problemSolving: number;
    communicationCollab: number;
    innovationInitiative: number;
  };
  recommendationBody: string;
  issuedAt: string;
  cryptographicHash: string;
  verificationBadgeToken: string;
  displayOnPortfolio?: boolean;
}

export interface CohortStudent {
  id: string;
  studentId: string;
  name: string;
  batch: string;
  department: string;
  college: string;
  readinessScore: number;
  devTier: DevTier;
  verificationStatus: {
    certificatesVerified: number;
    totalCertificates: number;
    githubQualityScore: number;
    sandboxPassed: boolean;
  };
  lorsIssuedCount: number;
  avatarUrl: string;
}

export interface MarketTrendSkill {
  skill: string;
  category: "Languages" | "Web & Cloud" | "AI & ML" | "Legacy / Obsolete";
  growthRatePercentage: number;
  activeOpeningsCount: number;
  averageSalaryLPA: number;
  trendStatus: "Surging" | "Steady" | "Deprecating";
  marketInsight: string;
}

export interface MarketDemandItem {
  technology: string;
  category: "Frontend" | "Backend" | "Cloud/DevOps" | "AI/ML";
  openPositions: number;
  trend: "surging" | "stable" | "declining";
  growthRatePercent: number;
  topLocations: string[];
  averageSalaryLPA: number;
  marketInsight: string;
}

export interface MarketDemandResponse {
  source: "live_adzuna" | "simulated_cache";
  timestamp: string;
  items: MarketDemandItem[];
  summary: {
    totalPositionsTracked: number;
    topSurgingTech: string;
    topHiringHub: string;
    activeCategoryCount: number;
  };
  cityBreakdown: {
    city: string;
    openPositions: number;
    topTech: string;
  }[];
}

export type PersonaType = "student" | "recruiter" | "faculty";

export interface PersonaProfile {
  id: string;
  type: PersonaType;
  role?: "student" | "evaluator" | "recruiter" | "institutional";
  name: string;
  title: string;
  organization: string;
  avatar: string;
}

export interface AuditEvidenceClaim {
  id: string;
  studentId: string;
  studentName: string;
  evidenceType: "Certificate" | "Sandbox" | "Bounty" | "GitHub";
  title: string;
  issuer: string;
  credentialId?: string;
  score: number;
  confidenceScore: number;
  dateUploaded: string;
  skills: string[];
  flagReason?: string;
  status: "pending" | "approved" | "flagged";
  securityAuditTrail?: string;
}

export interface DepartmentSkillGap {
  pillar: string;
  score: number;
  status: "Strong" | "Adequate" | "Moderate" | "Critical Deficit";
  color: string;
  textColor: string;
}

export interface InstitutionalMetrics {
  cohortSize: number;
  cohortMeanReadiness: number;
  lorsMinted: number;
  obsolescenceRiskDelta: number;
  placementVelocity: number;
}

export interface RecruiterAuditLog {
  id: string;
  action: string;
  targetCandidate: string;
  timestamp: string;
  verificationHash: string;
  status: "verified" | "flagged";
}
