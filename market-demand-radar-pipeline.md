# Module 10 Dynamic Market Demand Pipeline Plan

## Goal
Refactor Module 10 (Market Demand Radar) from static mock data to a dynamic Adzuna Jobs API pipeline with 24h caching, fault-tolerant benchmark fallback, and Linear dark monochrome UI.

## Tasks
- [ ] Task 1: Add MarketDemandItem and MarketDemandResponse interfaces in src/lib/types.ts -> Verify: TypeScript compiles without errors.
- [ ] Task 2: Create API Route Handler src/app/api/market/route.ts with Adzuna fetch, 24h cache (
ext: { revalidate: 86400 }), and deterministic benchmark fallback with source flag -> Verify: GET /api/market returns HTTP 200 JSON with required fields.
- [ ] Task 3: Refactor src/components/charts/market-trend-chart.tsx to support MarketDemandItem and monochrome/emerald styling -> Verify: Chart renders properly without purple gradients.
- [ ] Task 4: Refactor src/app/dashboard/market/page.tsx to fetch from /api/market, render live status indicator (LIVE TELEMETRY: ADZUNA (IN) vs BENCHMARK CACHE), and display city vacancy breakdown -> Verify: Page renders live/cache state, category filters, and metric toggles.
- [ ] Task 5: Run linter and Next.js production build -> Verify: 
pm.cmd run lint (0 errors) and 
pm.cmd run build (exit code 0).

## Done When
- [ ] /api/market returns aggregated Indian tech job telemetry with source: 'live_adzuna' | 'simulated_cache'.
- [ ] /dashboard/market displays status dot badge, dynamic items across 4 core stacks, and strict Linear monochrome styling.
- [ ] Build and lint pass with 0 errors.