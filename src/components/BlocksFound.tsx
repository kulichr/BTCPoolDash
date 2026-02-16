import type { BlockFound } from '../types'
import { truncateAddress } from '../utils/format'

interface BlocksFoundProps {
  blocks: BlockFound[]
}

export function BlocksFound({ blocks }: BlocksFoundProps) {
  return (
    <div className="bg-surface-card rounded-xl p-5 border border-white/5">
      <h2 className="text-lg font-semibold text-white mb-4">Blocks Found</h2>
      {blocks.length === 0 ? (
        <p className="text-white/50 text-sm">No blocks found yet.</p>
      ) : (
        <ul className="space-y-2">
          {blocks.map((b) => (
            <li key={b.height} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
              <span className="text-accent font-medium">#{b.height}</span>
              <span className="text-white/70">{truncateAddress(b.minerAddress)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
