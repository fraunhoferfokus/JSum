'use strict'

const crypto = require('crypto')

// Delimeter to separate object items form each other
// when stringifying
const DELIM = '|'

/**
 * Stringifies a JSON object (not any randon JS object).
 *
 * It should be noted that JS objects can have members of
 * specific type (e.g. function), that are not supported
 * by JSON.
 *
 * @param {Object} obj JSON object
 * @returns {String} stringified JSON object.
 */
function stringify (obj) {
  if (Array.isArray(obj)) {
    let stringifiedArr = []
    for (let i = 0; i < obj.length; i++) {
      stringifiedArr[i] = stringify(obj[i])
    }

    return JSON.stringify(stringifiedArr)
  } else if (typeof obj === 'object' && obj !== null) {
    let acc = []
    let sortedKeys = Object.keys(obj).sort()

    for (let i = 0; i < sortedKeys.length; i++) {
      let k = sortedKeys[i]
      acc[i] = `${k}:${stringify(obj[k])}`
    }

    return acc.join(DELIM)
  }

  return obj
}

/**
 * Creates hash of given JSON object.
 *
 * @param {Object} obj JSON object
 * @param {String} hashAlgorithm hash algorithm (e.g. SHA256)
 * @param {String} encoding hash encoding (e.g. base64) or none for buffer
 * @see #stringify
 */
function digest (obj, hashAlgorithm, encoding) {
  let hash = crypto.createHash(hashAlgorithm)
  return hash.update(stringify(obj)).digest(encoding)
}

module.exports = {
  stringify: stringify,
  digest: digest
}
