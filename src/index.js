const fetch = require('isomorphic-fetch')
const { serialize, safeEncodeURIComponent } = require('./serialize')

const BASE_ENDPOINT = 'https://api.airtable.com/v0/'

const createFetch = ({ url, ...params }) =>
  fetch(url, params)
    .then(resp => resp.json())

class Airtable {
  constructor (config = {}) {
    const noop = () => {}
    this.log = config.log || noop
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
    params = {}
  ) {
    const { base, table, view } = this.config
    const merged = {
      maxRecords: 20,
      ...params
    }

    if (view) {
      merged.view = view
    }

    let url = `${BASE_ENDPOINT}${base}/${safeEncodeURIComponent(table)}`

    if (Object.keys(merged).length) {
      url += `?${serialize(merged)}`
    }
    return url
  }

  list (params = {}) {
    const { apiKey } = this.config

    const req = async (accumulator = null, offset = '') => {
      console.log(offset)
      const url = this.stringify({ ...params, offset })

      this.log(url)

      let data = await createFetch({
        url,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      })

      this.log(data)

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

      offset = data.offset
      delete accumulator.offset
      return req(accumulator, offset)
    }

    return req(null, params.offset || '')
  }

  update (id, params = {}) {
    const { base, table, apiKey } = this.config
    const url = `${BASE_ENDPOINT}${base}/${safeEncodeURIComponent(table)}/${id}`
    this.log(url)
    return createFetch({
      url,
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({ fields: params.fields || params })
    })
  }

  retrieve (id) {
    const { base, table, apiKey } = this.config
    const url = `${BASE_ENDPOINT}${base}/${safeEncodeURIComponent(table)}/${id}`
    this.log(url)
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
    const url = `${BASE_ENDPOINT}${base}/${safeEncodeURIComponent(table)}/${id}`
    this.log(url)
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
    const url = `${BASE_ENDPOINT}${base}/${safeEncodeURIComponent(table)}`
    this.log(url)
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
