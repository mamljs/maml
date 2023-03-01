import glob from 'glob';
import R from 'ramda';
import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';
import nunjucks from 'nunjucks';

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
      config = R.mergeRight(parentPage, config);
      delete config.pathname;
      delete config.markdown;
    }
    R.pipe(
      R.keys,
      R.forEach(key => {
        this[key] = config[key];
      })
    )(config);
  }

  _parentPage() {
    const tokens = R.pipe(R.split('/'), R.reject(R.isEmpty))(this.pathname);
    if (R.isEmpty(tokens)) {
      return undefined;
    }
    const parentTokens = R.init(tokens);
    const parentPath = R.isEmpty(parentTokens)
      ? '/'
      : `/${parentTokens.join('/')}/`;
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
  const pathnames = R.pipe(
    R.map(
      R.pipe(
        R.split('/'),
        R.init,
        R.dropWhile(item => item !== 'models'),
        R.tail
      )
    ),
    R.sortBy(item => item.length),
    R.map(R.pipe(R.join('/'), item => (item === '' ? '/' : `/${item}/`)))
  )(files);

  pages = {};
  R.forEach(pathname => {
    pages[pathname] = new Page(input, output, pathname);
  }, pathnames);

  for (const page of Object.values<any>(pages)) {
    const action = (
      await import(path.resolve(input, 'controllers', page.controller + '.js'))
    )[page.action];
    action(page, pages);
  }

  // R.pipe(
  //   R.values,
  //   R.forEach(async page => {
  //     const action = (
  //       await import(
  //         path.resolve(input, 'controllers', page.controller + '.js')
  //       )
  //     )[page.action];
  //     action(page, pages);
  //   })
  // )(pages);
};
