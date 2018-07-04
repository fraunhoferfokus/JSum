# JSum
Consistent checksum calculation of JSON objects.

[![Build Status](https://travis-ci.org/fraunhoferfokus/JSum.svg?branch=master)](https://travis-ci.org/fraunhoferfokus/JSum)

## Quick start
```js
const JSum = require('jsum')

const obj1 = {foo: [{c: 1}, {d: 2, e: 3}], bar: {a: 2, b: undefined}}
const obj2 = {bar: {b: undefined, a: 2}, foo: [{c: 1}, {e: 3, d: 2}]}

console.log(JSum.digest(obj1, 'SHA256', 'hex')) // 7514a2664dab82189b89d8250da9d0e1e6c95d3efaca6ffc25e5db42d7a7d053
console.log(JSum.digest(obj2, 'SHA256', 'hex')) // 7514a2664dab82189b89d8250da9d0e1e6c95d3efaca6ffc25e5db42d7a7d053
```

## Why this module?
My main goal was to create [`Etag`s](https://tools.ietf.org/html/rfc7232#section-2.3) from JSON objects. The most intuitive approach
would have been something like:

```js
const crypto = require('crypto')

function checksum (obj) {
  return crypto.createHash('MD5').update(JSON.stringify(myObj)).digest('hex')
}
```

However, this approach would yield two different results for semantically same JSON objects:

```js
console.log(checksum({"a": 1, "b": 2})) // 608de49a4600dbb5b173492759792e4a
console.log(checksum({"b": 2, "a": 1})) // 9915965eb40d343a8fe26e4e341d1a05
```

`JSum` on other hand makes sure that semantically same JSON objects always get the same checksum! Moreover, it provides a good deal
of time advantage over some other viable modules\*:

| Module                  | Time (ms) to hash a 181 MB JSON file (from memory) |
|-------------------------|:---------------------------------------------------:|
| `json-hash`             | `81537`                                             |
| `json-stable-stringify` | `12134`                                             |
| `JSum`                  | `9656`                                              |
| `json-checksum`         | `FATAL ERROR: [...] - process out of memory`        |


For this trivial test a huge [random JSON file](https://github.com/zemirco/sf-city-lots-json)
(181 MB) was taken as the base for benchmarking. The listed modules were used to create `SHA256` hash of that file. To measure the time,
internal `console.time(()` and `console.timeEnd()` methods were used. Serious benchmarking is described below.

## Benchmarking
You can also run benchmarks to compare performance with similar modules:

```bash
npm i --no-save \
  benchmarked \
  fast-json-stable-stringify \
  json-checksum json-hash \
  json-stable-stringify
node benchmark/index.js
```

Results:

```
# benchmark/fixtures/medium.json (77986 bytes)
  fast-json-stable-stringify x 366 ops/sec ±8.11% (66 runs sampled)
  json-checksum x 200 ops/sec ±2.30% (76 runs sampled)
  json-hash x 82.65 ops/sec ±1.93% (68 runs sampled)
  json-stable-stringify x 384 ops/sec ±1.82% (81 runs sampled)
  jsum x 822 ops/sec ±2.83% (80 runs sampled)

  fastest is jsum

# benchmark/fixtures/small.json (456 bytes)
  fast-json-stable-stringify x 47,956 ops/sec ±3.17% (82 runs sampled)
  json-checksum x 15,424 ops/sec ±3.97% (74 runs sampled)
  json-hash x 7,536 ops/sec ±2.08% (82 runs sampled)
  json-stable-stringify x 32,833 ops/sec ±3.99% (76 runs sampled)
  jsum x 76,765 ops/sec ±2.31% (78 runs sampled)

  fastest is jsum
```

## I don't want this :-(
Fair enough! Just copy (check the license first!) this for your own code and hash as you will:

```js
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
function serialize (obj) {
  if (Array.isArray(obj)) {
    return JSON.stringify(obj.map(i => serialize(i)))
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj)
      .sort()
      .map(k => `${k}:${serialize(obj[k])}`)
      .join('|')
  }

  return obj
}
```