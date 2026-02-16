import type { TrackedWallet } from './types'

/**
 * List of tracked wallets for the Leaderboard (when pool API does not expose /api/miners).
 * Edit only here – the web UI has no add/remove buttons.
 */
export const TRACKED_WALLETS: TrackedWallet[] = [
  { address: 'bc1qcuwugdvdlklfgxayvx6efmyd354jhy8527ks84', name: 'Roman' },
  { address: 'bc1qcvt2n9ygwswfsfdf58s24rux70q5xqudf6w69q', name: 'Thomas' },
]

/** Current Bitcoin block reward in BTC (subsidy per block). */
export const BLOCK_REWARD_BTC = 3.125

/** GitHub repository URL for the footer link. Set to your repo (e.g. https://github.com/user/repo). */
export const GITHUB_URL = ''
