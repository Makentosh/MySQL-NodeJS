const express = require('express')
const path = require('path')
const todoRoutes = require('./routes/todo')
const sequelize = require('./utils/databaase')
const app = express()
const PORT = process.env.PORT || 5000


app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use('/api/todo', todoRoutes)


app.use((req, res, next) => {
  res.sendFile('/index.html')
})

async function start() {
  try {
    await sequelize.sync()
    app.listen(PORT)
  } catch (e) {
    console.log(e)
  }
}

start()


