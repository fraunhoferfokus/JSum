'use strict'

const JSum = require('../../index')

module.exports = function (json) {
  return JSum.digest(json, 'SHA256', 'hex')
}
