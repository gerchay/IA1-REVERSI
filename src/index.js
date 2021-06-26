const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({ origin: true }))
app.use(morgan('dev'))
app.use(require('./routes/index'))

app.listen(port, () => console.log(`Server on port ${port}`))