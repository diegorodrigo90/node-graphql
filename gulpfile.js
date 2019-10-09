const { dest, src, series, parallel, watch } = require('gulp')
const clean = require('gulp-clean')
const ts = require('gulp-typescript')
const camelcase = require('gulp-camelcase')

const tsProject = ts.createProject('tsconfig.json')
const watcher = watch(['src/**/*.*'], (clear, staticFiles, build))

function build () {
  const tsResult = tsProject.src().pipe(tsProject())

  return tsResult.js.pipe(dest('dist')).pipe(camelcase())
}

function staticFiles () {
  return src(['src/**/*.json'], ['src/**/*.ts']).pipe(dest('dist'))
}

function clear () {
  return src('dist', { read: false, allowEmpty: true }).pipe(clean())
}

watcher.on('change', function (path, stats) {
  console.log(` ${path} modificado`)
})

watcher.on('add', function (path, stats) {
  console.log(` ${path} adicionado`)
})

watcher.on('unlink', function (path, stats) {
  console.log(` ${path} removido`)
})

async function stopWatcher () {
  watcher.close()
}

exports.default = (series(clear, parallel(staticFiles, build), stopWatcher))

exports.compile = (series(clear, parallel(staticFiles, build)))
