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
import { IResReservationRow } from '../../types'
import { fmtN, fmtP } from '../../utils/formatting'

interface ReservationsViewProps {
  data: IResReservationRow[]
}

interface RegionStatData {
  region: string;
  pending: number;
  accepted: number;
  journey_associated: number;
  unsuccessful: number;
  total: number;
  associationPct: number;
}

type SortField = keyof Omit<RegionStatData, 'region'>

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

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  accepted: '#3b82f6',
  journey_associated: '#22c55e',
  unsuccessful: '#ef4444',
}

const TRACKED_STATUSES = ['pending', 'accepted', 'journey_associated', 'unsuccessful']

const ReservationsView: React.FC<ReservationsViewProps> = ({ data }) => {
  const [sortField, setSortField] = useState<SortField>('total')
  const [sortAsc, setSortAsc] = useState(false)

  const aggregatedData = useMemo(() => {
    const regionMap: Record<string, Record<string, number>> = {}

    REGION_ORDER.forEach((region) => {
      regionMap[region] = { pending: 0, accepted: 0, journey_associated: 0, unsuccessful: 0 }
    })

    data.forEach((row) => {
      if (!TRACKED_STATUSES.includes(row.status)) return
      if (!regionMap[row.nutsRegion]) {
        regionMap[row.nutsRegion] = { pending: 0, accepted: 0, journey_associated: 0, unsuccessful: 0 }
      }
      regionMap[row.nutsRegion][row.status] += row.count
    })

    const tableData: RegionStatData[] = REGION_ORDER
      .filter((region) => regionMap[region])
      .map((region) => {
        const s = regionMap[region]
        const total = s.pending + s.accepted + s.journey_associated + s.unsuccessful
        return {
          region,
          pending: s.pending,
          accepted: s.accepted,
          journey_associated: s.journey_associated,
          unsuccessful: s.unsuccessful,
          total,
          associationPct: total > 0 ? s.journey_associated / total * 100 : 0,
        }
      })

    return tableData
  }, [data])

  const totalsRow = useMemo(() => {
    const t: RegionStatData = {
      region: 'TOTAL',
      pending: 0, accepted: 0, journey_associated: 0, unsuccessful: 0,
      total: 0, associationPct: 0,
    }
    aggregatedData.forEach((row) => {
      t.pending += row.pending
      t.accepted += row.accepted
      t.journey_associated += row.journey_associated
      t.unsuccessful += row.unsuccessful
      t.total += row.total
    })
    t.associationPct = t.total > 0 ? t.journey_associated / t.total * 100 : 0
    return t
  }, [aggregatedData])

  const sortedData = useMemo(() => {
    return [...aggregatedData].sort((a, b) => {
      const result = (b[sortField] as number) - (a[sortField] as number)
      return sortAsc ? -result : result
    })
  }, [aggregatedData, sortField, sortAsc])

  const chartData = useMemo(() => {
    return aggregatedData.map((row) => ({
      region: row.region.replace(' (England)', ''),
      pending: row.pending,
      accepted: row.accepted,
      journey_associated: row.journey_associated,
      unsuccessful: row.unsuccessful,
    }))
  }, [aggregatedData])

  const handleHeaderClick = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc)
    else { setSortField(field); setSortAsc(false) }
  }

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return ' \u2195'
    return sortAsc ? ' \u2191' : ' \u2193'
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-slate-800 border border-slate-700 rounded p-3 text-white text-sm space-y-1">
          <p className="font-semibold">{item.region}</p>
          <p className="text-amber-400">Pending: {fmtN(item.pending)}</p>
          <p className="text-blue-400">Accepted: {fmtN(item.accepted)}</p>
          <p className="text-green-400">Journey Associated: {fmtN(item.journey_associated)}</p>
          <p className="text-red-400">Unsuccessful: {fmtN(item.unsuccessful)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6" style={{ height: '420px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
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
            <Bar dataKey="journey_associated" stackId="a" fill={STATUS_COLORS.journey_associated} name="Journey Associated" />
            <Bar dataKey="accepted" stackId="a" fill={STATUS_COLORS.accepted} name="Accepted" />
            <Bar dataKey="pending" stackId="a" fill={STATUS_COLORS.pending} name="Pending" />
            <Bar dataKey="unsuccessful" stackId="a" fill={STATUS_COLORS.unsuccessful} name="Unsuccessful" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg overflow-hidden border border-slate-700">
        <table className="w-full text-sm text-white">
          <thead className="bg-slate-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Region</th>
              <th
                className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => handleHeaderClick('pending')}
              >
                Pending{getSortIndicator('pending')}
              </th>
              <th
                className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => handleHeaderClick('accepted')}
              >
                Accepted{getSortIndicator('accepted')}
              </th>
              <th
                className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => handleHeaderClick('journey_associated')}
              >
                Journey Assoc.{getSortIndicator('journey_associated')}
              </th>
              <th
                className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => handleHeaderClick('unsuccessful')}
              >
                Unsuccessful{getSortIndicator('unsuccessful')}
              </th>
              <th
                className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => handleHeaderClick('total')}
              >
                Total{getSortIndicator('total')}
              </th>
              <th
                className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => handleHeaderClick('associationPct')}
              >
                Association %{getSortIndicator('associationPct')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sortedData.map((row) => (
              <tr key={row.region} className="bg-slate-800 hover:bg-slate-750 transition-colors">
                <td className="px-6 py-3 font-medium">{row.region}</td>
                <td className="px-4 py-3 text-right text-amber-400">{fmtN(row.pending)}</td>
                <td className="px-4 py-3 text-right text-blue-400">{fmtN(row.accepted)}</td>
                <td className="px-4 py-3 text-right text-green-400">{fmtN(row.journey_associated)}</td>
                <td className="px-4 py-3 text-right text-red-400">{fmtN(row.unsuccessful)}</td>
                <td className="px-4 py-3 text-right font-medium">{fmtN(row.total)}</td>
                <td className="px-4 py-3 text-right text-emerald-400">{fmtP(row.associationPct)}</td>
              </tr>
            ))}
            <tr className="bg-slate-700 font-semibold border-t-2 border-slate-500">
              <td className="px-6 py-3">{totalsRow.region}</td>
              <td className="px-4 py-3 text-right text-amber-400">{fmtN(totalsRow.pending)}</td>
              <td className="px-4 py-3 text-right text-blue-400">{fmtN(totalsRow.accepted)}</td>
              <td className="px-4 py-3 text-right text-green-400">{fmtN(totalsRow.journey_associated)}</td>
              <td className="px-4 py-3 text-right text-red-400">{fmtN(totalsRow.unsuccessful)}</td>
              <td className="px-4 py-3 text-right">{fmtN(totalsRow.total)}</td>
              <td className="px-4 py-3 text-right text-emerald-400">{fmtP(totalsRow.associationPct)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReservationsView
