import { TRACKED_WALLETS } from '../config'

export function useTrackedWallets() {
  return { wallets: TRACKED_WALLETS }
}
