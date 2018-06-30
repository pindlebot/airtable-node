require('dotenv').config()
const Airtable = require('../src')

const apiKey = process.env.AIRTABLE_API_KEY
const base = process.env.AIRTABLE_BASE
const table = process.env.AIRTABLE_TABLE
const view = process.env.AIRTABLE_VIEW

const log = promise => promise.then(data => {
  console.log(data.records.length)

})

const airtable = new Airtable({apiKey, base, table, view})
const promise = airtable.list({
  maxRecords: 110
}).value()
//const promise = airtable.get('recSE4QPq9mTf7zKR').value()
log(promise)
