# Module 7 Bounty Board & Test Suite Plan

## Goal
Upgrade Module 7 (Industry Bounty Board) with live GitHub issues API, PR auto-grading, StudentContext persistence, and an end-to-end automated testing suite scripts/test-modules.mjs.

## Tasks
- [ ] Task 1: Declare Bounty, BountySubmissionRequest, and BountyGradingResult interfaces in src/lib/types.ts -> Verify: TypeScript compiles without errors.
- [ ] Task 2: Implement GET (GitHub issues fetch + 1h cache + fallback) and POST (PR link regex check + AST auto-grading + SHA-256 hash) in src/app/api/bounties/route.ts -> Verify: Handler returns valid responses for GET and POST.
- [ ] Task 3: Enhance src/context/student-context.tsx to handle bounty completions from both dynamic and mock models -> Verify: Context recomputes readiness score and awards badges.
- [ ] Task 4: Refactor src/app/bounties/page.tsx with live telemetry tag, claim timer, and submission modal with multi-step loader -> Verify: UI matches Linear dark monochrome styling and persists completions.
- [ ] Task 5: Create scripts/test-modules.mjs and add "test:modules" to package.json -> Verify: Run 
pm.cmd run test:modules and all 3 suites pass.
- [ ] Task 6: Run Next.js build & lint -> Verify: 
pm.cmd run build and 
pm.cmd run lint exit 0.

## Done When
- [ ] Live GitHub issues stream loads with fallback.
- [ ] PR submissions are auto-graded with SHA-256 receipt.
- [ ] All 3 test suites pass via 
pm run test:modules.
- [ ] Build passes with 0 errors.