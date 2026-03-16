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
import { RegionRow } from '../../types'
import { fmtGBP, fmtN, fmtP } from '../../utils/formatting'

interface RegionalViewProps {
  data: RegionRow[]
}

type SortField = 'region' | 'jobs' | 'ttv' | 'marginPct' | 'allocSpend' | 'spendTtvPct'

const RegionalView: React.FC<RegionalViewProps> = ({ data }) => {
  const [sortField, setSortField] = useState<SortField>('allocSpend')
  const [sortAsc, setSortAsc] = useState(false)

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      const result = typeof aVal === 'string'
        ? aVal.localeCompare(bVal as string)
        : (bVal as number) - (aVal as number)
      return sortAsc ? result : -result
    })
    return sorted
  }, [data, sortField, sortAsc])

  const handleHeaderClick = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return ' ↕'
    return sortAsc ? ' ↑' : ' ↓'
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-slate-800 border border-slate-700 rounded p-3 text-white text-sm space-y-1">
          <p className="font-semibold">{item.region}</p>
          <p className="text-blue-400">Spend: {fmtGBP(item.allocSpend)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <YAxis
              dataKey="region"
              type="category"
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              width={140}
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

      <div className="rounded-lg overflow-hidden border border-slate-700">
        <table className="w-full text-sm text-white">
          <thead className="bg-slate-700 text-white">
            <tr>
              <th
                className="px-6 py-3 text-left font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => handleHeaderClick('region')}
              >
                Region{getSortIndicator('region')}
              </th>
              <th
                className="px-6 py-3 text-right font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => handleHeaderClick('jobs')}
              >
                Jobs{getSortIndicator('jobs')}
              </th>
              <th
                className="px-6 py-3 text-right font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => handleHeaderClick('ttv')}
              >
                TTV{getSortIndicator('ttv')}
              </th>
              <th
                className="px-6 py-3 text-right font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => handleHeaderClick('marginPct')}
              >
                Margin %{getSortIndicator('marginPct')}
              </th>
              <th
                className="px-6 py-3 text-right font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => handleHeaderClick('allocSpend')}
              >
                Alloc Spend{getSortIndicator('allocSpend')}
              </th>
              <th
                className="px-6 py-3 text-right font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => handleHeaderClick('spendTtvPct')}
              >
                Spend/TTV %{getSortIndicator('spendTtvPct')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sortedData.map((row) => (
              <tr key={row.region} className="bg-slate-800 hover:bg-slate-750 transition-colors">
                <td className="px-6 py-4 font-medium">{row.region}</td>
                <td className="px-6 py-4 text-right">{fmtN(row.jobs)}</td>
                <td className="px-6 py-4 text-right">{fmtGBP(row.ttv)}</td>
                <td className="px-6 py-4 text-right text-blue-400">{fmtP(row.marginPct)}</td>
                <td className="px-6 py-4 text-right font-medium">{fmtGBP(row.allocSpend)}</td>
                <td className="px-6 py-4 text-right text-emerald-400">{fmtP(row.spendTtvPct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RegionalView
