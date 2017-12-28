const program = require('commander')
const fs = require('fs')
const { exec } = require('child_process')

program
  .version(require('../package.json').version)
  .option('-t, --template <template>', 'specify website template')
  .parse(process.argv)

const template = program.template || 'default'

const init = () => {
  console.log(`Website initializing with template '${template}'`)
  exec(`
    wget https://github.com/mamljs/maml-template-${template}/archive/master.zip
    7z x master.zip && rm master.zip
    cp -r maml-template-${template}-master/assets .
    cp -r maml-template-${template}-master/controllers .
    cp -r maml-template-${template}-master/models .
    cp -r maml-template-${template}-master/views .
    cp -r maml-template-${template}-master/package.json .
    rm -rf maml-template-${template}-master
    yarn install
  `,
  (err) => {
    console.log(err || 'Website initialized')
  }).stdout.pipe(process.stdout)
}

if (fs.readdirSync('.').length === 0) {
  init()
} else {
  console.error('Directory is non-empty')
}
