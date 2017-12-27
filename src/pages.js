const glob = require('glob')
const R = require('ramda')
const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')
const nunjucks = require('nunjucks')

let pages = {}

class Page {
  constructor (input, output, pathname) {
    this.input = input
    this.output = output
    this.pathname = pathname
    this._loadConfig()
  }

  _loadConfig () {
    this.markdown = fs.readFileSync(path.join(this.input, 'models', this.pathname, 'index.md'), 'utf8')
    let config = yaml.safeLoad(fs.readFileSync(path.join(this.input, 'models', this.pathname, 'index.yml'), 'utf8'))
    const parentPage = this._parentPage()
    if (parentPage) {
      config = R.merge(parentPage, config)
      delete config.pathname
      delete config.markdown
    }
    R.pipe(
      R.keys,
      R.forEach(key => { this[key] = config[key] })
    )(config)
  }

  _parentPage () {
    const tokens = R.pipe(
      R.split('/'),
      R.reject(R.isEmpty)
    )(this.pathname)
    if (R.isEmpty(tokens)) {
      return undefined
    }
    const parentTokens = R.init(tokens)
    const parentPath = R.isEmpty(parentTokens) ? '/' : `/${parentTokens.join('/')}/`
    return pages[parentPath]
  }

  build () {
    console.log('build page')
    // todo: write to file system
  }
}

exports.buildPages = (input, output) => {
  nunjucks.configure(path.join(input, 'views'), { autoescape: false })

  const files = glob.sync(path.join(input, 'models/**/index.md'))
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
    R.map(
      R.pipe(
        R.join('/'),
        (item) => item === '' ? '/' : `/${item}/`
      )
    )
  )(files)

  pages = {}
  R.forEach(pathname => {
    pages[pathname] = new Page(input, output, pathname)
  }, pathnames)
  // console.log(pages)

  R.pipe(
    R.values,
    R.forEach(page => {
      const action = require(path.resolve(input, 'controllers', page.controller))[page.action]
      action(page, pages)
    })
  )(pages)
}
