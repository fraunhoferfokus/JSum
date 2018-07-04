'use strict'

const crypto = require('crypto')
const hash = require('json-hash')

module.exports = function (json) {
  return hash.digest(json, {crypto: crypto})
}
