import { Challenge } from "./types";

export const SKILL_CHALLENGES: Challenge[] = [
  {
    id: "challenge-sliding-rate-limiter",
    title: "Sliding Window Rate Limiter",
    skill: "System Design & Concurrency",
    category: "System Design",
    difficulty: "Medium",
    timeLimitSeconds: 180,
    functionName: "checkRateLimit",
    badgeName: "Redis Rate Limiting - Verified via Sandbox",
    instructions:
      "Implement a sliding window rate limiter in memory. Given an array of historical request timestamps (in ms), a max request limit, a window duration (in ms), and the current request timestamp, return true if the current request is allowed, or false if it exceeds the limit. Only count previous timestamps strictly within [currentTimestamp - windowMs, currentTimestamp].",
    starterCode: `/**
 * Sliding Window Rate Limiter
 * @param {number[]} timestamps - Historical request timestamps (ms)
 * @param {number} maxLimit - Max allowed requests per window
 * @param {number} windowMs - Window duration in milliseconds
 * @param {number} currentTimestamp - Incoming request timestamp (ms)
 * @returns {boolean} - true if allowed, false if rejected
 */
function checkRateLimit(timestamps, maxLimit, windowMs, currentTimestamp) {
  const windowStart = currentTimestamp - windowMs;
  
  // Filter historical timestamps that fall strictly within the current sliding window
  const activeRequests = timestamps.filter(t => t >= windowStart && t <= currentTimestamp);
  
  // Check if adding the incoming request exceeds maxLimit
  return activeRequests.length < maxLimit;
}`,
    testCases: [
      {
        inputDescription: "Filter active requests by windowStart",
        expectedKeywordPatterns: ["filter", "windowStart", "<="],
        hint: "Calculate windowStart = currentTimestamp - windowMs and filter valid timestamps.",
      },
    ],
    executableTestCases: [
      {
        name: "Test 1: Normal traffic within sliding window limit",
        args: [[1000, 2000, 3000], 5, 10000, 4000],
        expected: true,
      },
      {
        name: "Test 2: Burst excess traffic exceeding threshold",
        args: [[1000, 2000, 3000, 4000, 5000], 5, 10000, 6000],
        expected: false,
      },
      {
        name: "Test 3: Window expiration reset (Edge case)",
        args: [[1000, 2000, 3000, 4000, 5000], 5, 5000, 7500],
        expected: true,
      },
    ],
  },
  {
    id: "challenge-array-dedupe-order",
    title: "Array Deduplication with Order Preservation",
    skill: "TypeScript & Data Structures",
    category: "Backend",
    difficulty: "Easy",
    timeLimitSeconds: 180,
    functionName: "dedupePreserveOrder",
    badgeName: "O(N) Set Deduplication - Verified via Sandbox",
    instructions:
      "Deduplicate an array in O(N) linear time while strictly preserving the first-seen insertion order of all elements. Handle mixed strings, numbers, and boundary types without quadratic nested loops.",
    starterCode: `/**
 * Deduplicate array while preserving insertion order
 * @param {Array<string|number>} items
 * @returns {Array<string|number>}
 */
function dedupePreserveOrder(items) {
  const seen = new Set();
  const result = [];
  
  for (const item of items) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  
  return result;
}`,
    testCases: [
      {
        inputDescription: "Use Set for O(N) lookup and preserve order",
        expectedKeywordPatterns: ["Set", "has", "add"],
        hint: "Use new Set() to track seen keys and push to an accumulator array.",
      },
    ],
    executableTestCases: [
      {
        name: "Test 1: Deduplicate numeric sequence preserving order",
        args: [[3, 1, 3, 2, 1, 4, 2]],
        expected: [3, 1, 2, 4],
      },
      {
        name: "Test 2: Deduplicate string array with duplicate occurrences",
        args: [["alpha", "beta", "alpha", "gamma", "beta"]],
        expected: ["alpha", "beta", "gamma"],
      },
      {
        name: "Test 3: Preserve distinct zero and string '0' representations",
        args: [[0, "0", false, 0, "0"]],
        expected: [0, "0", false],
      },
    ],
  },
  {
    id: "challenge-cache-key-builder",
    title: "Deterministic API Cache Key Builder",
    skill: "Backend Architecture",
    category: "Backend",
    difficulty: "Medium",
    timeLimitSeconds: 180,
    functionName: "buildDeterministicCacheKey",
    badgeName: "Idempotent Cache Architecture - Verified via Sandbox",
    instructions:
      "Construct a canonical cache key by sorting query parameters alphabetically. Ensure identical query objects with different key insertion orders produce the identical normalized string formatted as 'endpoint?k1=v1&k2=v2'. If params is empty, return just the endpoint.",
    starterCode: `/**
 * Build deterministic sorted cache key
 * @param {string} endpoint - Base URL or path
 * @param {Record<string, string|number>} params - Query parameters
 * @returns {string} - Normalized cache key
 */
function buildDeterministicCacheKey(endpoint, params) {
  const keys = Object.keys(params).sort();
  if (keys.length === 0) return endpoint;
  
  const queryString = keys
    .map(k => \`\${k}=\${params[k]}\`)
    .join('&');
    
  return \`\${endpoint}?\${queryString}\`;
}`,
    testCases: [
      {
        inputDescription: "Sort keys alphabetically and serialize with join",
        expectedKeywordPatterns: ["sort", "map", "join"],
        hint: "Sort Object.keys(params) and join with '&'.",
      },
    ],
    executableTestCases: [
      {
        name: "Test 1: Unordered market query parameters sorted deterministically",
        args: ["/api/market", { city: "Bengaluru", stack: "Rust", page: 1 }],
        expected: "/api/market?city=Bengaluru&page=1&stack=Rust",
      },
      {
        name: "Test 2: Permuted keys produce identical normalized hash string",
        args: ["/api/v1/jobs", { z: 9, a: 1, m: 5 }],
        expected: "/api/v1/jobs?a=1&m=5&z=9",
      },
      {
        name: "Test 3: Empty query parameter dictionary returns endpoint without trailing ?",
        args: ["/api/health", {}],
        expected: "/api/health",
      },
    ],
  },
];
