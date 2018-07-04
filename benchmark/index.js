'use strict'

const Suite = require('benchmarked')

const suite = new Suite({
  cwd: __dirname,
  fixtures: 'fixtures/*.json',
  code: 'code/*.js'
})
suite.run()
