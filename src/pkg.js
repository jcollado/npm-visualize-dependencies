'use strict'

const promisify = require('promisify-object')

const fs = promisify(require('fs'), ['readFile'])
const path = require('path')

const util = require('./util')

const packageFilename = 'package.json'

function isPackageDirectory (dirname) {
  return util.isDirectory(dirname)
    .then(function (dirExists) {
      const filename = path.join(dirname, packageFilename)
      return dirExists && util.isFile(filename)
    })
}

function getPackage (dirname) {
  return isPackageDirectory(dirname)
    .then(function (isPackage) {
      if (!isPackage) {
        return null
      }

      const filename = path.join(dirname, packageFilename)
      return fs.readFile(filename)
        .then(function (data) {
          return JSON.parse(data)
        })
    })
}

module.exports = {
  getPackage
}
