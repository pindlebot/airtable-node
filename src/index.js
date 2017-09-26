'use strict';
const fetch = require('isomorphic-fetch');

function createFetch(params, url) {
  return fetch(url, params).then(resp => resp.json())
    .then(resp => {
      return resp;
    });
}

function Airtable(params, count = 10, offset = '') {
  var {apiKey, base, table, view = null} = params;

  var required = ['apiKey', 'base', 'table'];
  required.forEach(req => {
    if (!params[req]) {
      throw new Error(req + ' is required.');
    }
  });

  this.airtable = {};
  this.airtable.base = base;
  this.airtable.table = table;
  this.airtable.view = view;
  this.airtable.count = count; // Regardless of the `maxRecords` passed to the Airtable API, it returns only 100.
  this.airtable.offset = offset; // This refers to the `offset` string that appears in the response of a list of records.
  this.airtable.headers = {
    Authorization: `Bearer ${apiKey}`
  };
  this.createFetch = createFetch;
}

Airtable.prototype.list = function (view = this.airtable.view, count = this.airtable.count, offset = this.airtable.offset) {
  var {base, table, headers} = this.airtable;
  var params = {
    method: 'GET',
    headers
  };
  var req = (result = null, offset = '') => {
    var url = `https://api.airtable.com/v0/${base}/${table}?maxRecords=${count}&offset=${offset}&view=${view}`;
    return this.createFetch(params, url)
      .then(resp => {
        if (!resp || !resp.records) {
          return resp;
        }

        if (result) {
          // Append the new `records` to the `result` object.
          if (resp.records.length) {
            result.records = result.records.concat(resp.records);
          }
        } else {
          result = resp;
        }

        if (!resp.offset) {
          return result;
        }

        // Remove the key from the `result` object but store the `offset` in an intermediate variable to pass to the
        // recursive fuction below for requesting the new list.
        offset = resp.offset;
        delete result.offset;

        // Recursively request the next list, starting at the current list's `offset` value.
        return req(result, offset);
      });
  };
  return req(null, offset);
};

Airtable.prototype.update = function (fields, id) {
  var {base, table, headers} = this.airtable;
  headers[`Content-type`] = 'application/json';
  var params = {
    method: 'PATCH',
    headers,
    body: JSON.stringify({fields})
  };
  var url = `https://api.airtable.com/v0/${base}/${table}/${id}`;
  return this.createFetch(params, url);
};

Airtable.prototype.retrieve = function (id) {
  var {base, table, headers} = this.airtable;
  var params = {
    method: 'GET',
    headers
  };
  var url = `https://api.airtable.com/v0/${base}/${table}/${id}`;
  return this.createFetch(params, url);
};

Airtable.prototype.delete = function (id) {
  var {base, table, headers} = this.airtable;
  var params = {
    method: 'DELETE',
    headers
  };
  var url = `https://api.airtable.com/v0/${base}/${table}/${id}`;
  return this.createFetch(params, url);
};

Airtable.prototype.create = function (fields) {
  var {base, table, headers} = this.airtable;
  headers[`Content-type`] = 'application/json';
  var params = {
    method: 'POST',
    headers,
    body: JSON.stringify({fields})
  };
  var url = `https://api.airtable.com/v0/${base}/${table}`;
  return this.createFetch(params, url);
};

module.exports = Airtable;
