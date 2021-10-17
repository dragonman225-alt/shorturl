import './App.module.scss'
import { useState } from 'react'
import { createShortUrl } from './apiClient'

enum AppStatus {
  EnteringUrl,
  Pending,
  ShowingShortUrl,
  ShowingError,
}

function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.EnteringUrl)
  const [shortUrl, setShortUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [longUrl, setLongUrl] = useState('')

  return (
    <div className="App">
      {status === AppStatus.EnteringUrl && (
        <>
          <label>Enter a long URL</label>
          <input
            value={longUrl}
            type="url"
            onChange={e => setLongUrl(e.target.value)}
          />
          <button
            onClick={() => {
              createShortUrl(
                longUrl,
                shortUrl => {
                  setShortUrl(shortUrl)
                  setStatus(AppStatus.ShowingShortUrl)
                },
                errorMessage => {
                  setErrorMessage(errorMessage)
                  setStatus(AppStatus.ShowingError)
                }
              )
              setStatus(AppStatus.Pending)
            }}>
            Shorten
          </button>
        </>
      )}
      {status === AppStatus.ShowingShortUrl && (
        <>
          <label>Short URL</label>
          <input value={shortUrl} readOnly />
          <button onClick={() => setStatus(AppStatus.EnteringUrl)}>
            Shorten another
          </button>
        </>
      )}
      {status === AppStatus.Pending && <div>Shortening</div>}
      {status === AppStatus.ShowingError && (
        <>
          <div>{errorMessage}</div>
          <button onClick={() => setStatus(AppStatus.EnteringUrl)}>
            Try again
          </button>
        </>
      )}
    </div>
  )
}

export default App
