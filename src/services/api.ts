import {
  OverviewData,
  TrendPoint,
  CategoryRow,
  RegionRow,
  OtdMetrics,
  DeallocationData,
  DateRange,
} from '../types/index';

const API_BASE = import.meta.env.VITE_API_BASE || '/.netlify/functions';

/**
 * Helper function to build query parameters
 */
function buildQueryString(params: Record<string, string | number>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    query.append(key, String(value));
  });
  return query.toString();
}

/**
 * Fetch overview metrics
 */
export async function fetchOverview(range: DateRange): Promise<OverviewData> {
  const query = buildQueryString({
    startDate: range.startDate,
    endDate: range.endDate,
  });

  const response = await fetch(`${API_BASE}/overview?${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch overview data: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch trend data (monthly breakdown)
 */
export async function fetchTrends(endDate: string): Promise<TrendPoint[]> {
  const query = buildQueryString({ endDate });

  const response = await fetch(`${API_BASE}/trends?${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch trends data: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch category breakdown
 */
export async function fetchCategoryBreakdown(range: DateRange): Promise<CategoryRow[]> {
  const query = buildQueryString({
    startDate: range.startDate,
    endDate: range.endDate,
  });

  const response = await fetch(`${API_BASE}/category?${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch category breakdown: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch regional breakdown
 */
export async function fetchRegionalBreakdown(range: DateRange): Promise<RegionRow[]> {
  const query = buildQueryString({
    startDate: range.startDate,
    endDate: range.endDate,
  });

  const response = await fetch(`${API_BASE}/regional?${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch regional breakdown: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch OTD (On-Time Delivery) metrics
 */
export async function fetchOtdMetrics(range: DateRange): Promise<OtdMetrics> {
  const query = buildQueryString({
    startDate: range.startDate,
    endDate: range.endDate,
  });

  const response = await fetch(`${API_BASE}/otd?${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch OTD metrics: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch deallocation data
 */
export async function fetchDeallocations(range: DateRange): Promise<DeallocationData> {
  const query = buildQueryString({
    startDate: range.startDate,
    endDate: range.endDate,
  });

  const response = await fetch(`${API_BASE}/deallocations?${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch deallocations data: ${response.statusText}`);
  }

  return response.json();
}
