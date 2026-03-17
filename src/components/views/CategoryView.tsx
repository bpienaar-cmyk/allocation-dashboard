import React, { useState, useMemo } from 'react'
import { CategoryBreakdownRow, ActiveBookingRow, Country } from '../../types'
import { fmtN, fmtGBP, fmtP } from '../../utils/formatting'

const COUNTRY_LABELS: Record<Country, string> = {
  uk: 'UK (V4 + AVB)',
  spain: 'Spain (V4)',
  france: 'France (V4)',
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CATEGORIES = ['Home Removal', 'Furniture', 'Car', 'Motorbike', 'Piano']
const CAT_SHORT: Record<string, string> = {
  'Home Removal': 'Removals',
  'Furniture': 'Furn',
  'Car': 'Cars',
  'Motorbike': 'Bikes',
  'Piano': 'Pianos',
}

interface PartialMonthComparison {
  cutoffDay: number
  currentMonth: string
  mom: Record<string, Record<string, number>>
  yoy: Record<string, Record<string, number>>
}

interface CategoryViewProps {
  breakdownByCountry: Record<Country, CategoryBreakdownRow[]>
  activeBookingsByCountry: Record<Country, ActiveBookingRow[]>
  partialMonthByCountry: Record<Country, PartialMonthComparison>
  selectedCountry: Country
  onCountryChange: (country: Country) => void
}

/* ─── helper: format delta cell ─── */
function DeltaCell({ current, previous, label }: { current: number; previous: number | null; label: string }) {
  if (previous === null || previous === undefined) return <span className="text-slate-500 text-xs">—</span>
  const diff = current - previous
  const pct = previous > 0 ? ((diff / previous) * 100) : 0
  const color = diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-slate-400'
  const sign = diff > 0 ? '+' : ''
  return (
    <span className={`text-xs ${color}`}>
      {label}: {sign}{diff} ({sign}{pct.toFixed(1)}%)
    </span>
  )
}

const CategoryView: React.FC<CategoryViewProps> = ({
  breakdownByCountry,
  activeBookingsByCountry,
  partialMonthByCountry,
  selectedCountry,
  onCountryChange,
}) => {
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const countries: Country[] = ['uk', 'spain', 'france']
  const years = [2025, 2026]

  const allData = breakdownByCountry[selectedCountry] || []
  const allActive = activeBookingsByCountry[selectedCountry] || []

  // Derive NUTS1 regions dynamically from data
  const nuts1Regions = useMemo(() => {
    const set = new Set<string>()
    allData.forEach(r => {
      if (r.nuts1 && r.nuts1 !== 'Unknown') set.add(r.nuts1)
    })
    return Array.from(set).sort()
  }, [allData])

  // Build month strings
  const monthStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`
  const prevMonthDate = new Date(selectedYear, selectedMonth - 1, 1)
  const prevMonthStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-01`
  const yoyStr = `${selectedYear - 1}-${String(selectedMonth + 1).padStart(2, '0')}-01`

  // Check if this is the current (partial) month
  const partial = partialMonthByCountry[selectedCountry]
  const isPartialMonth = partial && monthStr === partial.currentMonth

  // Filtered categories based on toggle
  const displayCategories = selectedCategory === 'All' ? CATEGORIES : [selectedCategory]

  // ─── Completed & Paid comparison table ───
  // Build lookup: monthStr -> nuts1 -> category -> jobs
  const buildLookup = (data: CategoryBreakdownRow[]) => {
    const map: Record<string, Record<string, Record<string, number>>> = {}
    data.forEach(r => {
      const n = r.nuts1 || 'Unknown'
      if (!map[r.month]) map[r.month] = {}
      if (!map[r.month][n]) map[r.month][n] = {}
      map[r.month][n][r.category] = (map[r.month][n][r.category] || 0) + r.jobs
    })
    return map
  }

  const lookup = useMemo(() => buildLookup(allData), [allData])

  const getJobs = (month: string, nuts1: string, cat: string): number | null => {
    return lookup[month]?.[nuts1]?.[cat] ?? null
  }

  // For partial month: get MoM/YoY from the partial comparison data (same-day cutoff)
  // For full months: get MoM/YoY from the full-month baked data as before
  const getMomJobs = (nuts1: string, cat: string): number | null => {
    if (isPartialMonth) {
      return partial.mom[nuts1]?.[cat] ?? null
    }
    return getJobs(prevMonthStr, nuts1, cat)
  }

  const getYoyJobs = (nuts1: string, cat: string): number | null => {
    if (isPartialMonth) {
      return partial.yoy[nuts1]?.[cat] ?? null
    }
    return getJobs(yoyStr, nuts1, cat)
  }

  // Table rows: one per NUTS1 region
  const completedTableData = useMemo(() => {
    return nuts1Regions.map(nuts1 => {
      const row: Record<string, { current: number; mom: number | null; yoy: number | null }> = {}
      let total = 0
      let totalMom = 0
      let totalYoy = 0
      let hasMom = false
      let hasYoy = false

      displayCategories.forEach(cat => {
        const cur = getJobs(monthStr, nuts1, cat) ?? 0
        const prev = getMomJobs(nuts1, cat)
        const lastYear = getYoyJobs(nuts1, cat)
        row[cat] = { current: cur, mom: prev, yoy: lastYear }
        total += cur
        if (prev !== null) { totalMom += prev; hasMom = true }
        if (lastYear !== null) { totalYoy += lastYear; hasYoy = true }
      })

      return {
        nuts1,
        categories: row,
        total,
        totalMom: hasMom ? totalMom : null,
        totalYoy: hasYoy ? totalYoy : null,
      }
    }).filter(r => r.total > 0 || Object.values(r.categories).some(c => c.current > 0))
      .sort((a, b) => b.total - a.total)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nuts1Regions, monthStr, prevMonthStr, yoyStr, lookup, isPartialMonth, partial, displayCategories])

  // Grand totals
  const grandTotals = useMemo(() => {
    const totals: Record<string, { current: number; mom: number | null; yoy: number | null }> = {}
    let grandTotal = 0
    let grandMom: number | null = 0
    let grandYoy: number | null = 0

    displayCategories.forEach(cat => {
      let cur = 0, mom = 0, yoy = 0, hasMom = false, hasYoy = false
      completedTableData.forEach(r => {
        cur += r.categories[cat]?.current || 0
        if (r.categories[cat]?.mom !== null) { mom += r.categories[cat]?.mom || 0; hasMom = true }
        if (r.categories[cat]?.yoy !== null) { yoy += r.categories[cat]?.yoy || 0; hasYoy = true }
      })
      totals[cat] = { current: cur, mom: hasMom ? mom : null, yoy: hasYoy ? yoy : null }
      grandTotal += cur
      if (hasMom) grandMom = (grandMom || 0) + mom; else if (grandMom === 0) grandMom = null
      if (hasYoy) grandYoy = (grandYoy || 0) + yoy; else if (grandYoy === 0) grandYoy = null
    })

    return { categories: totals, total: grandTotal, totalMom: grandMom, totalYoy: grandYoy }
  }, [completedTableData])

  // ─── Active Bookings table ───
  const activeTableData = useMemo(() => {
    const monthPrefix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`
    const filtered = allActive.filter(r => r.day.startsWith(monthPrefix))

    // Get all days in the month
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    const days: string[] = []
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(`${monthPrefix}-${String(d).padStart(2, '0')}`)
    }

    // Build lookup: nuts1 -> day -> count
    const activeLookup: Record<string, Record<string, number>> = {}
    filtered.forEach(r => {
      const n = r.nuts1 || 'Unknown'
      if (!activeLookup[n]) activeLookup[n] = {}
      activeLookup[n][r.day] = (activeLookup[n][r.day] || 0) + r.activeCount
    })

    // Build rows sorted by total descending
    const rows = Object.entries(activeLookup).map(([nuts1, dayMap]) => {
      const total = Object.values(dayMap).reduce((s, v) => s + v, 0)
      return { nuts1, dayMap, total }
    }).sort((a, b) => b.total - a.total)

    return { days, rows }
  }, [allActive, selectedYear, selectedMonth])

  // ─── Render ───
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

      {/* Filter row */}
      <div className="flex items-center gap-4 flex-wrap">
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
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm font-medium">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ═══ COMPLETED & PAID TABLE ═══ */}
      <h2 className="text-lg font-semibold text-white">
        Completed & Paid — {MONTH_LABELS[selectedMonth]} {selectedYear} — {COUNTRY_LABELS[selectedCountry]}
        {isPartialMonth && (
          <span className="text-sm font-normal text-amber-400 ml-2">
            (MTD as of {partial.cutoffDay}{partial.cutoffDay === 1 ? 'st' : partial.cutoffDay === 2 ? 'nd' : partial.cutoffDay === 3 ? 'rd' : 'th'} — MoM/YoY compared to same date)
          </span>
        )}
      </h2>

      {completedTableData.length === 0 ? (
        <div className="rounded-lg bg-amber-900/30 border border-amber-700/50 px-4 py-2 text-sm text-amber-300">
          No completed data for this selection.
        </div>
      ) : (
        <div className="rounded-lg overflow-x-auto border border-slate-700">
          <table className="w-full text-sm text-white whitespace-nowrap">
            <thead className="bg-slate-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold sticky left-0 bg-slate-700 z-10">Region</th>
                {displayCategories.map(cat => (
                  <th key={cat} className="px-4 py-3 text-center font-semibold">{CAT_SHORT[cat] || cat}</th>
                ))}
                {displayCategories.length > 1 && (
                  <th className="px-4 py-3 text-center font-semibold">Total</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {completedTableData.map(row => (
                <tr key={row.nuts1} className="bg-slate-800 hover:bg-slate-750 transition-colors">
                  <td className="px-4 py-3 font-medium sticky left-0 bg-slate-800 z-10">{row.nuts1}</td>
                  {displayCategories.map(cat => {
                    const c = row.categories[cat]
                    return (
                      <td key={cat} className="px-4 py-3 text-center">
                        <div className="font-semibold">{fmtN(c?.current || 0)}</div>
                        <div className="flex flex-col gap-0.5 mt-1">
                          <DeltaCell current={c?.current || 0} previous={c?.mom ?? null} label="MoM" />
                          <DeltaCell current={c?.current || 0} previous={c?.yoy ?? null} label="YoY" />
                        </div>
                      </td>
                    )
                  })}
                  {displayCategories.length > 1 && (
                    <td className="px-4 py-3 text-center">
                      <div className="font-semibold">{fmtN(row.total)}</div>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <DeltaCell current={row.total} previous={row.totalMom} label="MoM" />
                        <DeltaCell current={row.total} previous={row.totalYoy} label="YoY" />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {/* Totals row */}
              <tr className="bg-slate-700 font-semibold">
                <td className="px-4 py-3 sticky left-0 bg-slate-700 z-10">Total</td>
                {displayCategories.map(cat => {
                  const c = grandTotals.categories[cat]
                  return (
                    <td key={cat} className="px-4 py-3 text-center">
                      <div>{fmtN(c?.current || 0)}</div>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <DeltaCell current={c?.current || 0} previous={c?.mom ?? null} label="MoM" />
                        <DeltaCell current={c?.current || 0} previous={c?.yoy ?? null} label="YoY" />
                      </div>
                    </td>
                  )
                })}
                {displayCategories.length > 1 && (
                  <td className="px-4 py-3 text-center">
                    <div>{fmtN(grandTotals.total)}</div>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <DeltaCell current={grandTotals.total} previous={grandTotals.totalMom} label="MoM" />
                      <DeltaCell current={grandTotals.total} previous={grandTotals.totalYoy} label="YoY" />
                    </div>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ═══ ACTIVE BOOKINGS TABLE ═══ */}
      <h2 className="text-lg font-semibold text-white mt-8">
        Active Bookings — {MONTH_LABELS[selectedMonth]} {selectedYear} — {COUNTRY_LABELS[selectedCountry]}
      </h2>

      {activeTableData.rows.length === 0 ? (
        <div className="rounded-lg bg-amber-900/30 border border-amber-700/50 px-4 py-2 text-sm text-amber-300">
          No active bookings for this selection.
        </div>
      ) : (
        <div className="rounded-lg overflow-x-auto border border-slate-700">
          <table className="text-sm text-white whitespace-nowrap">
            <thead className="bg-slate-700 text-white">
              <tr>
                <th className="px-3 py-2 text-left font-semibold sticky left-0 bg-slate-700 z-10 min-w-[180px]">Region</th>
                {activeTableData.days.map(day => {
                  const d = parseInt(day.split('-')[2])
                  return <th key={day} className="px-2 py-2 text-center font-semibold min-w-[40px]">{d}</th>
                })}
                <th className="px-3 py-2 text-center font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {activeTableData.rows.map(row => (
                <tr key={row.nuts1} className="bg-slate-800 hover:bg-slate-750 transition-colors">
                  <td className="px-3 py-2 font-medium sticky left-0 bg-slate-800 z-10">{row.nuts1}</td>
                  {activeTableData.days.map(day => {
                    const val = row.dayMap[day] || 0
                    return (
                      <td key={day} className={`px-2 py-2 text-center ${val > 0 ? 'text-white' : 'text-slate-600'}`}>
                        {val > 0 ? val : ''}
                      </td>
                    )
                  })}
                  <td className="px-3 py-2 text-center font-semibold text-blue-400">{row.total}</td>
                </tr>
              ))}
              {/* Day totals row */}
              <tr className="bg-slate-700 font-semibold">
                <td className="px-3 py-2 sticky left-0 bg-slate-700 z-10">Total</td>
                {activeTableData.days.map(day => {
                  const dayTotal = activeTableData.rows.reduce((s, r) => s + (r.dayMap[day] || 0), 0)
                  return (
                    <td key={day} className={`px-2 py-2 text-center ${dayTotal > 0 ? 'text-white' : 'text-slate-600'}`}>
                      {dayTotal > 0 ? dayTotal : ''}
                    </td>
                  )
                })}
                <td className="px-3 py-2 text-center text-blue-400">
                  {activeTableData.rows.reduce((s, r) => s + r.total, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CategoryView
