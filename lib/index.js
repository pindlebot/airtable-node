'use strict';

var fetch = require('isomorphic-fetch');

function createFetch(params, url) {
  return fetch(url, params).then(function (resp) {
    return resp.json();
  }).then(function (resp) {
    return resp;
  });
}

function Airtable(params) {
  var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var apiKey = params.apiKey,
      base = params.base,
      table = params.table,
      _params$view = params.view,
      view = _params$view === undefined ? null : _params$view;


  var required = ['apiKey', 'base', 'table'];
  required.forEach(function (req) {
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
    Authorization: 'Bearer ' + apiKey
  };
  this.createFetch = createFetch;
}

Airtable.prototype.list = function () {
  var view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.airtable.view;

  var _this = this;

  var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.airtable.count;
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.airtable.offset;
  var _airtable = this.airtable,
      base = _airtable.base,
      table = _airtable.table,
      headers = _airtable.headers;

  var params = {
    method: 'GET',
    headers: headers
  };
  var req = function req() {
    var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var url = 'https://api.airtable.com/v0/' + base + '/' + table + '?maxRecords=' + count + '&offset=' + offset + '&view=' + view;
    return _this.createFetch(params, url).then(function (resp) {
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
  var _airtable2 = this.airtable,
      base = _airtable2.base,
      table = _airtable2.table,
      headers = _airtable2.headers;

  headers['Content-type'] = 'application/json';
  var params = {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({ fields: fields })
  };
  var url = 'https://api.airtable.com/v0/' + base + '/' + table + '/' + id;
  return this.createFetch(params, url);
};

Airtable.prototype.retrieve = function (id) {
  var _airtable3 = this.airtable,
      base = _airtable3.base,
      table = _airtable3.table,
      headers = _airtable3.headers;

  var params = {
    method: 'GET',
    headers: headers
  };
  var url = 'https://api.airtable.com/v0/' + base + '/' + table + '/' + id;
  return this.createFetch(params, url);
};

Airtable.prototype.delete = function (id) {
  var _airtable4 = this.airtable,
      base = _airtable4.base,
      table = _airtable4.table,
      headers = _airtable4.headers;

  var params = {
    method: 'DELETE',
    headers: headers
  };
  var url = 'https://api.airtable.com/v0/' + base + '/' + table + '/' + id;
  return this.createFetch(params, url);
};

Airtable.prototype.create = function (fields) {
  var _airtable5 = this.airtable,
      base = _airtable5.base,
      table = _airtable5.table,
      headers = _airtable5.headers;

  headers['Content-type'] = 'application/json';
  var params = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ fields: fields })
  };
  var url = 'https://api.airtable.com/v0/' + base + '/' + table;
  return this.createFetch(params, url);
};

module.exports = Airtable;