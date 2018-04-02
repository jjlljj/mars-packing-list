const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const db = require('knex')(configuration)

const httpsRedirect = (req, res, next) => {
  if(req.headers['x-forwarded-proto'] !== 'https' ) {
    res.redirect("https://" + req.headers.host + req.url);
  }
  next()
}

app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json())
if (environment === 'production') { app.use(httpsRedirect) }
app.use(express.static('public'))

app.get('/', (req, res) => {
})

app.get('/api/v1/items', (req, res) => {
  // get all items from mars_items table 
})

app.post('/api/v1/items', (req, res) => {
  // post items to mars_items table -> require { item_name: <string>, packed: <boolean> }
  // respond with item: { item_name: <string>, packed: <boolean>, id: <number> } for render
})

app.patch('/api/v1/items/:id', (req, res) => {
  // update item at :id in mars_items table  --> require id: <number> from req.params, packed: <boolean> from req.body
})

app.delete('/api/v1/items/:id', (req, res) => {
  // delete item at :id in  mars_items table --> require id: <number> from req.params 
})

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.listen(app.get('port'), () => {
  console.log(`Mars Packer running on port ${app.get('port')}`)
})
