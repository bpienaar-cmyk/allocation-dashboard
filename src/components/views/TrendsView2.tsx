import React, { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { TrendPoint, Country, CategoryType } from '../../types'

const COUNTRY_LABELS: Record<Country, string> = {
  uk: 'UK (V4 + AVB)',
  spain: 'Spain (V4)',
  france: 'France (V4)',
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

type CategoryFilter = 'all' | CategoryType

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: 'All',
  furniture: 'Furniture',
  homeRemoval: 'Removals',
  car: 'Cars',
  motorbike: 'Bikes',
  piano: 'Pianos',
  journey: 'Journeys',
}

interface TrendsViewProps {
  trendsByCountry: Record<Country, TrendPoint[]>
  trendsByCategoryAndCountry: Record<Country, Record<CategoryType, TrendPoint[]>>
  selectedCountry: Country
  onCountryChange: (country: Country) => void
}

type MetricType = 'jobs' | 'ttv' | 'allocSpend' | 'spendTtvPct' | 'spendVariancePct' | 'marginPct' | 'furnRoutedPct' | 'otdDealloPct' | 'adminAllocD1OtdPct' | 'adminAllocPct'

interface YoYRow {
  monthLabel: string
  y2025: number | null
  y2026: number | null
}

const TrendsView2: React.FC<TrendsViewProps> = ({ trendsByCountry, trendsByCategoryAndCountry, selectedCountry, onCountryChange }) => {
  const [metric, setMetric] = useState<MetricType>('jobs')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all')

  const data = selectedCategory === 'all'
    ? trendsByCountry[selectedCountry]
    : (trendsByCategoryAndCountry[selectedCountry]?.[selectedCategory] ?? [])
  const countries: Country[] = ['uk', 'spain', 'france']
  const categoryFilters: CategoryFilter[] = ['all', 'furniture', 'homeRemoval', 'car', 'motorbike', 'piano', 'journey']

  const metricConfig: Record<MetricType, { label: string; key: keyof TrendPoint; isPercentage: boolean; isCurrency: boolean; compute?: (p: TrendPoint) => number }> = {
    jobs: { label: 'Jobs', key: 'jobs', isPercentage: false, isCurrency: false },
    ttv: { label: 'Total TTV', key: 'ttv', isPercentage: false, isCurrency: true },
    allocSpend: { label: 'Allocation Spend', key: 'allocSpend', isPercentage: false, isCurrency: true },
    spendTtvPct: { label: 'Spend/TTV %', key: 'spendTtvPct', isPercentage: true, isCurrency: false },
    spendVariancePct: { label: 'Spend Variance % (vs Original TP Fee)', key: 'spendVariancePct', isPercentage: true, isCurrency: false },
    marginPct: { label: 'Margin %', key: 'marginPct', isPercentage: true, isCurrency: false },
    otdDealloPct: { label: 'OTD Deallocation %', key: 'otdDeallocations', isPercentage: true, isCurrency: false, compute: (p) => p.jobs > 0 ? (p.otdDeallocations / p.jobs) * 100 : 0 },
    adminAllocD1OtdPct: { label: 'Admin Allocation D-1 & OTD', key: 'adminAllocD1Otd', isPercentage: false, isCurrency: false },
    furnRoutedPct: { label: 'Furn Routed %', key: 'furnRouted', isPercentage: true, isCurrency: false, compute: (p) => (p.furnTotal ?? 0) > 0 ? ((p.furnRouted ?? 0) / (p.furnTotal ?? 0)) * 100 : 0 },
    adminAllocPct: { label: 'Admin Allocations %', key: 'adminAllocPct', isPercentage: true, isCurrency: false },
  }

  const config = metricConfig[metric]
  const isPercentage = config.isPercentage
  const isCurrency = config.isCurrency

  // Build YoY comparison data: Jan-Dec with 2025 and 2026 values
  const yoyData = useMemo<YoYRow[]>(() => {
    // Index data by year+month
    const byYearMonth: Record<string, number> = {}
    data.forEach((point) => {
      const d = new Date(point.month)
      const year = d.getFullYear()
      const month = d.getMonth() // 0-indexed
      const val = config.compute ? config.compute(point) : point[config.key] as number
      byYearMonth[`${year}-${month}`] = val
    })

    return MONTH_LABELS.map((label, idx) => {
      const v2025 = byYearMonth[`2025-${idx}`]
      const v2026 = byYearMonth[`2026-${idx}`]
      return {
        monthLabel: label,
        y2025: v2025 !== undefined ? v2025 : null,
        y2026: v2026 !== undefined ? v2026 : null,
      }
    })
  }, [data, config.key])

  const formatValue = (v: number) => {
    if (isPercentage) return `${v.toFixed(2)}%`
    const prefix = isCurrency ? '£' : ''
    if (v >= 1000000) return `${prefix}${(v / 1000000).toFixed(2)}M`
    if (v >= 1000) return `${prefix}${(v / 1000).toFixed(1)}K`
    return `${prefix}${v.toLocaleString('en-GB', { maximumFractionDigits: 1 })}`
  }

  const formatLabel = (v: any) => {
    if (v === null || v === undefined) return ''
    const n = Number(v)
    if (isNaN(n)) return ''
    if (isPercentage) return `${n.toFixed(1)}%`
    const prefix = isCurrency ? '£' : ''
    if (n >= 1000000) return `${prefix}${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${prefix}${(n / 1000).toFixed(1)}K`
    return `${prefix}${n.toLocaleString()}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry: any) => {
            if (entry.value === null || entry.value === undefined) return null
            return (
              <p key={entry.dataKey} style={{ color: entry.color }}>
                {entry.name}: {formatValue(Number(entry.value))}
              </p>
            )
          })}
        </div>
      )
    }
    return null
  }

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

      {/* Category toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-slate-400 text-sm font-medium mr-1">Category:</span>
        {categoryFilters.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          2025 vs 2026 — {COUNTRY_LABELS[selectedCountry]}
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
            <option value="spendVariancePct">Spend Variance % (vs Original TP Fee)</option>
            <option value="marginPct">Margin %</option>
            <option value="furnRoutedPct">Furn Routed %</option>
            <option value="otdDealloPct">OTD Deallocation %</option>
            <option value="adminAllocD1OtdPct">Admin Allocation D-1 & OTD</option>
            <option value="adminAllocPct">Admin Allocations %</option>
          </select>
        </div>
      </div>

      {!hasData && (
        <div className="rounded-lg bg-amber-900/30 border border-amber-700/50 px-4 py-2 text-sm text-amber-300">
          No historical data available for {COUNTRY_LABELS[selectedCountry]}.
        </div>
      )}

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700" style={{ height: '420px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {isPercentage ? (
            <LineChart data={yoyData} margin={{ top: 25, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="monthLabel"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(v) => `${v.toFixed(1)}%`}
                domain={metric === 'marginPct' ? [40, 'auto'] : ['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '16px', color: '#94a3b8', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="y2025"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={{ r: 4, fill: '#f59e0b' }}
                activeDot={{ r: 6 }}
                name="2025"
                connectNulls={false}
              >
                <LabelList dataKey="y2025" position="top" offset={15} formatter={formatLabel} style={{ fill: '#f59e0b', fontSize: 10, fontWeight: 600 }} />
              </Line>
              <Line
                type="monotone"
                dataKey="y2026"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#3b82f6' }}
                activeDot={{ r: 6 }}
                name="2026"
                connectNulls={false}
              >
                <LabelList dataKey="y2026" position="top" offset={15} formatter={formatLabel} style={{ fill: '#3b82f6', fontSize: 10, fontWeight: 600 }} />
              </Line>
            </LineChart>
          ) : (
            <BarChart data={yoyData} margin={{ top: 25, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="monthLabel"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(v) => {
                  const prefix = isCurrency ? '£' : ''
                  if (v >= 1000000) return `${prefix}${(v / 1000000).toFixed(1)}M`
                  if (v >= 1000) return `${prefix}${(v / 1000).toFixed(0)}K`
                  return `${prefix}${v}`
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '16px', color: '#94a3b8', fontSize: '12px' }}
              />
              <Bar
                dataKey="y2025"
                fill="#f59e0b"
                name="2025"
                radius={[4, 4, 0, 0]}
                opacity={0.7}
              >
                <LabelList dataKey="y2025" position="top" formatter={formatLabel} style={{ fill: '#f59e0b', fontSize: 10, fontWeight: 600 }} />
              </Bar>
              <Bar
                dataKey="y2026"
                fill="#3b82f6"
                name="2026"
                radius={[4, 4, 0, 0]}
              >
                <LabelList dataKey="y2026" position="top" formatter={formatLabel} style={{ fill: '#3b82f6', fontSize: 10, fontWeight: 600 }} />
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TrendsView2
