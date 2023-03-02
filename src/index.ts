#! /usr/bin/env ts-node
import {program} from 'commander';

import init from './init';
import build from './build';

program
  .name('maml')
  .version(require('../package.json').version)
  .description('Static website generator taking markdown and yaml as input.');

program
  .command('init')
  .description('initialize a new website')
  .option('-t, --template <template>', 'specify website template', 'default')
  .action(options => {
    init(options);
  });

program
  .command('build', {isDefault: true})
  .description('build the website')
  .option('-i, --input <input>', 'specify input directory', '.')
  .option('-o, --output <output>', 'specify output directory', 'dist')
  .option('-w, --watch', 'turn on watch mode')
  .action(options => {
    build(options);
  });

program.parse();
