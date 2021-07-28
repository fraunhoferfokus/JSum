'use strict'

const crypto = require('crypto')

function _serialize(obj, acc) {
  if (Array.isArray(obj)) {
    let acc2 = ''
    for (let i = 0; i < obj.length; i++) {
      acc2 += _serialize(obj[i], acc)
    }

    return acc + acc2
  } else if (typeof obj === 'object' && obj !== null) {
    const keys = Object.keys(obj).sort()
    for (let i = 0; i < keys.length; i++) {
      acc += _serialize(obj[keys[i]], '')
    }
    return acc + JSON.stringify(keys)
  }

  return (acc + JSON.stringify(obj))
}

/**
 * Serializes a JSON object (not any random JS object).
 *
 * It should be noted that JS objects can have members of
 * specific type (e.g. function), that are not supported
 * by JSON.
 *
 * @param {Object} obj JSON object
 * @returns {String} stringified JSON object.
 */
function serialize (obj) {
  return _serialize(obj, '')
}

/**
 * Creates hash of given JSON object.
 *
 * @param {Object} obj JSON object
 * @param {String} hashAlgorithm hash algorithm (e.g. SHA256)
 * @param {String} encoding hash encoding (e.g. base64) or none for buffer
 * @see #serialize
 */
function digest (obj, hashAlgorithm, encoding) {
  const hash = crypto.createHash(hashAlgorithm)
  return hash.update(serialize(obj)).digest(encoding)
}

module.exports = {
  stringify: () => {
    throw new Error('"stringify()" is deprecated, use "serialize()" instead!')
  },
  serialize: serialize,
  digest: digest
}
