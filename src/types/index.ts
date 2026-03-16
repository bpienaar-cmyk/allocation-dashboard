export interface OverviewData {
  jobs: number;
  ttv: number;
  avgTtv: number;
  avFee: number;
  marginPct: number;
  allocSpend: number;
  spendTtvPct: number;
  otdCancels: number;
  cantSourceCount: number;
  cantSourceRate: number;
  tpCancels: number;
  deallocations: number;
  otdDeallocations: number;
  otdDealloPct: number;
  otdAllocSpend: number;
  noSpendJobs: number;
  noSpendPct: number;
  otdAllocatedJobs: number;
  furnRoutedPct: number;
  tpCancelRate: number;
}

export interface TrendPoint {
  month: string;
  jobs: number;
  ttv: number;
  avFee: number;
  marginPct: number;
  allocSpend: number;
  spendTtvPct: number;
  otdCancels: number;
  tpCancels: number;
  cantSourceCount: number;
  otdDeallocations: number;
  totalRecords: number;
}

export interface CategoryRow {
  category: string;
  jobs: number;
  ttv: number;
  marginPct: number;
  allocSpend: number;
  spendTtvPct: number;
}

export interface RegionRow {
  region: string;
  jobs: number;
  ttv: number;
  marginPct: number;
  allocSpend: number;
  spendTtvPct: number;
}

export interface OtdMetrics {
  otdJobsWithDeallos: number;
  otdAllocSpend: number;
  otdAllocatedJobs: number;
  noSpendJobs: number;
  noSpendPct: number;
}

export interface DeallocationData {
  deallocations: number;
  otdDeallocations: number;
  otdDealloPct: number;
  otdDealloCount: number;
  otdJobsWithDeallos: number;
  otdAllocSpend: number;
}

export type Country = 'uk' | 'spain' | 'france';

export interface CountryOverview {
  current: OverviewData;
  priorYear: OverviewData;
}

export type TabId = 'overview' | 'trends' | 'category' | 'regional' | 'otd' | 'deallocations';

export interface DateRange {
  startDate: string;
  endDate: string;
}
