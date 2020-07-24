const express  = require('express')
const mongoose = require('./config/database')
const app      = express()
const router   = require('./config/routes')
const port     = 3005


app.use(express.json())

app.use('/', router)

app.listen(port, () => {
  console.log('listening to port', port)
})
