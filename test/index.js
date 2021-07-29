/* global describe, it */

'use static'

const expect = require('chai').expect

const jsum = require('../index')

describe('JSum', function () {
  it('should correctly handle null', function () {
    // Why is null exceptional?
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#null
    expect(jsum.serialize({ b: null }))
      .to.be.equal('{["b"]null}')
  })

  it('should correctly handle arrays', function () {
    expect(jsum.serialize([1, 2, true, 'false']))
      .to.be.equal('[1,2,true,"false"]')
  })

  it('should correctly sort object members', function () {
    // One level
    expect(jsum.serialize({ a: 1, b: 2 }))
      .to.be.equal(jsum.serialize({ b: 2, a: 1 }))

    // Multiple level
    expect(jsum.serialize({ a: { x: 1, y: 2 }, b: 'test' }))
      .to.be.deep.equal(jsum.serialize({ b: 'test', a: { y: 2, x: 1 } }))
  })

  it('should correctly sort objects inside arrays', function () {
    expect(jsum.serialize([{ a: 1, b: 2 }, { x: 'test', y: 'me' }]))
      .to.be.equal(jsum.serialize([{ b: 2, a: 1 }, { y: 'me', x: 'test' }]))
  })

  it('should correctly serialize complex object', function () {
    expect(jsum.serialize({ foo: [{ c: 1 }, { d: 2, e: 3 }], bar: { a: 2, b: undefined } }))
      .to.be.equal(jsum.serialize({ bar: { b: undefined, a: 2 }, foo: [{ c: 1 }, { e: 3, d: 2 }] }))
  })

  // See issue #6
  it('should handle typing robustly', function () {
    expect(jsum.serialize({ a: 1 }))
      .to.not.be.equal(jsum.serialize({ a: '1' }))
  })

  // See issue #8
  it('should not be fooled by stringified values', function () {
    expect(jsum.serialize({ a: '{"b":42}' }))
      .to.not.be.equal(jsum.serialize({ a: { b: 42 } }))

    expect(jsum.serialize(['{"foo":1}']))
      .to.not.be.equal(jsum.serialize([{ foo: 1 }]))
  })

  it('should properly sort nested objects', function () {
    expect(jsum.serialize({ x: 3, a: { z: { l: 4, k: 3, a: 1, b: 2 }, c: 1 }, k: [{ l: 2, b: 1, z: 3 }, 4, 5] }))
      .to.equal(jsum.serialize({ a: { c: 1, z: { a: 1, b: 2, k: 3, l: 4 } }, k: [{ b: 1, l: 2, z: 3 }, 4, 5], x: 3 }))
  })
})
