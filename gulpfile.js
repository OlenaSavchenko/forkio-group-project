const { src, dest, watch, series, parallel } = require('gulp');
// Общие плагины
const sourcemaps = require('gulp-sourcemaps');         //source maps для дебага миниф.кода
const concat = require('gulp-concat');                 //объединение файлов  
const browserSync = require('browser-sync').create();  //browserSync
const del = require('del');                            //удаление папок/файлов
const rename = require('gulp-rename');                 //переименование
const newer = require('gulp-newer');                   //проверка на то, были ли манипуляции с элементом ранее
// Стили
const sass = require('gulp-sass');                     //SCSS компилятор 
const autoprefixer = require('gulp-autoprefixer');     //вендорные префиксы
const cleancss = require('gulp-clean-css');            //минификация стилей
const purgecss = require('gulp-purgecss')              //удаление неиспользуемого кода
const ttfToWoff2 = require('gulp-ttf2woff2');          //конвертирование шрифтов в woff2
const ttfToWoff = require('gulp-ttf2woff');            //конвертирование шрифтов в woff
// Изображения
const imageMin = require('gulp-imagemin');             //сжатие картинок
// Скрипты
const uglify = require('gulp-uglify-es').default;      //сжатие js
//Html
const fileInclude = require('gulp-file-include');      //импорт html файлов в главный html


// Html страницы
function combineHtml() {
   return src('src/html/index.html')
      .pipe(fileInclude({
         prefix: '@@',
         basepath: '@file'
      }))
      .pipe(dest('./'))
      .pipe(browserSync.stream())

}


// Конвертирование шрифтов
function convertFonts() {
   src('src/fonts/*.ttf')
      .pipe(ttfToWoff2())
      .pipe(dest('dist/fonts/'))

   return src('src/fonts/*.ttf')
      .pipe(ttfToWoff())
      .pipe(dest('dist/fonts/'))

}

// Манипуляция с SCSS для дев версии с sourcemaps
function compilStylesDev() {
   return src('./src/scss/main.scss')
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sass().on('error', sass.logError))
      .pipe(rename({ suffix: '.min' }))
      .pipe(autoprefixer({ overrideBrowserslist: ['last 3 versions'] }))
      .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
      .pipe(sourcemaps.write())
      .pipe(dest('./dist/css/'))
      .pipe(browserSync.stream())
}

// Манипуляция с SCSS для продакшн версии без sourcemaps и c очисткой неиспользуемых стилей
function compilStylesProd() {
   return src('./src/scss/main.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(rename({ suffix: '.min' }))
      .pipe(autoprefixer({ overrideBrowserslist: ['last 3 versions'] }))
      .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
      .pipe(purgecss({ content: ['index.html', 'src/js/**/*.js'] }))
      .pipe(dest('./dist/css/'))
}

// Сжатие картинок(c пропуском уже сжатых)
function compressImgs() {
   return src('src/img/**/*')
      .pipe(newer('dist/img/'))
      .pipe(imageMin())
      .pipe(dest('dist/img/'));
}

// Манипуляции с JS для дев версии с sourcemaps
function scriptsDev() {
   return src('src/js/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(concat('script.min.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(dest('dist/js/'))
      .pipe(browserSync.stream())
}
// Манипуляции с JS для продакшн версии без sourcemaps
function scriptsProd() {
   return src('src/js/**/*.js')
      .pipe(concat('script.min.js'))
      .pipe(uglify())
      .pipe(dest('dist/js/'))
}

// Настройки Browsersync
function browserChanges() {
   return browserSync.init({
      server: {
         baseDir: './'
      }
   })
}

// Очищение папки dist
function cleanDist() {
   return del('dist/**/*');
}

// Отслеживание изменений
function startWatch() {
   watch(['src/scss/**/*.scss'], compilStylesDev);          //стили
   watch(['src/html/**/*.html'], combineHtml).on('change', browserSync.reload);    //html
   watch('src/js/**/*.js', scriptsDev);                     //скрипты
   watch('src/img/**/*', compressImgs);                     //картинки
   watch('src/fonts/**/*', convertFonts);                   //шрифты
}


exports.dev = parallel(combineHtml, compilStylesDev, scriptsDev, compressImgs, convertFonts, browserChanges, startWatch);    //Для дев версия
exports.build = series(cleanDist, combineHtml, compilStylesProd, scriptsProd, compressImgs, convertFonts);                     //Для прод версии