export function isValidUrl(url: string): boolean {
  return url.startsWith('http')
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
