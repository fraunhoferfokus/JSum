'use strict'

const crypto = require('crypto')
const stringify = require('json-stable-stringify')

module.exports = function (json) {
  const hash = crypto.createHash('SHA256')
  return hash.update(stringify(json)).digest('hex')
}
