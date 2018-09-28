const fetch = require('isomorphic-fetch')
const serialize = require('./serialize')

const safeEncodeURIComponent = string => {
  let decoded = decodeURIComponent(string)
  while (string !== decoded) {
    string = decoded
    decoded = decodeURIComponent(string)
  }
  return encodeURIComponent(decoded)
}

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
    params = {},
    offset = ''
  ) {
    const { base, table, view } = this.config
    const merged = {
      maxRecords: 20,
      ...params
    }

    if (typeof offset !== 'undefined') {
      merged.offset = offset
    }

    if (view) {
      merged.view = safeEncodeURIComponent(view)
    }

    let url = `${BASE_ENDPOINT}${base}/${safeEncodeURIComponent(table)}`

    if (Object.keys(merged).length) {
      url += `?${serialize(merged)}`
    }
    return url
  }

  list (params = {}, offset) {
    const { apiKey } = this.config

    const req = async (accumulator = null, offset = '') => {
      const url = this.stringify(params, offset)
      let data = await createFetch({
        url,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + apiKey
        }
      })

      if (!data || !data.records) {
        return data
      }

      let { records } = data

      if (accumulator) {
        if (records.length) {
          accumulator.records = accumulator.records.concat(records)
        }
      } else {
        accumulator = data
      }

      if (!data.offset) {
        return accumulator
      }

      delete accumulator.offset
      return req(accumulator, data.offset)
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
