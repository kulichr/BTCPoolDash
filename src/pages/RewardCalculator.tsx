import { useEffect, useState } from 'react'
import { usePoolData } from '../hooks/usePoolData'
import { useTrackedWallets } from '../hooks/useTrackedWallets'
import { fetchClientInfo } from '../api/poolApi'
import { BLOCK_REWARD_BTC } from '../config'
import { formatHashrate, truncateAddress } from '../utils/format'
import type { MinerEntry } from '../types'

interface WalletRewardRow {
  name: string
  address: string
  hashrate: number
}

function getMinerHashrate(m: MinerEntry): number {
  const h = m.hashrate ?? m.hashRate ?? (m as { hash_rate?: number }).hash_rate ?? 0
  return typeof h === 'number' ? h : parseFloat(String(h)) || 0
}
function getMinerAddress(m: MinerEntry): string {
  return String(m.address ?? m.addr ?? m.wallet ?? '')
}

export function RewardCalculator() {
  const { pool, minersFromApi, loading: poolLoading, error: poolError } = usePoolData(0)
  const { wallets } = useTrackedWallets()
  const [rows, setRows] = useState<WalletRewardRow[]>([])
  const [loading, setLoading] = useState(true)

  const poolHashrate = pool?.totalHashRate ?? 0
  const blockRewardBtc = BLOCK_REWARD_BTC

  useEffect(() => {
    if (poolLoading) {
      setLoading(true)
      return
    }
    if (minersFromApi.length > 0) {
      setRows(
        minersFromApi.map((m) => ({
          name: (m.name as string) ?? truncateAddress(getMinerAddress(m)),
          address: getMinerAddress(m),
          hashrate: getMinerHashrate(m),
        }))
      )
      setLoading(false)
      return
    }
    if (wallets.length === 0) {
      setRows([])
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all(
      wallets.map((w) =>
        fetchClientInfo(w.address).then((info): WalletRewardRow => {
          const hashrate = info?.workers?.reduce((s, worker) => s + (worker?.hashRate ?? 0), 0) ?? 0
          return { name: w.name, address: w.address, hashrate }
        })
      )
    ).then((r) => {
      setRows(r)
      setLoading(false)
    })
  }, [poolLoading, minersFromApi, wallets])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-white mb-6">Reward calculator</h1>
      {poolError && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{poolError}</div>
      )}
      <div className="bg-surface-card rounded-xl p-5 border border-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Current block reward</h2>
        <p className="text-2xl font-bold text-accent">{blockRewardBtc} BTC</p>
        <p className="text-white/50 text-sm mt-1">Per block (pool finds a block)</p>
      </div>
      <div className="bg-surface-card rounded-xl p-5 border border-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Reward per wallet</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <button type="button" className="px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white">
            By current hashrate
          </button>
          <button type="button" disabled className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white/50 cursor-not-allowed">
            By total hashrate (shares) — coming soon
          </button>
        </div>
        {loading ? (
          <p className="text-white/50 text-sm">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-white/50 text-sm">No wallets or miners to show.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/60 text-left border-b border-white/10">
                  <th className="pb-2 pr-4">Wallet</th>
                  <th className="pb-2 pr-4">Hashrate</th>
                  <th className="pb-2 pr-4">Share</th>
                  <th className="pb-2">Est. reward (BTC)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const share = poolHashrate > 0 ? row.hashrate / poolHashrate : 0
                  const rewardBtc = share * blockRewardBtc
                  const sharePct = share * 100
                  return (
                    <tr key={row.address} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium text-white">{row.name}</p>
                          <p className="text-white/50 text-xs">{truncateAddress(row.address)}</p>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-accent">{formatHashrate(row.hashrate)}</td>
                      <td className="py-3 pr-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-medium">{sharePct.toFixed(2)}%</span>
                      </td>
                      <td className="py-3 text-white font-medium">{rewardBtc.toFixed(6)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
