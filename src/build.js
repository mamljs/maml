const path = require('path')
const { exec } = require('child_process')
const fs = require('fs')
const {debounce} = require('lodash')

const { buildPages } = require('./pages')
const {logInfo, logSuccess} = require('./utils');

const buildOnce = (input, output) => {
  logInfo(`${new Date()}`);
  buildPages(input, output)
  // copy assets
  exec(`cp -r ${path.join(input, 'assets', '*')} ${output}`)
  logSuccess(`${new Date()}`);
}

const build = options => {
  const {input, output, watch} = options;
  buildOnce(input, output);
  if (watch) { // watch mode
    const debouncedBuild = debounce(buildOnce, 256);
    const outputPath = fs.realpathSync(output)
    fs.watch(input, { recursive: true }, (eventType, filename) => {
      if (!fs.existsSync(path.join(input, filename))) {
        return // file deleted
      }
      const filePath = fs.realpathSync(path.join(input, filename))
      if (!filePath.startsWith(outputPath)) {
        debouncedBuild(input, output)
      }
    })
  }
};

module.exports = build;
