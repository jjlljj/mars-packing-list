const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

const environment = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const db = require('knex')(configuration)

describe('Client Routes', () => {
  beforeEach(done => {
    db.migrate.rollback()
      .then(() => {
        db.migrate.latest()
      .then(() => {
         return db.seed.run()
        .then(() => {
          done()
        })
      })
    })
  })

  it('should return the homepage', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200)
        response.should.be.html
      })
      .catch(error => {
        throw error
      })
  })

  it('should return 404 for a page that does not exist', () => {
    return chai.request(server)
      .get('/nopagehere')
      .then(response => {
        response.should.have.status(404)
      })
      .catch(error => {
        throw error
      })
  })
})

describe('Api Routes', () => {
  beforeEach(done => {
    db.migrate.rollback()
      .then(() => {
        db.migrate.latest()
      .then(() => {
         return db.seed.run()
        .then(() => {
          done()
        })
      })
    })
  })

  describe('GET /api/v1/items', () => {
    it('should return all mars items', () => {
      return chai.request(server)
        .get('/api/v1/items')
        .then(response => {
          response.should.have.status(200)
          response.should.be.json
          response.body.should.be.a('array')
          response.body.length.should.equal(4)

          response.body[0].should.have.property('item_name')
          response.body[0].item_name.should.equal('hat')
          response.body[0].should.have.property('packed')
          response.body[0].packed.should.equal(true)
        })
        .catch(error => {
          throw error
        })
    })
  })

  describe('POST /api/v1/items', () => {
    it('should add a new item', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({ item_name: 'shoes', packed: true })
        .then(response => {
          console.log(response)
          response.should.have.status(201)
          response.should.be.json
          response.body.should.be.a('object')
          response.body.should.have.property('id')
          response.body.id.should.equal(5)
          response.body.should.have.property('item_name')
          response.body.item_name.should.equal('shoes')
          response.body.should.have.property('packed')
          response.body.packed.should.equal(false)

        })
        .catch(error => {
          throw error
        })
    })

    it('should return 422 if missing information from the request body', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({ packed: false })
        .then(response => {
          response.should.have.status(422)
          response.body.error.should.equal('Expected format { item_name: <string>, packed: <boolean> }. You are missing a item_name property')
        })
        .catch(error => {
          throw error 
        })
    })
  })
})
