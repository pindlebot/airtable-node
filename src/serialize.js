
// Adapted from jQuery.param:
// https://github.com/jquery/jquery/blob/2.2-stable/src/serialize.js
function buildParams(prefix, maybeArray, insert) {
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
    // Serialize scalar item.
    insert(prefix, maybeArray)
  }
}

module.exports = (obj) => {
  const parts = []
  const insert = function(key, value) {
    value = (value === null || value === undefined) ? '' : value
    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
  }

  Object.keys(obj).forEach(key => {
    var value = obj[key]
    buildParams(key, value, insert)
  })

  return parts.join('&').replace(/%20/g, '+')
}