// Public Pool API response types (see https://github.com/benjamin-wilson/public-pool)

export interface PoolInfo {
  totalHashRate: number
  blockHeight: number
  totalMiners: number
  blocksFound: BlockFound[]
  fee: number
}

export interface BlockFound {
  height: number
  minerAddress: string
  worker?: string
  sessionId?: string
}

export interface NetworkInfo {
  blocks: number
  difficulty: number
  networkhashps: number
  chain: string
  warnings?: string
}

export interface SiteInfo {
  blockData: BlockFound[]
  userAgents: UserAgentInfo[]
  highScores: HighScoreEntry[]
  uptime?: string | number
  startedAt?: string | number
  serverStartTime?: string | number
}

export interface UserAgentInfo {
  userAgent: string
  count: string
  bestDifficulty: string
  totalHashRate: string
}

export interface HighScoreEntry {
  address?: string
  updatedAt?: string
  bestDifficulty: number
  bestDifficultyUserAgent?: string
}

export interface ChartDataPoint {
  label: string
  data: number
}

export interface ClientInfo {
  bestDifficulty: number
  workersCount: number
  workers: WorkerInfo[]
}

export interface WorkerInfo {
  sessionId: string
  name: string
  bestDifficulty: string
  hashRate: number
  startTime: string
  lastSeen: string
}

export interface TrackedWallet {
  address: string
  name: string
}

export interface MinerEntry {
  address?: string
  addr?: string
  wallet?: string
  hashrate?: number
  hashRate?: number
  hash_rate?: number
  workers?: number
  workerCount?: number
  worker_count?: number
  bestDifficulty?: number
  best_difficulty?: number
  name?: string
  shares?: number
  totalShares?: number
  startTime?: string
  connectedSince?: string
  [key: string]: unknown
}

export type MinersApiResponse = MinerEntry[] | { miners: MinerEntry[] }
