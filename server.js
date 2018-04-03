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
  db('mars_items').select()
    .then(items => {
      res.status(200).json(items)
    })
    .catch(error => {
      res.status(500).json({ error })
    })
})

app.post('/api/v1/items', (req, res) => {
  const { item_name, packed } = req.body

  for (let reqParam of ['item_name', 'packed']) {
    if(!(reqParam in req.body)){
      return res.status(422).json({error: `Expected format { item_name: <string>, packed: <boolean> }. You are missing a ${reqParam} property`})
    }
  }

  db('mars_items').insert({
    item_name: item_name,
    packed: true
    }, 'id')
    .then(added => {
      res.status(201).json({ item_name, packed, id: added[0] })
    })
    .catch(error => {
      res.status(500).json()
    })
})

app.patch('/api/v1/items/:id', (req, res) => {
  const { id }  = req.params
  const { packed, item_name } = req.body

  db('mars_items')
    .where('id', id)
    .update({
      item_name,
      packed
    })
    .then(updated => {
      if (!updated) {
        return res.status(422).json({ error: 'unable to update item' });
      }
      res.status(200).json('Record successfully updated');
    })
    .catch(error => {
      res.status(500).json({ error });
    });
})

app.delete('/api/v1/items/:id', (req, res) => {
  const { id } = req.params

  db('mars_items')
    .where('id', id)
    .del()
    .then(item => {
      if(!item) {
        return res.status(422).json({ error: 'unable to delete item' });
      }
      res.status(200).json(item)
    })
    .catch(error => {
      res.status(500).json({ error })
    })
})

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.listen(app.get('port'), () => {
  console.log(`Mars Packer running on port ${app.get('port')}`)
})

module.exports = app
