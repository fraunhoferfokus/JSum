'use strict'

const crypto = require('crypto')
const stringify = require('fast-json-stable-stringify')

module.exports = function (json) {
  let hash = crypto.createHash('SHA256')
  return hash.update(stringify(json)).digest('hex')
}
