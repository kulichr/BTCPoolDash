import { useEffect, useState } from 'react'
import * as api from '../api/poolApi'
import type { ChartDataPoint, MinerEntry, NetworkInfo, PoolInfo, SiteInfo } from '../types'

export function usePoolData(refreshTrigger: number) {
  const [pool, setPool] = useState<PoolInfo | null>(null)
  const [network, setNetwork] = useState<NetworkInfo | null>(null)
  const [info, setInfo] = useState<SiteInfo | null>(null)
  const [chart, setChart] = useState<ChartDataPoint[]>([])
  const [minersFromApi, setMinersFromApi] = useState<MinerEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setMinersFromApi([])

    async function load() {
      try {
        const [p, n, i, c] = await Promise.all([
          api.fetchPool(),
          api.fetchNetwork(),
          api.fetchInfo(),
          api.fetchInfoChart(),
        ])
        if (!cancelled) {
          setPool(p)
          setNetwork(n)
          setInfo(i)
          setChart(c)
        }
      } catch (standardError) {
        if (cancelled) return
        try {
          const raw = await api.fetchMiners()
          if (cancelled) return
          const miners = api.normalizeMinersResponse(raw)
          const totalHashRate = miners.reduce((sum, m) => {
            const h = m.hashrate ?? m.hashRate ?? (m as { hash_rate?: number }).hash_rate ?? 0
            return sum + (typeof h === 'number' ? h : parseFloat(String(h)) || 0)
          }, 0)
          const totalMiners = miners.reduce((sum, m) => {
            const w = m.workers ?? m.workerCount ?? (m as { worker_count?: number }).worker_count ?? 1
            return sum + (typeof w === 'number' ? w : parseInt(String(w), 10) || 1)
          }, 0)
          setMinersFromApi(miners)
          setPool({
            totalHashRate,
            totalMiners,
            blockHeight: 0,
            blocksFound: [],
            fee: 0,
          })
          setNetwork(null)
          setChart([])
          setError(null)
          const infoFromApi = await api.fetchInfo().catch(() => null)
          if (!cancelled && infoFromApi) setInfo(infoFromApi)
          else if (!cancelled) setInfo(null)
        } catch {
          if (!cancelled) {
            setError(
              standardError instanceof Error
                ? standardError.message
                : 'Failed to load data. Ensure the pool API is running (e.g. /api/pool or /api/miners).'
            )
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [refreshTrigger])

  return { pool, network, info, chart, minersFromApi, loading, error }
}
