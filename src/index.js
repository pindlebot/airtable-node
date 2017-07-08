'use strict';
var fetch = require('isomorphic-fetch');

async function createFetch(params, url) {
  const resp = await fetch(url, params);
  const json = await resp.json();
  return json;
}

function Airtable(params, count = 10) {
  var {apiKey, base, table, view = null} = params

  var required = new Array('apiKey', 'base', 'table')
  required.forEach(req => {
    if(!params[req]) {
      throw new Error(req + ' is required.')
    }
  })

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

Airtable.prototype.list = async function (view = this.airtable.view, count = this.airtable.count) {
  var {base, table, headers} = this.airtable;
  var params = {
    method: 'GET',
    headers
  };
  var url = `https://api.airtable.com/v0/${base}/${table}?maxRecords=${count}&view=${view}`;
  var data = await this.createFetch(params, url);
  console.log(data)
  return data;
};

Airtable.prototype.update = async function (fields, id) {
  var {base, table, headers} = this.airtable;
  headers[`Content-type`] = 'application/json';
  var params = {
    method: 'PATCH',
    headers,
    body: JSON.stringify({fields})
  };
  var url = `https://api.airtable.com/v0/${base}/${table}/${id}`;
  var resp = await this.createFetch(params, url);
  return resp;
};

Airtable.prototype.retrieve = async function (id) {
  var {base, table, headers} = this.airtable;
  var params = {
    method: 'GET',
    headers
  };
  var url = `https://api.airtable.com/v0/${base}/${table}/${id}`;
  var data = await this.createFetch(params, url);
  return data;
};

Airtable.prototype.delete = async function (id) {
  var {base, table, headers} = this.airtable;
  var params = {
    method: 'DELETE',
    headers
  };
  var url = `https://api.airtable.com/v0/${base}/${table}/${id}`;
  var data = await this.createFetch(params, url);
  return data;
};

Airtable.prototype.create = async function (fields) {
  var {base, table, headers} = this.airtable;
  headers[`Content-type`] = 'application/json';
  var params = {
    method: 'POST',
    headers,
    body: JSON.stringify({fields})
  };
  var url = `https://api.airtable.com/v0/${base}/${table}`;
  var data = await this.createFetch(params, url);
  return data;
};

module.exports = Airtable;
