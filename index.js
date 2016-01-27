#!/usr/bin/env node
'use strict'

const getDependencies = require('./src')

getDependencies('.').then(function (dependencies) {
  console.log(JSON.stringify(dependencies, null, 2))
})
