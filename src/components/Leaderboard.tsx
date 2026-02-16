import { useEffect, useState } from 'react'
import { formatHashrate, formatDifficulty, truncateAddress } from '../utils/format'
import { fetchClientInfo } from '../api/poolApi'
import type { MinerEntry, TrackedWallet } from '../types'

interface LeaderboardRow {
  wallet: TrackedWallet
  totalHashRate: number
  share: number
  workersCount: number
  bestDifficulty: number
}

interface LeaderboardProps {
  trackedWallets: TrackedWallet[]
  poolTotalHashRate: number
  minersFromApi: MinerEntry[]
}

function getMinerAddress(m: MinerEntry): string {
  return String(m.address ?? m.addr ?? m.wallet ?? '')
}
function getMinerHashrate(m: MinerEntry): number {
  const h = m.hashrate ?? m.hashRate ?? (m as { hash_rate?: number }).hash_rate ?? 0
  return typeof h === 'number' ? h : parseFloat(String(h)) || 0
}
function getMinerWorkers(m: MinerEntry): number {
  const w = m.workers ?? m.workerCount ?? (m as { worker_count?: number }).worker_count ?? 1
  return typeof w === 'number' ? w : parseInt(String(w), 10) || 1
}
function getMinerBestDiff(m: MinerEntry): number {
  const d = m.bestDifficulty ?? (m as { best_difficulty?: number }).best_difficulty ?? 0
  return typeof d === 'number' ? d : parseFloat(String(d)) || 0
}

export function Leaderboard({ trackedWallets, poolTotalHashRate, minersFromApi }: LeaderboardProps) {
  const [rows, setRows] = useState<LeaderboardRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (trackedWallets.length === 0) {
      setRows([])
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all(
      trackedWallets.map((w) =>
        fetchClientInfo(w.address).then((info): LeaderboardRow | null => {
          if (!info) return null
          const totalHashRate = info.workers.reduce((s, worker) => s + (worker?.hashRate ?? 0), 0)
          const share = poolTotalHashRate > 0 ? (totalHashRate / poolTotalHashRate) * 100 : 0
          return { wallet: w, totalHashRate, share, workersCount: info.workersCount, bestDifficulty: info.bestDifficulty ?? 0 }
        })
      )
    ).then((results) => {
      const valid = results.filter((r): r is LeaderboardRow => r !== null)
      valid.sort((a, b) => b.totalHashRate - a.totalHashRate)
      setRows(valid)
      setLoading(false)
    })
  }, [trackedWallets, poolTotalHashRate])

  const useApiMiners = minersFromApi.length > 0
  const sortedApiMiners = useApiMiners ? [...minersFromApi].sort((a, b) => getMinerHashrate(b) - getMinerHashrate(a)) : []

  return (
    <div className="bg-surface-card rounded-xl p-5 border border-white/5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-amber-400">🏆</span> Leaderboard
        </h2>
      </div>
      {useApiMiners ? (
        sortedApiMiners.length === 0 ? (
          <p className="text-white/50 text-sm">No miners in the pool.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/60 text-left border-b border-white/10">
                  <th className="pb-2 pr-4 w-12">#</th>
                  <th className="pb-2 pr-4">Miner</th>
                  <th className="pb-2 pr-4">Hashrate</th>
                  <th className="pb-2 pr-4">Share</th>
                  <th className="pb-2 pr-4">Workers</th>
                  <th className="pb-2">Best Diff</th>
                </tr>
              </thead>
              <tbody>
                {sortedApiMiners.map((m, idx) => {
                  const addr = getMinerAddress(m)
                  const hashrate = getMinerHashrate(m)
                  const share = poolTotalHashRate > 0 ? (hashrate / poolTotalHashRate) * 100 : 0
                  return (
                    <tr key={addr || idx} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pr-4">
                        <span className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-xs font-semibold ${idx === 0 ? 'bg-amber-500/30 text-amber-400' : 'bg-white/10 text-white/80'}`}>{idx + 1}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium text-white">{m.name ?? truncateAddress(addr)}</p>
                          {addr && <p className="text-white/50 text-xs">{truncateAddress(addr)}</p>}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-accent">{formatHashrate(hashrate)}</td>
                      <td className="py-3 pr-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-medium">{share.toFixed(1)}%</span>
                      </td>
                      <td className="py-3 pr-4 text-white/80">{getMinerWorkers(m)}</td>
                      <td className="py-3 text-white/80">{formatDifficulty(getMinerBestDiff(m))}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      ) : loading ? (
        <p className="text-white/50 text-sm">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-white/50 text-sm">No wallets in config (src/config.ts).</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/60 text-left border-b border-white/10">
                <th className="pb-2 pr-4 w-12">#</th>
                <th className="pb-2 pr-4">Miner</th>
                <th className="pb-2 pr-4">Hashrate</th>
                <th className="pb-2 pr-4">Share</th>
                <th className="pb-2 pr-4">Workers</th>
                <th className="pb-2 pr-4">Best Diff</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.wallet.address} className="border-b border-white/5 last:border-0">
                  <td className="py-3 pr-4">
                    <span className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-xs font-semibold ${idx === 0 ? 'bg-amber-500/30 text-amber-400' : 'bg-white/10 text-white/80'}`}>{idx + 1}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div>
                      <p className="font-medium text-white">{row.wallet.name}</p>
                      <p className="text-white/50 text-xs">{truncateAddress(row.wallet.address)}</p>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-accent">{formatHashrate(row.totalHashRate)}</td>
                  <td className="py-3 pr-4">
                    <span className="inline-block px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-medium">{row.share.toFixed(1)}%</span>
                  </td>
                  <td className="py-3 pr-4 text-white/80">{row.workersCount}</td>
                  <td className="py-3 pr-4 text-white/80">{formatDifficulty(row.bestDifficulty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
