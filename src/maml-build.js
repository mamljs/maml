const program = require('commander')
const path = require('path')
const { exec } = require('child_process')
const fs = require('fs')
const {debounce} = require('lodash')

const { buildPages } = require('./pages')
const {logInfo, logSuccess} = require('./utils');

program
  .version(require('../package.json').version)
  .option('-i, --input <input>', 'specify input directory')
  .option('-o, --output <output>', 'specify output directory')
  .option('-w, --watch', 'turn on watch mode')
  .parse(process.argv)

const input = program.input || '.'
const output = program.output || 'dist'

const build = () => {
  logInfo(`${new Date()} building`);
  buildPages(input, output)
  // copy assets
  exec(`cp -r ${path.join(input, 'assets', '*')} ${output}`)
  logSuccess(`${new Date()} done`);
}

build();

if (program.watch) { // watch mode
  const debouncedBuild = debounce(build, 256);
  const outputPath = fs.realpathSync(output)
  fs.watch(input, { recursive: true }, (eventType, filename) => {
    if (!fs.existsSync(path.join(input, filename))) {
      return // file deleted
    }
    const filePath = fs.realpathSync(path.join(input, filename))
    if (!filePath.startsWith(outputPath)) {
      debouncedBuild()
    }
  })
}
