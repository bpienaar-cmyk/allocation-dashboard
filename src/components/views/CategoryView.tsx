import React, { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CategoryBreakdownRow, Country } from '../../types'
import { fmtGBP, fmtN, fmtP } from '../../utils/formatting'

const COUNTRY_LABELS: Record<Country, string> = {
  uk: 'UK (V4 + AVB)',
  spain: 'Spain (V4)',
  france: 'France (V4)',
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const CATEGORY_OPTIONS = ['All', 'Furniture', 'Home Removal', 'Car', 'Motorbike', 'Piano']

const UK_NUTS1 = [
  'All',
  'London',
  'South East (England)',
  'East of England',
  'North West (England)',
  'South West (England)',
  'West Midlands (England)',
  'Yorkshire and The Humber',
  'East Midlands (England)',
  'Scotland',
  'North East (England)',
  'Wales',
  'Northern Ireland',
]

interface CategoryViewProps {
  breakdownByCountry: Record<Country, CategoryBreakdownRow[]>
  selectedCountry: Country
  onCountryChange: (country: Country) => void
}

interface AggRow {
  label: string
  jobs: number
  ttv: number
  avFee: number
  marginPct: number
  allocSpend: number
  spendTtvPct: number
}

const CategoryView: React.FC<CategoryViewProps> = ({ breakdownByCountry, selectedCountry, onCountryChange }) => {
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()) // 0-indexed
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedNuts1, setSelectedNuts1] = useState('All')

  const countries: Country[] = ['uk', 'spain', 'france']
  const years = [2025, 2026]

  const allData = breakdownByCountry[selectedCountry] || []

  // Filter data for selected month+year
  const monthStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`

  const filtered = useMemo(() => {
    let rows = allData.filter(r => r.month === monthStr)
    if (selectedCategory !== 'All') {
      rows = rows.filter(r => r.category === selectedCategory)
    }
    if (selectedNuts1 !== 'All' && selectedCountry === 'uk') {
      rows = rows.filter(r => r.nuts1 === selectedNuts1)
    }
    return rows
  }, [allData, monthStr, selectedCategory, selectedNuts1, selectedCountry])

  // Aggregate rows for display
  const tableData = useMemo<AggRow[]>(() => {
    // Determine grouping: by category or by NUTS1
    const groupByNuts = selectedCategory !== 'All' && selectedNuts1 === 'All' && selectedCountry === 'uk'
    const groupKey = groupByNuts ? 'nuts1' : 'category'

    const groups: Record<string, { jobs: number; ttv: number; avFee: number; allocSpend: number }> = {}
    filtered.forEach(r => {
      const key = groupByNuts ? r.nuts1 : r.category
      if (!groups[key]) groups[key] = { jobs: 0, ttv: 0, avFee: 0, allocSpend: 0 }
      groups[key].jobs += r.jobs
      groups[key].ttv += r.ttv
      groups[key].avFee += r.avFee
      groups[key].allocSpend += r.allocSpend
    })

    return Object.entries(groups)
      .map(([label, g]) => ({
        label,
        jobs: g.jobs,
        ttv: g.ttv,
        avFee: g.avFee,
        marginPct: g.ttv > 0 ? (g.avFee / g.ttv) * 100 : 0,
        allocSpend: g.allocSpend,
        spendTtvPct: g.ttv > 0 ? (g.allocSpend / g.ttv) * 100 : 0,
      }))
      .sort((a, b) => b.jobs - a.jobs)
  }, [filtered, selectedCategory, selectedNuts1, selectedCountry])

  // Totals row
  const totals = useMemo(() => {
    const t = tableData.reduce((acc, r) => ({
      jobs: acc.jobs + r.jobs,
      ttv: acc.ttv + r.ttv,
      avFee: acc.avFee + r.avFee,
      allocSpend: acc.allocSpend + r.allocSpend,
    }), { jobs: 0, ttv: 0, avFee: 0, allocSpend: 0 })
    return {
      ...t,
      marginPct: t.ttv > 0 ? (t.avFee / t.ttv) * 100 : 0,
      spendTtvPct: t.ttv > 0 ? (t.allocSpend / t.ttv) * 100 : 0,
    }
  }, [tableData])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-slate-800 border border-slate-700 rounded p-3 text-white text-sm space-y-1">
          <p className="font-semibold">{item.label}</p>
          <p>Jobs: {fmtN(item.jobs)}</p>
          <p className="text-blue-400">Spend: {fmtGBP(item.allocSpend)}</p>
          <p className="text-emerald-400">Spend/TTV: {fmtP(item.spendTtvPct)}</p>
        </div>
      )
    }
    return null
  }

  const groupByNuts = selectedCategory !== 'All' && selectedNuts1 === 'All' && selectedCountry === 'uk'

  return (
    <div className="space-y-4">
      {/* Country toggle */}
      <div className="flex items-center gap-2">
        {countries.map((c) => (
          <button
            key={c}
            onClick={() => { onCountryChange(c); setSelectedNuts1('All'); }}
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

      {/* Filter row */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Month */}
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm font-medium">Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            {MONTH_LABELS.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="flex items-center gap-1">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedYear === y
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Category */}
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm font-medium">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* NUTS1 - only for UK */}
        {selectedCountry === 'uk' && (
          <div className="flex items-center gap-2">
            <label className="text-slate-400 text-sm font-medium">Region:</label>
            <select
              value={selectedNuts1}
              onChange={(e) => setSelectedNuts1(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {UK_NUTS1.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-white">
        {MONTH_LABELS[selectedMonth]} {selectedYear} — {COUNTRY_LABELS[selectedCountry]}
        {selectedCategory !== 'All' && ` — ${selectedCategory}`}
        {selectedNuts1 !== 'All' && ` — ${selectedNuts1}`}
      </h2>

      {tableData.length === 0 ? (
        <div className="rounded-lg bg-amber-900/30 border border-amber-700/50 px-4 py-2 text-sm text-amber-300">
          No data available for this selection.
        </div>
      ) : (
        <>
          {/* Bar chart */}
          <div className="bg-slate-800 rounded-lg p-6" style={{ height: Math.max(250, tableData.length * 45 + 80) + 'px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tableData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 180, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={(v) => {
                  if (v >= 1000000) return `£${(v / 1000000).toFixed(1)}M`
                  if (v >= 1000) return `£${(v / 1000).toFixed(0)}K`
                  return `£${v}`
                }} />
                <YAxis
                  dataKey="label"
                  type="category"
                  stroke="#94a3b8"
                  tick={{ fontSize: 11 }}
                  width={170}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px', color: '#e2e8f0' }} />
                <Bar
                  dataKey="allocSpend"
                  fill="#3b82f6"
                  radius={[0, 8, 8, 0]}
                  name="Allocation Spend"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="rounded-lg overflow-hidden border border-slate-700">
            <table className="w-full text-sm text-white">
              <thead className="bg-slate-700 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">{groupByNuts ? 'Region' : 'Category'}</th>
                  <th className="px-6 py-3 text-right font-semibold">Jobs</th>
                  <th className="px-6 py-3 text-right font-semibold">TTV</th>
                  <th className="px-6 py-3 text-right font-semibold">Margin %</th>
                  <th className="px-6 py-3 text-right font-semibold">Alloc Spend</th>
                  <th className="px-6 py-3 text-right font-semibold">Spend/TTV %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {tableData.map((row) => (
                  <tr key={row.label} className="bg-slate-800 hover:bg-slate-750 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.label}</td>
                    <td className="px-6 py-4 text-right">{fmtN(row.jobs)}</td>
                    <td className="px-6 py-4 text-right">{fmtGBP(row.ttv)}</td>
                    <td className="px-6 py-4 text-right text-blue-400">{fmtP(row.marginPct)}</td>
                    <td className="px-6 py-4 text-right font-medium">{fmtGBP(row.allocSpend)}</td>
                    <td className="px-6 py-4 text-right text-emerald-400">{fmtP(row.spendTtvPct)}</td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-slate-700 font-semibold">
                  <td className="px-6 py-4">Total</td>
                  <td className="px-6 py-4 text-right">{fmtN(totals.jobs)}</td>
                  <td className="px-6 py-4 text-right">{fmtGBP(totals.ttv)}</td>
                  <td className="px-6 py-4 text-right text-blue-400">{fmtP(totals.marginPct)}</td>
                  <td className="px-6 py-4 text-right">{fmtGBP(totals.allocSpend)}</td>
                  <td className="px-6 py-4 text-right text-emerald-400">{fmtP(totals.spendTtvPct)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default CategoryView
