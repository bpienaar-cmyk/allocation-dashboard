import React, { useState } from 'react'
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendPoint } from '../../types'
import { fmtMonth } from '../../utils/formatting'

interface TrendsViewProps {
  data: TrendPoint[]
}

type MetricType = 'jobs' | 'ttv' | 'allocSpend' | 'spendTtvPct' | 'marginPct' | 'otdDeallocations'

const TrendsView: React.FC<TrendsViewProps> = ({ data }) => {
  const [metric, setMetric] = useState<MetricType>('jobs')

  const metricConfig: Record<MetricType, { label: string; key: keyof TrendPoint; isPercentage: boolean; color: string }> = {
    jobs: { label: 'Jobs', key: 'jobs', isPercentage: false, color: '#3b82f6' },
    ttv: { label: 'Total TTV', key: 'ttv', isPercentage: false, color: '#10b981' },
    allocSpend: { label: 'Allocation Spend', key: 'allocSpend', isPercentage: false, color: '#f59e0b' },
    spendTtvPct: { label: 'Spend/TTV %', key: 'spendTtvPct', isPercentage: true, color: '#8b5cf6' },
    marginPct: { label: 'Margin %', key: 'marginPct', isPercentage: true, color: '#06b6d4' },
    otdDeallocations: { label: 'OTD Deallocations', key: 'otdDeallocations', isPercentage: false, color: '#ef4444' },
  }

  const config = metricConfig[metric]
  const isPercentage = config.isPercentage

  const formattedData = data.map(point => ({
    ...point,
    monthLabel: fmtMonth(point.month),
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      const formatted = isPercentage ? `${value.toFixed(2)}%` : `£${value.toLocaleString()}`
      return (
        <div className="bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm">
          <p className="font-semibold">{payload[0].payload.monthLabel}</p>
          <p className="text-blue-400">{config.label}: {formatted}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-white font-medium">Metric:</label>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as MetricType)}
          className="bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option value="jobs">Jobs</option>
          <option value="ttv">Total TTV</option>
          <option value="allocSpend">Allocation Spend</option>
          <option value="spendTtvPct">Spend/TTV %</option>
          <option value="marginPct">Margin %</option>
          <option value="otdDeallocations">OTD Deallocations</option>
        </select>
      </div>

      <div className="bg-slate-800 rounded-lg p-6" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis
              dataKey="monthLabel"
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px', color: '#e2e8f0' }}
              iconType={isPercentage ? 'line' : 'square'}
            />
            {isPercentage ? (
              <Line
                type="monotone"
                dataKey={config.key}
                stroke={config.color}
                dot={{ fill: config.color, r: 5 }}
                activeDot={{ r: 7 }}
                strokeWidth={2}
                name={config.label}
              />
            ) : (
              <Bar
                dataKey={config.key}
                fill={config.color}
                name={config.label}
                radius={[8, 8, 0, 0]}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TrendsView
