'use strict'

const promisify = require('promisify-object')

const fs = promisify(require('fs'), ['stat'])

function isFile (filename) {
  return fs.stat(filename)
    .then(
      function (stats) {
        return stats.isFile()
      },
      function () {
        return false
      }
    )
}

function isDirectory (dirname) {
  return fs.stat(dirname)
    .then(
      function (stats) {
        return stats.isDirectory()
      },
      function () {
        return false
      }
    )
}

module.exports = {
  isFile,
  isDirectory
}
