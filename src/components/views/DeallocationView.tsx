import React from 'react'
import KPICard from '../common/KPICard'
import { DeallocationData } from '../../types'
import { fmtGBP, fmtN, fmtP } from '../../utils/formatting'

interface DeallocationViewProps {
  data: DeallocationData
}

const DeallocationView: React.FC<DeallocationViewProps> = ({ data }) => {
  const avgSpendPerDeallocation = data.otdJobsWithDeallos > 0
    ? data.otdAllocSpend / data.otdJobsWithDeallos
    : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Deallocations"
          value={fmtN(data.deallocations)}
          trend={undefined}
        />
        <KPICard
          title="OTD Deallocations"
          value={fmtN(data.otdDeallocations)}
          trend={undefined}
        />
        <KPICard
          title="OTD Deallo %"
          value={fmtP(data.otdDealloPct)}
          trend={undefined}
        />
        <KPICard
          title="Jobs with OTD Deallocations"
          value={fmtN(data.otdJobsWithDeallos)}
          trend={undefined}
        />
        <KPICard
          title="OTD Allocation Spend"
          value={fmtGBP(data.otdAllocSpend)}
          trend={undefined}
        />
        <KPICard
          title="Avg Spend per Deallocation"
          value={fmtGBP(avgSpendPerDeallocation)}
          trend={undefined}
        />
      </div>
    </div>
  )
}

export default DeallocationView
