import {
  CreateShortUrlRequestData,
  CreateShortUrlResponseData,
  SHORT_URLS_API_PATH,
} from './api'
import { getUrlPrefix } from './utils'

export async function createShortUrl(
  url: string,
  onSuccess: (shortUrl: string) => void,
  onError: (message: string) => void
) {
  const headers = new Headers()
  headers.append('content-type', 'application/json')

  return fetch(SHORT_URLS_API_PATH, {
    method: 'POST',
    body: JSON.stringify({ url } as CreateShortUrlRequestData),
    headers,
  })
    .then(checkStatus)
    .then(response => parseJson<CreateShortUrlResponseData>(response))
    .then(data => {
      if (data.error) onError(data.message)
      else onSuccess(`${getUrlPrefix()}${data.hash}`)
    })
    .catch((error: Error) => {
      onError(error.message)
    })
}

function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) return response
  const error = new Error(
    `HTTP Error: ${response.status} ${response.statusText}`
  )
  throw error
}

function parseJson<T>(response: Response): Promise<T> {
  return response.json()
}
