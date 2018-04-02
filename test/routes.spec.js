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
      .then(response => {
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

})
