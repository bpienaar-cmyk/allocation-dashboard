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
import { TrendPoint, Country } from '../../types'
import { fmtMonth } from '../../utils/formatting'

const COUNTRY_LABELS: Record<Country, string> = {
  uk: 'UK (V4 + AVB)',
  spain: 'Spain (V4)',
  france: 'France (V4)',
}

interface TrendsViewProps {
  trendsByCountry: Record<Country, TrendPoint[]>
  selectedCountry: Country
  onCountryChange: (country: Country) => void
}

type MetricType = 'jobs' | 'ttv' | 'allocSpend' | 'spendTtvPct' | 'marginPct' | 'otdDeallocations'

const TrendsView: React.FC<TrendsViewProps> = ({ trendsByCountry, selectedCountry, onCountryChange }) => {
  const [metric, setMetric] = useState<MetricType>('jobs')

  const data = trendsByCountry[selectedCountry]
  const countries: Country[] = ['uk', 'spain', 'france']

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
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm">
          <p className="font-semibold">{payload[0].payload.monthLabel}</p>
          <p className="text-blue-400">{config.label}: {formatted}</p>
        </div>
      )
    }
    return null
  }

  // Check if country has meaningful data
  const hasData = data.some(d => d.jobs > 0)

  return (
    <div className="space-y-4">
      {/* Country toggle */}
      <div className="flex items-center gap-2">
        {countries.map((c) => (
          <button
            key={c}
            onClick={() => onCountryChange(c)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedCountry === c
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {COUNTRY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          14-Month Trends — {COUNTRY_LABELS[selectedCountry]}
        </h2>
        <div className="flex items-center gap-3">
          <label className="text-slate-400 text-sm font-medium">Metric:</label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as MetricType)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="jobs">Jobs</option>
            <option value="ttv">Total TTV</option>
            <option value="allocSpend">Allocation Spend</option>
            <option value="spendTtvPct">Spend/TTV %</option>
            <option value="marginPct">Margin %</option>
            <option value="otdDeallocations">OTD Deallocations</option>
          </select>
        </div>
      </div>

      {!hasData && (
        <div className="rounded-lg bg-amber-900/30 border border-amber-700/50 px-4 py-2 text-sm text-amber-300">
          No historical data available for {COUNTRY_LABELS[selectedCountry]} in most of the 14-month window.
        </div>
      )}

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700" style={{ height: '420px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="monthLabel"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => {
                if (isPercentage) return `${v.toFixed(1)}%`
                if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
                if (v >= 1000) return `${(v / 1000).toFixed(0)}K`
                return String(v)
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px', color: '#94a3b8', fontSize: '12px' }}
              iconType={isPercentage ? 'line' : 'square'}
            />
            {isPercentage ? (
              <Line
                type="monotone"
                dataKey={config.key}
                stroke={config.color}
                dot={{ fill: config.color, r: 4 }}
                activeDot={{ r: 6 }}
                strokeWidth={2.5}
                name={config.label}
              />
            ) : (
              <Bar
                dataKey={config.key}
                fill={config.color}
                name={config.label}
                radius={[6, 6, 0, 0]}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TrendsView
