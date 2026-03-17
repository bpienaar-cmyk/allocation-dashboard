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
  adminAllocD1Otd: number;
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

export interface DailyRaw {
  day: number;
  jobs: number;
  ttv: number;
  avFee: number;
  allocSpend: number;
  cantSource: number;
  tpCancels: number;
  otdDealloCount: number;
  furnRouted: number;
  furnTotal: number;
}

export interface CategoryBreakdownRow {
  month: string;
  category: string;
  nuts1: string;
  jobs: number;
  ttv: number;
  avFee: number;
  marginPct: number;
  allocSpend: number;
  spendTtvPct: number;
}

export interface ActiveBookingRow {
  day: string;
  nuts1: string;
  category: string;
  status: string;
  activeCount: number;
}

export type Country = 'uk' | 'spain' | 'france';
export type CategoryType = 'furniture' | 'homeRemoval' | 'car' | 'motorbike' | 'piano' | 'journey';

export interface CountryOverview {
  current: OverviewData;
  priorYear: OverviewData;
  dailyCY: DailyRaw[];
  dailyPY: DailyRaw[];
}

export type TabId = 'overview' | 'trends' | 'category' | 'reservations' | 'otd' | 'deallocations';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DailyOverviewRow {
  day: string;
  category: string;
  jobs: number;
  ttv: number;
  avFee: number;
  allocSpend: number;
  otdCancels: number;
  tpCancels: number;
  cantSourceCount: number;
  deallocations: number;
  otdDeallocations: number;
  noSpendJobs: number;
  otdAllocatedJobs: number;
}

export interface IResReservationRow {
  day: string;
  nutsRegion: string;
  status: string;
  resType: string;
  people: number;
  count: number;
}
