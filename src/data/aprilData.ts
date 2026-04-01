/**
 * April 2026 MTD data — queried from Snowflake on 2026-04-01
 * This file contains month-specific data for the April month toggle.
 */
import {
  Country,
  CountryOverview,
  DailyOverviewRow,
  MtdSpendRawRow,
  CancellationRawRow,
  CompletedPaidRawRow,
  IResReservationRow,
} from '../types/index';

export const DATA_LAST_UPDATED_APR = '2026-04-01T10:00:00.000000Z';

/* ── Overview by country ── */
export const overviewByCountryApr: Record<Country, CountryOverview> = {
  uk: {
    current: {
      jobs: 2, ttv: 768.00, avgTtv: 384.00, avFee: 188.40,
      marginPct: 24.53, allocSpend: 5141.71, spendTtvPct: 669.49,
      otdCancels: 0, cantSourceCount: 0, cantSourceRate: 0,
      tpCancels: 0, deallocations: 30, otdDeallocations: 30,
      otdDealloPct: 1500, otdAllocSpend: 190, noSpendJobs: 0,
      noSpendPct: 0, otdAllocatedJobs: 0, furnRoutedPct: 0,
      tpCancelRate: 0,
    },
    priorYear: {
      jobs: 1081, ttv: 270814.66, avgTtv: 250.52, avFee: 114103.31,
      marginPct: 42.14, allocSpend: 5095.02, spendTtvPct: 1.88,
      otdCancels: 14, cantSourceCount: 3, cantSourceRate: 0.28,
      tpCancels: 6, deallocations: 93, otdDeallocations: 93,
      otdDealloPct: 8.60, otdAllocSpend: 2730, noSpendJobs: 0,
      noSpendPct: 0, otdAllocatedJobs: 68, furnRoutedPct: 85.98,
      tpCancelRate: 0.55,
    },
    dailyCY: [
      { day: 1, jobs: 2, ttv: 768.00, avFee: 188.40, allocSpend: 5141.71, cantSource: 0, tpCancels: 0, otdDealloCount: 30, furnRouted: 0, furnTotal: 1 },
    ],
    dailyPY: [
      { day: 1, jobs: 1081, ttv: 270814.66, avFee: 114103.31, allocSpend: 5095.02, cantSource: 3, tpCancels: 6, otdDealloCount: 93, furnRouted: 705, furnTotal: 820 },
    ],
  },
  spain: {
    current: {
      jobs: 0, ttv: 0, avgTtv: 0, avFee: 0,
      marginPct: 0, allocSpend: 2380.74, spendTtvPct: 0,
      otdCancels: 0, cantSourceCount: 0, cantSourceRate: 0,
      tpCancels: 0, deallocations: 1, otdDeallocations: 1,
      otdDealloPct: 0, otdAllocSpend: 0, noSpendJobs: 0,
      noSpendPct: 0, otdAllocatedJobs: 0, furnRoutedPct: 0,
      tpCancelRate: 0,
    },
    priorYear: {
      jobs: 34, ttv: 16125.37, avgTtv: 474.28, avFee: 3118.50,
      marginPct: 19.34, allocSpend: 1172.88, spendTtvPct: 7.27,
      otdCancels: 1, cantSourceCount: 0, cantSourceRate: 0,
      tpCancels: 0, deallocations: 2, otdDeallocations: 2,
      otdDealloPct: 5.88, otdAllocSpend: 163, noSpendJobs: 0,
      noSpendPct: 0, otdAllocatedJobs: 2, furnRoutedPct: 0,
      tpCancelRate: 0,
    },
    dailyCY: [
      { day: 1, jobs: 0, ttv: 0, avFee: 0, allocSpend: 2380.74, cantSource: 0, tpCancels: 0, otdDealloCount: 1, furnRouted: 0, furnTotal: 0 },
    ],
    dailyPY: [
      { day: 1, jobs: 34, ttv: 16125.37, avFee: 3118.50, allocSpend: 1172.88, cantSource: 0, tpCancels: 0, otdDealloCount: 2, furnRouted: 0, furnTotal: 0 },
    ],
  },
  france: {
    current: {
      jobs: 0, ttv: 0, avgTtv: 0, avFee: 0,
      marginPct: 0, allocSpend: 296, spendTtvPct: 0,
      otdCancels: 0, cantSourceCount: 0, cantSourceRate: 0,
      tpCancels: 0, deallocations: 1, otdDeallocations: 1,
      otdDealloPct: 0, otdAllocSpend: 0, noSpendJobs: 0,
      noSpendPct: 0, otdAllocatedJobs: 0, furnRoutedPct: 0,
      tpCancelRate: 0,
    },
    priorYear: {
      jobs: 0, ttv: 0, avgTtv: 0, avFee: 0,
      marginPct: 0, allocSpend: 0, spendTtvPct: 0,
      otdCancels: 3, cantSourceCount: 0, cantSourceRate: 0,
      tpCancels: 0, deallocations: 0, otdDeallocations: 0,
      otdDealloPct: 0, otdAllocSpend: 0, noSpendJobs: 0,
      noSpendPct: 0, otdAllocatedJobs: 0, furnRoutedPct: 0,
      tpCancelRate: 0,
    },
    dailyCY: [
      { day: 1, jobs: 0, ttv: 0, avFee: 0, allocSpend: 296, cantSource: 0, tpCancels: 0, otdDealloCount: 1, furnRouted: 0, furnTotal: 0 },
    ],
    dailyPY: [
      { day: 1, jobs: 0, ttv: 0, avFee: 0, allocSpend: 0, cantSource: 0, tpCancels: 0, otdDealloCount: 0, furnRouted: 0, furnTotal: 0 },
    ],
  },
};

/* ── Daily overview by category (Q11) ── */
export const dailyOverviewByCountryApr: Record<string, { cy: DailyOverviewRow[]; py: DailyOverviewRow[] }> = {
  uk: {
    cy: [
      { day: '2026-04-01', category: 'Car', jobs: 1, ttv: 406.00, avFee: 46.00, allocSpend: 2849, otdCancels: 0, tpCancels: 0, cantSourceCount: 0, deallocations: 2, otdDeallocations: 2, noSpendJobs: 0, otdAllocatedJobs: 0 },
      { day: '2026-04-01', category: 'Furniture', jobs: 1, ttv: 362.00, avFee: 142.40, allocSpend: 1201.72, otdCancels: 0, tpCancels: 0, cantSourceCount: 0, deallocations: 26, otdDeallocations: 25, noSpendJobs: 0, otdAllocatedJobs: 0 },
      { day: '2026-04-01', category: 'Home Removal', jobs: 0, ttv: 0, avFee: 0, allocSpend: 879.99, otdCancels: 0, tpCancels: 0, cantSourceCount: 0, deallocations: 2, otdDeallocations: 2, noSpendJobs: 0, otdAllocatedJobs: 0 },
      { day: '2026-04-01', category: 'Motorbike', jobs: 0, ttv: 0, avFee: 0, allocSpend: 83, otdCancels: 0, tpCancels: 0, cantSourceCount: 0, deallocations: 0, otdDeallocations: 0, noSpendJobs: 0, otdAllocatedJobs: 0 },
      { day: '2026-04-01', category: 'Piano', jobs: 0, ttv: 0, avFee: 0, allocSpend: 128, otdCancels: 0, tpCancels: 0, cantSourceCount: 0, deallocations: 0, otdDeallocations: 0, noSpendJobs: 0, otdAllocatedJobs: 0 },
    ],
    py: [
      { day: '2025-04-01', category: 'Car', jobs: 79, ttv: 25300.00, avFee: 5070.99, allocSpend: 769.60, otdCancels: 4, tpCancels: 0, cantSourceCount: 3, deallocations: 3, otdDeallocations: 3, noSpendJobs: 0, otdAllocatedJobs: 3 },
      { day: '2025-04-01', category: 'Furniture', jobs: 820, ttv: 132689.35, avFee: 53370.67, allocSpend: 2103.40, otdCancels: 8, tpCancels: 4, cantSourceCount: 0, deallocations: 76, otdDeallocations: 72, noSpendJobs: 0, otdAllocatedJobs: 53 },
      { day: '2025-04-01', category: 'Home Removal', jobs: 172, ttv: 110597.31, avFee: 54942.65, allocSpend: 2205.02, otdCancels: 2, tpCancels: 2, cantSourceCount: 0, deallocations: 14, otdDeallocations: 12, noSpendJobs: 0, otdAllocatedJobs: 12 },
      { day: '2025-04-01', category: 'Motorbike', jobs: 7, ttv: 1280.00, avFee: 281.00, allocSpend: 17, otdCancels: 0, tpCancels: 0, cantSourceCount: 0, deallocations: 0, otdDeallocations: 0, noSpendJobs: 0, otdAllocatedJobs: 0 },
      { day: '2025-04-01', category: 'Piano', jobs: 3, ttv: 948.00, avFee: 438.00, allocSpend: 0, otdCancels: 0, tpCancels: 0, cantSourceCount: 0, deallocations: 0, otdDeallocations: 0, noSpendJobs: 0, otdAllocatedJobs: 0 },
    ],
  },
  spain: {
    cy: [
      { day: '2026-04-01', category: 'Furniture', jobs: 0, ttv: 0, avFee: 0, allocSpend: 933.46, otdCancels: 0, tpCancels: 0, cantSourceCount: 0, deallocations: 1, otdDeallocations: 1, noSpendJobs: 0, otdAllocatedJobs: 0 },
      { day: '2026-04-01', category: 'Home Removal', jobs: 0, ttv: 0, avFee: 0, allocSpend: 1447.28, otdCancels: 0, tpCancels: 0, cantSourceCount: 0, deallocations: 0, otdDeallocations: 0, noSpendJobs: 0, otdAllocatedJobs: 0 },
    ],
    py: [
      { day: '2025-04-01', category: 'Home Removal', jobs: 34, ttv: 16125.37, avFee: 3118.50, allocSpend: 1172.88, otdCancels: 0, tpCancels: 0, cantSourceCount: 0, deallocations: 2, otdDeallocations: 2, noSpendJobs: 0, otdAllocatedJobs: 2 },
    ],
  },
  france: {
    cy: [
      { day: '2026-04-01', category: 'Furniture', jobs: 0, ttv: 0, avFee: 0, allocSpend: 148, otdCancels: 0, tpCancels: 0, cantSourceCount: 0, deallocations: 1, otdDeallocations: 1, noSpendJobs: 0, otdAllocatedJobs: 0 },
      { day: '2026-04-01', category: 'Home Removal', jobs: 0, ttv: 0, avFee: 0, allocSpend: 148, otdCancels: 0, tpCancels: 0, cantSourceCount: 0, deallocations: 0, otdDeallocations: 0, noSpendJobs: 0, otdAllocatedJobs: 0 },
    ],
    py: [
      { day: '2025-04-01', category: 'Furniture', jobs: 0, ttv: 0, avFee: 0, allocSpend: 0, otdCancels: 1, tpCancels: 0, cantSourceCount: 0, deallocations: 0, otdDeallocations: 0, noSpendJobs: 0, otdAllocatedJobs: 0 },
      { day: '2025-04-01', category: 'Home Removal', jobs: 0, ttv: 0, avFee: 0, allocSpend: 0, otdCancels: 2, tpCancels: 0, cantSourceCount: 0, deallocations: 0, otdDeallocations: 0, noSpendJobs: 0, otdAllocatedJobs: 0 },
    ],
  },
};

/* ── Furn routing lookup ── */
export const furnRoutingByCountryApr: Record<string, Record<string, { routed: number; total: number }>> = {
  uk: { '2026-04-01|Furniture': { routed: 0, total: 1 } },
  spain: {},
  france: {},
};

/* ── TP cancels lookup ── */
export const tpCancelsByCountryApr: Record<string, Record<string, number>> = {
  uk: {},
  spain: {},
  france: {},
};

/* ── Spend MTD raw (Q19) — CY day 1, PY empty for now ── */
export const mtdRaw2026Apr: MtdSpendRawRow[] = [
  { d: 1, n: 'East Midlands (England)', c: 'Car', s: 355, t: 0 },
  { d: 1, n: 'East Midlands (England)', c: 'Furniture', s: 27.78, t: 0 },
  { d: 1, n: 'East of England', c: 'Car', s: 349, t: 0 },
  { d: 1, n: 'East of England', c: 'Furniture', s: 28.69, t: 0 },
  { d: 1, n: 'East of England', c: 'Home Removal', s: 26, t: 0 },
  { d: 1, n: 'East of England', c: 'Piano', s: 36, t: 0 },
  { d: 1, n: 'London', c: 'Car', s: 184, t: 0 },
  { d: 1, n: 'London', c: 'Furniture', s: 226.6, t: 0 },
  { d: 1, n: 'London', c: 'Motorbike', s: 33, t: 0 },
  { d: 1, n: 'North East (England)', c: 'Car', s: 74, t: 0 },
  { d: 1, n: 'North East (England)', c: 'Furniture', s: 25, t: 0 },
  { d: 1, n: 'North West (England)', c: 'Car', s: 392, t: 406 },
  { d: 1, n: 'North West (England)', c: 'Furniture', s: 142.29, t: 362 },
  { d: 1, n: 'Northern Ireland', c: 'Furniture', s: 19, t: 0 },
  { d: 1, n: 'Northern Ireland', c: 'Home Removal', s: 151, t: 0 },
  { d: 1, n: 'Scotland', c: 'Car', s: 206, t: 0 },
  { d: 1, n: 'Scotland', c: 'Furniture', s: 79.99, t: 0 },
  { d: 1, n: 'Scotland', c: 'Home Removal', s: 332.99, t: 0 },
  { d: 1, n: 'Scotland', c: 'Motorbike', s: 50, t: 0 },
  { d: 1, n: 'Scotland', c: 'Piano', s: 48, t: 0 },
  { d: 1, n: 'South East (England)', c: 'Car', s: 719, t: 0 },
  { d: 1, n: 'South East (England)', c: 'Furniture', s: 315.4, t: 0 },
  { d: 1, n: 'South West (England)', c: 'Car', s: 335, t: 0 },
  { d: 1, n: 'South West (England)', c: 'Furniture', s: 190.73, t: 0 },
  { d: 1, n: 'South West (England)', c: 'Home Removal', s: 289, t: 0 },
  { d: 1, n: 'South West (England)', c: 'Piano', s: 44, t: 0 },
  { d: 1, n: 'Wales', c: 'Car', s: 161, t: 0 },
  { d: 1, n: 'Wales', c: 'Furniture', s: 36, t: 0 },
  { d: 1, n: 'West Midlands (England)', c: 'Car', s: 74, t: 0 },
  { d: 1, n: 'West Midlands (England)', c: 'Furniture', s: 95.24, t: 0 },
  { d: 1, n: 'Yorkshire and The Humber', c: 'Furniture', s: 15, t: 0 },
  { d: 1, n: 'Yorkshire and The Humber', c: 'Home Removal', s: 81, t: 0 },
];

export const mtdRaw2025Apr: MtdSpendRawRow[] = [];

/* ── Cancellation & completed paid raw — populated on next refresh ── */
export const cancellationRaw2025ByCountryApr: Record<string, (CancellationRawRow | CompletedPaidRawRow)[]> = { uk: [], spain: [], france: [] };
export const cancellationRaw2026ByCountryApr: Record<string, (CancellationRawRow | CompletedPaidRawRow)[]> = { uk: [], spain: [], france: [] };
export const completedPaidRaw2025ByCountryApr: Record<string, (CancellationRawRow | CompletedPaidRawRow)[]> = { uk: [], spain: [], france: [] };
export const completedPaidRaw2026ByCountryApr: Record<string, (CancellationRawRow | CompletedPaidRawRow)[]> = { uk: [], spain: [], france: [] };

/* ── iRes reservation data — populated on next refresh ── */
export const iresReservationDataApr: IResReservationRow[] = [];
