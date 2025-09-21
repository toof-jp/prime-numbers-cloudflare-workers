import { Hono } from 'hono'

const app = new Hono()
const primeCache: number[] = [2]

const isPrime = (candidate: number) => {
  if (candidate < 2) return false
  if (candidate === 2) return true
  if (candidate % 2 === 0) return false

  const limit = Math.floor(Math.sqrt(candidate))
  for (let divisor = 3; divisor <= limit; divisor += 2) {
    if (candidate % divisor === 0) {
      return false
    }
  }
  return true
}

const ensurePrimeCount = (requiredCount: number) => {
  let candidate = primeCache[primeCache.length - 1]
  while (primeCache.length < requiredCount) {
    candidate += 1
    if (isPrime(candidate)) {
      primeCache.push(candidate)
    }
  }
}

app.get('/', (c) => {
  const rawOffset = c.req.query('offset') ?? '0'
  const offset = Number(rawOffset)

  if (!Number.isInteger(offset) || offset < 0 || offset % 10 !== 0) {
    return c.json({ error: 'offset must be a non-negative multiple of 10' }, 400)
  }

  const endIndex = offset + 10
  ensurePrimeCount(endIndex)

  return c.json({ primes: primeCache.slice(offset, endIndex) })
})

export default app
