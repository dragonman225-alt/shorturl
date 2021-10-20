import { RequestHandler } from 'express'

import { CreateShortUrlRequestData, CreateShortUrlResponseData } from './api'
import { findUrl, insertUrl } from './service'
import { isBlacklistedUrl, isReachableUrl, isValidUrl } from './utils'

interface ControllerOptions {
  blacklistHosts: string[]
}

export class Controller {
  private blacklistHosts: string[]

  constructor(options: ControllerOptions = { blacklistHosts: [] }) {
    this.blacklistHosts = Array.isArray(options.blacklistHosts)
      ? options.blacklistHosts
      : []
  }

  createUrl: RequestHandler<
    undefined,
    CreateShortUrlResponseData,
    CreateShortUrlRequestData
  > = async (req, res) => {
    const longUrl = req.body.url
    if (!isValidUrl(longUrl)) {
      res.json({ error: true, hash: '', message: 'Invalid URL' })
      return
    }
    if (isBlacklistedUrl(longUrl, this.blacklistHosts)) {
      res.json({
        error: true,
        hash: '',
        message: "It's not allowed to shorten this URL",
      })
      return
    }
    if (!(await isReachableUrl(longUrl))) {
      res.json({ error: true, hash: '', message: 'Unreachable URL' })
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

  findUrlAndRedirect: RequestHandler<{ shortHash: string }> = (req, res) => {
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
  }
}
