'use strict'

const getDependencies = require('./dependencies').getDependencies
const parseArguments = require('./arguments').parseArguments
const pkg = require('../package')

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
