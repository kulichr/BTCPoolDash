import { useEffect, useState } from 'react'

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
const REFRESH_MS = 60 * 1000

export function useBtcPrice(): number | null {
  const [price, setPrice] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    function fetchPrice() {
      fetch(COINGECKO_URL)
        .then((res) => res.json())
        .then((data: { bitcoin?: { usd?: number } }) => {
          if (!cancelled && data?.bitcoin?.usd != null) setPrice(data.bitcoin.usd)
        })
        .catch(() => { if (!cancelled) setPrice(null) })
    }
    fetchPrice()
    const interval = setInterval(fetchPrice, REFRESH_MS)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  return price
}
