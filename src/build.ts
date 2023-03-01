import path from 'path';
import fs from 'fs';
import {debounce} from 'lodash';

import {buildPages} from './pages';
import {logInfo, logSuccess, run} from './utils';

const buildOnce = async (input, output) => {
  logInfo(`${new Date()}`);
  await buildPages(input, output);
  // copy assets
  run(`cp -r ${path.join(input, 'assets', '*')} ${output}/`);
  logSuccess(`${new Date()}`);
};

const build = async options => {
  const {input, output, watch} = options;
  buildOnce(input, output);
  if (watch) {
    // watch mode
    const debouncedBuild = debounce(buildOnce, 256);
    const outputPath = fs.realpathSync(output);
    fs.watch(input, {recursive: true}, (eventType, filename) => {
      if (!fs.existsSync(path.join(input, filename))) {
        return; // file deleted
      }
      const filePath = fs.realpathSync(path.join(input, filename));
      if (!filePath.startsWith(outputPath)) {
        debouncedBuild(input, output);
      }
    });
  }
};

export default build;
