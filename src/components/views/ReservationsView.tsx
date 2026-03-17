import React, { useState, useMemo } from 'react'
import { IResReservationRow } from '../../types'
import { fmtN } from '../../utils/formatting'

interface ReservationsViewProps {
  data: IResReservationRow[]
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

type PeopleFilter = 'All' | '1' | '2' | '12'
type TypeFilter = 'All' | 'Returns' | 'Customs' | 'Local' | 'Nationwide'
type StatusFilter = 'All' | 'pending' | 'accepted' | 'journey_associated' | 'unsuccessful'

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

const ReservationsView: React.FC<ReservationsViewProps> = ({ data }) => {
  const [peopleFilter, setPeopleFilter] = useState<PeopleFilter>('All')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')

  // Get all unique dates sorted
  const allDays = useMemo(() => {
    const daySet = new Set<string>()
    data.forEach((r) => daySet.add(r.day))
    return Array.from(daySet).sort()
  }, [data])

  // Filter data based on toggles
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (peopleFilter !== 'All' && row.people !== Number(peopleFilter)) return false
      if (typeFilter !== 'All' && row.resType !== typeFilter) return false
      if (statusFilter !== 'All' && row.status !== statusFilter) return false
      return true
    })
  }, [data, peopleFilter, typeFilter, statusFilter])

  // Build date × region grid: { [region]: { [day]: count } }
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

  // Column totals
  const dayTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    allDays.forEach((d) => {
      totals[d] = REGION_ORDER.reduce((sum, r) => sum + (gridData[r]?.[d] || 0), 0)
    })
    return totals
  }, [gridData, allDays])

  // Row totals
  const regionTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    REGION_ORDER.forEach((r) => {
      totals[r] = allDays.reduce((sum, d) => sum + (gridData[r]?.[d] || 0), 0)
    })
    return totals
  }, [gridData, allDays])

  const grandTotal = Object.values(dayTotals).reduce((s, v) => s + v, 0)

  // Format day header: "1 Mar", "2 Mar" etc
  const formatDayHeader = (day: string) => {
    const d = new Date(day + 'T00:00:00')
    return `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })}`
  }

  // Determine if a day is today or in the future (for highlighting)
  const today = new Date().toISOString().slice(0, 10)

  const pillClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
      active
        ? 'bg-blue-600 text-white'
        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
    }`

  // Find max value for heatmap colouring
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
    if (statusFilter === 'journey_associated') return `rgba(34, 197, 94, ${alpha})`
    if (statusFilter === 'accepted') return `rgba(59, 130, 246, ${alpha})`
    if (statusFilter === 'unsuccessful') return `rgba(239, 68, 68, ${alpha})`
    if (statusFilter === 'pending') return `rgba(245, 158, 11, ${alpha})`
    return `rgba(59, 130, 246, ${alpha})`
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
        {/* People filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-16 shrink-0">People</span>
          <div className="flex gap-2 flex-wrap">
            {(['All', '1', '2', '12'] as PeopleFilter[]).map((p) => (
              <button key={p} className={pillClass(peopleFilter === p)} onClick={() => setPeopleFilter(p)}>
                {p === 'All' ? 'All' : `${p} Man`}
              </button>
            ))}
          </div>
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-16 shrink-0">Type</span>
          <div className="flex gap-2 flex-wrap">
            {(['All', 'Returns', 'Customs', 'Local', 'Nationwide'] as TypeFilter[]).map((t) => (
              <button key={t} className={pillClass(typeFilter === t)} onClick={() => setTypeFilter(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-16 shrink-0">Status</span>
          <div className="flex gap-2 flex-wrap">
            <button className={pillClass(statusFilter === 'All')} onClick={() => setStatusFilter('All')}>All</button>
            {(['pending', 'accepted', 'journey_associated', 'unsuccessful'] as const).map((s) => (
              <button key={s} className={pillClass(statusFilter === s)} onClick={() => setStatusFilter(s)}>
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date × NUTS table */}
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
            {/* Totals row */}
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
        {(['pending', 'accepted', 'journey_associated', 'unsuccessful'] as const).map((status) => {
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
    </div>
  )
}

export default ReservationsView
