#! /usr/bin/env node
const program = require('commander')

program
  .version(require('../package.json').version)
  .command('init', 'initialize a new website')
  .command('build', 'build the website', { isDefault: true })
  .parse(process.argv)
