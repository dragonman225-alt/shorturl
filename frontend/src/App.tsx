import { useState } from 'react'
import { createShortUrl } from './apiClient'

import styles from './App.module.scss'

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
    <div className={styles.app}>
      <div className={styles.widget}>
        {status === AppStatus.EnteringUrl && (
          <>
            <label>Enter a long URL</label>
            <input
              value={longUrl}
              type="url"
              placeholder="http://www.example.com"
              onChange={e => setLongUrl(e.target.value)}
              required
            />
            <button
              onClick={() => {
                if (!longUrl) return
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
            <input
              value={shortUrl}
              onClick={e => (e.target as HTMLInputElement).select()}
              readOnly
            />
            <button onClick={() => setStatus(AppStatus.EnteringUrl)}>
              Shorten another
            </button>
          </>
        )}
        {status === AppStatus.Pending && <div>Shortening</div>}
        {status === AppStatus.ShowingError && (
          <>
            <div className={styles.error}>{errorMessage}</div>
            <button onClick={() => setStatus(AppStatus.EnteringUrl)}>
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default App
