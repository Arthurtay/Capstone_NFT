const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3001;

const db = require('./queries')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

app.get("/api", (req, res) => {
    res.json({ message: "Hello from Express!" });
});

app.get('/users', db.getUsers)
app.post('/addUser', db.addUser)
app.post('/updateUser',db.updateUser)

  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })