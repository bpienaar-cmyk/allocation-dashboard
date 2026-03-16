import React, { useState } from 'react'
import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import ErrorBoundary from './components/layout/ErrorBoundary'
import Loading from './components/common/Loading'
import ErrorDisplay from './components/common/ErrorDisplay'
import DateRangePicker from './components/common/DateRangePicker'
import OverviewView from './components/views/OverviewView'
import TrendsView from './components/views/TrendsView'
import CategoryView from './components/views/CategoryView'
import RegionalView from './components/views/RegionalView'
import OTDMetricsView from './components/views/OTDMetricsView'
import DeallocationView from './components/views/DeallocationView'
import { useAllocationData } from './hooks/useAllocationData'
import { getDefaultDateRange } from './utils/dateHelpers'
import { TabId, DateRange } from './types'

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange())

  const { overview, trends, categories, regions, otdMetrics, deallocations, loading, error, refetch } = useAllocationData(dateRange)

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange)
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <DateRangePicker
              dateRange={dateRange}
              onChange={handleDateRangeChange}
            />
          </div>

          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-8">
            {loading && <Loading />}
            {error && <ErrorDisplay message={error.message} onRetry={refetch} />}

            {!loading && !error && overview && (
              <div className="space-y-6">
                {activeTab === 'overview' && <OverviewView data={overview} />}
                {activeTab === 'trends' && trends && <TrendsView data={trends} />}
                {activeTab === 'category' && categories && <CategoryView data={categories} />}
                {activeTab === 'regional' && regions && <RegionalView data={regions} />}
                {activeTab === 'otd' && otdMetrics && <OTDMetricsView data={otdMetrics} />}
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
