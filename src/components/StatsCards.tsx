import { formatDate, formatHashrate, formatNetworkHashrate, formatDifficulty, timeAgo } from '../utils/format'

interface StatsCardsProps {
  poolHashrate: number
  connectedMiners: number
  blockHeight: number
  networkDifficulty: number
  networkHashrate: number
  uptimeDate: Date | null
}

const Card = ({ icon, label, value, sub, highlight }: { icon: React.ReactNode; label: string; value: string; sub?: string; highlight?: boolean }) => (
  <div className="bg-surface-card rounded-xl p-4 border border-white/5">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-accent shrink-0 [&_svg]:block [&_svg]:shrink-0 [&_svg]:mx-auto">{icon}</div>
      <div className="min-w-0">
        <p className="text-white/60 text-sm">{label}</p>
        <p className={`text-lg font-semibold ${highlight ? 'text-accent' : 'text-white'}`}>{value}</p>
        {sub && <p className="text-white/50 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  </div>
)

// Icons: Bolt (hashrate/power), UserGroup (miners), Squares2x2 (blocks/height), GlobeAlt (network), Clock (uptime)
const iconSvg = (path: string) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
    <path d={path} />
  </svg>
)

export function StatsCards({ poolHashrate, connectedMiners, blockHeight, networkDifficulty, networkHashrate, uptimeDate }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card icon={iconSvg('M13 10V3L4 14h7v7l9-11h-7z')} label="Pool Hashrate" value={formatHashrate(poolHashrate)} highlight />
      <Card icon={iconSvg('M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z')} label="Connected Miners" value={String(connectedMiners)} />
      <Card icon={iconSvg('M4 6h16M4 12h16M4 18h16')} label="Block Height" value={blockHeight.toLocaleString('en-GB')} />
      <Card icon={iconSvg('M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M21 12a9 9 0 11-18 0 9 9 0 0118 0z')} label="Network Difficulty" value={formatDifficulty(networkDifficulty)} sub={`${formatNetworkHashrate(networkHashrate)} network`} highlight />
      <Card icon={iconSvg('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z')} label="Pool Uptime" value={uptimeDate ? timeAgo(uptimeDate) : '—'} sub={uptimeDate ? `Since ${formatDate(uptimeDate)}` : undefined} />
    </div>
  )
}
