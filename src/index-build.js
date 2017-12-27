const program = require('commander')

const { buildPages } = require('./pages')

program
  .version(require('../package.json').version)
  .option('-i, --input <input>', 'specify input directory')
  .option('-o, --output <output>', 'specify output directory')
  .parse(process.argv)

const input = program.input || '.'
const output = program.output || 'dist'

buildPages(input, output)
