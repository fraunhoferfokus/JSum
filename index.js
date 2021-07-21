'use strict'

const crypto = require('crypto')

// Delimeter to separate object items form each other
// when stringifying
const KV_DELIM = Buffer.from([0xfe]).toString('utf8')
const OBJ_DELIM = Buffer.from([0xff]).toString('utf8')

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
    const stringifiedArr = []
    for (let i = 0; i < obj.length; i++) {
      stringifiedArr[i] = stringify(obj[i])
    }

    return `[${stringifiedArr.join(',')}]`
  } else if (typeof obj === 'object' && obj !== null) {
    const acc = []
    const sortedKeys = Object.keys(obj).sort()

    for (let i = 0; i < sortedKeys.length; i++) {
      const k = sortedKeys[i]
      acc[i] = `${k}${KV_DELIM}${stringify(obj[k])}`
    }

    return acc.join(OBJ_DELIM)
  } else if (typeof obj === 'string') {
    // See issue #6 for details
    return `"${obj}"`
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
  const hash = crypto.createHash(hashAlgorithm)
  return hash.update(stringify(obj)).digest(encoding)
}

module.exports = {
  stringify: stringify,
  digest: digest
}
