var assert = require('assert');
var Airtable = require('../src');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
chai.use(chaiAsPromised);

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
  require('env2')('.env');
}

var apiKey = process.env.AIRTABLE_API_KEY;
var base = process.env.AIRTABLE_BASE;
var table = process.env.AIRTABLE_TABLE;
var view = process.env.AIRTABLE_VIEW;

describe('Airtable.list', function () {
  it('Airtable.list', function (done) {
    var airtable = new Airtable({apiKey, base, table, view});
    airtable.list().should.eventually.be.fulfilled.notify(done);
  });
});

describe('Airtable.create', function () {
  it('Airtable.create', function (done) {
    var airtable = new Airtable({apiKey, base, table, view});
    airtable.create({link: 'http://www.google.com'}).should.eventually.be.fulfilled.notify(done);
  });
});

describe('Test errors', function () {
  it('Airtable', function () {
    assert.throws(function () {
      Airtable({});
    }, Error);
  });
});

describe('Test errors', function () {
  it('Airtable', function () {
    assert.throws(function () {
      Airtable({apiKey: 'test'});
    }, Error);
  });
});

describe('Test errors', function () {
  it('Airtable', function () {
    assert.throws(function () {
      Airtable({apiKey: 'test', base: 'base'});
    }, Error);
  });
});
