var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    del = require('del'),
    revDistClean = require('gulp-rev-dist-clean'),
    revAll = require('gulp-rev-all'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync').create('Gulp server'),
    htmlmin = require('gulp-htmlmin');

// 自定义配置
config = {
    baseUrl: (process.env.NODE_ENV == 'developement') ? 'https://www.codezm.com/' : 'https://www.example.com/',
};

// html task
function html(cb) {
    // more options, see @link https://github.com/kangax/html-minifier#options-quick-reference
    var options = {
        collapseWhitespace: true, // 压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input type="checkbox" checked="checked"> => <input type="checkbox" checked>
        removeComments: true, // 删除HTML注释
        removeEmptyAttributes: true, // 删除所有带有仅空格值的属性 <div id=""></div> => <div></div>
        removeScriptTypeAttributes: true, // 将 type="text/javascript" 从script标签中删除, 其他 type 属性值保持不变
        removeStyleLinkTypeAttributes: true, // type="text/css" 从style和link标签中删除, 其他 type 属性值保持不变
        minifyJS: true, // 压缩页面中的JS
        minifyCSS: true, // 压缩页面中的CSS
        removeEmptyElements: true, // 删除所有内容为空的元素 <div><p>  </p></div> => <div></div>
        keepClosingSlash: true, // 在单例元素上保留斜线, 即 <br /> => <br/>
    }

    return gulp.src('./src/*.html', { since: gulp.lastRun(html) })
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist/'))
}

// copy task, 处理第三方库文件
function copy(cb) {
    return gulp.src('./src/lib/**/*')
        .pipe(gulp.dest('./dist/lib'))

}

// javascript task
function script(cb) {
    return gulp.src('./src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
}

// css task
function css(cb) {
    var plugins = [
        autoprefixer(
            {
                // 更多选项配置详见：@link https://github.com/postcss/autoprefixer#options
                // css 未压缩是否美化属性，默认值: true
                cascade: false,
                // (boolean): 是否应该加前缀，默认值为：true
                add: true,
                // 是否移除不必要（过时）的前缀，默认值: true
                remove: true,
                // 是否为Grid布局属性添加IE前缀，默认值为：true
                grid: true,
                // 是否为"@supports"属性添加前缀，默认值为：true
                supports: true,
                // flexbox (boolean|string): 是否为flexbox属性是否为IE的添加前缀，默认值为：true。如果值为"no-2009"，那么只会为最终和IE规范添加前缀。
                flexbox: true,
                browsers: ['last 3 version']
            }
        ),
        cssnano()
    ]

    return gulp.src('src/css/**/*')
        .pipe(
            postcss(plugins)
        )
        .pipe(gulp.dest("dist/css"));
}

// images task
function images(cb) {
    return gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
}

// clean task
function clean(cb) {
    return del('./dist')
}

// rev dist clean
function rev_dist_clean(cb) {
    return gulp.src([
            './dist/**/*',
            '!./dist/**/*.html',
            '!dist/lib/*',
        ])
        .pipe(
            revDistClean('./src/rev-manifest.json', {
                keepOriginalFiles: false
            })
        )
}

// 给文件加个 hash
function rev_all() {
    // More options, see @link https://www.npmjs.com/package/gulp-rev-all#options
    var options = {
        //prefix: config.baseUrl, // html文件的css，js地址一般是相对路径，用此参数可配置前缀，一般用于设置CDN的前缀。
        dontGlobal: [ /^favicon.ico$/ ], // 不要做任何处理
        dontRenameFile: [ /\.html$/ ], // 不要加hash重命名，但是可以修改内部引用地址
        fileNameManifest: "rev-manifest.json", // 设置revAll.manifestFile()产生的文件名称，默认: rev-manifest.json
        hashLength: 8, // 追加的hash的长度，默认是8
        includeFilesInManifest: ['.css', '.js', '.jpg', '.png', '.jpeg', '.webp', '.gif', '.svg'], // 指定rev-manifest.json中可以有哪些类型，即不是对所有文件都生成一个Map，默认: ['.css', '.js']
        // 将路径中的一部分替换掉
        //transformPath: function (rev, source, path) {
            //// on the remote server, image files are served from `/images`
            //return rev.replace('/imgs', '/images').replace('/js', '/script');
        //},
        // 改变默认的命名规则（文件名+hash+后缀 可修改顺序）, 如果想更改命名规则，请确认是否已加载 var path = require("path");
        //transformFilename: function (file, hash) {
            //var ext = path.extname(file.path);

            //return hash.substr(0, 5) + '.'  + path.basename(file.path, ext) + ext; // ${filename}.${ext} => ${hash}.${filename}.${ext}
        //}
    }

    //return gulp.src('./src/**/*', { since: gulp.lastRun(rev_all) })
    return gulp.src(['./dist/**/*', '!./dist/lib/*'])
        .pipe(revAll.revision(options))
        .pipe(gulp.dest('./dist/'))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest('./src/'))
}

// watch task
watch = (cb) => {
    gulp.watch(['./src/**/*', '!src/rev-manifest.json'] , {
        events: 'all',
        ignoreInitial: false
    }, gulp.series(
        clean,
        html,
        script,
        css,
        images,
        copy,
        rev_all,
        rev_dist_clean,
        browserReload
    ))

    cb()
}

// browser server task
function browserServer() {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html",
        },
        host: 'localhost',
        port: 4000,
    })
}

// browser reload task
function browserReload(cb) {
    browserSync.reload()

    cb()
}

module.exports = {
    default: gulp.parallel(watch, browserServer),
    build: gulp.series(
        clean,
        html,
        script,
        css,
        images,
        copy,
        rev_all,
        rev_dist_clean,
    )
}
