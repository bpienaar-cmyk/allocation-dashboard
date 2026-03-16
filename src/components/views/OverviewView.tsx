import React from 'react'
import { Country, CountryOverview } from '../../types'
import { fmtGBP, fmtN, fmtP } from '../../utils/formatting'

const COUNTRY_LABELS: Record<Country, string> = {
  uk: 'UK (V4 + AVB)',
  spain: 'Spain (V4)',
  france: 'France (V4)',
}

interface OverviewViewProps {
  overviewByCountry: Record<Country, CountryOverview>
  selectedCountry: Country
  onCountryChange: (country: Country) => void
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
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({
  title, currentValue, priorValue, trend, changeLabel, invertColor = false,
}) => {
  const color = trend === 'flat'
    ? 'text-slate-400'
    : (invertColor ? (trend === 'down' ? 'text-emerald-400' : 'text-red-400') : (trend === 'up' ? 'text-emerald-400' : 'text-red-400'))

  return (
    <div className="rounded-xl bg-slate-800 p-5 border border-slate-700 hover:border-blue-500/50 transition-colors">
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3">{title}</p>
      <h3 className="text-2xl font-bold text-white">{currentValue}</h3>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">Mar '25: {priorValue}</span>
        <span className={`text-xs font-semibold ${color}`}>
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'} {changeLabel}
        </span>
      </div>
    </div>
  )
}

const OverviewView: React.FC<OverviewViewProps> = ({ overviewByCountry, selectedCountry, onCountryChange }) => {
  const { current: data, priorYear } = overviewByCountry[selectedCountry]

  const metrics = [
    { title: 'Completed Jobs', current: data.jobs, prior: priorYear.jobs, fmt: fmtN, type: 'yoy' as const },
    { title: 'Total TTV', current: data.ttv, prior: priorYear.ttv, fmt: fmtGBP, type: 'yoy' as const },
    { title: 'Avg TTV / Job', current: data.avgTtv, prior: priorYear.avgTtv, fmt: fmtGBP, type: 'yoy' as const },
    { title: 'AV Fee', current: data.avFee, prior: priorYear.avFee, fmt: fmtGBP, type: 'yoy' as const },
    { title: 'Margin %', current: data.marginPct, prior: priorYear.marginPct, fmt: fmtP, type: 'pp' as const },
    { title: 'Allocation Spend', current: data.allocSpend, prior: priorYear.allocSpend, fmt: fmtGBP, type: 'yoy' as const, invert: true },
    { title: 'Spend / TTV %', current: data.spendTtvPct, prior: priorYear.spendTtvPct, fmt: fmtP, type: 'pp' as const, invert: true },
    { title: 'Cant Source Rate', current: data.cantSourceRate, prior: priorYear.cantSourceRate, fmt: fmtP, type: 'pp' as const, invert: true },
    { title: 'OTD Deallo %', current: data.otdDealloPct, prior: priorYear.otdDealloPct, fmt: fmtP, type: 'pp' as const, invert: true },
    { title: 'No-Spend Rate', current: data.noSpendPct, prior: priorYear.noSpendPct, fmt: fmtP, type: 'pp' as const },
  ]

  const countries: Country[] = ['uk', 'spain', 'france']

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

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-white">
          MTD March 2026 — {COUNTRY_LABELS[selectedCountry]}
        </h2>
        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          vs MTD March 2025
        </span>
      </div>

      {priorYear.jobs === 0 && (
        <div className="rounded-lg bg-amber-900/30 border border-amber-700/50 px-4 py-2 text-sm text-amber-300">
          No prior year data available for {COUNTRY_LABELS[selectedCountry]} in March 2025 — YoY comparisons show N/A.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {metrics.map((m) => {
          const change = m.type === 'pp' ? ppChange(m.current, m.prior) : yoyChange(m.current, m.prior)
          return (
            <ComparisonCard
              key={m.title}
              title={m.title}
              currentValue={m.fmt(m.current)}
              priorValue={m.fmt(m.prior)}
              trend={change.trend}
              changeLabel={change.label}
              invertColor={m.invert}
            />
          )
        })}
      </div>
    </div>
  )
}

export default OverviewView
