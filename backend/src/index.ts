import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'

import {
  CreateShortUrlRequestData,
  CreateShortUrlResponseData,
  SHORT_URLS_API_PATH,
} from './api'
import { insertUrl } from './service'
import { isValidUrl } from './utils'

async function startServer() {
  /** Start database. */
  await createConnection()

  /** Start express. */
  const app = express()
  app.listen(3001)

  app.use(express.json())
  app.post<
    typeof SHORT_URLS_API_PATH,
    undefined,
    CreateShortUrlResponseData,
    CreateShortUrlRequestData
  >(SHORT_URLS_API_PATH, (req, res) => {
    const longUrl = req.body.url
    if (!isValidUrl(longUrl)) {
      res.json({ error: true, hash: '', message: 'Invalid URL' })
      return
    }
    insertUrl(longUrl)
      .then(shortHash =>
        res.json({ error: false, hash: shortHash, message: '' })
      )
      .catch(error => {
        console.error(error)
        res.json({ error: true, hash: '', message: 'Failed to insert URL' })
      })
  })
}

startServer().catch(error => console.error(error))
