export function formatHashrate(hashRate: number): string {
  if (hashRate >= 1e12) return `${(hashRate / 1e12).toFixed(2)} TH/s`
  if (hashRate >= 1e9) return `${(hashRate / 1e9).toFixed(2)} GH/s`
  if (hashRate >= 1e6) return `${(hashRate / 1e6).toFixed(2)} MH/s`
  if (hashRate >= 1e3) return `${(hashRate / 1e3).toFixed(2)} kH/s`
  return `${hashRate.toFixed(2)} H/s`
}

export function formatNetworkHashrate(hashRate: number): string {
  if (hashRate >= 1e18) return `${(hashRate / 1e18).toFixed(2)} EH/s`
  if (hashRate >= 1e15) return `${(hashRate / 1e15).toFixed(2)} PH/s`
  if (hashRate >= 1e12) return `${(hashRate / 1e12).toFixed(2)} TH/s`
  return formatHashrate(hashRate)
}

export function formatDifficulty(diff: number): string {
  if (diff >= 1e12) return `${(diff / 1e12).toFixed(2)}T`
  if (diff >= 1e9) return `${(diff / 1e9).toFixed(2)}G`
  if (diff >= 1e6) return `${(diff / 1e6).toFixed(2)}M`
  if (diff >= 1e3) return `${(diff / 1e3).toFixed(2)}K`
  return String(diff)
}

export function truncateAddress(addr: string, start = 6, end = 6): string {
  if (addr.length <= start + end) return addr
  return `${addr.slice(0, start)}...${addr.slice(-end)}`
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
}

export function parseUptimeToDate(info: {
  uptime?: string | number
  startedAt?: string | number
  serverStartTime?: string | number
} | null): Date | null {
  if (!info) return null
  const raw = info.uptime ?? info.startedAt ?? info.serverStartTime
  if (raw == null) return null
  if (typeof raw === 'number') {
    if (raw <= 0) return null
    if (raw < 1e7) return new Date(Date.now() - raw * 1000)
    if (raw < 1e12) return new Date(raw * 1000)
    return new Date(raw)
  }
  const d = new Date(raw)
  return isNaN(d.getTime()) ? null : d
}
