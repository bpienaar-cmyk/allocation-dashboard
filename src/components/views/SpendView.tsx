import React, { useState, useMemo, useCallback, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { SpendNutsRow, SpendCategoryRow, Country } from '../../types'
import { fmtN } from '../../utils/formatting'

interface SpendViewProps {
  nutsDataByCountry: Record<string, SpendNutsRow[]>
  categoryDataByCountry: Record<string, SpendCategoryRow[]>
  selectedCountry: Country
  onCountryChange: (c: Country) => void
}

const COUNTRY_LABELS: Record<Country, string> = {
  uk: 'UK (V4 + AVB)',
  spain: 'Spain (V4)',
  france: 'France (V4)',
}
const countries: Country[] = ['uk', 'spain', 'france']

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

const pillClass = (active: boolean) =>
  `px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
    active ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
  }`

const countryBtnClass = (active: boolean) =>
  `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
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

const tooltipStyle = {
  contentStyle: { backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '6px' },
  labelStyle: { color: '#e2e8f0' },
}

function computeComparisons(
  data: { month: string; spend: number; ttv: number }[]
) {
  const sorted = [...data].sort((a, b) => a.month.localeCompare(b.month))
  const monthMap = new Map<string, { spend: number; ttv: number }>()
  sorted.forEach((d) => monthMap.set(d.month, d))

  return sorted.map((d, idx) => {
    const spendTtvPct = d.ttv > 0 ? (d.spend / d.ttv) * 100 : 0
    const prev = idx > 0 ? sorted[idx - 1] : null
    const prevPct = prev && prev.ttv > 0 ? (prev.spend / prev.ttv) * 100 : null

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

type ChartRow = ReturnType<typeof computeComparisons>[number]

const SpendAmountChart: React.FC<{ data: ChartRow[] }> = ({ data }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold text-slate-300">Spend Amount (£)</h3>
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4" style={{ height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
          <XAxis dataKey="month" tickFormatter={formatMonthLabel} stroke="#94a3b8" tick={{ fill: '#e2e8f0', fontSize: 12 }} />
          <YAxis stroke="#3b82f6" tick={{ fill: '#93c5fd', fontSize: 12 }} tickFormatter={(val: number) => fmtCurrency(val)} domain={[0, (max: number) => Math.ceil(max * 1.15)]} />
          <Tooltip
            {...tooltipStyle}
            labelFormatter={(label: any) => formatMonthLabel(label)}
            formatter={(value: any, name: any) => [`£${fmtN(value)}`, name]}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          <Line
            type="monotone"
            dataKey="spend"
            stroke="#3b82f6"
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
            name="Spend"
            label={{ position: 'top', fill: '#93c5fd', fontSize: 10, formatter: (val: any) => fmtCurrency(val) }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)

const SpendTtvPctChart: React.FC<{ data: ChartRow[] }> = ({ data }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold text-slate-300">Spend / TTV %</h3>
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4" style={{ height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <XAxis dataKey="month" tickFormatter={formatMonthLabel} stroke="#94a3b8" tick={{ fill: '#e2e8f0', fontSize: 12 }} />
          <YAxis stroke="#f59e0b" tick={{ fill: '#fcd34d', fontSize: 12 }} tickFormatter={(val: number) => `${val}%`} />
          <Tooltip
            {...tooltipStyle}
            labelFormatter={(label: any) => formatMonthLabel(label)}
            formatter={(value: any, name: any) => [`${value}%`, name]}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          <Line
            type="monotone"
            dataKey="spendTtvPct"
            stroke="#f59e0b"
            dot={{ fill: '#f59e0b', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
            name="Spend/TTV %"
            label={{ position: 'top', fill: '#fcd34d', fontSize: 10, formatter: (val: any) => `${val}%` }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)

const ComparisonTable: React.FC<{ data: ChartRow[] }> = ({ data }) => (
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
        {data.map((row) => (
          <tr key={row.month} className="hover:bg-slate-800/80">
            <td className="px-3 py-2 font-medium">{formatMonthLabel(row.month)}</td>
            <td className="px-3 py-2 text-right tabular-nums">£{fmtN(row.spend)}</td>
            <td className="px-3 py-2 text-right tabular-nums">{row.spendTtvPct}%</td>
            <td className={`px-3 py-2 text-right tabular-nums ${row.momSpendChange === null ? 'text-slate-500' : row.momSpendChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {row.momSpendChange !== null ? `${row.momSpendChange > 0 ? '+' : ''}${row.momSpendChange}%` : '-'}
            </td>
            <td className={`px-3 py-2 text-right tabular-nums ${row.momTtvPctChange === null ? 'text-slate-500' : row.momTtvPctChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {row.momTtvPctChange !== null ? `${row.momTtvPctChange > 0 ? '+' : ''}${row.momTtvPctChange}pp` : '-'}
            </td>
            <td className={`px-3 py-2 text-right tabular-nums ${row.yoySpendChange === null ? 'text-slate-500' : row.yoySpendChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {row.yoySpendChange !== null ? `${row.yoySpendChange > 0 ? '+' : ''}${row.yoySpendChange}%` : '-'}
            </td>
            <td className={`px-3 py-2 text-right tabular-nums ${row.yoyTtvPctChange === null ? 'text-slate-500' : row.yoyTtvPctChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {row.yoyTtvPctChange !== null ? `${row.yoyTtvPctChange > 0 ? '+' : ''}${row.yoyTtvPctChange}pp` : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const SpendView: React.FC<SpendViewProps> = ({ nutsDataByCountry, categoryDataByCountry, selectedCountry, onCountryChange }) => {
  const nutsData = nutsDataByCountry[selectedCountry] || []
  const categoryData = categoryDataByCountry[selectedCountry] || []

  const allNutsRegions = useMemo(() => {
    return Array.from(new Set(nutsData.map(r => r.nutsRegion))).sort()
  }, [nutsData]) as string[]

  const allCategories = useMemo(() => {
    return Array.from(new Set(categoryData.map(r => r.category))).sort()
  }, [categoryData]) as string[]

  // NUTS filter with reset on country change
  const [selectedNuts, setSelectedNuts] = useState<Set<string>>(new Set(allNutsRegions))
  const nutsIsAll = selectedNuts.size === allNutsRegions.length
  const nutsIsActive = (val: string) => selectedNuts.has(val)
  const nutsToggle = useCallback((val: string) => {
    setSelectedNuts((prev) => {
      if (prev.size === allNutsRegions.length) return new Set([val])
      const next = new Set(prev)
      if (next.has(val)) { if (next.size > 1) next.delete(val) } else { next.add(val) }
      return next
    })
  }, [allNutsRegions])
  const nutsToggleAll = useCallback(() => {
    setSelectedNuts(new Set(allNutsRegions))
  }, [allNutsRegions])

  // Category filter with reset on country change
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set(allCategories))
  const catIsAll = selectedCats.size === allCategories.length
  const catIsActive = (val: string) => selectedCats.has(val)
  const catToggle = useCallback((val: string) => {
    setSelectedCats((prev) => {
      if (prev.size === allCategories.length) return new Set([val])
      const next = new Set(prev)
      if (next.has(val)) { if (next.size > 1) next.delete(val) } else { next.add(val) }
      return next
    })
  }, [allCategories])
  const catToggleAll = useCallback(() => {
    setSelectedCats(new Set(allCategories))
  }, [allCategories])

  // Reset filters when country changes (NUTS regions change per country)
  useEffect(() => {
    setSelectedNuts(new Set(allNutsRegions))
  }, [allNutsRegions])
  useEffect(() => {
    setSelectedCats(new Set(allCategories))
  }, [allCategories])

  const chartData = useMemo(() => {
    // Apply NUTS filter
    const nutsFiltered = nutsData.filter(r => selectedNuts.has(r.nutsRegion))
    const nutsMonthMap: Record<string, { spend: number; ttv: number }> = {}
    nutsFiltered.forEach(r => {
      if (!nutsMonthMap[r.month]) nutsMonthMap[r.month] = { spend: 0, ttv: 0 }
      nutsMonthMap[r.month].spend += r.spend
      nutsMonthMap[r.month].ttv += r.ttv
    })

    // Apply Category filter
    const catFiltered = categoryData.filter(r => selectedCats.has(r.category))
    const catMonthMap: Record<string, { spend: number; ttv: number }> = {}
    catFiltered.forEach(r => {
      if (!catMonthMap[r.month]) catMonthMap[r.month] = { spend: 0, ttv: 0 }
      catMonthMap[r.month].spend += r.spend
      catMonthMap[r.month].ttv += r.ttv
    })

    const allMonths = Array.from(new Set([...Object.keys(nutsMonthMap), ...Object.keys(catMonthMap)])).sort()

    // Get unfiltered totals
    const totalMonthMap: Record<string, { spend: number; ttv: number }> = {}
    nutsData.forEach(r => {
      if (!totalMonthMap[r.month]) totalMonthMap[r.month] = { spend: 0, ttv: 0 }
      totalMonthMap[r.month].spend += r.spend
      totalMonthMap[r.month].ttv += r.ttv
    })

    const combined = allMonths.map(month => {
      const total = totalMonthMap[month] || { spend: 1, ttv: 1 }
      const nuts = nutsMonthMap[month] || { spend: 0, ttv: 0 }
      const cat = catMonthMap[month] || { spend: 0, ttv: 0 }

      const nutsSpendRatio = total.spend > 0 ? nuts.spend / total.spend : 0
      const nutsTtvRatio = total.ttv > 0 ? nuts.ttv / total.ttv : 0
      const catSpendRatio = total.spend > 0 ? cat.spend / total.spend : 0
      const catTtvRatio = total.ttv > 0 ? cat.ttv / total.ttv : 0

      return {
        month,
        spend: Math.round(total.spend * nutsSpendRatio * catSpendRatio * 100) / 100,
        ttv: Math.round(total.ttv * nutsTtvRatio * catTtvRatio * 100) / 100,
      }
    })

    return computeComparisons(combined)
  }, [nutsData, categoryData, selectedNuts, selectedCats])

  return (
    <div className="space-y-6">
      {/* === Country Toggle === */}
      <div className="flex items-center gap-2">
        {countries.map((c) => (
          <button
            key={c}
            onClick={() => onCountryChange(c)}
            className={countryBtnClass(selectedCountry === c)}
          >
            {COUNTRY_LABELS[c]}
          </button>
        ))}
      </div>

      {/* === Filters === */}
      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-16 shrink-0">NUTS</span>
          <div className="flex gap-2 flex-wrap">
            <button className={pillClass(nutsIsAll)} onClick={nutsToggleAll}>All</button>
            {allNutsRegions.map((r) => (
              <button key={r} className={pillClass(nutsIsActive(r))} onClick={() => nutsToggle(r)}>
                {SHORT_REGION[r] || r}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-16 shrink-0">Category</span>
          <div className="flex gap-2 flex-wrap">
            <button className={pillClass(catIsAll)} onClick={catToggleAll}>All</button>
            {allCategories.map((c) => (
              <button key={c} className={pillClass(catIsActive(c))} onClick={() => catToggle(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* === Charts === */}
      <div className="space-y-4">
        <SpendAmountChart data={chartData} />
        <SpendTtvPctChart data={chartData} />
        <ComparisonTable data={chartData} />
      </div>
    </div>
  )
}

export default SpendView
