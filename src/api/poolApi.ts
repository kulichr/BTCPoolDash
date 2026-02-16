const API_BASE = import.meta.env.DEV ? '' : (import.meta.env.VITE_POOL_API_URL || '')

async function fetchApi<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API ${path}: ${res.status}`)
  return res.json()
}

export async function fetchMiners(): Promise<import('../types').MinersApiResponse> {
  return fetchApi('/api/miners')
}

export async function fetchPool(): Promise<import('../types').PoolInfo> {
  return fetchApi('/api/pool')
}

export async function fetchNetwork(): Promise<import('../types').NetworkInfo> {
  return fetchApi('/api/network')
}

export async function fetchInfo(): Promise<import('../types').SiteInfo> {
  return fetchApi('/api/info')
}

export async function fetchInfoChart(): Promise<import('../types').ChartDataPoint[]> {
  return fetchApi('/api/info/chart')
}

export async function fetchClientInfo(address: string): Promise<import('../types').ClientInfo | null> {
  try {
    return await fetchApi(`/api/client/${encodeURIComponent(address)}`)
  } catch {
    return null
  }
}

export function normalizeMinersResponse(
  data: import('../types').MinersApiResponse
): import('../types').MinerEntry[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && 'miners' in data && Array.isArray(data.miners)) {
    return data.miners
  }
  return []
}
