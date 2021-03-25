/* global describe, it */

'use static'

const expect = require('chai').expect

const jsum = require('../index')

const DELIM = '\u0000'

describe('JSum', function () {
  it('should correctly handle null', function () {
    // Why is null exceptional?
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#null
    expect(jsum.stringify({b: null}))
      .to.be.equal('b:null')
  })

  it('should correctly handle arrays', function () {
    expect(jsum.stringify([1, 2, true]))
      .to.be.equal('[1,2,true]')
  })

  it('should correctly sort object members', function () {
    // One level
    expect(jsum.stringify({a: 1, b: 2}))
      .to.be.equal(jsum.stringify({b: 2, a: 1}))

    // Multiple level
    expect(jsum.stringify({a: {x: 1, y: 2}, b: 'test'}))
      .to.be.deep.equal(jsum.stringify({b: 'test', a: {y: 2, x: 1}}))
  })

  it('should correctly sort objects inside arrays', function () {
    expect(jsum.stringify([{a: 1, b: 2}, {x: 'test', y: 'me'}]))
      .to.be.equal(jsum.stringify([{b: 2, a: 1}, {y: 'me', x: 'test'}]))
  })

  it('should correctly separate JSON members', function () {
    expect(jsum.stringify({a: 1, b: 2}))
      .to.be.equal(`a:1${DELIM}b:2`)
  })

  it('should correctly stringify complex object', function () {
    expect(jsum.stringify({foo: [{c: 1}, {d: 2, e: 3}], bar: {a: 2, b: undefined}}))
      .to.be.equal(jsum.stringify({bar: {b: undefined, a: 2}, foo: [{c: 1}, {e: 3, d: 2}]}))
  })

  // See issue #6
  it('should handle typing robustly', function () {
    expect(jsum.stringify({a: 1}))
      .to.not.be.equal(jsum.stringify({a: "1"}))
  })
})
