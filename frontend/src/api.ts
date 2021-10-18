export interface CreateShortUrlRequestData {
  url: string
}

export interface CreateShortUrlResponseData {
  error: boolean
  hash: string
  message: string
}

export const SHORT_URLS_API_PATH = '/api/shorturls'
