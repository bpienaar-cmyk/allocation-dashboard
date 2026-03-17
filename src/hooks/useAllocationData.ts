import { useState, useEffect, useCallback } from 'react';
import {
  OverviewData,
  TrendPoint,
  CategoryRow,
  RegionRow,
  OtdMetrics,
  DeallocationData,
  DateRange,
  Country,
  CountryOverview,
  DailyOverviewRow,
} from '../types/index';
import {
  overviewByCountry,
  trendsData,
  trendsByCountry,
  categoriesData,
  regionsData,
  otdMetricsData,
  deallocationsData,
  dailyOverview,
  dailyOverviewPY,
} from '../data/dashboardData';

export interface UseAllocationDataResult {
  overview: OverviewData | null;
  overviewPY: OverviewData | null;
  overviewByCountry: Record<Country, CountryOverview> | null;
  trends: TrendPoint[] | null;
  trendsByCountry: Record<Country, TrendPoint[]> | null;
  categories: CategoryRow[] | null;
  regions: RegionRow[] | null;
  otdMetrics: OtdMetrics | null;
  deallocations: DeallocationData | null;
  dailyOverview: DailyOverviewRow[] | null;
  dailyOverviewPY: DailyOverviewRow[] | null;
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
  const [overviewPY, setOverviewPY] = useState<OverviewData | null>(null);
  const [countryData, setCountryData] = useState<Record<Country, CountryOverview> | null>(null);
  const [trends, setTrends] = useState<TrendPoint[] | null>(null);
  const [trendsByCountryData, setTrendsByCountryData] = useState<Record<Country, TrendPoint[]> | null>(null);
  const [categories, setCategories] = useState<CategoryRow[] | null>(null);
  const [regions, setRegions] = useState<RegionRow[] | null>(null);
  const [otdMetrics, setOtdMetrics] = useState<OtdMetrics | null>(null);
  const [deallocations, setDeallocations] = useState<DeallocationData | null>(null);
  const [dailyOvrvw, setDailyOvrvw] = useState<DailyOverviewRow[] | null>(null);
  const [dailyOvrvwPY, setDailyOvrvwPY] = useState<DailyOverviewRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use static data - no API calls needed
      setOverview(overviewByCountry.uk.current);
      setOverviewPY(overviewByCountry.uk.priorYear);
      setCountryData(overviewByCountry);
      setTrends(trendsData);
      setTrendsByCountryData(trendsByCountry);
      setCategories(categoriesData);
      setRegions(regionsData);
      setOtdMetrics(otdMetricsData);
      setDeallocations(deallocationsData);
      setDailyOvrvw(dailyOverview);
      setDailyOvrvwPY(dailyOverviewPY);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      console.error('Failed to load allocation data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    overview,
    overviewPY,
    overviewByCountry: countryData,
    trends,
    trendsByCountry: trendsByCountryData,
    categories,
    regions,
    otdMetrics,
    deallocations,
    dailyOverview: dailyOvrvw,
    dailyOverviewPY: dailyOvrvwPY,
    loading,
    error,
    refetch: loadData,
  };
}
