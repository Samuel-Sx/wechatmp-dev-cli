const path = require('path');
const gulp = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const miniImg = require('gulp-imagemin');
const rename = require('gulp-rename');
const cache = require('gulp-cache');
const autoprefixer = require('autoprefixer');
const watch = require('gulp-watch');

const projectroot = path.join(__dirname, './miniprogram')

gulp.task('wxss', () => {
    return gulp.src([
        `${projectroot}/**/*.less`,
        `!${projectroot}/node_modules/**/*.less`,
        `!${projectroot}/miniprogram_npm/**/*.less`
    ])
        .pipe(less())
        .pipe(postcss([autoprefixer()]))
        .pipe(rename(path => {
            path.extname = '.wxss'
        }))
        .pipe(gulp.dest(file => {
            return file.base; // 输出到原目录
        }))
})

gulp.task('imgmin', () => {
    return gulp.src(`${projectroot}/assets/images/**/*.{png,jpe?g,gif,svg}`)
        .pipe(cache(miniImg([
            miniImg.gifsicle({ interlaced: true }),
            miniImg.jpegtran({ progressive: true }),
            miniImg.optipng({ optimizationLevel: 4 }),
            miniImg.svgo({
                plugins: [
                    { removeDimensions: true }
                ],
            }),
        ])))
        .pipe(gulp.dest((file) => {
            return file.base; // 输出到原目录
        }));
})

gulp.task('dev', () => {
    watch(`${projectroot}/**/*.less`, gulp.series('wxss'));
});