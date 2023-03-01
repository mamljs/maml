import fs from 'fs';

import {run} from './utils';

const init = options => {
  if (fs.readdirSync('.').length > 0) {
    console.error('Directory is non-empty');
    return;
  }
  const {template} = options;
  console.log(`Website initializing with template '${template}'`);
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
};

export default init;
