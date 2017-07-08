'use strict';

let createFetch = (() => {
  var _ref = _asyncToGenerator(function* (params, url) {
    const resp = yield fetch(url, params);
    const json = yield resp.json();
    return json;
  });

  return function createFetch(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetch = require('isomorphic-fetch');

function Airtable(params, count = 10) {
  var { apiKey, base, table, view = null } = params;

  var required = new Array('apiKey', 'base', 'table');
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

Airtable.prototype.list = (() => {
  var _ref2 = _asyncToGenerator(function* (view = this.airtable.view, count = this.airtable.count) {
    var { base, table, headers } = this.airtable;
    var params = {
      method: 'GET',
      headers
    };
    var url = `https://api.airtable.com/v0/${base}/${table}?maxRecords=${count}&view=${view}`;
    var data = yield this.createFetch(params, url);
    console.log(data);
    return data;
  });

  return function () {
    return _ref2.apply(this, arguments);
  };
})();

Airtable.prototype.update = (() => {
  var _ref3 = _asyncToGenerator(function* (fields, id) {
    var { base, table, headers } = this.airtable;
    headers[`Content-type`] = 'application/json';
    var params = {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ fields })
    };
    var url = `https://api.airtable.com/v0/${base}/${table}/${id}`;
    var resp = yield this.createFetch(params, url);
    return resp;
  });

  return function (_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
})();

Airtable.prototype.retrieve = (() => {
  var _ref4 = _asyncToGenerator(function* (id) {
    var { base, table, headers } = this.airtable;
    var params = {
      method: 'GET',
      headers
    };
    var url = `https://api.airtable.com/v0/${base}/${table}/${id}`;
    var data = yield this.createFetch(params, url);
    return data;
  });

  return function (_x5) {
    return _ref4.apply(this, arguments);
  };
})();

Airtable.prototype.delete = (() => {
  var _ref5 = _asyncToGenerator(function* (id) {
    var { base, table, headers } = this.airtable;
    var params = {
      method: 'DELETE',
      headers
    };
    var url = `https://api.airtable.com/v0/${base}/${table}/${id}`;
    var data = yield this.createFetch(params, url);
    return data;
  });

  return function (_x6) {
    return _ref5.apply(this, arguments);
  };
})();

Airtable.prototype.create = (() => {
  var _ref6 = _asyncToGenerator(function* (fields) {
    var { base, table, headers } = this.airtable;
    headers[`Content-type`] = 'application/json';
    var params = {
      method: 'POST',
      headers,
      body: JSON.stringify({ fields })
    };
    var url = `https://api.airtable.com/v0/${base}/${table}`;
    var data = yield this.createFetch(params, url);
    return data;
  });

  return function (_x7) {
    return _ref6.apply(this, arguments);
  };
})();

module.exports = Airtable;