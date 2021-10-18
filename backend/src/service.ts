import { getRepository } from 'typeorm'

import { Url } from './entities/url'
import { toBase58 } from './utils'

export async function insertUrl(validUrl: string): Promise<string> {
  const repository = getRepository(Url)
  const existingUrl = await repository.findOne({ originalUrl: validUrl })
  if (existingUrl) {
    return existingUrl.shortHash
  }

  const urlCount = await repository.count()
  const shortHash = toBase58(urlCount)
  const newUrl = new Url(shortHash, validUrl)
  await repository.save(newUrl)
  return shortHash
}

export async function findUrl(shortHash: string): Promise<string | undefined> {
  const repository = getRepository(Url)
  const url = await repository.findOne({ shortHash })
  if (url) return url.originalUrl
  else return undefined
}
