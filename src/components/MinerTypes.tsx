import type { UserAgentInfo } from '../types'
import { formatHashrate, formatDifficulty } from '../utils/format'

interface MinerTypesProps {
  userAgents: UserAgentInfo[]
}

export function MinerTypes({ userAgents }: MinerTypesProps) {
  return (
    <div className="bg-surface-card rounded-xl p-5 border border-white/5">
      <h2 className="text-lg font-semibold text-white mb-4">Miner Types</h2>
      {userAgents.length === 0 ? (
        <p className="text-white/50 text-sm">No data.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/60 text-left border-b border-white/10">
                <th className="pb-2 pr-4">User Agent</th>
                <th className="pb-2 pr-4">Count</th>
                <th className="pb-2 pr-4">Total Hashrate</th>
                <th className="pb-2">Best Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {userAgents.map((ua) => (
                <tr key={ua.userAgent} className="border-b border-white/5 last:border-0">
                  <td className="py-2 pr-4 text-white font-medium">{ua.userAgent}</td>
                  <td className="py-2 pr-4 text-white/80">{ua.count}</td>
                  <td className="py-2 pr-4 text-accent">{formatHashrate(parseFloat(ua.totalHashRate))}</td>
                  <td className="py-2 text-white/80">{formatDifficulty(parseFloat(ua.bestDifficulty))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
