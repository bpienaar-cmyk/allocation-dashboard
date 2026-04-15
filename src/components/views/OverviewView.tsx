import React, { useState, useMemo } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Country, CountryOverview, DailyRaw, DailyOverviewRow, OverviewData } from '../../types'
import { fmtGBP, fmtN, fmtP } from '../../utils/formatting'

const COUNTRY_LABELS: Record<Country, string> = {
  uk: 'UK (V4 + AVB)',
  spain: 'Spain (V4)',
  france: 'France (V4)',
}

type MetricKey = 'jobs' | 'ttv' | 'furnRoutedPct' | 'avFee' | 'marginPct' | 'allocSpend' | 'spendTtvPct' | 'cantSourceRate' | 'otdDealloPct' | 'tpCancelRate'


interface MetricDef {
  title: string
  key: MetricKey
  fmt: (v: number) => string
  type: 'yoy' | 'pp'
  invert?: boolean
  /** Extract daily value from a DailyRaw row */
  dailyValue: (d: DailyRaw) => number
  /** Is this a rate/pct that should use cumulative calculation? */
  isCumRate?: boolean
  /** Only show this metric for UK */
  ukOnly?: boolean
}

type CategoryFilter = 'All' | 'Furniture' | 'Home Removal' | 'Car' | 'Motorbike' | 'Piano'

interface OverviewViewProps {
  overviewByCountry: Record<Country, CountryOverview>
  selectedCountry: Country
  onCountryChange: (country: Country) => void
  dailyOverviewByCountry?: Record<string, { cy: DailyOverviewRow[], py: DailyOverviewRow[] }> | null
  furnRoutingByCountry?: Record<string, Record<string, { routed: number; total: number }>> | null
  tpCancelsByCountry?: Record<string, Record<string, number>> | null
  dataLastUpdated?: string
}

function yoyChange(current: number, prior: number): { trend: 'up' | 'down' | 'flat'; label: string } {
  if (prior === 0) return { trend: 'flat', label: 'N/A' }
  const pct = ((current - prior) / Math.abs(prior)) * 100
  if (Math.abs(pct) < 0.5) return { trend: 'flat', label: '0%' }
  return {
    trend: pct > 0 ? 'up' : 'down',
    label: `${pct > 0 ? '+' : ''}${pct.toFixed(1)}% YoY`,
  }
}

function ppChange(current: number, prior: number): { trend: 'up' | 'down' | 'flat'; label: string } {
  const diff = current - prior
  if (Math.abs(diff) < 0.05) return { trend: 'flat', label: '0pp' }
  return {
    trend: diff > 0 ? 'up' : 'down',
    label: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}pp YoY`,
  }
}

interface ComparisonCardProps {
  title: string
  currentValue: string
  priorValue: string
  trend: 'up' | 'down' | 'flat'
  changeLabel: string
  invertColor?: boolean
  selected?: boolean
  onClick?: () => void
  absoluteCount?: number
  priorAbsoluteCount?: number
  pyLabel?: string
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({
  title, currentValue, priorValue, trend, changeLabel, invertColor = false, selected = false, onClick,
  absoluteCount, priorAbsoluteCount, pyLabel = "Mar '25",
}) => {
  const color = trend === 'flat'
    ? 'text-slate-400'
    : (invertColor ? (trend === 'down' ? 'text-emerald-400' : 'text-red-400') : (trend === 'up' ? 'text-emerald-400' : 'text-red-400'))

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl bg-slate-800 p-5 border transition-colors cursor-pointer ${
        selected ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-slate-700 hover:border-blue-500/50'
      }`}
    >
      {absoluteCount !== undefined && (
        <span className="absolute top-3 right-4 text-xs text-slate-500">{fmtN(absoluteCount)}</span>
      )}
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3">{title}</p>
      <h3 className="text-2xl font-bold text-white">{currentValue}</h3>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">{pyLabel}: {priorValue}</span>
        <span className={`text-xs font-semibold ${color}`}>
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'} {changeLabel}
        </span>
      </div>
    </div>
  )
}

/** Build cumulative daily chart data for a metric */
function buildChartData(
  dailyCY: DailyRaw[],
  dailyPY: DailyRaw[],
  metric: MetricDef,
): { day: number; dayLabel: string; cy: number; py: number }[] {
  // Build a map of PY data keyed by day number for alignment
  const pyByDay: Record<number, DailyRaw> = {}
  dailyPY.forEach(d => { pyByDay[d.day] = d })

  const result: { day: number; dayLabel: string; cy: number; py: number }[] = []

  // For cumulative rates we need running totals
  let cumCY = 0, cumPY = 0
  // For derived rates we need cumulative numerator & denominator
  let cumCYNum = 0, cumCYDen = 0, cumPYNum = 0, cumPYDen = 0

  for (let i = 0; i < dailyCY.length; i++) {
    const cy = dailyCY[i]
    const day = cy.day  // Use actual day number from data
    const py = pyByDay[day]  // Match PY by same day number

    let cyVal = 0, pyVal = 0

    if (metric.key === 'marginPct') {
      if (cy) { cumCYNum += cy.avFee; cumCYDen += cy.ttv }
      if (py) { cumPYNum += py.avFee; cumPYDen += py.ttv }
      cyVal = cumCYDen > 0 ? (cumCYNum / cumCYDen) * 100 : 0
      pyVal = cumPYDen > 0 ? (cumPYNum / cumPYDen) * 100 : 0
    } else if (metric.key === 'spendTtvPct') {
      if (cy) { cumCYNum += cy.allocSpend; cumCYDen += cy.ttv }
      if (py) { cumPYNum += py.allocSpend; cumPYDen += py.ttv }
      cyVal = cumCYDen > 0 ? (cumCYNum / cumCYDen) * 100 : 0
      pyVal = cumPYDen > 0 ? (cumPYNum / cumPYDen) * 100 : 0
    } else if (metric.key === 'cantSourceRate') {
      if (cy) { cumCYNum += cy.cantSource; cumCYDen += cy.jobs }
      if (py) { cumPYNum += py.cantSource; cumPYDen += py.jobs }
      cyVal = cumCYDen > 0 ? (cumCYNum / cumCYDen) * 100 : 0
      pyVal = cumPYDen > 0 ? (cumPYNum / cumPYDen) * 100 : 0
    } else if (metric.key === 'otdDealloPct') {
      if (cy) { cumCYNum += cy.otdDealloCount; cumCYDen += cy.jobs }
      if (py) { cumPYNum += py.otdDealloCount; cumPYDen += py.jobs }
      cyVal = cumCYDen > 0 ? (cumCYNum / cumCYDen) * 100 : 0
      pyVal = cumPYDen > 0 ? (cumPYNum / cumPYDen) * 100 : 0
    } else if (metric.key === 'tpCancelRate') {
      if (cy) { cumCYNum += cy.tpCancels; cumCYDen += cy.jobs }
      if (py) { cumPYNum += py.tpCancels; cumPYDen += py.jobs }
      cyVal = cumCYDen > 0 ? (cumCYNum / cumCYDen) * 100 : 0
      pyVal = cumPYDen > 0 ? (cumPYNum / cumPYDen) * 100 : 0
    } else if (metric.key === 'furnRoutedPct') {
      if (cy) { cumCYNum += cy.furnRouted; cumCYDen += cy.furnTotal }
      if (py) { cumPYNum += py.furnRouted; cumPYDen += py.furnTotal }
      cyVal = cumCYDen > 0 ? (cumCYNum / cumCYDen) * 100 : 0
      pyVal = cumPYDen > 0 ? (cumPYNum / cumPYDen) * 100 : 0
    } else {
      // Simple cumulative sum (jobs, ttv, avFee, allocSpend)
      if (cy) cumCY += metric.dailyValue(cy)
      if (py) cumPY += metric.dailyValue(py)
      cyVal = cumCY
      pyVal = cumPY
    }

    result.push({
      day,
      dayLabel: `${day}`,
      cy: Math.round(cyVal * 100) / 100,
      py: Math.round(pyVal * 100) / 100,
    })
  }

  return result
}

/** Build daily (non-cumulative) bar chart data — actual value per day */
function buildDailyBarData(
  dailyCY: DailyRaw[],
  dailyPY: DailyRaw[],
  metric: MetricDef,
): { day: number; dayLabel: string; cy: number; py: number }[] {
  // Build a map of PY data keyed by day number for alignment
  const pyByDay: Record<number, DailyRaw> = {}
  dailyPY.forEach(d => { pyByDay[d.day] = d })

  const result: { day: number; dayLabel: string; cy: number; py: number }[] = []

  for (let i = 0; i < dailyCY.length; i++) {
    const cy = dailyCY[i]
    const day = cy.day  // Use actual day number from data
    const py = pyByDay[day]  // Match PY by same day number
    let cyVal = 0, pyVal = 0

    if (metric.key === 'marginPct') {
      cyVal = cy && cy.ttv > 0 ? (cy.avFee / cy.ttv) * 100 : 0
      pyVal = py && py.ttv > 0 ? (py.avFee / py.ttv) * 100 : 0
    } else if (metric.key === 'spendTtvPct') {
      cyVal = cy && cy.ttv > 0 ? (cy.allocSpend / cy.ttv) * 100 : 0
      pyVal = py && py.ttv > 0 ? (py.allocSpend / py.ttv) * 100 : 0
    } else if (metric.key === 'cantSourceRate') {
      cyVal = cy && cy.jobs > 0 ? (cy.cantSource / cy.jobs) * 100 : 0
      pyVal = py && py.jobs > 0 ? (py.cantSource / py.jobs) * 100 : 0
    } else if (metric.key === 'otdDealloPct') {
      cyVal = cy && cy.jobs > 0 ? (cy.otdDealloCount / cy.jobs) * 100 : 0
      pyVal = py && py.jobs > 0 ? (py.otdDealloCount / py.jobs) * 100 : 0
    } else if (metric.key === 'tpCancelRate') {
      cyVal = cy && cy.jobs > 0 ? (cy.tpCancels / cy.jobs) * 100 : 0
      pyVal = py && py.jobs > 0 ? (py.tpCancels / py.jobs) * 100 : 0
    } else if (metric.key === 'furnRoutedPct') {
      cyVal = cy && cy.furnTotal > 0 ? (cy.furnRouted / cy.furnTotal) * 100 : 0
      pyVal = py && py.furnTotal > 0 ? (py.furnRouted / py.furnTotal) * 100 : 0
    } else {
      // Simple daily value (jobs, ttv, avFee, allocSpend)
      cyVal = cy ? metric.dailyValue(cy) : 0
      pyVal = py ? metric.dailyValue(py) : 0
    }

    result.push({
      day,
      dayLabel: `${day}`,
      cy: Math.round(cyVal * 100) / 100,
      py: Math.round(pyVal * 100) / 100,
    })
  }

  return result
}

/** Aggregate daily overview data for a given date range and optional category */
function aggregateDaily(
  dailyData: DailyOverviewRow[],
  startDate: string,
  endDate: string,
  category?: string,
  furnRouting?: Record<string, { routed: number; total: number }>,
  tpCancelsLookup?: Record<string, number>,
): OverviewData {
  const filtered = dailyData.filter(row => {
    const matches = row.day >= startDate && row.day <= endDate
    if (category && category !== 'All') {
      return matches && row.category === category
    }
    return matches
  })

  const agg = {
    jobs: 0,
    ttv: 0,
    avFee: 0,
    allocSpend: 0,
    otdCancels: 0,
    tpCancels: 0,
    cantSourceCount: 0,
    deallocations: 0,
    otdDeallocations: 0,
    noSpendJobs: 0,
    otdAllocatedJobs: 0,
  }

  filtered.forEach(row => {
    agg.jobs += row.jobs
    agg.ttv += row.ttv
    agg.avFee += row.avFee
    agg.allocSpend += row.allocSpend
    agg.otdCancels += row.otdCancels
    // Use corrected TP cancels from lookup (only TP-related reason codes)
    // If lookup exists, use it (0 for missing keys = no TP cancels that day/category)
    const tpKey = `${row.day}|${row.category}`
    agg.tpCancels += tpCancelsLookup ? (tpCancelsLookup[tpKey] || 0) : row.tpCancels
    agg.cantSourceCount += row.cantSourceCount
    agg.deallocations += row.deallocations
    agg.otdDeallocations += row.otdDeallocations
    agg.noSpendJobs += row.noSpendJobs
    agg.otdAllocatedJobs += row.otdAllocatedJobs
  })

  // Compute furniture routing from lookup
  let furnRoutedTotal = 0, furnTotal = 0
  if (furnRouting) {
    // Get unique days in the filtered data
    const days = new Set(filtered.map(r => r.day))
    days.forEach(day => {
      const entry = furnRouting[day]
      if (entry) {
        furnRoutedTotal += entry.routed
        furnTotal += entry.total
      }
    })
  }

  return {
    jobs: agg.jobs,
    ttv: agg.ttv,
    avgTtv: agg.jobs > 0 ? agg.ttv / agg.jobs : 0,
    avFee: agg.avFee,
    marginPct: agg.ttv > 0 ? (agg.avFee / agg.ttv) * 100 : 0,
    allocSpend: agg.allocSpend,
    spendTtvPct: agg.ttv > 0 ? (agg.allocSpend / agg.ttv) * 100 : 0,
    otdCancels: agg.otdCancels,
    cantSourceCount: agg.cantSourceCount,
    cantSourceRate: agg.jobs > 0 ? (agg.cantSourceCount / agg.jobs) * 100 : 0,
    tpCancels: agg.tpCancels,
    deallocations: agg.deallocations,
    otdDeallocations: agg.otdDeallocations,
    otdDealloPct: agg.jobs > 0 ? (agg.otdDeallocations / agg.jobs) * 100 : 0,
    otdAllocSpend: 0,
    noSpendJobs: agg.noSpendJobs,
    noSpendPct: agg.otdAllocatedJobs > 0 ? (agg.noSpendJobs / agg.otdAllocatedJobs) * 100 : 0,
    otdAllocatedJobs: agg.otdAllocatedJobs,
    furnRoutedPct: furnTotal > 0 ? (furnRoutedTotal / furnTotal) * 100 : 0,
    tpCancelRate: agg.jobs > 0 ? (agg.tpCancels / agg.jobs) * 100 : 0,
  }
}

/** Convert filtered daily overview data to DailyRaw format for charting */
function convertToDailyRaw(
  dailyData: DailyOverviewRow[],
  startDate: string,
  endDate: string,
  category?: string,
  furnRouting?: Record<string, { routed: number; total: number }>,
  tpCancelsLookup?: Record<string, number>,
): DailyRaw[] {
  const filtered = dailyData.filter(row => {
    const matches = row.day >= startDate && row.day <= endDate
    if (category && category !== 'All') {
      return matches && row.category === category
    }
    return matches
  })

  // Group by day and sum across categories if 'All'
  const byDay: Record<number, DailyRaw> = {}

  filtered.forEach(row => {
    const dayNum = parseInt(row.day.split('-')[2], 10)
    if (!byDay[dayNum]) {
      byDay[dayNum] = {
        day: dayNum,
        jobs: 0,
        ttv: 0,
        avFee: 0,
        allocSpend: 0,
        cantSource: 0,
        tpCancels: 0,
        otdDealloCount: 0,
        furnRouted: 0,
        furnTotal: 0,
      }
    }
    byDay[dayNum].jobs += row.jobs
    byDay[dayNum].ttv += row.ttv
    byDay[dayNum].avFee += row.avFee
    byDay[dayNum].allocSpend += row.allocSpend
    byDay[dayNum].cantSource += row.cantSourceCount
    const tpKey = `${row.day}|${row.category}`
    byDay[dayNum].tpCancels += tpCancelsLookup ? (tpCancelsLookup[tpKey] || 0) : row.tpCancels
    byDay[dayNum].otdDealloCount += row.otdDeallocations

    // Populate furn routing from lookup (only once per day)
    if (furnRouting && byDay[dayNum].furnRouted === 0 && byDay[dayNum].furnTotal === 0) {
      const entry = furnRouting[row.day]
      if (entry) {
        byDay[dayNum].furnRouted = entry.routed
        byDay[dayNum].furnTotal = entry.total
      }
    }
  })

  return Object.values(byDay).sort((a, b) => a.day - b.day)
}

const METRICS: MetricDef[] = [
  { title: 'Completed Jobs', key: 'jobs', fmt: fmtN, type: 'yoy', dailyValue: d => d.jobs },
  { title: 'Total TTV', key: 'ttv', fmt: fmtGBP, type: 'yoy', dailyValue: d => d.ttv },
  { title: 'Furn Routed %', key: 'furnRoutedPct', fmt: fmtP, type: 'pp', dailyValue: () => 0, isCumRate: true },
  { title: 'AV Fee', key: 'avFee', fmt: fmtGBP, type: 'yoy', dailyValue: d => d.avFee },
  { title: 'Margin %', key: 'marginPct', fmt: fmtP, type: 'pp', dailyValue: () => 0, isCumRate: true },
  { title: 'Allocation Spend', key: 'allocSpend', fmt: fmtGBP, type: 'yoy', invert: true, dailyValue: d => d.allocSpend },
  { title: 'Spend / TTV %', key: 'spendTtvPct', fmt: fmtP, type: 'pp', invert: true, dailyValue: () => 0, isCumRate: true },
  { title: 'Cant Source Rate', key: 'cantSourceRate', fmt: fmtP, type: 'pp', invert: true, dailyValue: () => 0, isCumRate: true },
  { title: 'OTD Deallo %', key: 'otdDealloPct', fmt: fmtP, type: 'pp', invert: true, dailyValue: () => 0, isCumRate: true },
  { title: 'TP Cancel Rate', key: 'tpCancelRate', fmt: fmtP, type: 'pp', invert: true, dailyValue: () => 0, isCumRate: true },
]

const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const OverviewView: React.FC<OverviewViewProps> = ({
  overviewByCountry,
  selectedCountry,
  onCountryChange,
  dailyOverviewByCountry,
  furnRoutingByCountry,
  tpCancelsByCountry,
  dataLastUpdated,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey | null>(null)

  // Derive date range from the SELECTED MONTH's dataLastUpdated (not global)
  const monthDate = useMemo(() => {
    const d = dataLastUpdated ? new Date(dataLastUpdated) : new Date()
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth(), // 0-indexed
      day: d.getUTCDate(),
    }
  }, [dataLastUpdated])

  const [dateRange, setDateRange] = useState(() => {
    const d = dataLastUpdated ? new Date(dataLastUpdated) : new Date()
    const year = d.getUTCFullYear()
    const month = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')
    return { start: `${year}-${month}-01`, end: `${year}-${month}-${day}` }
  })

  // Reset date range when dataLastUpdated changes (month toggle)
  useMemo(() => {
    if (dataLastUpdated) {
      const d = new Date(dataLastUpdated)
      const year = d.getUTCFullYear()
      const month = String(d.getUTCMonth() + 1).padStart(2, '0')
      const day = String(d.getUTCDate()).padStart(2, '0')
      setDateRange({ start: `${year}-${month}-01`, end: `${year}-${month}-${day}` })
    }
  }, [dataLastUpdated])

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All')

  // Dynamic month labels derived from dataLastUpdated
  const cyMonthShort = MONTH_NAMES_SHORT[monthDate.month]
  const cyYear = monthDate.year
  const pyYear = cyYear - 1
  const cyLabel = `${cyMonthShort} ${cyYear}`
  const pyLabel = `${cyMonthShort} ${pyYear}`
  const pyLabelShort = `${cyMonthShort} '${String(pyYear).slice(2)}`

  const countryData = overviewByCountry[selectedCountry]
  const countries: Country[] = ['uk', 'spain', 'france']

  // Get country-specific daily data and routing lookup
  const countryDailyData = dailyOverviewByCountry?.[selectedCountry]
  const cyRouting = furnRoutingByCountry?.[`${selectedCountry}_cy`]
  const pyRouting = furnRoutingByCountry?.[`${selectedCountry}_py`]
  const cyTpCancels = tpCancelsByCountry?.[`${selectedCountry}_cy`]
  const pyTpCancels = tpCancelsByCountry?.[`${selectedCountry}_py`]
  const { current: baseData, priorYear: basePriorYear } = countryData

  const { data, priorYear } = useMemo(() => {
    // Use daily data for all countries if available
    if (countryDailyData && countryDailyData.cy && countryDailyData.cy.length > 0) {
      const cyData = aggregateDaily(countryDailyData.cy, dateRange.start, dateRange.end, selectedCategory === 'All' ? undefined : selectedCategory, cyRouting, cyTpCancels)
      const cyYear = dateRange.start.substring(0, 4)
      const pyYear = String(Number(cyYear) - 1)
      const pyData = aggregateDaily(countryDailyData.py, dateRange.start.replace(cyYear, pyYear), dateRange.end.replace(cyYear, pyYear), selectedCategory === 'All' ? undefined : selectedCategory, pyRouting, pyTpCancels)
      return { data: cyData, priorYear: pyData }
    }
    // Fallback to existing aggregated data
    return { data: baseData, priorYear: basePriorYear }
  }, [selectedCountry, countryDailyData, dateRange, selectedCategory, baseData, basePriorYear, cyRouting, pyRouting, cyTpCancels, pyTpCancels])

  const chartData = useMemo(() => {
    if (!selectedMetric) return []
    const metric = METRICS.find(m => m.key === selectedMetric)
    if (!metric) return []

    // Use daily data for all countries if available
    if (countryDailyData && countryDailyData.cy && countryDailyData.cy.length > 0) {
      const cyCY = convertToDailyRaw(countryDailyData.cy, dateRange.start, dateRange.end, selectedCategory === 'All' ? undefined : selectedCategory, cyRouting, cyTpCancels)
      const cyPY = convertToDailyRaw(countryDailyData.py, dateRange.start.replace(String(cyYear), String(pyYear)), dateRange.end.replace(String(cyYear), String(pyYear)), selectedCategory === 'All' ? undefined : selectedCategory, pyRouting, pyTpCancels)
      return buildChartData(cyCY, cyPY, metric)
    }
    return buildChartData(countryData.dailyCY, countryData.dailyPY, metric)
  }, [selectedMetric, selectedCountry, countryData, countryDailyData, dateRange, selectedCategory, cyRouting, pyRouting, cyTpCancels, pyTpCancels])

  const dailyBarData = useMemo(() => {
    if (!selectedMetric) return []
    const metric = METRICS.find(m => m.key === selectedMetric)
    if (!metric) return []

    // Use daily data for all countries if available
    if (countryDailyData && countryDailyData.cy && countryDailyData.cy.length > 0) {
      const cyCY = convertToDailyRaw(countryDailyData.cy, dateRange.start, dateRange.end, selectedCategory === 'All' ? undefined : selectedCategory, cyRouting, cyTpCancels)
      const cyPY = convertToDailyRaw(countryDailyData.py, dateRange.start.replace(String(cyYear), String(pyYear)), dateRange.end.replace(String(cyYear), String(pyYear)), selectedCategory === 'All' ? undefined : selectedCategory, pyRouting, pyTpCancels)
      return buildDailyBarData(cyCY, cyPY, metric)
    }
    return buildDailyBarData(countryData.dailyCY, countryData.dailyPY, metric)
  }, [selectedMetric, selectedCountry, countryData, countryDailyData, dateRange, selectedCategory, cyRouting, pyRouting, cyTpCancels, pyTpCancels])

  const selectedMetricDef = METRICS.find(m => m.key === selectedMetric)

  // Format tooltip values
  const formatTooltipValue = (value: number) => {
    if (!selectedMetricDef) return String(value)
    return selectedMetricDef.fmt(value)
  }

  // Determine display header
  const monthName = new Date(dateRange.start + 'T00:00:00').toLocaleString('en-GB', { month: 'long' })
  const headerYear = dateRange.start.substring(0, 4)
  const startDay = parseInt(dateRange.start.split('-')[2], 10)
  const endDay = parseInt(dateRange.end.split('-')[2], 10)
  const isFullMonth = startDay === 1 && endDay >= 16
  const headerText = isFullMonth
    ? `MTD ${monthName} ${headerYear}`
    : `${startDay}-${endDay} ${monthName} ${headerYear}`

  const categoryOptions: CategoryFilter[] = ['All', 'Furniture', 'Home Removal', 'Car', 'Motorbike', 'Piano']

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

      {/* Date Range and Category Filters */}
      {countryDailyData && countryDailyData.cy && countryDailyData.cy.length > 0 && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 space-y-4">
          {/* Date Range Picker */}
          <div className="flex items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-slate-400">Category:</span>
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-white">
          {headerText} — {COUNTRY_LABELS[selectedCountry]}
        </h2>
        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          vs March 2025 ({selectedCategory !== 'All' ? selectedCategory : 'all categories'})
        </span>
      </div>

      {priorYear.jobs === 0 && (
        <div className="rounded-lg bg-amber-900/30 border border-amber-700/50 px-4 py-2 text-sm text-amber-300">
          No prior year data available for {COUNTRY_LABELS[selectedCountry]} in March 2025 — YoY comparisons show N/A.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {METRICS.filter(m => !m.ukOnly || selectedCountry === 'uk').map((m) => {
          const currentVal = data[m.key as keyof typeof data] as number
          const priorVal = priorYear[m.key as keyof typeof priorYear] as number
          const change = m.type === 'pp' ? ppChange(currentVal, priorVal) : yoyChange(currentVal, priorVal)

          // For these cards, show absolute counts
          let absoluteCount: number | undefined
          let priorAbsoluteCount: number | undefined

          if (m.key === 'cantSourceRate') {
            absoluteCount = data.cantSourceCount
            priorAbsoluteCount = priorYear.cantSourceCount
          } else if (m.key === 'tpCancelRate') {
            absoluteCount = data.tpCancels
            priorAbsoluteCount = priorYear.tpCancels
          } else if (m.key === 'otdDealloPct') {
            absoluteCount = data.otdDeallocations
            priorAbsoluteCount = priorYear.otdDeallocations
          }

          return (
            <ComparisonCard
              key={m.key}
              title={m.title}
              currentValue={m.fmt(currentVal)}
              priorValue={m.fmt(priorVal)}
              trend={change.trend}
              changeLabel={change.label}
              invertColor={m.invert}
              selected={selectedMetric === m.key}
              onClick={() => setSelectedMetric(selectedMetric === m.key ? null : m.key)}
              absoluteCount={absoluteCount}
              priorAbsoluteCount={priorAbsoluteCount}
              pyLabel={pyLabelShort}
            />
          )
        })}
      </div>

      {/* Daily MTD Trend Chart */}
      {selectedMetric && selectedMetricDef && chartData.length > 0 && (<>
        <div className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">
              {selectedMetricDef.title} — Daily Cumulative MTD
            </h3>
            <button
              onClick={() => setSelectedMetric(null)}
              className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700"
            >
              ✕ Close
            </button>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="dayLabel"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                interval={1}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(v) => {
                  if (selectedMetricDef.type === 'pp') return `${v.toFixed(1)}%`
                  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
                  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`
                  return String(v)
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '13px',
                }}
                formatter={(value, name) => [
                  formatTooltipValue(Number(value)),
                  name === 'cy' ? cyLabel : pyLabel,
                ]}
                labelFormatter={(label) => label}
              />
              <Legend
                formatter={(value) => (value === 'cy' ? 'Mar 2026' : 'Mar 2025')}
                wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="cy"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#3b82f6' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="py"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={{ r: 3, fill: '#f59e0b' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Bar Chart */}
        <div className="rounded-xl bg-slate-800 p-6 border border-slate-700 mt-4">
          <h3 className="text-base font-semibold text-white mb-4">
            {selectedMetricDef.title} — Daily Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dailyBarData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="dayLabel"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(v) => {
                  if (selectedMetricDef.type === 'pp') return `${v.toFixed(1)}%`
                  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
                  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`
                  return String(v)
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '13px',
                }}
                formatter={(value, name) => [
                  formatTooltipValue(Number(value)),
                  name === 'cy' ? cyLabel : pyLabel,
                ]}
                labelFormatter={(label) => `${cyMonthShort} ${label}`}
              />
              <Legend
                formatter={(value) => (value === 'cy' ? 'Mar 2026' : 'Mar 2025')}
                wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
              />
              <Bar dataKey="cy" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="py" fill="#f59e0b" radius={[3, 3, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Each bar shows the actual value for that specific day — spot jumps or drops at a glance
          </p>
        </div>
      </>)}

      {!selectedMetric && (
        <p className="text-xs text-slate-500 text-center mt-2">
          Click any metric card to view its daily MTD trend chart with YoY comparison
        </p>
      )}
    </div>
  )
}

export default OverviewView
