import React from 'react'
import KPICard from '../common/KPICard'
import { OtdMetrics } from '../../types'
import { fmtGBP, fmtN, fmtP } from '../../utils/formatting'

interface OTDMetricsViewProps {
  data: OtdMetrics
}

const OTDMetricsView: React.FC<OTDMetricsViewProps> = ({ data }) => {
  const avgSpendPerJob = data.otdJobsWithDeallos > 0
    ? data.otdAllocSpend / data.otdJobsWithDeallos
    : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          title="OTD Jobs with Deallocations"
          value={fmtN(data.otdJobsWithDeallos)}
          trend={undefined}
        />
        <KPICard
          title="OTD Allocation Spend"
          value={fmtGBP(data.otdAllocSpend)}
          trend={undefined}
        />
        <KPICard
          title="Avg Spend per OTD Job"
          value={fmtGBP(avgSpendPerJob)}
          trend={undefined}
        />
        <KPICard
          title="No-Spend Jobs"
          value={fmtN(data.noSpendJobs)}
          trend={undefined}
        />
        <KPICard
          title="No-Spend Rate"
          value={fmtP(data.noSpendPct)}
          trend={undefined}
        />
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <p className="text-slate-300 text-sm leading-relaxed">
          <span className="font-semibold text-blue-400">OTD (On-The-Day)</span> metrics track allocation activities that occur on the same day as the job posting. These metrics are critical for understanding last-minute allocation challenges, same-day deallocations, and jobs that couldn't be allocated to spending providers.
        </p>
      </div>
    </div>
  )
}

export default OTDMetricsView
