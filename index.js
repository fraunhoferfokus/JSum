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
    return JSON.stringify(obj.map(i => stringify(i)))
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj)
      .sort()
      .map(k => `${k}:${stringify(obj[k])}`)
      .join(DELIM)
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
