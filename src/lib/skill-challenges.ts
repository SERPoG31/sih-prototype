import { Challenge } from "./types";

export const SKILL_CHALLENGES: Challenge[] = [
  {
    id: "challenge-ts-01",
    title: "Fix Race Condition in Async Debounce Hook",
    skill: "TypeScript & React",
    difficulty: "Medium",
    timeLimitSeconds: 180,
    instructions:
      "The custom hook below has a memory leak and race condition when unmounted during a pending timeout. Add proper cleanup in useEffect and use a ref or cleanup function to cancel the pending timer.",
    starterCode: `// Fix the unmount leak in this custom hook
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // BUG: Missing cleanup function!
    // TODO: return a cleanup function that cancels the timeout
    
  }, [value, delayMs]);

  return debouncedValue;
}`,
    testCases: [
      {
        inputDescription: "Cleanup timer on unmount",
        expectedKeywordPatterns: ["clearTimeout", "return () =>", "handler"],
        hint: "Return an arrow function inside useEffect that calls clearTimeout(handler)",
      },
    ],
    badgeName: "React Hook Concurrency Pro",
  },
  {
    id: "challenge-backend-02",
    title: "Implement Idempotent Cache Key Generator",
    skill: "Node.js & FastAPI",
    difficulty: "Medium",
    timeLimitSeconds: 180,
    instructions:
      "Ensure query params are sorted deterministically so identical queries with different param orders (e.g. ?b=2&a=1 vs ?a=1&b=2) produce the exact same cache hash.",
    starterCode: `// Complete the deterministic cache key generator
export function buildDeterministicCacheKey(endpoint: string, params: Record<string, string | number>): string {
  // Sort the keys alphabetically to avoid key divergence
  const sortedKeys = Object.keys(params).sort();
  
  // Construct query string: key1=val1&key2=val2
  const serialized = sortedKeys
    .map(key => \`\${key}=\${params[key]}\`)
    .join('&');

  // Return the normalized key format: [METHOD/PATH]?[PARAMS]
  return \`\${endpoint}?\${serialized}\`;
}`,
    testCases: [
      {
        inputDescription: "Sort keys alphabetically and serialize with join",
        expectedKeywordPatterns: ["sort", "map", "join"],
        hint: "Make sure you use sort(), map(), and join('&')",
      },
    ],
    badgeName: "Idempotent API Specialist",
  },
  {
    id: "challenge-db-03",
    title: "SQL Index Optimization Query",
    skill: "PostgreSQL & Redis",
    difficulty: "Hard",
    timeLimitSeconds: 180,
    instructions:
      "Write a query to fetch the top 5 highest spending verified users without causing a full table scan. Use an index-friendly compound WHERE and ORDER BY clause.",
    starterCode: `-- Optimize query to leverage idx_users_status_spending
-- Columns: user_id, status ('VERIFIED', 'PENDING'), total_spent_cents, created_at
SELECT user_id, total_spent_cents
FROM user_transactions
WHERE status = 'VERIFIED'
ORDER BY total_spent_cents DESC
LIMIT 5;`,
    testCases: [
      {
        inputDescription: "Correct index filter and ordering",
        expectedKeywordPatterns: ["SELECT", "WHERE status = 'VERIFIED'", "ORDER BY total_spent_cents DESC", "LIMIT 5"],
        hint: "Ensure exact filter match on 'VERIFIED' with descending order and limit 5",
      },
    ],
    badgeName: "PostgreSQL Query Optimizer",
  },
  {
    id: "challenge-docker-04",
    title: "Multi-Stage Dockerfile Size Reducer",
    skill: "Docker & Kubernetes",
    difficulty: "Medium",
    timeLimitSeconds: 180,
    instructions:
      "Complete the production stage of this multi-stage Docker build to copy standalone Next.js artifacts and run as a non-root user (node).",
    starterCode: `# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# COPY artifacts from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]`,
    testCases: [
      {
        inputDescription: "Multi-stage builder artifact copy with chown and USER directive",
        expectedKeywordPatterns: ["COPY --from=builder", "USER nextjs", "CMD [\"node\", \"server.js\"]"],
        hint: "Ensure COPY --from=builder, USER nextjs, and CMD node server.js are specified",
      },
    ],
    badgeName: "Container Security & Efficiency Pro",
  },
];
