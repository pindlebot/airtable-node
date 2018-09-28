
// lifted from https://github.com/jquery/jquery/blob/2.2-stable/src/serialize.js

const safeEncodeURIComponent = string => {
  let decoded = decodeURIComponent(string)
  while (string !== decoded) {
    string = decoded
    decoded = decodeURIComponent(string)
  }
  return encodeURIComponent(decoded)
}

function buildParams (prefix, maybeArray, insert) {
  if (Array.isArray(maybeArray)) {
    maybeArray.forEach((value, index) => {
      if (/\[\]$/.test(prefix)) {
        insert(prefix, value)
      } else {
        let val = value && typeof value === 'object' ? index : ''
        buildParams(`${prefix}[${val}]`, value, insert)
      }
    })
  } else if (typeof maybeArray === 'object') {
    Object.keys(maybeArray).forEach(name => {
      buildParams(prefix + '[' + name + ']', maybeArray[name], insert)
    })
  } else {
    insert(prefix, maybeArray)
  }
}

module.exports.safeEncodeURIComponent = safeEncodeURIComponent

module.exports.serialize = (obj) => {
  const parts = []
  const insert = (key, value) => {
    value = (value === null || value === undefined) ? '' : value
    parts.push(safeEncodeURIComponent(key) + '=' + safeEncodeURIComponent(value))
  }

  Object.keys(obj).forEach(key => {
    buildParams(key, obj[key], insert)
  })

  return parts.join('&').replace(/%20/g, '+')
}
