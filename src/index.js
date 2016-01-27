'use strict'

const promisify = require('promisify-object')

const fs = promisify(require('fs'), ['readdir', 'readFile', 'stat'])
const path = require('path')

const packageFilename = 'package.json'
const dependenciesDir = 'node_modules'

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

function isPackageDirectory (dirname) {
  return isDirectory(dirname)
    .then(function (dirExists) {
      const filename = path.join(dirname, packageFilename)
      return dirExists && isFile(filename)
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

function getDependencies (dirname) {
  const modulesDir = path.join(dirname, dependenciesDir)
  return isDirectory(modulesDir)
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

module.exports = getDependencies
