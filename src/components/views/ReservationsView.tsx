import React, { useState, useMemo, useCallback } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { IResReservationRow, IResTrendRow } from '../../types'
import { fmtN } from '../../utils/formatting'

interface ReservationsViewProps {
  data: IResReservationRow[]
  trendData?: IResTrendRow[]
}

const REGION_ORDER = [
  'East Midlands (England)',
  'East of England',
  'London',
  'North East (England)',
  'North West (England)',
  'Northern Ireland',
  'Scotland',
  'South East (England)',
  'South West (England)',
  'Wales',
  'West Midlands (England)',
  'Yorkshire and The Humber',
]

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

const PEOPLE_OPTIONS = ['1', '2', '12'] as const
const TYPE_OPTIONS = ['Returns', 'Customs', 'Local', 'Nationwide'] as const
const STATUS_OPTIONS = ['pending', 'accepted', 'journey_associated', 'unsuccessful'] as const

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-400',
  accepted: 'text-blue-400',
  journey_associated: 'text-green-400',
  unsuccessful: 'text-red-400',
}

const STATUS_BG: Record<string, string> = {
  pending: 'bg-amber-500/20',
  accepted: 'bg-blue-500/20',
  journey_associated: 'bg-green-500/20',
  unsuccessful: 'bg-red-500/20',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  journey_associated: 'Journey Assoc.',
  unsuccessful: 'Unsuccessful',
}

// Generic multi-select toggle hook
function useMultiFilter<T extends string>(allOptions: readonly T[]) {
  const [selected, setSelected] = useState<Set<T>>(new Set(allOptions))

  const isAll = selected.size === allOptions.length
  const isActive = (val: T) => selected.has(val)

  const toggle = useCallback((val: T) => {
    setSelected((prev) => {
      // If all are selected, switch to ONLY this one
      if (prev.size === allOptions.length) {
        return new Set([val])
      }
      const next = new Set(prev)
      if (next.has(val)) {
        // Don't allow deselecting the last one
        if (next.size > 1) next.delete(val)
      } else {
        next.add(val)
      }
      return next
    })
  }, [allOptions])

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === allOptions.length) return prev // already all selected, stay
      return new Set(allOptions)
    })
  }, [allOptions])

  return { selected, isAll, isActive, toggle, toggleAll }
}

const ReservationsView: React.FC<ReservationsViewProps> = ({ data, trendData }) => {
  const people = useMultiFilter(PEOPLE_OPTIONS)
  const types = useMultiFilter(TYPE_OPTIONS)
  const statuses = useMultiFilter(STATUS_OPTIONS)

  // Trend chart filters (separate from heatmap filters)
  const trendPeople = useMultiFilter(PEOPLE_OPTIONS)
  const trendTypes = useMultiFilter(TYPE_OPTIONS)

  // Get unique NUTS regions from trend data
  const allNutsRegions = useMemo(() => {
    if (!trendData) return []
    return Array.from(new Set(trendData.map(r => r.nutsRegion))).sort()
  }, [trendData])

  // Create a dynamic multi-filter for NUTS regions
  const [trendNutsSelected, setTrendNutsSelected] = useState<Set<string>>(new Set())

  const trendNutsToggle = useCallback((val: string) => {
    setTrendNutsSelected((prev) => {
      // If all are selected, switch to ONLY this one
      if (prev.size === allNutsRegions.length) {
        return new Set([val])
      }
      const next = new Set(prev)
      if (next.has(val)) {
        if (next.size > 1) next.delete(val)
      } else {
        next.add(val)
      }
      return next
    })
  }, [allNutsRegions])

  const trendNutsToggleAll = useCallback(() => {
    setTrendNutsSelected((prev) => {
      if (prev.size === allNutsRegions.length) return prev
      return new Set(allNutsRegions)
    })
  }, [allNutsRegions])

  // Initialize trendNutsSelected when allNutsRegions changes
  const trendNutsIsAll = trendNutsSelected.size === allNutsRegions.length && allNutsRegions.length > 0
  useMemo(() => {
    if (trendNutsSelected.size === 0 && allNutsRegions.length > 0) {
      setTrendNutsSelected(new Set(allNutsRegions))
    }
  }, [allNutsRegions, trendNutsSelected])

  // Get all unique dates sorted
  const allDays = useMemo(() => {
    const daySet = new Set<string>()
    data.forEach((r) => daySet.add(r.day))
    return Array.from(daySet).sort()
  }, [data])

  // Filter data based on multi-select toggles
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (!people.selected.has(String(row.people) as typeof PEOPLE_OPTIONS[number])) return false
      if (!types.selected.has(row.resType as typeof TYPE_OPTIONS[number])) return false
      if (!statuses.selected.has(row.status as typeof STATUS_OPTIONS[number])) return false
      return true
    })
  }, [data, people.selected, types.selected, statuses.selected])

  // Build date x region grid
  const gridData = useMemo(() => {
    const grid: Record<string, Record<string, number>> = {}
    REGION_ORDER.forEach((r) => {
      grid[r] = {}
      allDays.forEach((d) => { grid[r][d] = 0 })
    })
    filteredData.forEach((row) => {
      if (grid[row.nutsRegion]) {
        grid[row.nutsRegion][row.day] = (grid[row.nutsRegion][row.day] || 0) + row.count
      }
    })
    return grid
  }, [filteredData, allDays])

  const dayTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    allDays.forEach((d) => {
      totals[d] = REGION_ORDER.reduce((sum, r) => sum + (gridData[r]?.[d] || 0), 0)
    })
    return totals
  }, [gridData, allDays])

  const regionTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    REGION_ORDER.forEach((r) => {
      totals[r] = allDays.reduce((sum, d) => sum + (gridData[r]?.[d] || 0), 0)
    })
    return totals
  }, [gridData, allDays])

  const grandTotal = Object.values(dayTotals).reduce((s, v) => s + v, 0)

  const formatDayHeader = (day: string) => {
    const d = new Date(day + 'T00:00:00')
    return `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })}`
  }

  const today = new Date().toISOString().slice(0, 10)

  const pillClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
      active
        ? 'bg-blue-600 text-white'
        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
    }`

  const maxVal = useMemo(() => {
    let mx = 0
    REGION_ORDER.forEach((r) => {
      allDays.forEach((d) => {
        if (gridData[r]?.[d] > mx) mx = gridData[r][d]
      })
    })
    return mx || 1
  }, [gridData, allDays])

  const cellBg = (val: number) => {
    if (val === 0) return ''
    const intensity = Math.min(val / maxVal, 1)
    const alpha = 0.1 + intensity * 0.4
    // Use a single status colour if only one status selected, otherwise blue
    if (statuses.selected.size === 1) {
      const s = Array.from(statuses.selected)[0]
      if (s === 'journey_associated') return `rgba(34, 197, 94, ${alpha})`
      if (s === 'accepted') return `rgba(59, 130, 246, ${alpha})`
      if (s === 'unsuccessful') return `rgba(239, 68, 68, ${alpha})`
      if (s === 'pending') return `rgba(245, 158, 11, ${alpha})`
    }
    return `rgba(59, 130, 246, ${alpha})`
  }

  // Build trend chart data
  const chartData = useMemo(() => {
    if (!trendData) return []

    const filteredTrend = trendData.filter((row) => {
      if (!trendPeople.selected.has(String(row.people) as typeof PEOPLE_OPTIONS[number])) return false
      if (!trendTypes.selected.has(row.resType as typeof TYPE_OPTIONS[number])) return false
      if (!trendNutsSelected.has(row.nutsRegion)) return false
      return true
    })

    const monthMap: Record<string, { journeyAssoc: number; unsuccessful: number }> = {}
    filteredTrend.forEach((row) => {
      if (!monthMap[row.month]) {
        monthMap[row.month] = { journeyAssoc: 0, unsuccessful: 0 }
      }
      monthMap[row.month].journeyAssoc += row.journeyAssoc
      monthMap[row.month].unsuccessful += row.unsuccessful
    })

    // Sort months and format dates
    const sortedMonths = Object.keys(monthMap).sort()
    return sortedMonths.map((month) => {
      const { journeyAssoc, unsuccessful } = monthMap[month]
      const total = journeyAssoc + unsuccessful
      const rate = total > 0 ? (journeyAssoc / total) * 100 : 0
      return {
        month,
        rate: parseFloat(rate.toFixed(1)),
        journeyAssoc,
        unsuccessful,
        total,
      }
    })
  }, [trendData, trendPeople.selected, trendTypes.selected, trendNutsSelected])

  const formatMonthLabel = (month: string) => {
    const [year, monthNum] = month.split('-')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const shortYear = year.slice(2)
    return `${monthNames[parseInt(monthNum) - 1]} ${shortYear}`
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
        {/* People filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-16 shrink-0">People</span>
          <div className="flex gap-2 flex-wrap">
            <button className={pillClass(people.isAll)} onClick={people.toggleAll}>All</button>
            {PEOPLE_OPTIONS.map((p) => (
              <button key={p} className={pillClass(people.isActive(p))} onClick={() => people.toggle(p)}>
                {p} Man
              </button>
            ))}
          </div>
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-16 shrink-0">Type</span>
          <div className="flex gap-2 flex-wrap">
            <button className={pillClass(types.isAll)} onClick={types.toggleAll}>All</button>
            {TYPE_OPTIONS.map((t) => (
              <button key={t} className={pillClass(types.isActive(t))} onClick={() => types.toggle(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-16 shrink-0">Status</span>
          <div className="flex gap-2 flex-wrap">
            <button className={pillClass(statuses.isAll)} onClick={statuses.toggleAll}>All</button>
            {STATUS_OPTIONS.map((s) => (
              <button key={s} className={pillClass(statuses.isActive(s))} onClick={() => statuses.toggle(s)}>
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date x NUTS table */}
      <div className="rounded-lg border border-slate-700 overflow-auto" style={{ maxHeight: '600px' }}>
        <table className="text-xs text-white border-collapse" style={{ minWidth: `${allDays.length * 52 + 140}px` }}>
          <thead className="bg-slate-700 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left font-semibold sticky left-0 bg-slate-700 z-20 border-r border-slate-600" style={{ minWidth: '120px' }}>
                Region
              </th>
              {allDays.map((day) => (
                <th
                  key={day}
                  className={`px-1 py-2 text-center font-medium whitespace-nowrap ${
                    day === today ? 'bg-blue-900/40' : day > today ? 'bg-slate-700/60' : ''
                  }`}
                  style={{ minWidth: '48px' }}
                >
                  {formatDayHeader(day)}
                </th>
              ))}
              <th className="px-3 py-2 text-right font-semibold border-l border-slate-600" style={{ minWidth: '60px' }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {REGION_ORDER.map((region) => (
              <tr key={region} className="hover:bg-slate-800/80 transition-colors">
                <td className="px-3 py-2 font-medium sticky left-0 bg-slate-800 z-10 border-r border-slate-700" title={region}>
                  {SHORT_REGION[region] || region}
                </td>
                {allDays.map((day) => {
                  const val = gridData[region]?.[day] || 0
                  return (
                    <td
                      key={day}
                      className={`px-1 py-2 text-center tabular-nums ${
                        day === today ? 'border-x border-blue-700/30' : ''
                      }`}
                      style={{ backgroundColor: cellBg(val) }}
                    >
                      {val > 0 ? val : <span className="text-slate-600">-</span>}
                    </td>
                  )
                })}
                <td className="px-3 py-2 text-right font-semibold border-l border-slate-600">
                  {fmtN(regionTotals[region] || 0)}
                </td>
              </tr>
            ))}
            <tr className="bg-slate-700 font-semibold border-t-2 border-slate-500">
              <td className="px-3 py-2 sticky left-0 bg-slate-700 z-10 border-r border-slate-600">TOTAL</td>
              {allDays.map((day) => (
                <td key={day} className="px-1 py-2 text-center tabular-nums">
                  {dayTotals[day] > 0 ? dayTotals[day] : <span className="text-slate-500">-</span>}
                </td>
              ))}
              <td className="px-3 py-2 text-right border-l border-slate-600">{fmtN(grandTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {STATUS_OPTIONS.map((status) => {
          const count = filteredData
            .filter((r) => r.status === status)
            .reduce((s, r) => s + r.count, 0)
          return (
            <div key={status} className={`rounded-lg p-4 ${STATUS_BG[status]} border border-slate-700`}>
              <div className="text-xs text-slate-400 mb-1">{STATUS_LABELS[status]}</div>
              <div className={`text-2xl font-bold ${STATUS_COLORS[status]}`}>{fmtN(count)}</div>
            </div>
          )
        })}
      </div>

      {/* Acceptance Rate Trend Section */}
      {trendData && (
        <div className="space-y-4 mt-8 pt-8 border-t border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300">Acceptance Rate Trend (YoY)</h3>

          {/* Trend chart filters */}
          <div className="bg-slate-800 rounded-lg p-4 space-y-3">
            {/* NUTS filter */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-16 shrink-0">NUTS</span>
              <div className="flex gap-2 flex-wrap">
                <button className={pillClass(trendNutsIsAll)} onClick={trendNutsToggleAll}>All</button>
                {allNutsRegions.map((nuts) => (
                  <button key={nuts} className={pillClass(trendNutsSelected.has(nuts))} onClick={() => trendNutsToggle(nuts)}>
                    {SHORT_REGION[nuts] || nuts}
                  </button>
                ))}
              </div>
            </div>

            {/* People filter */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-16 shrink-0">People</span>
              <div className="flex gap-2 flex-wrap">
                <button className={pillClass(trendPeople.isAll)} onClick={trendPeople.toggleAll}>All</button>
                {PEOPLE_OPTIONS.map((p) => (
                  <button key={p} className={pillClass(trendPeople.isActive(p))} onClick={() => trendPeople.toggle(p)}>
                    {p} Man
                  </button>
                ))}
              </div>
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-16 shrink-0">Type</span>
              <div className="flex gap-2 flex-wrap">
                <button className={pillClass(trendTypes.isAll)} onClick={trendTypes.toggleAll}>All</button>
                {TYPE_OPTIONS.map((t) => (
                  <button key={t} className={pillClass(trendTypes.isActive(t))} onClick={() => trendTypes.toggle(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trend chart */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-4" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonthLabel}
                  stroke="#94a3b8"
                  tick={{ fill: '#e2e8f0', fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#94a3b8"
                  tick={{ fill: '#e2e8f0', fontSize: 12 }}
                  label={{ value: 'Acceptance Rate (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                  labelFormatter={(label: any) => `${formatMonthLabel(label)}`}
                />
                <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#3b82f6"
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                  name="Acceptance Rate (%)"
                  isAnimationActive={true}
                  label={{
                    position: 'top',
                    fill: '#e2e8f0',
                    fontSize: 11,
                    formatter: (val: any) => `${val}%`,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservationsView
