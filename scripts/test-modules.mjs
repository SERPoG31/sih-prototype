#!/usr/bin/env node
import { spawn } from "node:child_process";
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
let spawnedServer = null;

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

function logPass(msg) {
  console.log(`  ${colors.green}✓${colors.reset} ${msg}`);
}

function logFail(msg, err) {
  console.error(`  ${colors.red}✗${colors.reset} ${msg}`);
  if (err) {
    console.error(`    ${colors.dim}${err.message || err}${colors.reset}`);
  }
}

async function isServerAlive(url) {
  try {
    const res = await fetch(`${url}/api/market`, { method: "GET" });
    return res.status === 200;
  } catch {
    return false;
  }
}

async function ensureServerRunning() {
  const alive = await isServerAlive(BASE_URL);
  if (alive) {
    console.log(`${colors.cyan}ℹ Found active Next.js instance on ${BASE_URL}${colors.reset}\n`);
    return;
  }

  console.log(`${colors.yellow}⚠ No active server on ${BASE_URL}. Spawning Next.js instance...${colors.reset}`);
  const isWindows = process.platform === "win32";
  const cmd = isWindows ? "npx.cmd" : "npx";

  spawnedServer = spawn(cmd, ["next", "dev", "-p", "3000"], {
    cwd: process.cwd(),
    stdio: "pipe",
    shell: isWindows,
  });

  const startTime = Date.now();
  while (Date.now() - startTime < 35000) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await isServerAlive(BASE_URL)) {
      console.log(`${colors.green}✓ Next.js server spawned successfully on ${BASE_URL}${colors.reset}\n`);
      return;
    }
  }

  throw new Error(`Server failed to start on ${BASE_URL} within 35 seconds.`);
}

async function runSuite1() {
  console.log(`${colors.bold}${colors.blue}[SUITE 1] Module 10: Market Demand Radar API (/api/market)${colors.reset}`);
  const res = await fetch(`${BASE_URL}/api/market`);
  assert.equal(res.status, 200, `Expected HTTP 200, got ${res.status}`);
  logPass("GET /api/market returns HTTP 200 OK");

  const data = await res.json();

  // Validate source
  assert.ok(
    data.source === "live_adzuna" || data.source === "simulated_cache",
    `Unexpected source: ${data.source}`
  );
  logPass(`Telemetry source verified: "${data.source}"`);

  // Validate items array
  assert.ok(Array.isArray(data.items), "data.items is not an array");
  assert.ok(data.items.length > 0, "data.items array is empty");
  logPass(`Items array populated with ${data.items.length} technology demand profiles`);

  const firstItem = data.items[0];
  assert.ok(firstItem.technology, "First item missing technology");
  assert.ok(firstItem.openPositions > 0, "openPositions is non-positive");
  assert.ok(firstItem.category, "First item missing category");
  logPass(`Individual item schema valid (Sample: ${firstItem.technology} - ${firstItem.openPositions} positions)`);

  // Validate timestamp
  assert.ok(data.timestamp, "Missing timestamp");
  assert.ok(!isNaN(Date.parse(data.timestamp)), "Invalid timestamp format");
  logPass(`Timestamp valid: ${data.timestamp}`);

  // Validate city breakdown
  assert.ok(Array.isArray(data.cityBreakdown), "cityBreakdown is not an array");
  const cities = data.cityBreakdown.map((c) => c.city);
  const requiredCities = ["Bengaluru", "Hyderabad", "Pune", "Delhi/NCR"];
  for (const city of requiredCities) {
    assert.ok(cities.includes(city), `Missing Indian hiring hub: ${city}`);
  }
  logPass(`City breakdown contains all targeted tech hubs: ${requiredCities.join(", ")}`);
}

async function runSuite2() {
  console.log(`\n${colors.bold}${colors.blue}[SUITE 2] Module 7: Bounty Board GET API (/api/bounties)${colors.reset}`);
  const res = await fetch(`${BASE_URL}/api/bounties`);
  assert.equal(res.status, 200, `Expected HTTP 200, got ${res.status}`);
  logPass("GET /api/bounties returns HTTP 200 OK");

  const data = await res.json();

  // Validate source
  assert.ok(
    data.source === "live_github_issues" || data.source === "simulated_fallback",
    `Unexpected source: ${data.source}`
  );
  logPass(`Telemetry source verified: "${data.source}"`);

  // Validate bounties array
  assert.ok(Array.isArray(data.bounties), "bounties is not an array");
  assert.ok(data.bounties.length > 0, "bounties array is empty");
  logPass(`Bounties list populated with ${data.bounties.length} available challenges`);

  // Validate structure of each bounty
  for (let i = 0; i < Math.min(data.bounties.length, 5); i++) {
    const b = data.bounties[i];
    assert.ok(b.id, `Bounty [${i}] missing id`);
    assert.ok(b.title, `Bounty [${i}] missing title`);
    assert.ok(b.reward, `Bounty [${i}] missing reward`);
    assert.ok(b.repoUrl, `Bounty [${i}] missing repoUrl`);
    assert.equal(b.timeLimitHours, 48, `Bounty [${i}] timeLimitHours must be 48`);
  }
  logPass("Bounty items validated: strict schema (id, title, reward, repoUrl, 48h sprint window)");
}

async function runSuite3() {
  console.log(`\n${colors.bold}${colors.blue}[SUITE 3] Module 7: Bounty Board POST Auto-Grading API (/api/bounties)${colors.reset}`);

  // 3A: Valid submission
  const validPayload = {
    bountyId: "gh-test-1",
    prUrl: "https://github.com/facebook/react/pull/28000",
    studentId: "arjun-kumar",
  };

  const validRes = await fetch(`${BASE_URL}/api/bounties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validPayload),
  });

  assert.equal(validRes.status, 200, `Expected HTTP 200 for valid PR, got ${validRes.status}`);
  const validData = await validRes.json();

  assert.equal(validData.passed, true, "Grading result should pass");
  assert.ok(validData.score >= 70, `Score expected >= 70, got ${validData.score}`);
  assert.equal(typeof validData.txHash, "string", "txHash is not a string");
  assert.equal(validData.txHash.length, 64, `txHash must be 64-char SHA-256, got length ${validData.txHash.length}`);
  assert.ok(validData.checks, "checks object missing");
  assert.ok(validData.checks.branchCoverage >= 90, "branchCoverage check missing or < 90");
  assert.equal(validData.checks.astStyleCompliance, true, "astStyleCompliance must be true");
  assert.equal(validData.checks.testSuitePassed, true, "testSuitePassed must be true");
  logPass(`Valid PR evaluated: Passed with score ${validData.score}%, SHA-256 txHash: ${validData.txHash.slice(0, 16)}...`);

  // 3B: Invalid PR URL (regex check)
  const invalidPayload = {
    bountyId: "gh-test-1",
    prUrl: "https://invalid-site.com/repo",
    studentId: "arjun-kumar",
  };

  const invalidRes = await fetch(`${BASE_URL}/api/bounties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invalidPayload),
  });

  assert.equal(invalidRes.status, 400, `Expected HTTP 400 for invalid PR URL, got ${invalidRes.status}`);
  const invalidData = await invalidRes.json();
  assert.ok(invalidData.error, "Expected error message in response body");
  assert.ok(
    invalidData.error.toLowerCase().includes("pull request"),
    `Error message did not mention pull request: ${invalidData.error}`
  );
  logPass("Invalid PR URL rejected: HTTP 400 Bad Request with regex validation error");

  // 3C: Missing parameters check
  const missingRes = await fetch(`${BASE_URL}/api/bounties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  assert.equal(missingRes.status, 400, `Expected HTTP 400 for missing params, got ${missingRes.status}`);
  logPass("Missing payload parameters rejected: HTTP 400 Bad Request");
}

async function main() {
  console.log(`\n======================================================`);
  console.log(` SKILLNEXUS E2E TEST SUITE: MODULE 7 & MODULE 10`);
  console.log(`======================================================\n`);

  let exitCode = 0;

  try {
    await ensureServerRunning();
    await runSuite1();
    await runSuite2();
    await runSuite3();

    console.log(`\n======================================================`);
    console.log(` ${colors.green}ALL 3 MODULE TEST SUITES PASSED VERIFICATION${colors.reset}`);
    console.log(`======================================================\n`);
  } catch (err) {
    logFail("Test suite execution failed", err);
    exitCode = 1;
  } finally {
    if (spawnedServer) {
      console.log(`${colors.dim}Stopping spawned Next.js instance...${colors.reset}`);
      spawnedServer.kill("SIGTERM");
    }
    process.exit(exitCode);
  }
}

main();
