const program = require('commander')
const path = require('path')
const { exec } = require('child_process')
const fs = require('fs')
const Rx = require('rxjs/Rx')

const { buildPages } = require('./pages')

program
  .version(require('../package.json').version)
  .option('-i, --input <input>', 'specify input directory')
  .option('-o, --output <output>', 'specify output directory')
  .option('-w, --watch', 'turn on watch mode')
  .parse(process.argv)

const input = program.input || '.'
const output = program.output || 'dist'

const build = () => {
  console.log('building')
  buildPages(input, output)
  // copy assets
  exec(`cp -r ${path.join(input, 'assets', '*')} ${output}`)
  console.log('done')
}

build()

if (program.watch) { // watch mode
  const subject = new Rx.Subject().debounceTime(256)
  subject.subscribe(() => { build() })
  const outputPath = fs.realpathSync(output)
  fs.watch(input, { recursive: true }, (eventType, filename) => {
    const filePath = fs.realpathSync(path.join(input, filename))
    if (!filePath.startsWith(outputPath)) {
      subject.next()
    }
  })
}
