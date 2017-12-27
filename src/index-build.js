const program = require('commander')
const nunjucks = require('nunjucks')
const path = require('path')

const { loadPages } = require('./pages')

program
  .version(require('../package.json').version)
  .option('-i, --input <input>', 'specify input directory')
  .option('-o, --output <output>', 'specify output directory')
  .parse(process.argv)

const input = program.input || '.'
nunjucks.configure(path.join(input, 'views'), { autoescape: false })

const pages = loadPages(input)
console.log(pages)

const output = program.output || 'dist'
console.log(output)
