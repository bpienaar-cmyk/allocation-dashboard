/**
 * Month selector — provides month-keyed access to MTD data.
 * March data comes from dashboardData.ts, April from aprilData.ts.
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

import {
  DATA_LAST_UPDATED as DATA_LAST_UPDATED_MAR,
  overviewByCountry as marchOverview,
  dailyOverviewByCountry as marchDailyOverview,
  furnRoutingByCountry as marchFurnRouting,
  tpCancelsByCountry as marchTpCancels,
  iresReservationData as marchIres,
  mtdRaw2025 as marchMtdRaw2025,
  mtdRaw2026 as marchMtdRaw2026,
  cancellationRaw2025ByCountry as marchCancRaw2025,
  cancellationRaw2026ByCountry as marchCancRaw2026,
  completedPaidRaw2025ByCountry as marchCompRaw2025,
  completedPaidRaw2026ByCountry as marchCompRaw2026,
} from './dashboardData';

import {
  DATA_LAST_UPDATED_APR,
  overviewByCountryApr as aprilOverview,
  dailyOverviewByCountryApr as aprilDailyOverview,
  furnRoutingByCountryApr as aprilFurnRouting,
  tpCancelsByCountryApr as aprilTpCancels,
  iresReservationDataApr as aprilIres,
  mtdRaw2025Apr as aprilMtdRaw2025,
  mtdRaw2026Apr as aprilMtdRaw2026,
  cancellationRaw2025ByCountryApr as aprilCancRaw2025,
  cancellationRaw2026ByCountryApr as aprilCancRaw2026,
  completedPaidRaw2025ByCountryApr as aprilCompRaw2025,
  completedPaidRaw2026ByCountryApr as aprilCompRaw2026,
} from './aprilData';

export const AVAILABLE_MONTHS = ['2026-03', '2026-04'] as const;
export type MonthKey = (typeof AVAILABLE_MONTHS)[number];

export const MONTH_LABELS: Record<MonthKey, string> = {
  '2026-03': 'Mar 2026',
  '2026-04': 'Apr 2026',
};

export interface MonthlyMTDData {
  dataLastUpdated: string;
  overviewByCountry: Record<Country, CountryOverview>;
  dailyOverviewByCountry: Record<string, { cy: DailyOverviewRow[]; py: DailyOverviewRow[] }>;
  furnRoutingByCountry: Record<string, Record<string, { routed: number; total: number }>>;
  tpCancelsByCountry: Record<string, Record<string, number>>;
  iresReservationData: IResReservationRow[];
  mtdRaw2025: MtdSpendRawRow[];
  mtdRaw2026: MtdSpendRawRow[];
  cancellationRaw2025ByCountry: Record<string, (CancellationRawRow | CompletedPaidRawRow)[]>;
  cancellationRaw2026ByCountry: Record<string, (CancellationRawRow | CompletedPaidRawRow)[]>;
  completedPaidRaw2025ByCountry: Record<string, (CancellationRawRow | CompletedPaidRawRow)[]>;
  completedPaidRaw2026ByCountry: Record<string, (CancellationRawRow | CompletedPaidRawRow)[]>;
}

const monthlyData: Record<MonthKey, MonthlyMTDData> = {
  '2026-03': {
    dataLastUpdated: DATA_LAST_UPDATED_MAR,
    overviewByCountry: marchOverview,
    dailyOverviewByCountry: marchDailyOverview,
    furnRoutingByCountry: marchFurnRouting,
    tpCancelsByCountry: marchTpCancels,
    iresReservationData: marchIres,
    mtdRaw2025: marchMtdRaw2025,
    mtdRaw2026: marchMtdRaw2026,
    cancellationRaw2025ByCountry: marchCancRaw2025,
    cancellationRaw2026ByCountry: marchCancRaw2026,
    completedPaidRaw2025ByCountry: marchCompRaw2025,
    completedPaidRaw2026ByCountry: marchCompRaw2026,
  },
  '2026-04': {
    dataLastUpdated: DATA_LAST_UPDATED_APR,
    overviewByCountry: aprilOverview,
    dailyOverviewByCountry: aprilDailyOverview,
    furnRoutingByCountry: aprilFurnRouting,
    tpCancelsByCountry: aprilTpCancels,
    iresReservationData: aprilIres,
    mtdRaw2025: aprilMtdRaw2025,
    mtdRaw2026: aprilMtdRaw2026,
    cancellationRaw2025ByCountry: aprilCancRaw2025,
    cancellationRaw2026ByCountry: aprilCancRaw2026,
    completedPaidRaw2025ByCountry: aprilCompRaw2025,
    completedPaidRaw2026ByCountry: aprilCompRaw2026,
  },
};

export function getMTDData(month: MonthKey): MonthlyMTDData {
  return monthlyData[month];
}

export function getDefaultMonth(): MonthKey {
  return '2026-03';
}
