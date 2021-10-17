interface CreateShortUrlRequestData {
  url: string
}

interface CreateShortUrlResponseData {
  shortUrl: string
}

export async function createShortUrl(
  url: string,
  onSuccess: (shortUrl: string) => void,
  onError: (message: string) => void
) {
  const headers = new Headers()
  headers.append('content-type', 'application/json')

  return fetch(`api/create`, {
    method: 'POST',
    body: JSON.stringify({ url } as CreateShortUrlRequestData),
    headers,
  })
    .then(checkStatus)
    .then(response => parseJson<CreateShortUrlResponseData>(response))
    .then(data => {
      onSuccess(data.shortUrl)
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
