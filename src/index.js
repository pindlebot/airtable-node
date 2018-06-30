const fetch = require('isomorphic-fetch')

const BASE_ENDPOINT = 'https://api.airtable.com/v0/'

const createFetch = (url, params) =>
  fetch(url, params).then(resp => resp.json())

class Airtable {
  constructor(params, count = 10, offset = '') {
    const required = ['apiKey', 'base', 'table']
    required.forEach(req => {
      if (!params[req]) {
        throw new Error(req + ' is required.')
      }
    })
    const { base, table, view, apiKey } = params
    this.airtable = {
      base,
      table,
      view,
      count,
      offset,
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    }
  }

  list (
    view = this.airtable.view,
    count = this.airtable.count,
    offset = this.airtable.offset
  ) {
    const { base, table, headers } = this.airtable
    const params = {
      method: 'GET',
      headers
    }
    const req = (result = null, offset = '') => {
      const url = `${BASE_ENDPOINT}${base}/${table}?maxRecords=${count}&offset=${offset}&view=${view}`
      return createFetch(url, params)
        .then(resp => {
          if (!resp || !resp.records) {
            return resp
          }

          if (result) {
            // Append the new `records` to the `result` object.
            if (resp.records.length) {
              result.records = result.records.concat(resp.records)
            }
          } else {
            result = resp
          }

          if (!resp.offset) {
            return result
          }

          // Remove the key from the `result` object but store the `offset` in an intermediate constiable to pass to the
          // recursive fuction below for requesting the new list.
          offset = resp.offset
          delete result.offset

          // Recursively request the next list, starting at the current list's `offset` value.
          return req(result, offset)
        })
    }
    return req(null, offset)
  }

  update (fields, id) {
    const {base, table, headers} = this.airtable
    headers[`Content-type`] = 'application/json'
    const params = {
      method: 'PATCH',
      headers,
      body: JSON.stringify({fields})
    }
    const url = `${BASE_ENDPOINT}${base}/${table}/${id}`
    return createFetch(url, params)
  }

  retrieve (id) {
    const {base, table, headers} = this.airtable
    const params = {
      method: 'GET',
      headers
    }
    const url = `${BASE_ENDPOINT}${base}/${table}/${id}`
    return createFetch(url, params)
  }

  delete (id) {
    const {base, table, headers} = this.airtable
    const params = {
      method: 'DELETE',
      headers
    }
    const url = `${BASE_ENDPOINT}${base}/${table}/${id}`
    return createFetch(url, params)
  }

  create (fields) {
    const { base, table, headers } = this.airtable
    headers[`Content-type`] = 'application/json'
    const params = {
      method: 'POST',
      headers,
      body: JSON.stringify({fields})
    }
    const url = `${BASE_ENDPOINT}${base}/${table}`
    return createFetch(url, params)
  }

  get (...args) {
    return this.retrieve(...args)
  }

  remove (...args) {
    return this.delete(...args)
  }
}

module.exports = Airtable

