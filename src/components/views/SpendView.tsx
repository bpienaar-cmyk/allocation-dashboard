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
import { SpendNutsRow, SpendCategoryRow, SpendByDaysRow, AgentSpendRow, MtdSpendRawRow, Country } from '../../types'
import { fmtN } from '../../utils/formatting'
import { DATA_LAST_UPDATED } from '../../data/dashboardData'

const MTD_MONTH_NAME = (() => {
  const d = new Date(DATA_LAST_UPDATED)
  return d.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' })
})()

const MTD_DAYS_IN_MONTH = (() => {
  const d = new Date(DATA_LAST_UPDATED)
  return new Date(d.getUTCFullYear(), d.getUTCMonth() + 1, 0).getDate()
})()
import AgentBreakdownModal from '../common/AgentBreakdownModal'

interface SpendViewProps {
  nutsDataByCountry: Record<string, SpendNutsRow[]>
  categoryDataByCountry: Record<string, SpendCategoryRow[]>
  spendByDaysByCountry: Record<string, SpendByDaysRow[]>
  agentSpendByCountry: Record<string, AgentSpendRow[]>
  mtdRaw2025: MtdSpendRawRow[]
  mtdRaw2026: MtdSpendRawRow[]
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
  return sorted.map((d) => {
    const spendTtvPct = d.ttv > 0 ? (d.spend / d.ttv) * 100 : 0
    return {
      month: d.month,
      spend: d.spend,
      ttv: d.ttv,
      spendTtvPct: parseFloat(spendTtvPct.toFixed(2)),
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
        <LineChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
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

// === MTD Cumulative Allocation Spend Chart ===
interface MtdChartData {
  day: number;
  spend2026: number | null;
  spend2025: number;
  forecast2026: number | null;
}

const MtdSpendChart: React.FC<{
  raw2025: MtdSpendRawRow[];
  raw2026: MtdSpendRawRow[];
  selectedNuts: Set<string>;
  selectedCats: Set<string>;
}> = ({ raw2025, raw2026, selectedNuts, selectedCats }) => {
  const chartData = useMemo(() => {
    // Filter raw rows by NUTS and Category
    const filtered2025 = raw2025.filter(r => selectedNuts.has(r.n) && selectedCats.has(r.c))
    const filtered2026 = raw2026.filter(r => selectedNuts.has(r.n) && selectedCats.has(r.c))

    // Group by day and sum spend
    const daily2025: Record<number, number> = {}
    const daily2026: Record<number, number> = {}

    filtered2025.forEach(row => {
      if (!daily2025[row.d]) daily2025[row.d] = 0
      daily2025[row.d] += row.s
    })

    filtered2026.forEach(row => {
      if (!daily2026[row.d]) daily2026[row.d] = 0
      daily2026[row.d] += row.s
    })

    // Get all days from 1 to 31
    const allDays = Array.from({ length: MTD_DAYS_IN_MONTH }, (_, i) => i + 1)

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

    // Find last actual day with 2026 daily data (not cumulative — cumulative stays positive)
    const days2026WithData = Object.keys(daily2026).map(Number).sort((a, b) => a - b)
    const lastDay = days2026WithData.length > 0 ? days2026WithData[days2026WithData.length - 1] : 0

    // Forecast: use 2025 to project total, then smooth the daily distribution
    // Step 1: Project 2026 total from 2025's proportional completion at lastDay
    const total2025 = cumulative2025[MTD_DAYS_IN_MONTH] || 0
    const proportion2025AtLastDay = total2025 > 0 ? cumulative2025[lastDay] / total2025 : 0
    const projected2026Total = proportion2025AtLastDay > 0
      ? Math.round(cumulative2026[lastDay] / proportion2025AtLastDay)
      : cumulative2026[lastDay]
    const remaining2026 = projected2026Total - (cumulative2026[lastDay] || 0)

    // Step 2: Smooth the 2025 daily increments using a 5-day rolling average
    // to remove end-of-month spikes while preserving the general acceleration pattern
    const smoothedDaily2025: Record<number, number> = {}
    const WINDOW = 5
    for (let day = lastDay + 1; day <= MTD_DAYS_IN_MONTH; day++) {
      let sum = 0; let count = 0
      for (let w = -Math.floor(WINDOW / 2); w <= Math.floor(WINDOW / 2); w++) {
        const d = day + w
        if (d >= 1 && d <= MTD_DAYS_IN_MONTH) { sum += daily2025[d] || 0; count++ }
      }
      smoothedDaily2025[day] = count > 0 ? sum / count : 0
    }

    // Step 3: Build cumulative smoothed weights for remaining days
    let totalSmoothedWeight = 0
    for (let day = lastDay + 1; day <= MTD_DAYS_IN_MONTH; day++) totalSmoothedWeight += smoothedDaily2025[day]
    // If 2025 had no remaining data, fall back to linear distribution
    const useLinear = totalSmoothedWeight === 0

    // Build chart data with smoothed forecast
    const result: MtdChartData[] = allDays.map(day => {
      const spend2026Val = day <= lastDay ? (cumulative2026[day] || 0) : null
      let forecast2026Val: number | null = null

      if (day > lastDay) {
        let cumulativeWeight = 0
        for (let d = lastDay + 1; d <= day; d++) cumulativeWeight += smoothedDaily2025[d] || 0
        const proportion = useLinear
          ? (day - lastDay) / (31 - lastDay)
          : totalSmoothedWeight > 0 ? cumulativeWeight / totalSmoothedWeight : 0
        forecast2026Val = Math.round((cumulative2026[lastDay] || 0) + remaining2026 * proportion)
      } else if (day === lastDay) {
        // Bridge point: forecast starts at last actual value
        forecast2026Val = cumulative2026[day] || 0
      }

      return {
        day,
        spend2026: spend2026Val,
        spend2025: cumulative2025[day] || 0,
        forecast2026: forecast2026Val,
      }
    })

    return result
  }, [raw2025, raw2026, selectedNuts, selectedCats])

  const lastActualDay = chartData.filter(d => d.spend2026 !== null).length

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-300">MTD Cumulative Allocation Spend — {MTD_MONTH_NAME}</h3>
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
              tickFormatter={(val: number) => fmtCurrency(val)}
              domain={[0, (max: number) => Math.ceil(max * 1.1)]}
            />
            <Tooltip
              {...tooltipStyle}
              labelFormatter={(label: any) => `Day ${label}`}
              formatter={(value: any, name: any) => {
                if (value === null || value === undefined) return ['-', name]
                return [`£${fmtN(value)}`, name]
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
              dataKey="spend2025"
              stroke="#64748b"
              dot={{ fill: '#64748b', r: 2 }}
              activeDot={{ r: 4 }}
              strokeWidth={2}
              name={`${MTD_MONTH_NAME} 2025`}
              connectNulls
            />
            {/* March 2026 actual */}
            <Line
              type="monotone"
              dataKey="spend2026"
              stroke="#3b82f6"
              dot={{ fill: '#3b82f6', r: 3 }}
              activeDot={{ r: 5 }}
              strokeWidth={2.5}
              name={`${MTD_MONTH_NAME} 2026 (Actual)`}
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
      <p className="text-xs text-slate-500">Forecast projects 2026 month-end total from 2025's proportional completion, then distributes remaining spend using a smoothed 2025 daily pattern</p>
    </div>
  )
}

// === MTD Spend / TTV % Chart ===
interface MtdTtvChartData {
  day: number;
  pct2026: number | null;
  pct2025: number;
  forecastPct2026: number | null;
}

const MtdSpendTtvChart: React.FC<{
  raw2025: MtdSpendRawRow[];
  raw2026: MtdSpendRawRow[];
  selectedNuts: Set<string>;
  selectedCats: Set<string>;
}> = ({ raw2025, raw2026, selectedNuts, selectedCats }) => {
  const chartData = useMemo(() => {
    // Filter raw rows by NUTS and Category
    const filtered2025 = raw2025.filter(r => selectedNuts.has(r.n) && selectedCats.has(r.c))
    const filtered2026 = raw2026.filter(r => selectedNuts.has(r.n) && selectedCats.has(r.c))

    // Group by day and sum spend and ttv
    const daily2025: Record<number, { s: number; t: number }> = {}
    const daily2026: Record<number, { s: number; t: number }> = {}

    filtered2025.forEach(row => {
      if (!daily2025[row.d]) daily2025[row.d] = { s: 0, t: 0 }
      daily2025[row.d].s += row.s
      daily2025[row.d].t += row.t
    })

    filtered2026.forEach(row => {
      if (!daily2026[row.d]) daily2026[row.d] = { s: 0, t: 0 }
      daily2026[row.d].s += row.s
      daily2026[row.d].t += row.t
    })

    // Get all days from 1 to 31
    const allDays = Array.from({ length: MTD_DAYS_IN_MONTH }, (_, i) => i + 1)

    // Compute cumulative totals
    let cum2025 = 0
    let cumTtv2025 = 0
    let cum2026 = 0
    let cumTtv2026 = 0
    const cumulative2025: Record<number, number> = {}
    const cumulativeTtv2025: Record<number, number> = {}
    const cumulative2026: Record<number, number> = {}
    const cumulativeTtv2026: Record<number, number> = {}

    allDays.forEach(day => {
      cum2025 += daily2025[day]?.s || 0
      cumTtv2025 += daily2025[day]?.t || 0
      cum2026 += daily2026[day]?.s || 0
      cumTtv2026 += daily2026[day]?.t || 0
      cumulative2025[day] = cum2025
      cumulativeTtv2025[day] = cumTtv2025
      cumulative2026[day] = cum2026
      cumulativeTtv2026[day] = cumTtv2026
    })

    // Calculate spend/TTV percentage for each day
    const spendTtvPct2025: Record<number, number> = {}
    const spendTtvPct2026: Record<number, number> = {}

    allDays.forEach(day => {
      spendTtvPct2025[day] = cumulativeTtv2025[day] > 0 ? (cumulative2025[day] / cumulativeTtv2025[day]) * 100 : 0
      spendTtvPct2026[day] = cumulativeTtv2026[day] > 0 ? (cumulative2026[day] / cumulativeTtv2026[day]) * 100 : 0
    })

    // Find last actual day with 2026 data
    const days2026WithData = Object.keys(daily2026).map(Number).sort((a, b) => a - b)
    const lastDay = days2026WithData.length > 0 ? days2026WithData[days2026WithData.length - 1] : 0

    // Forecast: project spend and TTV separately using smoothed 2025 daily pattern, then compute ratio
    // Step 1: Project 2026 totals from 2025's proportional completion at lastDay
    const totalSpend2025 = cumulative2025[MTD_DAYS_IN_MONTH] || 0
    const totalTtv2025 = cumulativeTtv2025[MTD_DAYS_IN_MONTH] || 0
    const propSpend2025 = totalSpend2025 > 0 ? cumulative2025[lastDay] / totalSpend2025 : 0
    const propTtv2025 = totalTtv2025 > 0 ? cumulativeTtv2025[lastDay] / totalTtv2025 : 0
    const projectedSpend2026 = propSpend2025 > 0 ? cumulative2026[lastDay] / propSpend2025 : cumulative2026[lastDay]
    const projectedTtv2026 = propTtv2025 > 0 ? cumulativeTtv2026[lastDay] / propTtv2025 : cumulativeTtv2026[lastDay]
    const remainingSpend2026 = projectedSpend2026 - (cumulative2026[lastDay] || 0)
    const remainingTtv2026 = projectedTtv2026 - (cumulativeTtv2026[lastDay] || 0)

    // Step 2: Smooth the 2025 daily increments for spend and TTV
    const smoothedDailySpend2025: Record<number, number> = {}
    const smoothedDailyTtv2025: Record<number, number> = {}
    const WINDOW = 5
    for (let day = lastDay + 1; day <= MTD_DAYS_IN_MONTH; day++) {
      let sumS = 0, sumT = 0, count = 0
      for (let w = -Math.floor(WINDOW / 2); w <= Math.floor(WINDOW / 2); w++) {
        const d = day + w
        if (d >= 1 && d <= MTD_DAYS_IN_MONTH) {
          sumS += daily2025[d]?.s || 0
          sumT += daily2025[d]?.t || 0
          count++
        }
      }
      smoothedDailySpend2025[day] = count > 0 ? sumS / count : 0
      smoothedDailyTtv2025[day] = count > 0 ? sumT / count : 0
    }

    // Step 3: Build cumulative smoothed weights
    let totalWeightSpend = 0, totalWeightTtv = 0
    for (let day = lastDay + 1; day <= MTD_DAYS_IN_MONTH; day++) {
      totalWeightSpend += smoothedDailySpend2025[day]
      totalWeightTtv += smoothedDailyTtv2025[day]
    }
    const useLinearSpend = totalWeightSpend === 0
    const useLinearTtv = totalWeightTtv === 0

    // Build chart data with smoothed forecast
    const result: MtdTtvChartData[] = allDays.map(day => {
      const pct2026Val = day <= lastDay ? spendTtvPct2026[day] : null
      let forecastPct2026Val: number | null = null

      if (day > lastDay) {
        // Accumulate smoothed weights up to this day
        let cumWeightS = 0, cumWeightT = 0
        for (let d = lastDay + 1; d <= day; d++) {
          cumWeightS += smoothedDailySpend2025[d] || 0
          cumWeightT += smoothedDailyTtv2025[d] || 0
        }
        const propS = useLinearSpend ? (day - lastDay) / (31 - lastDay) : totalWeightSpend > 0 ? cumWeightS / totalWeightSpend : 0
        const propT = useLinearTtv ? (day - lastDay) / (31 - lastDay) : totalWeightTtv > 0 ? cumWeightT / totalWeightTtv : 0
        const forecastSpend = (cumulative2026[lastDay] || 0) + remainingSpend2026 * propS
        const forecastTtv = (cumulativeTtv2026[lastDay] || 0) + remainingTtv2026 * propT
        forecastPct2026Val = forecastTtv > 0 ? parseFloat(((forecastSpend / forecastTtv) * 100).toFixed(2)) : 0
      } else if (day === lastDay) {
        // Bridge point: forecast starts at last actual value
        forecastPct2026Val = spendTtvPct2026[day]
      }

      return {
        day,
        pct2026: pct2026Val,
        pct2025: spendTtvPct2025[day],
        forecastPct2026: forecastPct2026Val,
      }
    })

    return result
  }, [raw2025, raw2026, selectedNuts, selectedCats])

  const lastActualDay = chartData.filter(d => d.pct2026 !== null).length

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-300">MTD Cumulative Spend / TTV % — {MTD_MONTH_NAME}</h3>
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
              dataKey="pct2025"
              stroke="#64748b"
              dot={{ fill: '#64748b', r: 2 }}
              activeDot={{ r: 4 }}
              strokeWidth={2}
              name={`${MTD_MONTH_NAME} 2025`}
              connectNulls
            />
            {/* March 2026 actual */}
            <Line
              type="monotone"
              dataKey="pct2026"
              stroke="#f59e0b"
              dot={{ fill: '#f59e0b', r: 3 }}
              activeDot={{ r: 5 }}
              strokeWidth={2.5}
              name={`${MTD_MONTH_NAME} 2026 (Actual)`}
              connectNulls
            />
            {/* Forecast 2026 (dashed) */}
            <Line
              type="monotone"
              dataKey="forecastPct2026"
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
      <p className="text-xs text-slate-500">Spend as % of TTV — cumulative MTD, filtered by region and category</p>
    </div>
  )
}

// === Days-before-pickup line graph ===
const DAYS_BUCKETS = ['OTD', '1d', '2d', '3d', '4d+'] as const
const DAYS_COLORS: Record<string, string> = {
  'OTD': '#ef4444',   // red
  '1d': '#f59e0b',    // amber
  '2d': '#22c55e',    // green
  '3d': '#3b82f6',    // blue
  '4d+': '#a855f7',   // purple
}

const SpendView: React.FC<SpendViewProps> = ({ nutsDataByCountry, categoryDataByCountry, spendByDaysByCountry, agentSpendByCountry, mtdRaw2025, mtdRaw2026, selectedCountry, onCountryChange }) => {
  const nutsData = nutsDataByCountry[selectedCountry] || []
  const categoryData = categoryDataByCountry[selectedCountry] || []

  const allNutsRegions = useMemo(() => {
    return Array.from(new Set(nutsData.map(r => r.nutsRegion))).filter(r => r !== '').sort()
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

  // === Days-before-pickup line graph data ===
  const daysData = spendByDaysByCountry[selectedCountry] || []
  const agentData = agentSpendByCountry[selectedCountry] || []

  // Days bucket toggle (separate from NUTS/Category)
  const [selectedDaysBuckets, setSelectedDaysBuckets] = useState<Set<string>>(new Set(DAYS_BUCKETS))
  const daysIsAll = selectedDaysBuckets.size === DAYS_BUCKETS.length
  const daysIsActive = (val: string) => selectedDaysBuckets.has(val)
  const daysToggle = useCallback((val: string) => {
    setSelectedDaysBuckets((prev) => {
      if (prev.size === DAYS_BUCKETS.length) return new Set([val])
      const next = new Set(prev)
      if (next.has(val)) { if (next.size > 1) next.delete(val) } else { next.add(val) }
      return next
    })
  }, [])
  const daysToggleAll = useCallback(() => {
    setSelectedDaysBuckets(new Set(DAYS_BUCKETS))
  }, [])

  // Compute monthly spend per days-bucket (filtered by NUTS + Category)
  const daysLineData = useMemo(() => {
    const filtered = daysData.filter(
      r => selectedNuts.has(r.nutsRegion) && selectedCats.has(r.category)
    )

    // Group by month × daysBucket
    const map: Record<string, Record<string, number>> = {}
    filtered.forEach(r => {
      if (!map[r.month]) map[r.month] = {}
      if (!map[r.month][r.daysBucket]) map[r.month][r.daysBucket] = 0
      map[r.month][r.daysBucket] += r.spend
    })

    const months = Object.keys(map).sort()
    return months.map(month => {
      const row: Record<string, any> = { month }
      DAYS_BUCKETS.forEach(b => {
        row[b] = Math.round((map[month][b] || 0) * 100) / 100
      })
      return row
    })
  }, [daysData, selectedNuts, selectedCats])

  // Modal state for agent breakdown
  const [modalBucket, setModalBucket] = useState<string | null>(null)
  const [modalMonth, setModalMonth] = useState<string | null>(null)

  const modalAgentData = useMemo(() => {
    if (!modalBucket || !modalMonth) return []
    return agentData.filter(
      r => r.month === modalMonth && r.daysBucket === modalBucket && selectedNuts.has(r.nutsRegion) && selectedCats.has(r.category)
    )
  }, [agentData, modalMonth, modalBucket, selectedNuts, selectedCats])

  // Handle click on line chart data point
  const handleDaysChartClick = useCallback((data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const month = data.activeLabel
      // Find which line was closest / use the first active series
      const activeBucket = data.activePayload[0]?.dataKey
      if (month && activeBucket && DAYS_BUCKETS.includes(activeBucket as any)) {
        setModalMonth(month)
        setModalBucket(activeBucket)
      }
    }
  }, [])

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

      {/* === MTD Cumulative Allocation Spend Chart === */}
      {selectedCountry === 'uk' && <MtdSpendChart raw2025={mtdRaw2025} raw2026={mtdRaw2026} selectedNuts={selectedNuts} selectedCats={selectedCats} />}

      {/* === MTD Spend / TTV % Chart === */}
      {selectedCountry === 'uk' && <MtdSpendTtvChart raw2025={mtdRaw2025} raw2026={mtdRaw2026} selectedNuts={selectedNuts} selectedCats={selectedCats} />}

      {/* === Spend Amount Chart === */}
      <SpendAmountChart data={chartData} />

      {/* === Spend / TTV % Chart === */}
      <SpendTtvPctChart data={chartData} />

      {/* === Spend by Days Before Pickup Line Graph === */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300">Spend by Days Before Pickup</h3>

        {/* Days bucket toggle (specific to this graph) */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-16 shrink-0">Days</span>
          <div className="flex gap-2 flex-wrap">
            <button className={pillClass(daysIsAll)} onClick={daysToggleAll}>All</button>
            {DAYS_BUCKETS.map((b) => (
              <button
                key={b}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
                  daysIsActive(b)
                    ? 'text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                style={daysIsActive(b) ? { backgroundColor: DAYS_COLORS[b] } : undefined}
                onClick={() => daysToggle(b)}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4" style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daysLineData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }} onClick={handleDaysChartClick}>
              <XAxis dataKey="month" tickFormatter={formatMonthLabel} stroke="#94a3b8" tick={{ fill: '#e2e8f0', fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#e2e8f0', fontSize: 12 }} tickFormatter={(val: number) => fmtCurrency(val)} domain={[0, (max: number) => Math.ceil(max * 1.15)]} />
              <Tooltip
                {...tooltipStyle}
                labelFormatter={(label: any) => formatMonthLabel(label)}
                formatter={(value: any, name: any) => [`£${fmtN(value)}`, name]}
              />
              <Legend wrapperStyle={{ color: '#cbd5e1' }} />
              {DAYS_BUCKETS.filter(b => selectedDaysBuckets.has(b)).map((bucket) => (
                <Line
                  key={bucket}
                  type="monotone"
                  dataKey={bucket}
                  stroke={DAYS_COLORS[bucket]}
                  dot={{ fill: DAYS_COLORS[bucket], r: 3 }}
                  activeDot={{ r: 5 }}
                  strokeWidth={2}
                  name={bucket}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-500">Click a data point to see agent breakdown</p>
      </div>

      {/* === Agent Breakdown Modal === */}
      {modalBucket && modalMonth && (
        <AgentBreakdownModal
          daysBucket={modalBucket}
          month={modalMonth}
          agentData={modalAgentData}
          onClose={() => { setModalBucket(null); setModalMonth(null) }}
        />
      )}
    </div>
  )
}

export default SpendView
