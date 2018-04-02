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
