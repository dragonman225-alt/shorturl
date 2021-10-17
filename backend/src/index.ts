import express from 'express'

const app = express()
app.listen(3001)

app.post('/api/create', (req, res) => {
  console.log(req.body)
  res.json({ shortUrl: '12345' })
})
