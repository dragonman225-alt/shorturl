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
import { Controller } from './controller'

async function startServer() {
  /** Start database. */
  await createConnection()

  /** Start express. */
  const port = process.env.PORT || 3001
  const app = express()
  app.listen(port)
  app.use(express.json())

  /** Configure public directory. */
  const { flags } = parseArgv(process.argv)
  /** Path to static assets. */
  const publicPath = parseFlagVal(
    flags,
    '--public',
    FlagTypes.string,
    ''
  ) as string
  const absolutePublicPath = path.join(process.cwd(), publicPath)
  if (publicPath) app.use(express.static(absolutePublicPath))

  /**
   * Reject shortening for hosts, can be used to prevent recursive
   * redirection to the service itself.
   * Note: host = hostname + port
   */
  const blacklistHostsSpaceSeparated = parseFlagVal(
    flags,
    '--blacklist-hosts',
    FlagTypes.string,
    ''
  ) as string
  const blacklistHosts = blacklistHostsSpaceSeparated
    .trim()
    .split(' ')
    .filter(str => !!str)

  const controller = new Controller({ blacklistHosts })

  /** Create URL. */
  app.post<undefined, CreateShortUrlResponseData, CreateShortUrlRequestData>(
    SHORT_URLS_API_PATH,
    controller.createUrl
  )

  /** Find URL and redirect. */
  app.get<{ shortHash: string }>(
    `${REDIRECT_PATH}/:shortHash`,
    controller.findUrlAndRedirect
  )

  /** Print server information. */
  console.log(`Server running at port ${port}`)
  if (!publicPath) console.log('API server only')
  else console.log(`With public directory "${absolutePublicPath}"`)
  if (blacklistHosts) console.log('Blacklisted host:', blacklistHosts)
}

startServer().catch(error => console.error(error))
