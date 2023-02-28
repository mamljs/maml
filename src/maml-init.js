const program = require('commander')
const fs = require('fs')

const {run} =require('./utils');

program
  .version(require('../package.json').version)
  .option('-t, --template <template>', 'specify website template')
  .parse(process.argv);

const template = program.template || 'default';

const init = () => {
  console.log(`Website initializing with template '${template}'`)
  run(`
    curl -L https://github.com/mamljs/maml-template-${template}/archive/master.zip -o master.zip
    unzip master.zip -d .
    rm master.zip
    cp -r maml-template-${template}-master/assets .
    cp -r maml-template-${template}-master/controllers .
    cp -r maml-template-${template}-master/models .
    cp -r maml-template-${template}-master/views .
    cp -r maml-template-${template}-master/package.json .
    rm -rf maml-template-${template}-master
    yarn install
  `);
}

if (fs.readdirSync('.').length === 0) {
  init();
} else {
  console.error('Directory is non-empty')
}
