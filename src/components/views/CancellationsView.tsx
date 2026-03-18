import React, { useState, useMemo, useCallback, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { CancellationRawRow, CompletedPaidRawRow, MonthlyCancellationRow, MonthlyCompletedPaidRow, Country } from '../../types'
import { REASON_CODE_LABELS } from '../../data/dashboardData'

interface CancellationsViewProps {
  cancellationRaw2025: CancellationRawRow[]
  cancellationRaw2026: CancellationRawRow[]
  completedPaidRaw2025: CompletedPaidRawRow[]
  completedPaidRaw2026: CompletedPaidRawRow[]
  monthlyCancellationTrends: MonthlyCancellationRow[]
  monthlyCompletedPaidTrends: MonthlyCompletedPaidRow[]
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

const tooltipStyle = {
  contentStyle: { backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '6px' },
  labelStyle: { color: '#e2e8f0' },
}

// === MTD Cumulative Cancellation Chart ===
interface MtdCancellationChartData {
  day: number
  count2026: number | null
  count2025: number
  forecast2026: number | null
}

const MtdCumulativeCancellationChart: React.FC<{
  raw2025: CancellationRawRow[]
  raw2026: CancellationRawRow[]
  selectedNuts: Set<string>
  selectedCats: Set<string>
  selectedReasons: Set<string>
}> = ({ raw2025, raw2026, selectedNuts, selectedCats, selectedReasons }) => {
  const chartData = useMemo(() => {
    // Filter raw rows by NUTS, Category, and Reason
    const filtered2025 = raw2025.filter(
      r => selectedNuts.has(r.n) && selectedCats.has(r.c) && selectedReasons.has(r.r)
    )
    const filtered2026 = raw2026.filter(
      r => selectedNuts.has(r.n) && selectedCats.has(r.c) && selectedReasons.has(r.r)
    )

    // Group by day and sum counts
    const daily2025: Record<number, number> = {}
    const daily2026: Record<number, number> = {}

    filtered2025.forEach(row => {
      if (!daily2025[row.d]) daily2025[row.d] = 0
      daily2025[row.d] += row.cnt
    })

    filtered2026.forEach(row => {
      if (!daily2026[row.d]) daily2026[row.d] = 0
      daily2026[row.d] += row.cnt
    })

    // Get all days from 1 to 31
    const allDays = Array.from({ length: 31 }, (_, i) => i + 1)

    // Compute cumulative totals
    let cum2025 = 0
    let cum2026 = 0
    const cumulative2025: Record<number, number> = {}
    const cumulative2026: Record<number, number> = {}

    allDays.forEach(day => {
      cum2025 += daily2025[day] || 0
      cum2026 += daily2026[day] || 0
      cumulative2025[day] = cum2025
      cumulative2026[day] = cum2026
    })

    // Find last actual day with 2026 daily data
    const days2026WithData = Object.keys(daily2026).map(Number).sort((a, b) => a - b)
    const lastDay = days2026WithData.length > 0 ? days2026WithData[days2026WithData.length - 1] : 0

    // Calculate ratio for forecast
    const ratio = lastDay > 0 && cumulative2025[lastDay] > 0 ? cumulative2026[lastDay] / cumulative2025[lastDay] : 1

    // Build chart data with forecast
    const result: MtdCancellationChartData[] = allDays.map(day => {
      const count2026Val = day <= lastDay ? (cumulative2026[day] || 0) : null
      let forecast2026Val: number | null = null

      if (day > lastDay && cumulative2025[day] > 0) {
        // Forecast: scale 2025 cumulative by ratio
        forecast2026Val = Math.round(cumulative2025[day] * ratio)
      } else if (day === lastDay) {
        // Bridge point: forecast starts at last actual value
        forecast2026Val = cumulative2026[day] || 0
      }

      return {
        day,
        count2026: count2026Val,
        count2025: cumulative2025[day] || 0,
        forecast2026: forecast2026Val,
      }
    })

    return result
  }, [raw2025, raw2026, selectedNuts, selectedCats, selectedReasons])

  const lastActualDay = chartData.filter(d => d.count2026 !== null).length

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-300">MTD Cumulative Cancellations — March</h3>
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4" style={{ height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              tick={{ fill: '#e2e8f0', fontSize: 12 }}
              tickFormatter={(val: number) => `${val}`}
              label={{ value: 'Day of Month', position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#e2e8f0', fontSize: 12 }}
              domain={[0, (max: number) => Math.ceil(max * 1.1)]}
            />
            <Tooltip
              {...tooltipStyle}
              labelFormatter={(label: any) => `Day ${label}`}
              formatter={(value: any, name: any) => {
                if (value === null || value === undefined) return ['-', name]
                return [value, name]
              }}
            />
            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
            <ReferenceLine
              x={lastActualDay}
              stroke="#475569"
              strokeDasharray="4 4"
              label={{ value: 'Today', position: 'top', fill: '#94a3b8', fontSize: 10 }}
            />
            {/* March 2025 actual */}
            <Line
              type="monotone"
              dataKey="count2025"
              stroke="#64748b"
              dot={{ fill: '#64748b', r: 2 }}
              activeDot={{ r: 4 }}
              strokeWidth={2}
              name="March 2025"
              connectNulls
            />
            {/* March 2026 actual */}
            <Line
              type="monotone"
              dataKey="count2026"
              stroke="#3b82f6"
              dot={{ fill: '#3b82f6', r: 3 }}
              activeDot={{ r: 5 }}
              strokeWidth={2.5}
              name="March 2026 (Actual)"
              connectNulls
            />
            {/* Forecast 2026 (dashed) */}
            <Line
              type="monotone"
              dataKey="forecast2026"
              stroke="#f59e0b"
              strokeDasharray="6 3"
              dot={{ fill: '#f59e0b', r: 2 }}
              activeDot={{ r: 4 }}
              strokeWidth={2}
              name="2026 Forecast (based on 2025)"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-500">Forecast projects 2026 from current MTD using March 2025 daily pattern</p>
    </div>
  )
}

// === MTD Cancellation Rate Chart ===
interface MtdCancellationRateChartData {
  day: number
  rate2026: number | null
  rate2025: number
  forecastRate2026: number | null
}

const MtdCancellationRateChart: React.FC<{
  cancRaw2025: CancellationRawRow[]
  cancRaw2026: CancellationRawRow[]
  paidRaw2025: CompletedPaidRawRow[]
  paidRaw2026: CompletedPaidRawRow[]
  selectedNuts: Set<string>
  selectedCats: Set<string>
  selectedReasons: Set<string>
}> = ({ cancRaw2025, cancRaw2026, paidRaw2025, paidRaw2026, selectedNuts, selectedCats, selectedReasons }) => {
  const chartData = useMemo(() => {
    // Filter cancellation rows by NUTS, Category, and Reason
    const filteredCanc2025 = cancRaw2025.filter(
      r => selectedNuts.has(r.n) && selectedCats.has(r.c) && selectedReasons.has(r.r)
    )
    const filteredCanc2026 = cancRaw2026.filter(
      r => selectedNuts.has(r.n) && selectedCats.has(r.c) && selectedReasons.has(r.r)
    )

    // Use all completed paid rows (daily totals, not broken by NUTS/Category)
    const filteredPaid2025 = paidRaw2025
    const filteredPaid2026 = paidRaw2026

    // Group by day and sum counts
    const cancDaily2025: Record<number, number> = {}
    const cancDaily2026: Record<number, number> = {}
    const paidDaily2025: Record<number, number> = {}
    const paidDaily2026: Record<number, number> = {}

    filteredCanc2025.forEach(row => {
      if (!cancDaily2025[row.d]) cancDaily2025[row.d] = 0
      cancDaily2025[row.d] += row.cnt
    })

    filteredCanc2026.forEach(row => {
      if (!cancDaily2026[row.d]) cancDaily2026[row.d] = 0
      cancDaily2026[row.d] += row.cnt
    })

    filteredPaid2025.forEach(row => {
      if (!paidDaily2025[row.d]) paidDaily2025[row.d] = 0
      paidDaily2025[row.d] += row.cnt
    })

    filteredPaid2026.forEach(row => {
      if (!paidDaily2026[row.d]) paidDaily2026[row.d] = 0
      paidDaily2026[row.d] += row.cnt
    })

    // Get all days from 1 to 31
    const allDays = Array.from({ length: 31 }, (_, i) => i + 1)

    // Compute cumulative totals
    let cumCanc2025 = 0
    let cumCanc2026 = 0
    let cumPaid2025 = 0
    let cumPaid2026 = 0
    const cumulativeCanc2025: Record<number, number> = {}
    const cumulativeCanc2026: Record<number, number> = {}
    const cumulativePaid2025: Record<number, number> = {}
    const cumulativePaid2026: Record<number, number> = {}

    allDays.forEach(day => {
      cumCanc2025 += cancDaily2025[day] || 0
      cumCanc2026 += cancDaily2026[day] || 0
      cumPaid2025 += paidDaily2025[day] || 0
      cumPaid2026 += paidDaily2026[day] || 0
      cumulativeCanc2025[day] = cumCanc2025
      cumulativeCanc2026[day] = cumCanc2026
      cumulativePaid2025[day] = cumPaid2025
      cumulativePaid2026[day] = cumPaid2026
    })

    // Calculate cancellation rate for each day
    const cancRate2025: Record<number, number> = {}
    const cancRate2026: Record<number, number> = {}

    allDays.forEach(day => {
      cancRate2025[day] = cumulativePaid2025[day] > 0 ? (cumulativeCanc2025[day] / cumulativePaid2025[day]) * 100 : 0
      cancRate2026[day] = cumulativePaid2026[day] > 0 ? (cumulativeCanc2026[day] / cumulativePaid2026[day]) * 100 : 0
    })

    // Find last actual day with 2026 data
    const days2026WithData = Object.keys(cancDaily2026).map(Number).sort((a, b) => a - b)
    const lastDay = days2026WithData.length > 0 ? days2026WithData[days2026WithData.length - 1] : 0

    // Calculate ratio for forecast
    const ratio = lastDay > 0 && cancRate2025[lastDay] > 0 ? cancRate2026[lastDay] / cancRate2025[lastDay] : 1

    // Build chart data with forecast
    const result: MtdCancellationRateChartData[] = allDays.map(day => {
      const rate2026Val = day <= lastDay ? cancRate2026[day] : null
      let forecastRate2026Val: number | null = null

      if (day > lastDay && cancRate2025[day] > 0) {
        // Forecast: scale 2025 rate by ratio
        forecastRate2026Val = parseFloat((cancRate2025[day] * ratio).toFixed(2))
      } else if (day === lastDay) {
        // Bridge point: forecast starts at last actual value
        forecastRate2026Val = cancRate2026[day]
      }

      return {
        day,
        rate2026: rate2026Val,
        rate2025: cancRate2025[day],
        forecastRate2026: forecastRate2026Val,
      }
    })

    return result
  }, [cancRaw2025, cancRaw2026, paidRaw2025, paidRaw2026, selectedNuts, selectedCats, selectedReasons])

  const lastActualDay = chartData.filter(d => d.rate2026 !== null).length

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-300">MTD Cumulative Cancellation Rate % — March</h3>
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4" style={{ height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              tick={{ fill: '#e2e8f0', fontSize: 12 }}
              tickFormatter={(val: number) => `${val}`}
              label={{ value: 'Day of Month', position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#e2e8f0', fontSize: 12 }}
              tickFormatter={(val: number) => `${val.toFixed(1)}%`}
            />
            <Tooltip
              {...tooltipStyle}
              labelFormatter={(label: any) => `Day ${label}`}
              formatter={(value: any, name: any) => {
                if (value === null || value === undefined) return ['-', name]
                return [`${Number(value).toFixed(2)}%`, name]
              }}
            />
            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
            <ReferenceLine
              x={lastActualDay}
              stroke="#475569"
              strokeDasharray="4 4"
              label={{ value: 'Today', position: 'top', fill: '#94a3b8', fontSize: 10 }}
            />
            {/* March 2025 actual */}
            <Line
              type="monotone"
              dataKey="rate2025"
              stroke="#64748b"
              dot={{ fill: '#64748b', r: 2 }}
              activeDot={{ r: 4 }}
              strokeWidth={2}
              name="March 2025"
              connectNulls
            />
            {/* March 2026 actual */}
            <Line
              type="monotone"
              dataKey="rate2026"
              stroke="#f59e0b"
              dot={{ fill: '#f59e0b', r: 3 }}
              activeDot={{ r: 5 }}
              strokeWidth={2.5}
              name="March 2026 (Actual)"
              connectNulls
            />
            {/* Forecast 2026 (dashed) */}
            <Line
              type="monotone"
              dataKey="forecastRate2026"
              stroke="#ef4444"
              strokeDasharray="6 3"
              dot={{ fill: '#ef4444', r: 2 }}
              activeDot={{ r: 4 }}
              strokeWidth={2}
              name="2026 Forecast (based on 2025)"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-500">Cancellations as % of completed paid bookings — cumulative MTD</p>
    </div>
  )
}

// === Monthly Cancellation Count Chart ===
interface MonthlyCancellationCountChartData {
  month: string
  count: number
}

const MonthlyCancellationCountChart: React.FC<{
  data: MonthlyCancellationRow[]
  selectedNuts: Set<string>
  selectedCats: Set<string>
  selectedReasons: Set<string>
}> = ({ data, selectedNuts, selectedCats, selectedReasons }) => {
  const chartData = useMemo(() => {
    // Filter by NUTS, Category, Reason
    const filtered = data.filter(
      r => selectedNuts.has(r.n) && selectedCats.has(r.c) && selectedReasons.has(r.r)
    )

    // Group by month
    const monthMap: Record<string, number> = {}
    filtered.forEach(r => {
      if (!monthMap[r.m]) monthMap[r.m] = 0
      monthMap[r.m] += r.cnt
    })

    const months = Object.keys(monthMap).sort()
    return months.map(month => ({
      month,
      count: monthMap[month],
    }))
  }, [data, selectedNuts, selectedCats, selectedReasons])

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-300">Monthly Cancellation Count</h3>
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
            <XAxis
              dataKey="month"
              tickFormatter={formatMonthLabel}
              stroke="#94a3b8"
              tick={{ fill: '#e2e8f0', fontSize: 12 }}
            />
            <YAxis stroke="#94a3b8" tick={{ fill: '#e2e8f0', fontSize: 12 }} />
            <Tooltip
              {...tooltipStyle}
              labelFormatter={(label: any) => formatMonthLabel(label)}
              formatter={(value: any) => [value, 'Count']}
            />
            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
              name="Cancellations"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// === Monthly Cancellation Rate Chart ===
interface MonthlyCancellationRateChartData {
  month: string
  rate: number
}

const MonthlyCancellationRateChart: React.FC<{
  cancellationData: MonthlyCancellationRow[]
  completedPaidData: MonthlyCompletedPaidRow[]
  selectedNuts: Set<string>
  selectedCats: Set<string>
  selectedReasons: Set<string>
}> = ({ cancellationData, completedPaidData, selectedNuts, selectedCats, selectedReasons }) => {
  const chartData = useMemo(() => {
    // Filter cancellation data by NUTS, Category, Reason
    const filteredCanc = cancellationData.filter(
      r => selectedNuts.has(r.n) && selectedCats.has(r.c) && selectedReasons.has(r.r)
    )

    // Filter completed paid data by NUTS and Category (NOT reason)
    const filteredPaid = completedPaidData.filter(r => selectedNuts.has(r.n) && selectedCats.has(r.c))

    // Group by month
    const cancMonthMap: Record<string, number> = {}
    const paidMonthMap: Record<string, number> = {}

    filteredCanc.forEach(r => {
      if (!cancMonthMap[r.m]) cancMonthMap[r.m] = 0
      cancMonthMap[r.m] += r.cnt
    })

    filteredPaid.forEach(r => {
      if (!paidMonthMap[r.m]) paidMonthMap[r.m] = 0
      paidMonthMap[r.m] += r.cnt
    })

    const allMonths = Array.from(new Set([...Object.keys(cancMonthMap), ...Object.keys(paidMonthMap)])).sort()

    return allMonths.map(month => {
      const canc = cancMonthMap[month] || 0
      const paid = paidMonthMap[month] || 0
      const rate = paid > 0 ? (canc / paid) * 100 : 0

      return {
        month,
        rate: parseFloat(rate.toFixed(2)),
      }
    })
  }, [cancellationData, completedPaidData, selectedNuts, selectedCats, selectedReasons])

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-300">Monthly Cancellation Rate %</h3>
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
            <XAxis
              dataKey="month"
              tickFormatter={formatMonthLabel}
              stroke="#94a3b8"
              tick={{ fill: '#e2e8f0', fontSize: 12 }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#e2e8f0', fontSize: 12 }}
              tickFormatter={(val: number) => `${val}%`}
            />
            <Tooltip
              {...tooltipStyle}
              labelFormatter={(label: any) => formatMonthLabel(label)}
              formatter={(value: any) => [`${value}%`, 'Rate']}
            />
            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#f59e0b"
              dot={{ fill: '#f59e0b', r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
              name="Cancellation Rate"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// === Main Component ===
const CancellationsView: React.FC<CancellationsViewProps> = ({
  cancellationRaw2025,
  cancellationRaw2026,
  completedPaidRaw2025,
  completedPaidRaw2026,
  monthlyCancellationTrends,
  monthlyCompletedPaidTrends,
  selectedCountry,
  onCountryChange,
}) => {
  // Extract unique NUTS regions from 2026 data
  const allNutsRegions = useMemo(() => {
    return Array.from(new Set(cancellationRaw2026.map(r => r.n))).filter(r => r !== '').sort()
  }, [cancellationRaw2026]) as string[]

  // Extract unique categories from 2026 data
  const allCategories = useMemo(() => {
    return Array.from(new Set(cancellationRaw2026.map(r => r.c))).sort()
  }, [cancellationRaw2026]) as string[]

  // Extract unique reason codes from 2026 data
  const allReasons = useMemo(() => {
    return Array.from(new Set(cancellationRaw2026.map(r => r.r))).sort()
  }, [cancellationRaw2026]) as string[]

  // NUTS filter
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

  // Category filter
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

  // Reason filter
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(new Set(allReasons))
  const reasonIsAll = selectedReasons.size === allReasons.length
  const reasonIsActive = (val: string) => selectedReasons.has(val)
  const reasonToggle = useCallback((val: string) => {
    setSelectedReasons((prev) => {
      if (prev.size === allReasons.length) return new Set([val])
      const next = new Set(prev)
      if (next.has(val)) { if (next.size > 1) next.delete(val) } else { next.add(val) }
      return next
    })
  }, [allReasons])
  const reasonToggleAll = useCallback(() => {
    setSelectedReasons(new Set(allReasons))
  }, [allReasons])

  // Reset filters when country changes
  useEffect(() => {
    setSelectedNuts(new Set(allNutsRegions))
  }, [allNutsRegions])
  useEffect(() => {
    setSelectedCats(new Set(allCategories))
  }, [allCategories])
  useEffect(() => {
    setSelectedReasons(new Set(allReasons))
  }, [allReasons])

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
            <button className={pillClass(nutsIsAll)} onClick={nutsToggleAll}>
              All
            </button>
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
            <button className={pillClass(catIsAll)} onClick={catToggleAll}>
              All
            </button>
            {allCategories.map((c) => (
              <button key={c} className={pillClass(catIsActive(c))} onClick={() => catToggle(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-16 shrink-0">Reason</span>
          <div className="flex gap-2 flex-wrap">
            <button className={pillClass(reasonIsAll)} onClick={reasonToggleAll}>
              All
            </button>
            {allReasons.map((r) => (
              <button key={r} className={pillClass(reasonIsActive(r))} onClick={() => reasonToggle(r)}>
                {REASON_CODE_LABELS[r] || r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* === MTD Cumulative Cancellations Chart (UK only) === */}
      {selectedCountry === 'uk' && (
        <MtdCumulativeCancellationChart
          raw2025={cancellationRaw2025}
          raw2026={cancellationRaw2026}
          selectedNuts={selectedNuts}
          selectedCats={selectedCats}
          selectedReasons={selectedReasons}
        />
      )}

      {/* === MTD Cancellation Rate Chart (UK only) === */}
      {selectedCountry === 'uk' && (
        <MtdCancellationRateChart
          cancRaw2025={cancellationRaw2025}
          cancRaw2026={cancellationRaw2026}
          paidRaw2025={completedPaidRaw2025}
          paidRaw2026={completedPaidRaw2026}
          selectedNuts={selectedNuts}
          selectedCats={selectedCats}
          selectedReasons={selectedReasons}
        />
      )}

      {/* === Monthly Cancellation Count Chart === */}
      <MonthlyCancellationCountChart
        data={monthlyCancellationTrends}
        selectedNuts={selectedNuts}
        selectedCats={selectedCats}
        selectedReasons={selectedReasons}
      />

      {/* === Monthly Cancellation Rate Chart === */}
      <MonthlyCancellationRateChart
        cancellationData={monthlyCancellationTrends}
        completedPaidData={monthlyCompletedPaidTrends}
        selectedNuts={selectedNuts}
        selectedCats={selectedCats}
        selectedReasons={selectedReasons}
      />
    </div>
  )
}

export default CancellationsView
