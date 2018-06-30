require('dotenv').config()
const Airtable = require('../src')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const assert = chai.assert
const expect = chai.expect
const should = chai.should()
chai.use(chaiAsPromised)

const apiKey = process.env.AIRTABLE_API_KEY
const base = process.env.AIRTABLE_BASE
const table = process.env.AIRTABLE_TABLE
const view = process.env.AIRTABLE_VIEW

console.log({ apiKey, base, table, view })

describe('Airtable.list', function () {
  it('Airtable.list', function (done) {
    const airtable = new Airtable({apiKey, base, table, view})
    airtable.list().should.eventually.be.fulfilled.notify(done)
  })
})

describe('Airtable.create', function () {
  it('Airtable.create', function (done) {
    const airtable = new Airtable({apiKey, base, table, view})
    airtable.create({Name: 'Bob'}).should.eventually.be.fulfilled.notify(done)
  })
})

describe('Test errors', function () {
  it('Airtable', function () {
    assert.throws(function () {
      Airtable({})
    }, Error)
  })
})

describe('Test errors', function () {
  it('Airtable', function () {
    assert.throws(function () {
      Airtable({apiKey: 'test'})
    }, Error)
  })
})

describe('Test errors', function () {
  it('Airtable', function () {
    assert.throws(function () {
      Airtable({apiKey: 'test', base: 'base'})
    }, Error)
  })
})
