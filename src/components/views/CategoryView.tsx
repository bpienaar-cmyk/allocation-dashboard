import React from 'react'
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
import { CategoryRow } from '../../types'
import { fmtGBP, fmtN, fmtP } from '../../utils/formatting'

interface CategoryViewProps {
  data: CategoryRow[]
}

const CategoryView: React.FC<CategoryViewProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-slate-800 border border-slate-700 rounded p-3 text-white text-sm space-y-1">
          <p className="font-semibold">{item.category}</p>
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
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <YAxis
              dataKey="category"
              type="category"
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              width={190}
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
              <th className="px-6 py-3 text-left font-semibold">Category</th>
              <th className="px-6 py-3 text-right font-semibold">Jobs</th>
              <th className="px-6 py-3 text-right font-semibold">TTV</th>
              <th className="px-6 py-3 text-right font-semibold">Margin %</th>
              <th className="px-6 py-3 text-right font-semibold">Alloc Spend</th>
              <th className="px-6 py-3 text-right font-semibold">Spend/TTV %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {data.map((row) => (
              <tr key={row.category} className="bg-slate-800 hover:bg-slate-750 transition-colors">
                <td className="px-6 py-4 font-medium">{row.category}</td>
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

export default CategoryView
