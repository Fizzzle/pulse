
// Определяем переменную "preprocessor"
let preprocessor = 'sass'; 
 
// Определяем константы Gulp
const { src, dest, parallel, series, watch } = require('gulp');
 
// Подключаем Browsersync
const browserSync = require('browser-sync').create();
 
// Подключаем gulp-concat
const concat = require('gulp-concat');
 
// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;
 
// Подключаем модули gulp-sass и gulp-less
const sass = require('gulp-sass')(require('sass'));
const less = require('gulp-less');
 
// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');
 
// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css');
 
// Подключаем compress-images для работы с изображениями
const imagecomp = require('compress-images');
 
// Подключаем модуль del
const del = require('del');
 
// Определяем логику работы Browsersync
function browsersync() {
	browserSync.init({ // Инициализация Browsersync
		server: { baseDir: 'src/' }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true // Режим работы: true или false
	})
}
 
// function scripts() {
// 	return src([ // Берем файлы из источников
// 		'node_modules/jquery/dist/jquery.min.js', // Пример подключения библиотеки
// 		'src/js/app.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
// 		])
// 	.pipe(concat('main.min.js')) // Конкатенируем в один файл
// 	.pipe(uglify()) // Сжимаем JavaScript
// 	.pipe(dest('src/js/')) // Выгружаем готовый файл в папку назначения
// 	.pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
// }
 
function styles() {
	return src('src/' + preprocessor + '/style.' + preprocessor + '') // Выбираем источник: "src/sass/main.sass" или "src/less/main.less"
	.pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
	.pipe(concat('style.min.css')) // Конкатенируем в файл src.min.js
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
	.pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
	.pipe(dest('src/css/')) // Выгрузим результат в папку "src/css/"
	.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}
 
async function images() {
	imagecomp(
		"src/img/*", // Берём все изображения из папки источника
		"dist/img/*", // Выгружаем оптимизированные изображения в папку назначения
		{ compress_force: false, statistic: true, autoupdate: true }, false, // Настраиваем основные параметры
		{ jpg: { engine: "mozjpeg", command: ["-quality", "75"] } }, // Сжимаем и оптимизируем изображеня
		{ png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
		{ svg: { engine: "svgo", command: "--multipass" } },
		{ gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
		function (err, completed) { // Обновляем страницу по завершению
			if (completed === true) {
				browserSync.reload()
			}
		}
	)
}
 
function cleanimg() {
	return del('app/images/dest/**/*', { force: true }) // Удаляем все содержимое папки "app/images/dest/"
}
 
// function buildcopy() {
// 	return src([ // Выбираем нужные файлы
// 		'app/css/**/*.min.css',
// 		'app/js/**/*.min.js',
// 		'app/images/dest/**/*',
// 		'app/**/*.html',
// 		], { base: 'app' }) // Параметр "base" сохраняет структуру проекта при копировании
// 	.pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
// }
 
function cleandist() {
	return del('dist/**/*', { force: true }) // Удаляем все содержимое папки "dist/"
}
 
function startwatch() {
 
	// Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
	// watch(['src/**/*.js', '!src/**/*.min.js'], scripts);
	
	// Мониторим файлы препроцессора на изменения
	watch('src/**/' + preprocessor + '/**/*', styles);
 
	// Мониторим файлы HTML на изменения
	watch('src/**/*.html').on('change', browserSync.reload);
 
	// Мониторим папку-источник изображений и выполняем images(), если есть изменения
	watch('src/images/src/**/*', images);
 
}
 
// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;
 
// Экспортируем функцию scripts() в таск scripts
// exports.scripts = scripts;
 
// Экспортируем функцию styles() в таск styles
exports.styles = styles;
 
// Экспорт функции images() в таск images
exports.images = images;
 
// Экспортируем функцию cleanimg() как таск cleanimg
exports.cleanimg = cleanimg;
 
// Создаем новый таск "build", который последовательно выполняет нужные операции
// exports.build = series(cleandist, styles, images, buildcopy);
 
// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, browsersync, startwatch);