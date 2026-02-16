import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatHashrate } from '../utils/format'
import type { ChartDataPoint } from '../types'

interface HashrateChartProps {
  data: ChartDataPoint[]
}

export function HashrateChart({ data }: HashrateChartProps) {
  const chartData = data.map((d) => ({
    time: new Date(d.label).getTime(),
    label: new Date(d.label).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    hashrate: Number(d.data),
  }))
  const maxHash = Math.max(0, ...chartData.map((d) => d.hashrate))

  return (
    <div className="bg-surface-card rounded-xl p-5 border border-white/5">
      <h2 className="text-lg font-semibold text-white mb-4">Pool Hashrate (24h)</h2>
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-white/50 text-sm">No chart data.</div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="hashrateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
              <YAxis domain={[0, maxHash * 1.05 || 1]} tickFormatter={(v) => formatHashrate(v)} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} width={70} />
              <Tooltip contentStyle={{ backgroundColor: '#222228', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} labelStyle={{ color: 'rgba(255,255,255,0.8)' }} formatter={(value: number) => [formatHashrate(value), 'Hashrate']} labelFormatter={(label) => `Time: ${label}`} />
              <Area type="monotone" dataKey="hashrate" stroke="#f97316" strokeWidth={2} fill="url(#hashrateGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
