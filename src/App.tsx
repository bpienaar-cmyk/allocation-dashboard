import React, { useState, useMemo } from 'react'
import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import MonthToggle from './components/common/MonthToggle'
import ErrorBoundary from './components/layout/ErrorBoundary'
import Loading from './components/common/Loading'
import ErrorDisplay from './components/common/ErrorDisplay'
import OverviewView from './components/views/OverviewView'
import TrendsView from './components/views/TrendsView'
import CategoryView from './components/views/CategoryView'
import ReservationsView from './components/views/ReservationsView'
import SpendView from './components/views/SpendView'
import CancellationsView from './components/views/CancellationsView'
import AdminAllocationView from './components/views/AdminAllocationView'
import { useAllocationData } from './hooks/useAllocationData'
import { getDefaultDateRange } from './utils/dateHelpers'
import { getMTDData, getDefaultMonth, MonthKey } from './data/monthSelector'
import { trendsByCategoryAndCountry, categoryBreakdownByCountry, activeBookingsByCountry, partialMonthComparisonByCountry, monthlyCancellationTrendsByCountry, monthlyCompletedPaidTrendsByCountry } from './data/dashboardData'
import { TabId, Country } from './types'

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [selectedCountry, setSelectedCountry] = useState<Country>('uk')
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>(getDefaultMonth())
  const defaultDateRange = getDefaultDateRange()

  // Non-MTD data from hook (trends, categories, etc. — shared across months)
  const { trends, trendsByCountry, categories, regions, iresTrendData, otdMetrics, spendByNutsByCountry, spendByCategoryByCountry, spendByDaysByCountry, agentSpendByCountry, loading, error, refetch } = useAllocationData(defaultDateRange)

  // MTD data — switches based on selected month
  const mtd = useMemo(() => getMTDData(selectedMonth), [selectedMonth])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-2">
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
            <MonthToggle selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
          </div>

          <div className="mt-8">
            {loading && <Loading />}
            {error && <ErrorDisplay message={error.message} onRetry={refetch} />}

            {!loading && !error && mtd.overviewByCountry && (
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <OverviewView
                    overviewByCountry={mtd.overviewByCountry}
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    dailyOverviewByCountry={mtd.dailyOverviewByCountry}
                    furnRoutingByCountry={mtd.furnRoutingByCountry}
                    tpCancelsByCountry={mtd.tpCancelsByCountry}
                  />
                )}
                {activeTab === 'trends' && trendsByCountry && (
                  <TrendsView
                    trendsByCountry={trendsByCountry}
                    trendsByCategoryAndCountry={trendsByCategoryAndCountry}
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                  />
                )}
                {activeTab === 'category' && (
                  <CategoryView
                    breakdownByCountry={categoryBreakdownByCountry}
                    activeBookingsByCountry={activeBookingsByCountry}
                    partialMonthByCountry={partialMonthComparisonByCountry}
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                  />
                )}
                {activeTab === 'reservations' && mtd.iresReservationData && (
                  <ReservationsView data={mtd.iresReservationData} trendData={iresTrendData || undefined} />
                )}
                {activeTab === 'spend' && (
                  <SpendView
                    nutsDataByCountry={spendByNutsByCountry}
                    categoryDataByCountry={spendByCategoryByCountry}
                    spendByDaysByCountry={spendByDaysByCountry}
                    agentSpendByCountry={agentSpendByCountry}
                    mtdRaw2025={mtd.mtdRaw2025}
                    mtdRaw2026={mtd.mtdRaw2026}
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                  />
                )}
                {activeTab === 'cancellations' && (
                  <CancellationsView
                    cancellationRaw2025ByCountry={mtd.cancellationRaw2025ByCountry}
                    cancellationRaw2026ByCountry={mtd.cancellationRaw2026ByCountry}
                    completedPaidRaw2025ByCountry={mtd.completedPaidRaw2025ByCountry}
                    completedPaidRaw2026ByCountry={mtd.completedPaidRaw2026ByCountry}
                    monthlyCancellationTrendsByCountry={monthlyCancellationTrendsByCountry}
                    monthlyCompletedPaidTrendsByCountry={monthlyCompletedPaidTrendsByCountry}
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                  />
                )}
                {activeTab === 'admin-allocation' && (
                  <AdminAllocationView
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
