# airtable-node [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Node wrapper for Airtable API

## Installation

```sh
$ npm i airtable-node --save
```

## Usage

```js
const Airtable = require('airtable-node');

const airtable = new Airtable({apiKey, base, table, view})

airtable.list().then(resp => {
  console.log(resp)
})

const view = 'my airtable view'
const count = 20

airtable.list(view, count).then(resp => {
  console.log(resp)
})

```

## Methods 

### Airtable({ apiKey, base, table, view }, count)

- required: apiKey, base, table
- optional: view, count 


#### Example

```js
const airtable = new Airtable({apiKey, base, table, view}, count)
```

### Airtable.list(view, count)

- optional: view, count
- required: view (if no view is set by Airtable(...))

Airtable.list returns a promise.

#### Example

```js
const airtable = new Airtable({apiKey, base, table, view}, count)
airtable.list().then(resp => {
  console.log(resp)
})

```

### Airtable.update(fields, id)

- required: fields, id

#### Example

```js
const airtable = new Airtable({apiKey, base, table})
const id = 'airtable record id'
const fields = {
  some_field_name: 'some value'
}

airtable.update(fields, id).then(resp => {
  console.log(resp)
})
```

### Airtable.retrieve(id)

- required: id

```js
const airtable = new Airtable({apiKey, base, table})
const id = 'airtable record id'

airtable.update(id).then(resp => {
  console.log(resp)
})
```


### Airtable.delete(id)
- required: id

#### Example

```js
const airtable = new Airtable({apiKey, base, table})
const id = 'airtable record id'

airtable.delete(id).then(resp => {
  console.log(resp)
})

```



## License

MIT © [Ben](http://www.focuswish.com)


[npm-image]: https://badge.fury.io/js/airtable-node.svg
[npm-url]: https://npmjs.org/package/airtable-node
[travis-image]: https://travis-ci.org/focuswish/airtable-node.svg?branch=master
[travis-url]: https://travis-ci.org/focuswish/airtable-node
[daviddm-image]: https://david-dm.org/focuswish/airtable-node.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/focuswish/airtable-node
[coveralls-image]: https://coveralls.io/repos/focuswish/airtable-node/badge.svg
[coveralls-url]: https://coveralls.io/r/focuswish/airtable-node
