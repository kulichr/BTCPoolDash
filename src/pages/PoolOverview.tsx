import { useState } from 'react'
import { usePoolData } from '../hooks/usePoolData'
import { useTrackedWallets } from '../hooks/useTrackedWallets'
import { parseUptimeToDate } from '../utils/format'
import { StatsCards } from '../components/StatsCards'
import { HashrateChart } from '../components/HashrateChart'
import { Leaderboard } from '../components/Leaderboard'
import { BlocksFound } from '../components/BlocksFound'
import { MinerTypes } from '../components/MinerTypes'

export function PoolOverview() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { pool, network, info, chart, minersFromApi, loading, error } = usePoolData(refreshTrigger)
  const { wallets } = useTrackedWallets()

  const uptimeDate = parseUptimeToDate(info ?? null)
  const poolHashrate = pool?.totalHashRate ?? 0
  const blockHeight = pool?.blockHeight ?? network?.blocks ?? 0
  const totalMiners = pool?.totalMiners ?? 0
  const networkDifficulty = network?.difficulty ?? 0
  const networkHashrate = network?.networkhashps ?? 0
  const blocksFound = pool?.blocksFound ?? info?.blockData ?? []
  const userAgents = info?.userAgents ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-end mb-6">
        <button
          type="button"
          onClick={() => setRefreshTrigger((t) => t + 1)}
          className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center hover:bg-accent/30 transition"
          title="Refresh data"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}. Ensure the pool API is running at the target address and reachable from this machine
          (with <code className="bg-white/10 px-1 rounded">npm run dev</code>, the proxy in
          <code className="bg-white/10 px-1 rounded"> vite.config.ts</code> is used).
        </div>
      )}

      {loading && !pool ? (
        <div className="text-white/60">Loading…</div>
      ) : (
        <>
          <div className="mb-6">
            <StatsCards
              poolHashrate={poolHashrate}
              connectedMiners={totalMiners}
              blockHeight={blockHeight}
              networkDifficulty={networkDifficulty}
              networkHashrate={networkHashrate}
              uptimeDate={uptimeDate}
            />
          </div>
          <div className="mb-6">
            <HashrateChart data={chart} />
          </div>
          <div className="mb-6">
            <Leaderboard trackedWallets={wallets} poolTotalHashRate={poolHashrate} minersFromApi={minersFromApi} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BlocksFound blocks={blocksFound} />
            <MinerTypes userAgents={userAgents} />
          </div>
        </>
      )}
    </div>
  )
}
