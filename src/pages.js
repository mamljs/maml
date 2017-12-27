const glob = require('glob')
const R = require('ramda')
const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')

let pages = {}

class Page {
  constructor (input, pathname) {
    this.pathname = pathname
    const config = yaml.safeLoad(fs.readFileSync(path.join(input, 'models', pathname, 'index.yml'), 'utf8'))
    R.pipe(
      R.keys,
      R.forEach(key => { this[key] = config[key] })
    )(config)
  }
}

const loadPages = input => {
  pages = {}

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

  R.forEach(pathname => {
    pages[pathname] = new Page(input, pathname)
  }, pathnames)

  return pages
}

module.exports = { loadPages }
