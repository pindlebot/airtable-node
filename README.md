# airtable-node [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Node wrapper for Airtable API

## Installation

```sh
$ npm i airtable-node --save
```

## Usage

```js
const Airtable = require('airtable-node');

const airtable = new Airtable()
  .base('appRvT3sM3XOBruUk')
  .table('Team%20Members')
  .view('Main%20View')

airtable.list().value().then(resp => {
  console.log(resp)
})

airtable.list({
  filterByFormula: `NOT({Feature} = '')`, // optional
  maxRecords: 200, // optional
  pageSize: 100, // optional 
  sort: 'asc', // optional
  view: 'Airtable%20View', // optional
  cellFormat: 'json', // optional
  timeZone, // optional
  userLocale // optional
},
offset //optional
).then(resp => {
  console.log(resp)
})

```

## Methods 

### Airtable({ apiKey, base, table, view })

- required: apiKey
- all other parameters can be set via chaining


#### Example

```js
const airtable = new Airtable({ apiKey, base, table, view })
```

### Airtable.list(params)

Airtable.list returns a promise.

#### Example

```js
const airtable = new Airtable({ apiKey, base, table, view })
airtable.list({
  maxRecords: 200
}).value().then(resp => {
  console.log(resp)
})

```

### Airtable.update(id, { fields })

#### Example

```js
const airtable = new Airtable({ apiKey, base, table })
const id = 'airtable record id'
const fields = {
  some_field_name: 'some value'
}

airtable.update(id, { fields }).value().then(resp => {
  console.log(resp)
})
```

### Airtable.retrieve(id)

- required: id

```js
const airtable = new Airtable({ apiKey, base, table })
const id = 'airtable record id'

airtable.retrieve(id).value().then(resp => {
  console.log(resp)
})
```


### Airtable.delete(id)
- required: id

#### Example

```js
const airtable = new Airtable({apiKey, base, table})
const id = 'airtable record id'

airtable.delete(id).value().then(resp => {
  console.log(resp)
})

```



## License

MIT © [Ben](http://www.menubar.io)


[npm-image]: https://badge.fury.io/js/airtable-node.svg
[npm-url]: https://npmjs.org/package/airtable-node
[travis-image]: https://travis-ci.org/focuswish/airtable-node.svg?branch=master
[travis-url]: https://travis-ci.org/focuswish/airtable-node
[daviddm-image]: https://david-dm.org/focuswish/airtable-node.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/focuswish/airtable-node
[coveralls-image]: https://coveralls.io/repos/focuswish/airtable-node/badge.svg
[coveralls-url]: https://coveralls.io/r/focuswish/airtable-node
