import React from 'react'
import KPICard from '../common/KPICard'
import { OverviewData } from '../../types'
import { fmtGBP, fmtN, fmtP } from '../../utils/formatting'

interface OverviewViewProps {
  data: OverviewData
}

const OverviewView: React.FC<OverviewViewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Jobs"
          value={fmtN(data.jobs)}
          trend={undefined}
        />
        <KPICard
          title="Total TTV"
          value={fmtGBP(data.ttv)}
          trend={undefined}
        />
        <KPICard
          title="Avg TTV/Job"
          value={fmtGBP(data.avgTtv)}
          trend={undefined}
        />
        <KPICard
          title="AV Fee"
          value={fmtGBP(data.avFee)}
          trend={undefined}
        />
        <KPICard
          title="Margin %"
          value={fmtP(data.marginPct)}
          trend={undefined}
        />
        <KPICard
          title="Allocation Spend"
          value={fmtGBP(data.allocSpend)}
          trend={undefined}
        />
        <KPICard
          title="Spend/TTV %"
          value={fmtP(data.spendTtvPct)}
          trend={undefined}
        />
        <KPICard
          title="Cant Source Rate"
          value={fmtP(data.cantSourceRate)}
          trend={undefined}
        />
        <KPICard
          title="OTD Deallo %"
          value={fmtP(data.otdDealloPct)}
          trend={undefined}
        />
        <KPICard
          title="No-Spend Rate"
          value={fmtP(data.noSpendPct)}
          trend={undefined}
        />
      </div>
    </div>
  )
}

export default OverviewView
