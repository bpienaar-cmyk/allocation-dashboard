import React, { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Country, CountryOverview, DailyRaw } from '../../types'
import { fmtGBP, fmtN, fmtP } from '../../utils/formatting'

const COUNTRY_LABELS: Record<Country, string> = {
  uk: 'UK (V4 + AVB)',
  spain: 'Spain (V4)',
  france: 'France (V4)',
}

type MetricKey = 'jobs' | 'ttv' | 'furnRoutedPct' | 'avFee' | 'marginPct' | 'allocSpend' | 'spendTtvPct' | 'cantSourceRate' | 'otdDealloPct' | 'tpCancelRate'

interface MetricDef {
  title: string
  key: MetricKey
  fmt: (v: number) => string
  type: 'yoy' | 'pp'
  invert?: boolean
  /** Extract daily value from a DailyRaw row */
  dailyValue: (d: DailyRaw) => number
  /** Is this a rate/pct that should use cumulative calculation? */
  isCumRate?: boolean
}

interface OverviewViewProps {
  overviewByCountry: Record<Country, CountryOverview>
  selectedCountry: Country
  onCountryChange: (country: Country) => void
}

function yoyChange(current: number, prior: number): { trend: 'up' | 'down' | 'flat'; label: string } {
  if (prior === 0) return { trend: 'flat', label: 'N/A' }
  const pct = ((current - prior) / Math.abs(prior)) * 100
  if (Math.abs(pct) < 0.5) return { trend: 'flat', label: '0%' }
  return {
    trend: pct > 0 ? 'up' : 'down',
    label: `${pct > 0 ? '+' : ''}${pct.toFixed(1)}% YoY`,
  }
}

function ppChange(current: number, prior: number): { trend: 'up' | 'down' | 'flat'; label: string } {
  const diff = current - prior
  if (Math.abs(diff) < 0.05) return { trend: 'flat', label: '0pp' }
  return {
    trend: diff > 0 ? 'up' : 'down',
    label: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}pp YoY`,
  }
}

interface ComparisonCardProps {
  title: string
  currentValue: string
  priorValue: string
  trend: 'up' | 'down' | 'flat'
  changeLabel: string
  invertColor?: boolean
  selected?: boolean
  onClick?: () => void
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({
  title, currentValue, priorValue, trend, changeLabel, invertColor = false, selected = false, onClick,
}) => {
  const color = trend === 'flat'
    ? 'text-slate-400'
    : (invertColor ? (trend === 'down' ? 'text-emerald-400' : 'text-red-400') : (trend === 'up' ? 'text-emerald-400' : 'text-red-400'))

  return (
    <div
      onClick={onClick}
      className={`rounded-xl bg-slate-800 p-5 border transition-colors cursor-pointer ${
        selected ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-slate-700 hover:border-blue-500/50'
      }`}
    >
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3">{title}</p>
      <h3 className="text-2xl font-bold text-white">{currentValue}</h3>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">Mar '25: {priorValue}</span>
        <span className={`text-xs font-semibold ${color}`}>
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'} {changeLabel}
        </span>
      </div>
    </div>
  )
}

/** Build cumulative daily chart data for a metric */
function buildChartData(
  dailyCY: DailyRaw[],
  dailyPY: DailyRaw[],
  metric: MetricDef,
): { day: number; dayLabel: string; cy: number; py: number }[] {
  const maxDay = Math.max(dailyCY.length, dailyPY.length)
  const result: { day: number; dayLabel: string; cy: number; py: number }[] = []

  // For cumulative rates we need running totals
  let cumCY = 0, cumPY = 0
  // For derived rates we need cumulative numerator & denominator
  let cumCYNum = 0, cumCYDen = 0, cumPYNum = 0, cumPYDen = 0

  for (let i = 0; i < maxDay; i++) {
    const cy = dailyCY[i]
    const py = dailyPY[i]
    const day = i + 1

    let cyVal = 0, pyVal = 0

    if (metric.key === 'marginPct') {
      // Cumulative margin = cumAvFee / cumTtv * 100
      if (cy) { cumCYNum += cy.avFee; cumCYDen += cy.ttv }
      if (py) { cumPYNum += py.avFee; cumPYDen += py.ttv }
      cyVal = cumCYDen > 0 ? (cumCYNum / cumCYDen) * 100 : 0
      pyVal = cumPYDen > 0 ? (cumPYNum / cumPYDen) * 100 : 0
    } else if (metric.key === 'spendTtvPct') {
      // Cumulative spend/ttv = cumSpend / cumTtv * 100
      if (cy) { cumCYNum += cy.allocSpend; cumCYDen += cy.ttv }
      if (py) { cumPYNum += py.allocSpend; cumPYDen += py.ttv }
      cyVal = cumCYDen > 0 ? (cumCYNum / cumCYDen) * 100 : 0
      pyVal = cumPYDen > 0 ? (cumPYNum / cumPYDen) * 100 : 0
    } else if (metric.key === 'cantSourceRate') {
      // Cumulative cant source / cumulative jobs * 100
      if (cy) { cumCYNum += cy.cantSource; cumCYDen += cy.jobs }
      if (py) { cumPYNum += py.cantSource; cumPYDen += py.jobs }
      cyVal = cumCYDen > 0 ? (cumCYNum / cumCYDen) * 100 : 0
      pyVal = cumPYDen > 0 ? (cumPYNum / cumPYDen) * 100 : 0
    } else if (metric.key === 'otdDealloPct') {
      // Cumulative OTD deallo count (all statuses) / cumulative completed paid jobs * 100
      if (cy) { cumCYNum += cy.otdDealloCount; cumCYDen += cy.jobs }
      if (py) { cumPYNum += py.otdDealloCount; cumPYDen += py.jobs }
      cyVal = cumCYDen > 0 ? (cumCYNum / cumCYDen) * 100 : 0
      pyVal = cumPYDen > 0 ? (cumPYNum / cumPYDen) * 100 : 0
    } else if (metric.key === 'tpCancelRate') {
      // Cumulative TP cancels / cumulative jobs * 100
      if (cy) { cumCYNum += cy.tpCancels; cumCYDen += cy.jobs }
      if (py) { cumPYNum += py.tpCancels; cumPYDen += py.jobs }
      cyVal = cumCYDen > 0 ? (cumCYNum / cumCYDen) * 100 : 0
      pyVal = cumPYDen > 0 ? (cumPYNum / cumPYDen) * 100 : 0
    } else if (metric.key === 'furnRoutedPct') {
      // Cumulative furn routed / furn total * 100
      if (cy) { cumCYNum += cy.furnRouted; cumCYDen += cy.furnTotal }
      if (py) { cumPYNum += py.furnRouted; cumPYDen += py.furnTotal }
      cyVal = cumCYDen > 0 ? (cumCYNum / cumCYDen) * 100 : 0
      pyVal = cumPYDen > 0 ? (cumPYNum / cumPYDen) * 100 : 0
    } else {
      // Simple cumulative sum (jobs, ttv, avFee, allocSpend)
      if (cy) cumCY += metric.dailyValue(cy)
      if (py) cumPY += metric.dailyValue(py)
      cyVal = cumCY
      pyVal = cumPY
    }

    result.push({
      day,
      dayLabel: `Mar ${day}`,
      cy: Math.round(cyVal * 100) / 100,
      py: Math.round(pyVal * 100) / 100,
    })
  }

  return result
}

const METRICS: MetricDef[] = [
  { title: 'Completed Jobs', key: 'jobs', fmt: fmtN, type: 'yoy', dailyValue: d => d.jobs },
  { title: 'Total TTV', key: 'ttv', fmt: fmtGBP, type: 'yoy', dailyValue: d => d.ttv },
  { title: 'Furn Routed %', key: 'furnRoutedPct', fmt: fmtP, type: 'pp', dailyValue: () => 0, isCumRate: true },
  { title: 'AV Fee', key: 'avFee', fmt: fmtGBP, type: 'yoy', dailyValue: d => d.avFee },
  { title: 'Margin %', key: 'marginPct', fmt: fmtP, type: 'pp', dailyValue: () => 0, isCumRate: true },
  { title: 'Allocation Spend', key: 'allocSpend', fmt: fmtGBP, type: 'yoy', invert: true, dailyValue: d => d.allocSpend },
  { title: 'Spend / TTV %', key: 'spendTtvPct', fmt: fmtP, type: 'pp', invert: true, dailyValue: () => 0, isCumRate: true },
  { title: 'Cant Source Rate', key: 'cantSourceRate', fmt: fmtP, type: 'pp', invert: true, dailyValue: () => 0, isCumRate: true },
  { title: 'OTD Deallo %', key: 'otdDealloPct', fmt: fmtP, type: 'pp', invert: true, dailyValue: () => 0, isCumRate: true },
  { title: 'TP Cancel Rate', key: 'tpCancelRate', fmt: fmtP, type: 'pp', invert: true, dailyValue: () => 0, isCumRate: true },
]

const OverviewView: React.FC<OverviewViewProps> = ({ overviewByCountry, selectedCountry, onCountryChange }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey | null>(null)
  const countryData = overviewByCountry[selectedCountry]
  const { current: data, priorYear } = countryData

  const chartData = useMemo(() => {
    if (!selectedMetric) return []
    const metric = METRICS.find(m => m.key === selectedMetric)
    if (!metric) return []
    return buildChartData(countryData.dailyCY, countryData.dailyPY, metric)
  }, [selectedMetric, countryData])

  const selectedMetricDef = METRICS.find(m => m.key === selectedMetric)

  const countries: Country[] = ['uk', 'spain', 'france']

  // Format tooltip values
  const formatTooltipValue = (value: number) => {
    if (!selectedMetricDef) return String(value)
    return selectedMetricDef.fmt(value)
  }

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

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-white">
          MTD March 2026 — {COUNTRY_LABELS[selectedCountry]}
        </h2>
        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          vs MTD March 2025
        </span>
      </div>

      {priorYear.jobs === 0 && (
        <div className="rounded-lg bg-amber-900/30 border border-amber-700/50 px-4 py-2 text-sm text-amber-300">
          No prior year data available for {COUNTRY_LABELS[selectedCountry]} in March 2025 — YoY comparisons show N/A.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {METRICS.map((m) => {
          const currentVal = data[m.key as keyof typeof data] as number
          const priorVal = priorYear[m.key as keyof typeof priorYear] as number
          const change = m.type === 'pp' ? ppChange(currentVal, priorVal) : yoyChange(currentVal, priorVal)
          return (
            <ComparisonCard
              key={m.key}
              title={m.title}
              currentValue={m.fmt(currentVal)}
              priorValue={m.fmt(priorVal)}
              trend={change.trend}
              changeLabel={change.label}
              invertColor={m.invert}
              selected={selectedMetric === m.key}
              onClick={() => setSelectedMetric(selectedMetric === m.key ? null : m.key)}
            />
          )
        })}
      </div>

      {/* Daily MTD Trend Chart */}
      {selectedMetric && selectedMetricDef && chartData.length > 0 && (
        <div className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">
              {selectedMetricDef.title} — Daily Cumulative MTD
            </h3>
            <button
              onClick={() => setSelectedMetric(null)}
              className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700"
            >
              ✕ Close
            </button>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="dayLabel"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                interval={1}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(v) => {
                  if (selectedMetricDef.type === 'pp') return `${v.toFixed(1)}%`
                  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
                  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`
                  return String(v)
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '13px',
                }}
                formatter={(value, name) => [
                  formatTooltipValue(Number(value)),
                  name === 'cy' ? 'Mar 2026' : 'Mar 2025',
                ]}
                labelFormatter={(label) => label}
              />
              <Legend
                formatter={(value) => (value === 'cy' ? 'Mar 2026' : 'Mar 2025')}
                wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="cy"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#3b82f6' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="py"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={{ r: 3, fill: '#f59e0b' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Click any metric card above to compare its daily cumulative MTD trend
          </p>
        </div>
      )}

      {!selectedMetric && (
        <p className="text-xs text-slate-500 text-center mt-2">
          Click any metric card to view its daily MTD trend chart with YoY comparison
        </p>
      )}
    </div>
  )
}

export default OverviewView
