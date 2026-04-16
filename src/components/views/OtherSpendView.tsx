import React, { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { OtherSpendDetailRow, OtherSpendAgentRow, OtherSpendReasonRow, OtherSpendTrendRow, Country } from '../../types'

interface OtherSpendViewProps {
  detailByCountry: Record<string, OtherSpendDetailRow[]>
  agentByCountry: Record<string, OtherSpendAgentRow[]>
  reasonByCountry: Record<string, OtherSpendReasonRow[]>
  trendByCountry: Record<string, OtherSpendTrendRow[]>
  selectedCountry: Country
  onCountryChange: (c: Country) => void
}

const COUNTRY_LABELS: Record<Country, string> = {
  uk: 'UK (V4 + AVB)',
  spain: 'Spain (V4)',
  france: 'France (V4)',
}
const countries: Country[] = ['uk', 'spain', 'france']

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

const formatReasonLabel = (reason: string) => {
  return reason
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const formatDateLabel = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00Z')
  return `${d.getUTCDate()} ${d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' })}`
}

const REASON_COLORS: Record<string, string> = {
  boost_prices: '#3b82f6',
  admin_error: '#ef4444',
  other: '#f59e0b',
  listing_edit_pricing_issue: '#8b5cf6',
  marketing_influencer_booking: '#10b981',
  reactivated_price_split_incorrect: '#ec4899',
}

const OtherSpendView: React.FC<OtherSpendViewProps> = ({
  detailByCountry,
  agentByCountry,
  reasonByCountry,
  trendByCountry,
  selectedCountry,
  onCountryChange,
}) => {
  const [sortField, setSortField] = useState<'amount' | 'spendDate'>('spendDate')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const detail = detailByCountry[selectedCountry] || []
  const agents = agentByCountry[selectedCountry] || []
  const reasons = reasonByCountry[selectedCountry] || []
  const trends = trendByCountry[selectedCountry] || []

  const totalMtdSpend = useMemo(() => detail.reduce((s, r) => s + r.amount, 0), [detail])
  const totalMtdJobs = detail.length

  const sortedDetail = useMemo(() => {
    const sorted = [...detail]
    sorted.sort((a, b) => {
      if (sortField === 'amount') return sortDir === 'desc' ? b.amount - a.amount : a.amount - b.amount
      return sortDir === 'desc'
        ? b.spendDate.localeCompare(a.spendDate) || b.amount - a.amount
        : a.spendDate.localeCompare(b.spendDate) || b.amount - a.amount
    })
    return sorted
  }, [detail, sortField, sortDir])

  const trendChartData = useMemo(() => {
    return trends.map(t => ({
      month: formatMonthLabel(t.month),
      spend: Math.round(t.totalSpend),
      jobs: t.jobCount,
    }))
  }, [trends])

  const handleSort = (field: 'amount' | 'spendDate') => {
    if (sortField === field) {
      setSortDir(d => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const sortIndicator = (field: string) => {
    if (sortField !== field) return ''
    return sortDir === 'desc' ? ' ▼' : ' ▲'
  }

  return (
    <div className="space-y-6">
      {/* Country selector */}
      <div className="flex gap-2">
        {countries.map(c => (
          <button key={c} onClick={() => onCountryChange(c)} className={countryBtnClass(selectedCountry === c)}>
            {COUNTRY_LABELS[c]}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">MTD Other Spend</p>
          <p className="text-2xl font-bold text-white mt-1">£{totalMtdSpend.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <p className="text-slate-400 text-sm">MTD Jobs with Other Spend</p>
          <p className="text-2xl font-bold text-white mt-1">{totalMtdJobs}</p>
        </div>
      </div>

      {/* Trend chart */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Other Spend — Monthly Trend (Jan 2025 → Current)</h3>
        {trendChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={trendChartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v: number) => fmtCurrency(v)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: number) => [`£${value.toLocaleString()}`, 'Spend']}
              />
              <Legend />
              <Bar dataKey="spend" name="Other Spend (£)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-400 text-sm">No trend data available for this country.</p>
        )}
      </div>

      {/* Agent and Reason breakdowns side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Breakdown */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Agent Breakdown — MTD</h3>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-2 pr-2">Agent</th>
                  <th className="text-right py-2 px-2">Amount</th>
                  <th className="text-right py-2 pl-2">Jobs</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a, i) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-2 pr-2 text-white">{a.agentName}</td>
                    <td className="py-2 px-2 text-right text-amber-400 font-mono">£{a.totalSpend.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="py-2 pl-2 text-right text-slate-300">{a.jobCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reason Code Breakdown */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Reason Code Breakdown — MTD</h3>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-2 pr-2">Reason Code</th>
                  <th className="text-right py-2 px-2">Amount</th>
                  <th className="text-right py-2 pl-2">Jobs</th>
                </tr>
              </thead>
              <tbody>
                {reasons.map((r, i) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-2 pr-2 text-white flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                        style={{ backgroundColor: REASON_COLORS[r.reason] || '#64748b' }}
                      />
                      {formatReasonLabel(r.reason)}
                    </td>
                    <td className="py-2 px-2 text-right text-amber-400 font-mono">£{r.totalSpend.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="py-2 pl-2 text-right text-slate-300">{r.jobCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail table */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Other Spend Detail — MTD</h3>
        <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-800 z-10">
              <tr className="text-slate-400 border-b border-slate-700">
                <th
                  className="text-left py-2 pr-2 cursor-pointer hover:text-white select-none"
                  onClick={() => handleSort('spendDate')}
                >
                  Date{sortIndicator('spendDate')}
                </th>
                <th className="text-left py-2 px-2">Reason Code</th>
                <th
                  className="text-right py-2 px-2 cursor-pointer hover:text-white select-none"
                  onClick={() => handleSort('amount')}
                >
                  Amount{sortIndicator('amount')}
                </th>
                <th className="text-right py-2 px-2">Listing</th>
                <th className="text-left py-2 pl-2">Agent</th>
              </tr>
            </thead>
            <tbody>
              {sortedDetail.map((row, i) => (
                <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-2 pr-2 text-slate-300 whitespace-nowrap">{formatDateLabel(row.spendDate)}</td>
                  <td className="py-2 px-2 text-white">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                        style={{ backgroundColor: REASON_COLORS[row.reason] || '#64748b' }}
                      />
                      {formatReasonLabel(row.reason)}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right text-amber-400 font-mono">£{row.amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="py-2 px-2 text-right text-slate-300 font-mono">{row.listingId}</td>
                  <td className="py-2 pl-2 text-white whitespace-nowrap">{row.agentName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OtherSpendView
