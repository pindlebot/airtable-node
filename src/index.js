const fetch = require('isomorphic-fetch')
const BASE_ENDPOINT = 'https://api.airtable.com/v0/'

const createFetch = ({ url, ...params }) =>
  fetch(url, params)
    .then(resp => resp.json())

class Airtable {
  constructor (config = {}) {
    this.config = config
  }

  base (ref) {
    this.config.base = ref
    return this
  }

  table (ref) {
    this.config.table = ref
    return this
  }

  view (ref) {
    this.config.view = ref
    return this
  }

  stringify (
    params,
    offset = ''
  ) {
    const { base, table, view } = this.config
    const merged = {
      maxRecords: 20,
      view,
      offset,
      ...params
    }
    let url = `${BASE_ENDPOINT}${base}/${table}?`
    url += Object.keys(merged).reduce((acc, key) => {
      acc.push(`${key}=${merged[key]}`)
      return acc
    }, []).join('&')
    return url
  }

  list (params = {}, offset) {
    const { apiKey } = this.config

    const req = (result = null, offset = '') => {
      const url = this.stringify(params, offset)
      return createFetch({
        url,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + apiKey
        }
      }).then(resp => {
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

        // Remove the key from the `result` object but store the `offset` in an intermediate variable to pass to the
        // recursive fuction below for requesting the new list.
        offset = resp.offset
        delete result.offset

        // Recursively request the next list, starting at the current list's `offset` value.
        return req(result, offset)
      })
    }
    return req(null, offset)
  }

  update (id, params) {
    const { base, table, apiKey } = this.config
    const url = `${BASE_ENDPOINT}${base}/${table}/${id}`
    return createFetch({
      url,
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify(params)
    })
  }

  retrieve (id) {
    const { base, table, apiKey } = this.config
    const url = `${BASE_ENDPOINT}${base}/${table}/${id}`
    return createFetch({
      url,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + apiKey
      }
    })
  }

  delete (id) {
    const { base, table, apiKey } = this.config
    const url = `${BASE_ENDPOINT}${base}/${table}/${id}`
    return createFetch({
      url,
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + apiKey
      }
    })
  }

  create (params) {
    const { base, table, apiKey } = this.config
    const url = `${BASE_ENDPOINT}${base}/${table}`
    return createFetch({
      url,
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify(params)
    })
  }

  set (...args) {
    return this.update(...args)
  }

  get (...args) {
    return this.retrieve(...args)
  }

  remove (...args) {
    return this.delete(...args)
  }
}

module.exports = Airtable

