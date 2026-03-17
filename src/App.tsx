import React, { useState } from 'react'
import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import ErrorBoundary from './components/layout/ErrorBoundary'
import Loading from './components/common/Loading'
import ErrorDisplay from './components/common/ErrorDisplay'
import OverviewView from './components/views/OverviewView'
import TrendsView from './components/views/TrendsView'
import CategoryView from './components/views/CategoryView'
import ReservationsView from './components/views/ReservationsView'
import SpendView from './components/views/SpendView'
import DeallocationView from './components/views/DeallocationView'
import { useAllocationData } from './hooks/useAllocationData'
import { getDefaultDateRange } from './utils/dateHelpers'
import { trendsByCategoryAndCountry, categoryBreakdownByCountry, activeBookingsByCountry, partialMonthComparisonByCountry } from './data/dashboardData'
import { TabId, Country } from './types'

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [selectedCountry, setSelectedCountry] = useState<Country>('uk')
  const defaultDateRange = getDefaultDateRange()

  const { overview, overviewByCountry, trends, trendsByCountry, categories, regions, iresReservations, iresTrendData, otdMetrics, deallocations, dailyOverviewByCountry, furnRoutingByCountry, tpCancelsByCountry, spendByNuts, spendByCategory, loading, error, refetch } = useAllocationData(defaultDateRange)

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-8">
            {loading && <Loading />}
            {error && <ErrorDisplay message={error.message} onRetry={refetch} />}

            {!loading && !error && overview && (
              <div className="space-y-6">
                {activeTab === 'overview' && overviewByCountry && (
                  <OverviewView
                    overviewByCountry={overviewByCountry}
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    dailyOverviewByCountry={dailyOverviewByCountry}
                    furnRoutingByCountry={furnRoutingByCountry}
                    tpCancelsByCountry={tpCancelsByCountry}
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
                {activeTab === 'reservations' && iresReservations && <ReservationsView data={iresReservations} trendData={iresTrendData || undefined} />}
                {activeTab === 'spend' && <SpendView nutsData={spendByNuts} categoryData={spendByCategory} />}
                {activeTab === 'deallocations' && deallocations && <DeallocationView data={deallocations} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
