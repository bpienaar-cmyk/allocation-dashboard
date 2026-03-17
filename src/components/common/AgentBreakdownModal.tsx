import React, { useEffect, useRef } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { AgentSpendRow } from '../../types'

interface AgentBreakdownModalProps {
  daysBucket: string
  month: string
  agentData: AgentSpendRow[]
  onClose: () => void
}

const formatMonthLabel = (month: string) => {
  const [year, monthNum] = month.split('-')
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[parseInt(monthNum) - 1]} ${year}`
}

const AgentBreakdownModal: React.FC<AgentBreakdownModalProps> = ({
  daysBucket,
  month,
  agentData,
  onClose,
}) => {
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose()
  }

  // Aggregate by agent name (sum across regions/categories for the selected month+bucket)
  const agentMap: Record<string, { spend: number; jobs: number }> = {}
  agentData.forEach((r) => {
    if (!agentMap[r.agentName]) agentMap[r.agentName] = { spend: 0, jobs: 0 }
    agentMap[r.agentName].spend += r.spend
    agentMap[r.agentName].jobs += r.jobs
  })

  const chartRows = Object.entries(agentMap)
    .map(([name, data]) => ({
      name,
      spend: Math.round(data.spend * 100) / 100,
      jobs: data.jobs,
    }))
    .sort((a, b) => b.spend - a.spend)

  const totalSpend = chartRows.reduce((sum, r) => sum + r.spend, 0)
  const barHeight = 36
  const chartHeight = Math.max(200, chartRows.length * barHeight + 40)

  const COLORS = [
    '#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#1d4ed8',
    '#818cf8', '#a78bfa', '#c084fc', '#7c3aed', '#6366f1',
    '#38bdf8', '#22d3ee', '#2dd4bf', '#34d399', '#4ade80',
  ]

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Agent Breakdown — {daysBucket}
            </h2>
            <p className="text-sm text-slate-400">{formatMonthLabel(month)} · Total: £{totalSpend.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl font-bold leading-none px-2"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {chartRows.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No agent spend data for this selection.</p>
          ) : (
            <div style={{ height: chartHeight }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartRows}
                  layout="vertical"
                  margin={{ top: 5, right: 60, left: 120, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    stroke="#94a3b8"
                    tick={{ fill: '#e2e8f0', fontSize: 11 }}
                    tickFormatter={(val: number) => val >= 1000 ? `£${(val / 1000).toFixed(1)}k` : `£${val}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ fill: '#e2e8f0', fontSize: 11 }}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '6px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                    formatter={(value: any) => [`£${Number(value).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Spend']}
                  />
                  <Bar dataKey="spend" radius={[0, 4, 4, 0]} barSize={24}>
                    {chartRows.map((_entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Agent table below chart */}
          {chartRows.length > 0 && (
            <div className="mt-4 rounded-lg border border-slate-700 overflow-auto">
              <table className="w-full text-xs text-white">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Agent</th>
                    <th className="px-3 py-2 text-right font-semibold">Spend (£)</th>
                    <th className="px-3 py-2 text-right font-semibold">Jobs</th>
                    <th className="px-3 py-2 text-right font-semibold">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {chartRows.map((row) => (
                    <tr key={row.name} className="hover:bg-slate-800/80">
                      <td className="px-3 py-2 font-medium">{row.name}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        £{row.spend.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{row.jobs}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {totalSpend > 0 ? ((row.spend / totalSpend) * 100).toFixed(1) : '0.0'}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgentBreakdownModal
