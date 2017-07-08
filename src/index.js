'use strict';
const fetch = require('isomorphic-fetch');

function createFetch(params, url) {
  return fetch(url, params).then(resp => resp.json())
  .then(resp => {
    return resp
  })
}

function Airtable(params, count = 10) {
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
  this.airtable.count = count;
  this.airtable.headers = {
    Authorization: `Bearer ${apiKey}`
  };
  this.createFetch = createFetch;
}

Airtable.prototype.list = function (view = this.airtable.view, count = this.airtable.count) {
  var {base, table, headers} = this.airtable;
  var params = {
    method: 'GET',
    headers
  };
  var url = `https://api.airtable.com/v0/${base}/${table}?maxRecords=${count}&view=${view}`;
  return this.createFetch(params, url);
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
