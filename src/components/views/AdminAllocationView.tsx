import React, { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Country } from '../../types'
import { adminAllocData, AdminAllocRow } from '../../data/adminAllocData'

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

const ALL_CATEGORIES = ['Car', 'Furniture', 'Home Removal', 'Motorbike', 'Piano']

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
  return `${monthNames[parseInt(monthNum) - 1]} '${year.slice(2)}`
}

interface ChartRow {
  month: string
  d1_total: number
  d1_noSpend: number
  d1_withSpend: number
  d1_noSpendPct: number
  d1_avgSpend: number
  otd_total: number
  otd_noSpend: number
  otd_withSpend: number
  otd_noSpendPct: number
  otd_avgSpend: number
}

interface AdminAllocationViewProps {
  selectedCountry: Country
  onCountryChange: (c: Country) => void
}

const tooltipStyle = {
  contentStyle: { backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', padding: '12px 16px' },
  labelStyle: { color: '#f1f5f9', fontWeight: 600 },
}

const AdminAllocationView: React.FC<AdminAllocationViewProps> = ({
  selectedCountry,
  onCountryChange,
}) => {
  const [selectedNuts, setSelectedNuts] = useState<string>('All')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [view, setView] = useState<'chart' | 'table'>('chart')

  // Get available NUTS regions from data
  const nutsRegions = useMemo(() => {
    const regions = Array.from(new Set(adminAllocData.filter(r => r.n !== 'Unknown').map(r => r.n))).sort()
    return regions
  }, [])

  // Filter and aggregate data
  const chartData = useMemo(() => {
    let filtered = adminAllocData.filter(r => r.n !== 'Unknown')

    if (selectedNuts !== 'All') {
      filtered = filtered.filter(r => r.n === selectedNuts)
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(r => r.c === selectedCategory)
    }

    // Group by month + timing
    const grouped: Record<string, { total: number; noSpend: number; withSpend: number; spendSum: number; spendCount: number }> = {}
    for (const r of filtered) {
      const key = `${r.m}|${r.t}`
      if (!grouped[key]) grouped[key] = { total: 0, noSpend: 0, withSpend: 0, spendSum: 0, spendCount: 0 }
      grouped[key].total += r.total
      grouped[key].noSpend += r.noSpend
      grouped[key].withSpend += r.withSpend
      if (r.avgSpend > 0 && r.withSpend > 0) {
        grouped[key].spendSum += r.avgSpend * r.withSpend
        grouped[key].spendCount += r.withSpend
      }
    }

    // Build chart rows
    const months = Array.from(new Set(filtered.map(r => r.m))).sort()
    const result: ChartRow[] = months.map(m => {
      const d1 = grouped[`${m}|D1`] || { total: 0, noSpend: 0, withSpend: 0, spendSum: 0, spendCount: 0 }
      const otd = grouped[`${m}|OTD`] || { total: 0, noSpend: 0, withSpend: 0, spendSum: 0, spendCount: 0 }
      return {
        month: m,
        d1_total: d1.total,
        d1_noSpend: d1.noSpend,
        d1_withSpend: d1.withSpend,
        d1_noSpendPct: d1.total > 0 ? parseFloat(((d1.noSpend / d1.total) * 100).toFixed(1)) : 0,
        d1_avgSpend: d1.spendCount > 0 ? parseFloat((d1.spendSum / d1.spendCount).toFixed(2)) : 0,
        otd_total: otd.total,
        otd_noSpend: otd.noSpend,
        otd_withSpend: otd.withSpend,
        otd_noSpendPct: otd.total > 0 ? parseFloat(((otd.noSpend / otd.total) * 100).toFixed(1)) : 0,
        otd_avgSpend: otd.spendCount > 0 ? parseFloat((otd.spendSum / otd.spendCount).toFixed(2)) : 0,
      }
    })
    return result
  }, [selectedNuts, selectedCategory])

  // Summary stats
  const summary = useMemo(() => {
    if (chartData.length === 0) return null
    const first = chartData[0]
    const last = chartData[chartData.length - 1]
    const d1Change = first.d1_noSpendPct - last.d1_noSpendPct
    return {
      d1Start: first.d1_noSpendPct,
      d1End: last.d1_noSpendPct,
      d1Change,
      otdAvg: parseFloat((chartData.reduce((s, r) => s + r.otd_noSpendPct, 0) / chartData.length).toFixed(1)),
      otdMin: Math.min(...chartData.map(r => r.otd_noSpendPct)),
      otdMax: Math.max(...chartData.map(r => r.otd_noSpendPct)),
    }
  }, [chartData])

  const first2026Idx = chartData.findIndex(r => r.month.startsWith('2026'))

  return (
    <div className="space-y-6">
      {/* Country selector */}
      <div className="flex items-center gap-3">
        {countries.map(c => (
          <button key={c} className={countryBtnClass(selectedCountry === c)} onClick={() => onCountryChange(c)}>
            {COUNTRY_LABELS[c]}
          </button>
        ))}
      </div>

      {/* Only UK has data for now */}
      {selectedCountry !== 'uk' ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <p className="text-slate-400 text-lg">Admin allocation data is currently available for UK only.</p>
        </div>
      ) : (
        <>
          {/* Filter pills */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Region</span>
              <button className={pillClass(selectedNuts === 'All')} onClick={() => setSelectedNuts('All')}>All</button>
              {nutsRegions.map(n => (
                <button key={n} className={pillClass(selectedNuts === n)} onClick={() => setSelectedNuts(n)}>
                  {SHORT_REGION[n] || n}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Category</span>
              <button className={pillClass(selectedCategory === 'All')} onClick={() => setSelectedCategory('All')}>All</button>
              {ALL_CATEGORIES.map(c => (
                <button key={c} className={pillClass(selectedCategory === c)} onClick={() => setSelectedCategory(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* View toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('chart')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'chart' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'table' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Data Table
            </button>
          </div>

          {/* Chart */}
          {view === 'chart' && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">
                Admin Allocation No-Spend % — D-1 vs OTD
                {selectedNuts !== 'All' && <span className="text-blue-400 ml-2">({SHORT_REGION[selectedNuts] || selectedNuts})</span>}
                {selectedCategory !== 'All' && <span className="text-amber-400 ml-2">({selectedCategory})</span>}
              </h3>
              <div style={{ height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="month"
                      tickFormatter={formatMonthLabel}
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: '#475569' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: '#475569' }}
                      tickFormatter={(v: number) => `${v}%`}
                    />
                    <Tooltip
                      {...tooltipStyle}
                      labelFormatter={(label: string) => formatMonthLabel(label)}
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                    />
                    <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12, color: '#cbd5e1' }} />
                    {first2026Idx >= 0 && (
                      <ReferenceLine
                        x={chartData[first2026Idx]?.month}
                        stroke="#475569"
                        strokeDasharray="6 4"
                        label={{ value: '2026 →', fill: '#64748b', fontSize: 11, position: 'top' }}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="d1_noSpendPct"
                      name="D-1 No Spend %"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#f59e0b' }}
                      activeDot={{ r: 6 }}
                      label={({ x, y, value }: any) => (
                        <text x={x} y={y - 12} fill="#f59e0b" fontSize={10} fontWeight={600} textAnchor="middle">
                          {value}%
                        </text>
                      )}
                    />
                    <Line
                      type="monotone"
                      dataKey="otd_noSpendPct"
                      name="OTD No Spend %"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#3b82f6' }}
                      activeDot={{ r: 6 }}
                      label={({ x, y, value }: any) => (
                        <text x={x} y={y + 18} fill="#3b82f6" fontSize={10} fontWeight={600} textAnchor="middle">
                          {value}%
                        </text>
                      )}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Table */}
          {view === 'table' && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-slate-400 font-semibold border-b-2 border-slate-600" rowSpan={2}>Month</th>
                    <th className="px-3 py-3 text-center font-bold border-b border-slate-600" colSpan={4} style={{ color: '#f59e0b' }}>D-1 (Day Before)</th>
                    <th className="px-3 py-3 text-center font-bold border-b border-slate-600" colSpan={4} style={{ color: '#3b82f6' }}>OTD (On The Day)</th>
                  </tr>
                  <tr>
                    {['Total', 'No Spend', 'With Spend', 'No Spend %', 'Total', 'No Spend', 'With Spend', 'No Spend %'].map((h, i) => (
                      <th key={i} className="px-3 py-2 text-right text-slate-400 font-medium text-xs border-b-2 border-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row, i) => {
                    const is2026 = row.month.startsWith('2026')
                    return (
                      <tr key={i} className={`border-b border-slate-700/50 ${is2026 ? 'bg-blue-950/20' : ''}`}>
                        <td className={`px-3 py-2.5 ${is2026 ? 'font-semibold text-slate-100' : 'text-slate-300'}`}>
                          {formatMonthLabel(row.month)}
                        </td>
                        <td className="px-3 py-2.5 text-right text-slate-300">{row.d1_total.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-right text-slate-300">{row.d1_noSpend.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-right text-slate-300">{row.d1_withSpend.toLocaleString()}</td>
                        <td className={`px-3 py-2.5 text-right font-bold ${
                          row.d1_noSpendPct < 70 ? 'text-red-400' : row.d1_noSpendPct < 85 ? 'text-amber-400' : 'text-green-400'
                        }`}>{row.d1_noSpendPct}%</td>
                        <td className="px-3 py-2.5 text-right text-slate-300">{row.otd_total.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-right text-slate-300">{row.otd_noSpend.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-right text-slate-300">{row.otd_withSpend.toLocaleString()}</td>
                        <td className={`px-3 py-2.5 text-right font-bold ${
                          row.otd_noSpendPct < 20 ? 'text-red-400' : row.otd_noSpendPct < 30 ? 'text-amber-400' : 'text-green-400'
                        }`}>{row.otd_noSpendPct}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary insight */}
          {summary && (
            <div className="bg-slate-800 rounded-lg border-l-4 border-amber-500 p-4 space-y-2">
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="font-bold text-amber-400">D-1 trend:</span>{' '}
                No-spend rate has fallen from {summary.d1Start}% ({formatMonthLabel(chartData[0].month)}) to {summary.d1End}% ({formatMonthLabel(chartData[chartData.length - 1].month)}) — a {summary.d1Change.toFixed(1)}pp decline.
                {summary.d1Change > 20 && ' The team increasingly needs to pay up to place jobs the day before pickup.'}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="font-bold text-blue-400">OTD trend:</span>{' '}
                Volatile between {summary.otdMin}–{summary.otdMax}%, averaging {summary.otdAvg}%. OTD has always been an emergency channel where spend is the norm.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminAllocationView
