'use strict'

const crypto = require('crypto')

function _serialize (obj) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = _serialize(obj[i])
    }
    return obj
  } else if (typeof obj === 'object' && obj != null) {
    const sortedKeys = Object.keys(obj).sort()
    for (let i = 0; i < sortedKeys.length; i++) {
      const k = sortedKeys[i]
      obj[k] = _serialize(obj[k])
    }
    return JSON.stringify(obj, sortedKeys)
  }

  return obj
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
  const ser = _serialize(obj)
  return (typeof ser !== 'string') ? JSON.stringify(ser) : ser
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
