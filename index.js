#!/usr/bin/env node
'use strict'

const main = require('./src')

main().then(function (dependencies) {
  console.log(JSON.stringify(dependencies, null, 2))
})
