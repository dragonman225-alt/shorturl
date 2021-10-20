import { URL } from 'url'

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

export function toBase58(count: number): string {
  /**
   * Use Base58, which doesn't include confusing chars 0OIl.
   * @see https://en.wikipedia.org/wiki/Base62
   */
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  const divisor = chars.length
  let dividend = count
  const results: string[] = []
  do {
    const mod = dividend % divisor
    results.push(chars[mod])
    dividend = dividend / divisor
  } while (dividend > 0)
  return results.join('')
}

export function isBlacklistedUrl(
  url: string,
  blacklistHosts: string[]
): boolean {
  try {
    const urlObj = new URL(url)
    for (let i = 0; i < blacklistHosts.length; i++) {
      const blacklistHost = blacklistHosts[i]
      if (urlObj.host === blacklistHost) return true
    }
    return false
  } catch (error) {
    return true
  }
}
