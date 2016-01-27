'use strict'

const promisify = require('promisify-object')

const fs = promisify(require('fs'), ['readdir'])
const path = require('path')

const util = require('./util')
const getPackage = require('./pkg').getPackage
const parseArguments = require('./arguments').parseArguments
const pkg = require('../package')

const dependenciesDir = 'node_modules'

function getDependencies (dirname) {
  const modulesDir = path.join(dirname, dependenciesDir)
  return util.isDirectory(modulesDir)
    .then(function (isDir) {
      if (!isDir) {
        return []
      }
      return fs.readdir(modulesDir)
        .then(function (dirEntries) {
          const validatedEntries = dirEntries.map(function (dirEntry) {
            const dirEntryPath = path.join(modulesDir, dirEntry)
            return getPackage(dirEntryPath)
              .then(function (pkg) {
                return Boolean(pkg) && {
                  name: pkg.name,
                  version: pkg.version,
                  path: dirEntryPath
                }
              })
          })
          return Promise.all(validatedEntries)
        })
        .then(function (validatedPkgs) {
          return validatedPkgs.filter(Boolean)
        })
        .then(function (pkgs) {
          const pkgDependencies = pkgs.map(function (pkg) {
            return getDependencies(pkg.path).then(function (dependencies) {
              const label = `${pkg.name}@${pkg.version}`
              if (!dependencies.length) {
                return label
              }
              return {[label]: dependencies}
            })
          })
          return Promise.all(pkgDependencies)
        })
    })
}

function main () {
  const defaults = {
    version: pkg.version,
    description: pkg.description,
    directory: '.',
    logLevel: 'info'
  }
  const program = parseArguments(defaults, process.argv)
  return getDependencies(program.directory)
}

module.exports = main
