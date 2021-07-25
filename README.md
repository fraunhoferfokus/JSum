# JSum
Consistent checksum calculation of JSON objects.

[![Unit Tests](https://github.com/fraunhoferfokus/JSum/actions/workflows/node.js.yml/badge.svg)](https://github.com/fraunhoferfokus/JSum/actions/workflows/node.js.yml)

## Quick start
```js
const JSum = require('jsum')

const obj1 = {foo: [{c: 1}, {d: 2, e: 3}], bar: {a: 2, b: undefined}}
const obj2 = {bar: {b: undefined, a: 2}, foo: [{c: 1}, {e: 3, d: 2}]}

console.log(JSum.digest(obj1, 'SHA256', 'hex')) // 9a08ad6302b1e9e5682c365c8b24c5ca2ea6db5c90b672bc5b579879136dda0c
console.log(JSum.digest(obj2, 'SHA256', 'hex')) // 9a08ad6302b1e9e5682c365c8b24c5ca2ea6db5c90b672bc5b579879136dda0c
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
| `JSum`                  | `7200`                                              |
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
  fast-json-stable-stringify x 629 ops/sec ±1.67% (81 runs sampled)
  json-checksum x 236 ops/sec ±0.88% (82 runs sampled)
  json-hash x 83.40 ops/sec ±1.25% (60 runs sampled)
  json-stable-stringify x 609 ops/sec ±0.80% (87 runs sampled)
  jsum x 1,118 ops/sec ±0.68% (89 runs sampled)

  fastest is jsum

# benchmark/fixtures/small.json (456 bytes)
  fast-json-stable-stringify x 67,381 ops/sec ±1.16% (84 runs sampled)
  json-checksum x 21,372 ops/sec ±1.21% (89 runs sampled)
  json-hash x 7,409 ops/sec ±1.17% (75 runs sampled)
  json-stable-stringify x 54,015 ops/sec ±0.89% (83 runs sampled)
  jsum x 90,816 ops/sec ±1.06% (87 runs sampled)

  fastest is jsum
```
