import './App.module.scss'

function App() {
  return (
    <div className="App">
      <label>Enter a long URL</label>
      <input type="url" />
      <label>Short URL</label>
      <input readOnly />
    </div>
  )
}

export default App
