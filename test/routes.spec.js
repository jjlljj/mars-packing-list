const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

const environment = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const db = require('knex')(configuration)

describe('Client Routes', () => {
  beforeEach( done => {
    db.migrate.rollback()
      .then( () => {
        db.migrate.latest()
      .then( () => {
         return db.seed.run()
        .then( () => {
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
      .catch( error => {
        throw error
      })
  })

  it('should return 404 for a page that does not exist', () => {
    return chai.request(server)
      .get('/nopagehere')
      .then( response => {
        response.should.have.status(404)
      })
      .catch( error => {
        throw error
      })
  })
})

describe('Api Routes', () => {
  beforeEach( done => {
    db.migrate.rollback()
      .then( () => {
        db.migrate.latest()
      .then( () => {
         return db.seed.run()
        .then( () => {
          done()
        })
      })
    })
  })

  describe('GET /api/v1/items', () => {
    it('should return all mars items', () => {
      return chai.request(server)
        .get('api/v1/items')
        .then( response => {
          response.should.have.status(200)
          response.should.be.json
          response.body.should.be.a('array')
          response.body.length.should.equal(4)

          response.body[0].should.have.property('item_name')
          response.body[0].item_name.should.equal('')
          response.body[0].should.have.property('packed')
          response.body[0].packed.should.equal(true)
        })
        .catch( error => {
          throw error
        })
    })
  })

})
