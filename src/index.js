const fetch = require('isomorphic-fetch')

const BASE_ENDPOINT = 'https://api.airtable.com/v0/'

const createFetch = ({ url, ...params }) =>
  fetch(url, params)
    .then(resp => resp.json())
    .catch(err => {
      console.error(err)
      return err
    })


class Transactions {
  constructor() {
    this.transactions = []
  }

  push(transaction) {
    this.transactions.push(transaction)
  }

  value () {
    return Promise.all(this.transactions.map(fn => fn()))
      .then(data => {
        this.transactions = []
        return data.length === 1 ? data[0] : data
      })
  }
}

class Airtable {
  constructor(params, count = 10, offset = '') {
    const { base, table, view, apiKey } = params
    this.transactions = new Transactions()

    this.airtable = {
      base,
      table,
      view,
      count,
      offset,
      apiKey
    }
  }

  base (ref) {
    this.base = ref
    return this
  }

  table (ref) {
    this.table = ref
    return this
  }

  view (ref) {
    this.view = view
    return this
  }

  enqueue (transaction) {
    this.transactions.push(transaction)
    return this
  }

  value () {
    return this.transactions.value()
  }

  write () {
    return this.transactions.value()
  }

  list (
    count = this.airtable.count,
    offset = this.airtable.offset
  ) {
    const { base, table, apiKey, view } = this.airtable
    const req = (accumulator = null, offset = '') => {
      let url = `${BASE_ENDPOINT}${base}/${table}`
      url += `?maxRecords=${count}&view=${view}&offset=${offset}`
      return createFetch({
        url,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + apiKey
        }
      }).then(data => {
        let { records, offset } = data
        if (!records) {
          return data
        }

        if (accumulator && records.length) {
          // Append the new `records` to the `accumulator` object.
          accumulator.records = accumulator.records.concat(records)
        } else {
          accumulator = data
        }

        if (!offset) {
          return accumulator
        }

        // Remove the key from the `result` object
        // but store the `offset` in an intermediate
        // to pass to therecursive fuction below for
        // requesting the new list.
        offset = data.offset
        delete accumulator.offset

        // Recursively request the next list, starting
        // at the current list's `offset` value.
        return req(accumulator, offset)
      })
    }
    return this.enqueue(() => req(null, offset))
  }

  update (fields, id) {
    const { base, table, apiKey } = this.airtable
    const url = `${BASE_ENDPOINT}${base}/${table}/${id}`
    return this.enqueue(
      () => createFetch({
        url,
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({ fields })
      })
    )
  }

  retrieve (id) {
    const { base, table, apiKey } = this.airtable
    const url = `${BASE_ENDPOINT}${base}/${table}/${id}`
    return this.enqueue(
      () => createFetch({
        url,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + apiKey
        }
      })
    )
  }

  delete (id) {
    const { base, table, apiKey } = this.airtable
    const url = `${BASE_ENDPOINT}${base}/${table}/${id}`
    return this.enqueue(
      () => createFetch({
        url,
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + apiKey
        }
      })
    )
  }

  create (fields) {
    const { base, table, apiKey } = this.airtable
    const url = `${BASE_ENDPOINT}${base}/${table}`
    return this.enqueue(
      () => createFetch({
        url,
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({ fields })
      })
    )
  }

  get (...args) {
    return this.retrieve(...args)
  }

  remove (...args) {
    return this.delete(...args)
  }
}

module.exports = Airtable

