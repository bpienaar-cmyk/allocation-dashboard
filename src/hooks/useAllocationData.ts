import { useState, useEffect, useCallback } from 'react';
import {
  OverviewData,
  TrendPoint,
  CategoryRow,
  RegionRow,
  OtdMetrics,
  DeallocationData,
  DateRange,
} from '../types/index';
import {
  fetchOverview,
  fetchTrends,
  fetchCategoryBreakdown,
  fetchRegionalBreakdown,
  fetchOtdMetrics,
  fetchDeallocations,
} from '../services/api';

export interface UseAllocationDataResult {
  overview: OverviewData | null;
  trends: TrendPoint[] | null;
  categories: CategoryRow[] | null;
  regions: RegionRow[] | null;
  otdMetrics: OtdMetrics | null;
  deallocations: DeallocationData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch all allocation dashboard data
 * Fetches all data in parallel and manages loading/error states
 */
export function useAllocationData(dateRange: DateRange): UseAllocationDataResult {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [trends, setTrends] = useState<TrendPoint[] | null>(null);
  const [categories, setCategories] = useState<CategoryRow[] | null>(null);
  const [regions, setRegions] = useState<RegionRow[] | null>(null);
  const [otdMetrics, setOtdMetrics] = useState<OtdMetrics | null>(null);
  const [deallocations, setDeallocations] = useState<DeallocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        overviewData,
        trendsData,
        categoriesData,
        regionsData,
        otdData,
        deallocationsData,
      ] = await Promise.all([
        fetchOverview(dateRange),
        fetchTrends(dateRange.endDate),
        fetchCategoryBreakdown(dateRange),
        fetchRegionalBreakdown(dateRange),
        fetchOtdMetrics(dateRange),
        fetchDeallocations(dateRange),
      ]);

      setOverview(overviewData);
      setTrends(trendsData);
      setCategories(categoriesData);
      setRegions(regionsData);
      setOtdMetrics(otdData);
      setDeallocations(deallocationsData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      console.error('Failed to load allocation data:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    overview,
    trends,
    categories,
    regions,
    otdMetrics,
    deallocations,
    loading,
    error,
    refetch: loadData,
  };
}
