const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const db = require('knex')(configuration)

const httpsRedirect = (request, response, next) => {
  if(request.headers['x-forwarded-proto'] !== 'https' ) {
    response.redirect("https://" + request.headers.host + request.url);
  }
  next()
}

app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json())
if (environment === 'production') { app.use(httpsRedirect) }
app.use(express.static('public'))

app.get('/', (req, res) => {
})


app.listen(app.get('port'), () => {
  console.log(`Mars Packer running on port ${app.get('port')}`)
})
