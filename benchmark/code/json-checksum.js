'use strict'

const hash = require('json-checksum')

module.exports = function (json) {
  return hash(json)
}
