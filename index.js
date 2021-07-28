'use strict'

const crypto = require('crypto')

function _collectKeys (obj) {
  let res = []

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      res = res.concat(_collectKeys(obj[i]))
    }
  } else if (typeof obj === 'object' && obj !== null) {
    const keys = Object.keys(obj)
    res = res.concat(keys)
    for (const k of keys) {
      res = res.concat(_collectKeys(obj[k]))
    }
  }

  return res
}

/**
 * Collects and sorts all unique keys of the given object recursively.
 *
 * @param {any} obj object to inspect
 * @returns sorted unique keys
 */
function collectKeys (obj) {
  return [...new Set(_collectKeys(obj).sort())]
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
  return JSON.stringify(obj, collectKeys(obj))
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
  digest: digest,
  collectKeys: collectKeys
}
