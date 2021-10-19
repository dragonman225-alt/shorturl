import 'reflect-metadata'
import path from 'path'
import express from 'express'
import { createConnection } from 'typeorm'
import { FlagTypes, parseArgv, parseFlagVal } from '@dnpr/cli'

import {
  CreateShortUrlRequestData,
  CreateShortUrlResponseData,
  REDIRECT_PATH,
  SHORT_URLS_API_PATH,
} from './api'
import { findUrl, insertUrl } from './service'
import { isValidUrl } from './utils'

async function startServer() {
  /** Start database. */
  await createConnection()

  /** Start express. */
  const port = process.env.PORT || 3001
  const app = express()
  app.listen(port)

  app.use(express.json())

  /** Create URL. */
  app.post<undefined, CreateShortUrlResponseData, CreateShortUrlRequestData>(
    SHORT_URLS_API_PATH,
    (req, res) => {
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
    }
  )

  /** Find URL and redirect. */
  app.get<{ shortHash: string }>(`${REDIRECT_PATH}/:shortHash`, (req, res) => {
    const shortHash = req.params.shortHash
    if (!shortHash) res.redirect('/')
    else {
      findUrl(shortHash)
        .then(originalUrl => {
          /** Redirection uses 301, the same as https://tinyurl.com/ */
          if (!originalUrl) res.redirect('/')
          else res.redirect(301, originalUrl)
        })
        .catch(error => {
          console.error(error)
          res.redirect('/')
        })
    }
  })

  /** Configure public directory. */
  const { flags } = parseArgv(process.argv)
  const publicPath = parseFlagVal(
    flags,
    '--public',
    FlagTypes.string,
    ''
  ) as string
  const absolutePublicPath = path.join(process.cwd(), publicPath)
  if (publicPath) app.use(express.static(absolutePublicPath))

  /** Print server information. */
  console.log(`Server running at port ${port}`)
  if (!publicPath) console.log('API server only')
  else console.log(`With public directory "${absolutePublicPath}"`)
}

startServer().catch(error => console.error(error))
