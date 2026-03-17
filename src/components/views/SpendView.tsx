import React, { useState, useMemo, useCallback } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { SpendNutsRow, SpendCategoryRow } from '../../types'
import { fmtN } from '../../utils/formatting'

interface SpendViewProps {
  nutsData: SpendNutsRow[]
  categoryData: SpendCategoryRow[]
}

const SHORT_REGION: Record<string, string> = {
  'East Midlands (England)': 'E. Midlands',
  'East of England': 'E. of England',
  'London': 'London',
  'North East (England)': 'N. East',
  'North West (England)': 'N. West',
  'Northern Ireland': 'N. Ireland',
  'Scotland': 'Scotland',
  'South East (England)': 'S. East',
  'South West (England)': 'S. West',
  'Wales': 'Wales',
  'West Midlands (England)': 'W. Midlands',
  'Yorkshire and The Humber': 'Yorkshire',
}

const REGION_COLORS: Record<string, string> = {
  'East Midlands (England)': '#3b82f6',
  'East of England': '#22c55e',
  'London': '#ef4444',
  'North East (England)': '#f59e0b',
  'North West (England)': '#8b5cf6',
  'Northern Ireland': '#06b6d4',
  'Scotland': '#ec4899',
  'South East (England)': '#14b8a6',
  'South West (England)': '#f97316',
  'Wales': '#84cc16',
  'West Midlands (England)': '#6366f1',
  'Yorkshire and The Humber': '#a855f7',
}

const CATEGORY_COLORS: Record<string, string> = {
  'Furniture': '#3b82f6',
  'Home Removal': '#22c55e',
  'Car': '#ef4444',
  'Motorbike': '#f59e0b',
  'Piano': '#8b5cf6',
}

function useMultiFilter<T extends string>(allOptions: readonly T[]) {
  const [selected, setSelected] = useState<Set<T>>(new Set(allOptions))
  const isAll = selected.size === allOptions.length
  const isActive = (val: T) => selected.has(val)
  const toggle = useCallback((val: T) => {
    setSelected((prev) => {
      if (prev.size === allOptions.length) return new Set([val])
      const next = new Set(prev)
      if (next.has(val)) {
        if (next.size > 1) next.delete(val)
      } else {
        next.add(val)
      }
      return next
    })
  }, [allOptions])
  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === allOptions.length) return prev
      return new Set(allOptions)
    })
  }, [allOptions])
  return { selected, isAll, isActive, toggle, toggleAll }
}

const pillClass = (active: boolean) =>
  `px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
    active ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
  }`

const formatMonthLabel = (month: string) => {
  const [year, monthNum] = month.split('-')
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[parseInt(monthNum) - 1]} ${year.slice(2)}`
}

const fmtCurrency = (val: number) => {
  if (val >= 1000) return `£${(val / 1000).toFixed(1)}k`
  return `£${val.toFixed(0)}`
}

// Helper to compute MoM and YoY
function computeComparisons(
  data: { month: string; spend: number; ttv: number }[]
): {
  month: string
  spend: number
  ttv: number
  spendTtvPct: number
  momSpendChange: number | null
  momTtvPctChange: number | null
  yoySpendChange: number | null
  yoyTtvPctChange: number | null
}[] {
  const sorted = [...data].sort((a, b) => a.month.localeCompare(b.month))
  const monthMap = new Map<string, { spend: number; ttv: number }>()
  sorted.forEach((d) => monthMap.set(d.month, d))

  return sorted.map((d, idx) => {
    const spendTtvPct = d.ttv > 0 ? (d.spend / d.ttv) * 100 : 0
    const prev = idx > 0 ? sorted[idx - 1] : null
    const prevPct = prev && prev.ttv > 0 ? (prev.spend / prev.ttv) * 100 : null

    // YoY: find same month last year
    const [y, m] = d.month.split('-')
    const yoyMonth = `${parseInt(y) - 1}-${m}`
    const yoyData = monthMap.get(yoyMonth)
    const yoyPct = yoyData && yoyData.ttv > 0 ? (yoyData.spend / yoyData.ttv) * 100 : null

    return {
      month: d.month,
      spend: d.spend,
      ttv: d.ttv,
      spendTtvPct: parseFloat(spendTtvPct.toFixed(2)),
      momSpendChange: prev ? parseFloat(((d.spend - prev.spend) / (prev.spend || 1) * 100).toFixed(1)) : null,
      momTtvPctChange: prevPct !== null ? parseFloat((spendTtvPct - prevPct).toFixed(2)) : null,
      yoySpendChange: yoyData ? parseFloat(((d.spend - yoyData.spend) / (yoyData.spend || 1) * 100).toFixed(1)) : null,
      yoyTtvPctChange: yoyPct !== null ? parseFloat((spendTtvPct - yoyPct).toFixed(2)) : null,
    }
  })
}

interface SectionProps {
  title: string
  chartData: { month: string; spend: number; spendTtvPct: number; momSpendChange: number | null; yoySpendChange: number | null; momTtvPctChange: number | null; yoyTtvPctChange: number | null }[]
}

const TrendSection: React.FC<SectionProps> = ({ title, chartData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-300">{title}</h3>

      {/* Spend vs TTV% chart */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4" style={{ height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <XAxis
              dataKey="month"
              tickFormatter={formatMonthLabel}
              stroke="#94a3b8"
              tick={{ fill: '#e2e8f0', fontSize: 12 }}
            />
            <YAxis
              yAxisId="spend"
              stroke="#3b82f6"
              tick={{ fill: '#93c5fd', fontSize: 12 }}
              tickFormatter={(val: number) => fmtCurrency(val)}
              label={{ value: 'Spend (£)', angle: -90, position: 'insideLeft', fill: '#93c5fd' }}
            />
            <YAxis
              yAxisId="pct"
              orientation="right"
              stroke="#f59e0b"
              tick={{ fill: '#fcd34d', fontSize: 12 }}
              tickFormatter={(val: number) => `${val}%`}
              label={{ value: 'Spend/TTV %', angle: 90, position: 'insideRight', fill: '#fcd34d' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '6px' }}
              labelStyle={{ color: '#e2e8f0' }}
              labelFormatter={(label: any) => formatMonthLabel(label)}
              formatter={(value: any, name: any) => {
                if (name === 'Spend') return [`£${fmtN(value)}`, name]
                if (name === 'Spend/TTV %') return [`${value}%`, name]
                return [value, name]
              }}
            />
            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
            <Line
              yAxisId="spend"
              type="monotone"
              dataKey="spend"
              stroke="#3b82f6"
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
              name="Spend"
              label={{
                position: 'top',
                fill: '#93c5fd',
                fontSize: 10,
                formatter: (val: any) => fmtCurrency(val),
              }}
            />
            <Line
              yAxisId="pct"
              type="monotone"
              dataKey="spendTtvPct"
              stroke="#f59e0b"
              dot={{ fill: '#f59e0b', r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
              name="Spend/TTV %"
              label={{
                position: 'bottom',
                fill: '#fcd34d',
                fontSize: 10,
                formatter: (val: any) => `${val}%`,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* MoM & YoY comparison table */}
      <div className="rounded-lg border border-slate-700 overflow-auto">
        <table className="w-full text-xs text-white">
          <thead className="bg-slate-700">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Month</th>
              <th className="px-3 py-2 text-right font-semibold">Spend</th>
              <th className="px-3 py-2 text-right font-semibold">Spend/TTV %</th>
              <th className="px-3 py-2 text-right font-semibold">MoM Spend</th>
              <th className="px-3 py-2 text-right font-semibold">MoM TTV%</th>
              <th className="px-3 py-2 text-right font-semibold">YoY Spend</th>
              <th className="px-3 py-2 text-right font-semibold">YoY TTV%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {chartData.map((row) => (
              <tr key={row.month} className="hover:bg-slate-800/80">
                <td className="px-3 py-2 font-medium">{formatMonthLabel(row.month)}</td>
                <td className="px-3 py-2 text-right tabular-nums">£{fmtN(row.spend)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.spendTtvPct}%</td>
                <td className={`px-3 py-2 text-right tabular-nums ${
                  row.momSpendChange === null ? 'text-slate-500' :
                  row.momSpendChange > 0 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {row.momSpendChange !== null ? `${row.momSpendChange > 0 ? '+' : ''}${row.momSpendChange}%` : '-'}
                </td>
                <td className={`px-3 py-2 text-right tabular-nums ${
                  row.momTtvPctChange === null ? 'text-slate-500' :
                  row.momTtvPctChange > 0 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {row.momTtvPctChange !== null ? `${row.momTtvPctChange > 0 ? '+' : ''}${row.momTtvPctChange}pp` : '-'}
                </td>
                <td className={`px-3 py-2 text-right tabular-nums ${
                  row.yoySpendChange === null ? 'text-slate-500' :
                  row.yoySpendChange > 0 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {row.yoySpendChange !== null ? `${row.yoySpendChange > 0 ? '+' : ''}${row.yoySpendChange}%` : '-'}
                </td>
                <td className={`px-3 py-2 text-right tabular-nums ${
                  row.yoyTtvPctChange === null ? 'text-slate-500' :
                  row.yoyTtvPctChange > 0 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {row.yoyTtvPctChange !== null ? `${row.yoyTtvPctChange > 0 ? '+' : ''}${row.yoyTtvPctChange}pp` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const SpendView: React.FC<SpendViewProps> = ({ nutsData, categoryData }) => {
  // NUTS regions
  const allNutsRegions = useMemo(() => {
    return Array.from(new Set(nutsData.map(r => r.nutsRegion))).sort()
  }, [nutsData]) as string[]

  const nutsFilter = useMultiFilter(allNutsRegions as unknown as readonly string[])

  // Categories
  const allCategories = useMemo(() => {
    return Array.from(new Set(categoryData.map(r => r.category))).sort()
  }, [categoryData]) as string[]

  const catFilter = useMultiFilter(allCategories as unknown as readonly string[])

  // Aggregate NUTS data by month (filtered)
  const nutsChartData = useMemo(() => {
    const filtered = nutsData.filter(r => nutsFilter.selected.has(r.nutsRegion))
    const monthMap: Record<string, { spend: number; ttv: number }> = {}
    filtered.forEach(r => {
      if (!monthMap[r.month]) monthMap[r.month] = { spend: 0, ttv: 0 }
      monthMap[r.month].spend += r.spend
      monthMap[r.month].ttv += r.ttv
    })
    const entries = Object.entries(monthMap).map(([month, d]) => ({ month, ...d }))
    return computeComparisons(entries)
  }, [nutsData, nutsFilter.selected])

  // Aggregate category data by month (filtered)
  const catChartData = useMemo(() => {
    const filtered = categoryData.filter(r => catFilter.selected.has(r.category))
    const monthMap: Record<string, { spend: number; ttv: number }> = {}
    filtered.forEach(r => {
      if (!monthMap[r.month]) monthMap[r.month] = { spend: 0, ttv: 0 }
      monthMap[r.month].spend += r.spend
      monthMap[r.month].ttv += r.ttv
    })
    const entries = Object.entries(monthMap).map(([month, d]) => ({ month, ...d }))
    return computeComparisons(entries)
  }, [categoryData, catFilter.selected])

  return (
    <div className="space-y-6">
      {/* === NUTS Section === */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-white">Spend vs TTV% by NUTS Region</h2>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 w-16 shrink-0">NUTS</span>
            <div className="flex gap-2 flex-wrap">
              <button className={pillClass(nutsFilter.isAll)} onClick={nutsFilter.toggleAll}>All</button>
              {allNutsRegions.map((r) => (
                <button key={r} className={pillClass(nutsFilter.isActive(r))} onClick={() => nutsFilter.toggle(r)}>
                  {SHORT_REGION[r] || r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <TrendSection title="Spend vs TTV% — NUTS Region" chartData={nutsChartData} />
      </div>

      {/* === Category Section === */}
      <div className="space-y-4 mt-8 pt-8 border-t border-slate-700">
        <h2 className="text-base font-semibold text-white">Spend vs TTV% by Category</h2>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 w-16 shrink-0">Category</span>
            <div className="flex gap-2 flex-wrap">
              <button className={pillClass(catFilter.isAll)} onClick={catFilter.toggleAll}>All</button>
              {allCategories.map((c) => (
                <button key={c} className={pillClass(catFilter.isActive(c))} onClick={() => catFilter.toggle(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <TrendSection title="Spend vs TTV% — Category" chartData={catChartData} />
      </div>
    </div>
  )
}

export default SpendView
