'use strict'

const requireInject = require('require-inject')
const sinon = require('sinon')
const test = require('ava').test

test('isFile: returns true if it is a file', function (t) {
  const stubs = {
    fs: {
      stat: sinon.stub().yields(null, {
        isFile: sinon.stub().returns(true)
      })
    }
  }
  const util = requireInject('../src/util', stubs)
  return util.isFile('some file').then(function (isFile) {
    t.true(isFile)
  })
})

test('isFile: returns false if is not a file', function (t) {
  const stubs = {
    fs: {
      stat: sinon.stub().yields(null, {
        isFile: sinon.stub().returns(false)
      })
    }
  }
  const util = requireInject('../src/util', stubs)
  return util.isFile('some file').then(function (isFile) {
    t.false(isFile)
  })
})

test('isFile: returns false on error', function (t) {
  const stubs = {
    fs: {
      stat: sinon.stub().yields(new Error('some error'))
    }
  }
  const util = requireInject('../src/util', stubs)
  return util.isFile('some file').then(function (isFile) {
    t.false(isFile)
  })
})
