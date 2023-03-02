import glob from 'glob';
import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';
import nunjucks from 'nunjucks';
import {merge, initial, tail, dropWhile, sortBy} from 'lodash';

let pages = {};

class Page {
  input: string;
  output: string;
  pathname: string;
  markdown: string;
  view: string;

  constructor(input: string, output: string, pathname: string) {
    this.input = input;
    this.output = output;
    this.pathname = pathname;
    this._loadConfig();
  }

  _loadConfig() {
    this.markdown = fs.readFileSync(
      path.join(this.input, 'models', this.pathname, 'index.md'),
      'utf8'
    );
    let config = yaml.load(
      fs.readFileSync(
        path.join(this.input, 'models', this.pathname, 'index.yml'),
        'utf8'
      )
    );
    const parentPage = this._parentPage();
    if (parentPage) {
      config = merge(JSON.parse(JSON.stringify(parentPage)), config);
      delete config.pathname;
      delete config.markdown;
    }
    for (const key of Object.keys(config)) {
      this[key] = config[key];
    }
  }

  _parentPage() {
    const tokens = this.pathname.split('/').filter(t => t !== '');
    if (tokens.length === 0) {
      return undefined;
    }
    const parentTokens = initial(tokens);
    const parentPath =
      parentTokens.length === 0 ? '/' : `/${parentTokens.join('/')}/`;
    return pages[parentPath];
  }

  build() {
    const htmlFile = path.join(this.output, this.pathname, 'index.html');
    const html = nunjucks.render(`${this.view}.html`, {
      page: this,
      pages: pages,
    });
    fs.mkdirSync(path.dirname(htmlFile), {recursive: true});
    fs.writeFileSync(htmlFile, html);
  }
}

export const buildPages = async (input, output) => {
  nunjucks.configure(path.join(input, 'views'), {autoescape: false});

  const files = glob.globSync(path.join(input, 'models/**/index.md'));
  const pathnames = sortBy(
    files.map(f => tail(dropWhile(initial(f.split('/')), i => i !== 'models'))),
    item => item.length
  )
    .map(items => items.join('/'))
    .map(item => (item === '' ? '/' : `/${item}/`));

  pages = {};
  for (const pathname of pathnames) {
    pages[pathname] = new Page(input, output, pathname);
  }

  for (const page of Object.values<any>(pages)) {
    const action = (
      await import(path.resolve(input, 'controllers', page.controller))
    )[page.action];
    action(page, pages);
  }
};
