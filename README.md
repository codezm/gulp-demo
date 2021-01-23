前端自动化构建工具之 Gulp
=========================

#### 快速使用
##### 安装依赖库
```bash
$ git clone https://github.com/codezm/gulp-demo.git
$ cd gulp-demo
$ cnpm install

# 或者您也可以手动安装
$ cnpm install --save-dev \
            gulp \
            gulp-cli \
            gulp-htmlmin \
            gulp-rev-all \
            gulp-rev-dist-clean \
            del \
            gulp-uglify \
            gulp-babel \
            @babel/core \
            @babel/preset-env \
            browser-sync \
            gulp-postcss \
            cssnano \
            autoprefixer \
            gulp-imagemin \
            cross-env
```

在 `src` 目录下编写项目代码。

##### 开发模式 - 实时构建
```bash
$ npm run dev
```

##### 正式发布 - 打包
```bash
$ npm run build
```

#### 开篇

Grunt、Gulp、Webpack，更多构建工具参考对比详见 [前端构建：3类13种热门工具的选型参考](https://segmentfault.com/a/1190000017183743) 。

也可以参考下这篇文章： [2020年，gulp 有哪些功能是 webpack 不能替代的？](https://www.zhihu.com/question/45536395)

#### 起因

项目线上后，静态资源 (HTML、CSS、JavaScript、Images) 因需求变动或解决问题，需要重新覆盖线上文件，但覆盖 (因：服务端会对静态资源做缓存处理，诸如：css、js、images、fonts、txt 之类) 后，之前已经加载过这个页面的浏览器不能马上响应新的变更。主要是因为本地浏览器根据服务端的响应规则给缓存了，而要解决这个问题也很简单，就是在引用静态资源的 `URL` 地址后面追加个参数，这个参数可以是固定的、也可以是变动的，加了这个参数后浏览器就不会使用本地缓存来渲染页面了。

原始资源引用

```html
<script src="https://www.example.com/assets/js/public.js"></script>
```

给引用资源增加个版本号

```html
<script src="https://www.example.com/assets/js/public.js?v=1.0.0"></script>
```



固定的参数每次改动引用的静态资源都要保证后缀与上次设置不一致，要不然没法保证哪些用户浏览器已经加载过页面了，使用的是非本地缓存。而变动的虽然省去的每次修改代码变更 `URL` 参数的麻烦，同样也失去了用户端浏览器本地缓存的功能，每次都会向服务器发起请求。

#### Gulp 能做什么？

首先，它能解决上面的问题，那怎么解决的呢？这需要个 `Gulp `的插件 `gulp-rev-all`，它会给静态资源文件名添加个 `hash` 值，这个 `hash` 值是基于文件内容的，也就是说假设文件内容更改了，那就会生成一个新的 `hash` 值。这样也就解决了浏览器缓存问题。

那它还能做什么？

- 性能优化

  我们都知道浏览器请求的文件越多越耗时，请求的文件越大越耗时。为了代码更清晰，结构更合理，我们就会有很多 JS 文件，无疑又拖慢了网页的速度。为了解决这个问题，因此我们需要做两件事

  - 文件合并

    浏览器需要下载多个JS文件，而浏览器是有并发限制，也就是同时并发只能下载几个文件，假如浏览器并发数是5，你有20个JS文件，而每5个需要2S, 那么你光下载JS文件都需要8S，那么网页的性能可想而知，所以我们需要合并多个文件以减少文件的数量。

  - 文件压缩

    我们知道文件越大，下载越慢，而针对JavaScript和CSS, 里面的空格，换行这些都是为了让我们读代码时更容易阅读，但是对机器来说，这些对它没有影响，所以为了减少文件大小，一般的情况我们都会用工具去掉空格和换行，有时候我们还会用比较短的变量名(记住这个要让工具最后压缩时做，而源代码一定要保证命名可读性) 来减少文件大小。

- 效率提升

  - Vender CSS 前缀

    在 CSS3 使用越来越多的时候，我们都知道一些CSS的特性，不同的浏览器 CSS 有不同的前缀，如果我们手工添加将会很繁琐，而如果使用构建工具，很多构建工具可以自动添加 CSS 的 Vendor 前缀

    - [为什么需要浏览器引擎前缀](https://www.webhek.com/post/vendor-prefixes.html)

    - [浏览器引擎前缀 | MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/Vendor_Prefix)

  - 单元测试

    单元测试是质量保证的一个很重要的手段，所以在上传代码之前，使用构建工具自动跑一遍我们的单元测试是非常重要的。

  - 代码分析

    写的JavaScript很多时候会有一些潜在的bug, 比如忘了添加分号，某个变量没有等等，使用一些JavaScript的代码分析工具，可以很好的帮我们检查一些常见的问题。



根据文件类型可以做哪些处理

- HTML
  - [gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin)  HTML 代码压缩处理。
- Images
  - 图片压缩处理
  - 雪碧图
    - [gulp.spritesmith](https://www.npmjs.com/package/gulp.spritesmith)
- JavaScript
  - 代码压缩处理
  - ES6 新语法转换(To ES5)
  - Eslint 检测
  - 单元测试
- CSS
  - 代码压缩处理
  - Vender Css prefixes
  - Less、Sass 转换

#### 安装、入门操作

1. 检查 `node`、`npm` 和 `npx` 是否正确安装，详见： [nodejs 官网](https://nodejs.org/en/)

   ```bash
   $ node --version
   $ npm --version
   $ npx --version
   ```

2. 安装 `gulp` 命令行工具

   ```
   $ npm install --global gulp
   ```

3. 初始化项目

   ```bash
   $ mkdir gulp-demo
   $ cd gulp-demo
   $ npm init -y
   ```

4. 安装 `gulp` 作为开发时依赖项

   ```bash
   $ npm install --save-dev gulp
   ```

5. 创建 `gulpfile.js` 文件

   ```javascript
   function defaultTask(cb) {
     // place code for your default task here
     cb();
   }
   
   exports.default = defaultTask
   ```

6. 运行

   ```bash
   $ gulp
   ```

   如需运行多个任务（task），可以执行 `gulp <task> <othertask>`。

7. 输出结果
   默认任务（task）将执行，因为任务为空，因此没有实际动作。

   ![Output: Starting default & Finished default](https://gulpjs.com/img/docs-gulp-command.png)

当然命令行工具也可以本地安装：

```bash
$ npm intall --save-dev gulp-cli
```

运行方式则变成了：

```bash
$ npx gulp
```



#### JavaScript 和 Gulpfile

Gulp 允许使用现有 JavaScript 知识来书写 gulpfile 文件，或者利用所掌握的 gulpfile 经验来书写普通的 JavaScript 代码。虽然gulp 提供了一些实用工具来简化文件系统和命令行的操作，但是所编写的其他代码都是纯 JavaScript 代码。

##### Gulpfile 详解

gulpfile 是项目目录下名为 `gulpfile.js` （或者首字母大写 `Gulpfile.js`，就像 Makefile 一样命名）的文件，在运行 `gulp` 命令时会被自动加载。在这个文件中，你经常会看到类似 `src()`、`dest()`、`series()` 或 `parallel()` 函数之类的 gulp API，除此之外，纯 JavaScript 代码或 Node 模块也会被使用。任何导出（export）的函数都将注册到 gulp 的任务（task）系统中。



#### Demo 演示

##### 目录结构

```tex
src/
├── css
│   └── index.css
├── fonts
│   ├── glyphicons-halflings-regular.eot
│   ├── glyphicons-halflings-regular.svg
│   ├── glyphicons-halflings-regular.ttf
│   └── glyphicons-halflings-regular.woff
├── images
│   └── example.jpg
├── js
│   ├── calculator
│   │   ├── addition.js
│   │   ├── division.js
│   │   ├── multiply.js
│   │   └── subtraction.js
│   └── index.js
├── lib
│   └── jquery.min.js
└── index.html
```



##### 示例项目代码

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <style>
        div {
            font-size:14px;
        }
    </style>

    <link rel="stylesheet" href="css/index.css">
</head>
<body>
    <!-- container -->
    <div class="  " id="" data-url=" "   data-name=" " style="font-size:20px; margin:0 auto; text-align:center; margin-top:20%">
        <div>
            <img src="images/example.jpg" alt="">
        </div>

        Gulp 演示 7<br />
        <input type="checkbox" checked="checked">Hello World!
        <div>
            <p>  </p>
        </div>
    </div>

    <script src="js/index.js" type="text/javascript"></script>
    <script src="js/calculator/addition.js" type="text/javascript"></script>

    <script type="text/javascript">
        // 计算器: 加
        console.log(addition(1, 1))
    </script>
</body>
</html>
```



##### HTML 处理

来，上插件:  [gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin)

```bash
$ npm install --save-dev gulp-htmlmin
```

vim gulpfile.js

```javascript
var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin');
 
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

module.exports = {
    default: html
}
```

执行构建命令

```shell
$ gulp

# 或者通过 npx 命令执行本地 gulp-cli
$ npx gulp
```

index.html 构建后内容

```html
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>body{font-size:14px}img{height:100px;width:100px}</style></head><body><div data-url=" " data-name=" " style="font-size:20px;margin:0 auto;text-align:center;margin-top:20%"><div><img src="img/example.jpg" alt=""></div>Gulp 演示<br/><input type="checkbox" checked>Hello World!<div></div></div><script src="js/calculator/addition.js"></script><script>console.log(addition(1,1))</script></body></html>
```



开发完，总不能每每都要手动执行构建吧？这个时候 [`gulp.watch`](https://www.gulpjs.com.cn/docs/api/watch/) 就派上用场了。

vim gulpfile.js

```javascript
var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin');
 
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

// watch task
watch = (cb) => {
    gulp.watch('./src/**/*.html' , {
        events: 'all',
        ignoreInitial: false
    }, gulp.series(
        html
    ))

    cb()
}

module.exports = {
    default: watch
}
```

监听文件事件自动构建的问题解决了，但没修改完代码都需要刷新下浏览器，好烦啊。。。

来，上插件:  [browser-sync](https://www.npmjs.com/package/browser-sync)

```bash
$ npm install --save-dev browser-sync
```

vim gulpfile.js

```javascript
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    htmlmin = require('gulp-htmlmin');

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

// watch task
watch = (cb) => {
    gulp.watch('./src/**/*.html' , {
        events: 'all',
        ignoreInitial: false
    }, gulp.series(
        html,
      	browserReload
    ))

    cb()
}

// browser server task
function browserServer(cb) {
    browserSync({
        server: {
            baseDir: "dist"
        }
    })
    cb()
}

// browser reload task
function browserReload(cb) {
    browserSync.reload()
    cb()
}

module.exports = {
    default: gulp.series(watch, browserServer)
}
```

改下 html 代码，瞅下浏览器，完美...

##### JavaScript 处理

我们可以使用 [`gulp-uglify`](https://www.npmjs.com/package/gulp-uglify) 插件来对 `JavaScript` 文件进行压缩。如果想使用 `ES6` 语法新特性，则可以使用 [`gulp-babel`](https://www.npmjs.com/package/gulp-babel) 插件转换成 `ES5` 代码。

```
$ npm install --save-dev gulp-uglify

# Babel 7
$ npm install --save-dev gulp-babel @babel/core @babel/preset-env

# Babel 6
$ npm install --save-dev gulp-babel@7 babel-core babel-preset-env
```

vim gulpfile.js

```javascript
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync'),
    htmlmin = require('gulp-htmlmin');

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

// javascript task
function script(cb) {
    // 处理第三方库文件
    gulp.src('./src/lib/**/*.js')
        .pipe(gulp.dest('./dist/lib'))

    return gulp.src('./src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
}

// watch task
watch = (cb) => {
    gulp.watch('./src/**/*.html' , {
        events: 'all',
        ignoreInitial: false
    }, gulp.series(
        html,
      	browserReload
    ))

    gulp.watch('./src/**/*.js' , {
        events: 'all',
        ignoreInitial: false
    }, gulp.series(
        script,
      	browserReload
    ))

    cb()
}

// browser server task
function browserServer(cb) {
    browserSync({
        server: {
            baseDir: "dist"
        }
    })
    cb()
}

// browser reload task
function browserReload(cb) {
    browserSync.reload()
    cb()
}

module.exports = {
    default: gulp.series(watch, browserServer)
}
```

为了能看出 `babel` 转换的效果，我们创建个 `index.js` 文件

vim src/js/index.js

```javascript
var output = (msg) => {
    console.log(msg)
}

//var output = function (msg) {
    //console.log(msg)
//}

output('Hello World, From by index.js!')
```

执行构建命令后，原来的 `index.js` 代码就会被转化并压缩成这样：

vim dist/js/index.js

```javascript
"use strict";var output=function(o){console.log(o)};output("Hello World, From by index.js!");
```

那我们如何实现在每次编辑 `src/js/index.js` 时，引用它的 `html` 页面给加个 `hash` 戳，避免浏览器缓存呢？

这时我们可以通过 [`gulp-rev-all`](https://www.npmjs.com/package/gulp-rev-all) 插件来达到我们的目的。首先，我们通过执行以下命令来安装这个插件。

```bash
 $ npm install --save-dev gulp-rev-all
```

vim gulpfile.js

```javascript
var gulp = require('gulp'),
    revAll = require('gulp-rev-all'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync'),
    htmlmin = require('gulp-htmlmin');

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

// javascript task
function script(cb) {
    // 处理第三方库文件
    gulp.src('./src/lib/**/*.js')
        .pipe(gulp.dest('./dist/lib'))

    return gulp.src('./src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
}

// 给文件加个 hash
function rev_all() {
    // More options, see @link https://www.npmjs.com/package/gulp-rev-all#options
    var options = {
        //prefix: 'https://www.example.com/', // html文件的css，js地址一般是相对路径，用此参数可配置前缀，一般用于设置CDN的前缀。
        dontGlobal: [ /^favicon.ico$/ ], // 不要做任何处理
        dontRenameFile: [ /\.html$/ ], // 不要加hash重命名，但是可以修改内部引用地址
        fileNameManifest: "rev-manifest.json", // 设置revAll.manifestFile()产生的文件名称，默认: rev-manifest.json
        hashLength: 8, // 追加的hash的长度，默认是8
        includeFilesInManifest: ['.css', '.js'], // 指定rev-manifest.json中可以有哪些类型，即不是对所有文件都生成一个Map，默认: ['.css', '.js']
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
    gulp.watch('./src/**/*.html' , {
        events: 'all',
        //ignoreInitial: false
    }, gulp.series(
        html,
      	browserReload
    ))

    gulp.watch('./src/**/*.js' , {
        events: 'all',
        ignoreInitial: false
    }, gulp.series(
        script,
        rev_all,
      	browserReload
    ))

    cb()
}

// browser server task
function browserServer(cb) {
    browserSync({
        server: {
            baseDir: "dist"
        }
    })
    cb()
}

// browser reload task
function browserReload(cb) {
    browserSync.reload()
    cb()
}

module.exports = {
    default: gulp.series(watch, browserServer)
}
```



执行构建命令后，`dist/index.html` 文件内容： 

```html
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>body{font-size:14px}img{height:100px;width:100px}</style></head><body><div data-url=" " data-name=" " style="font-size:20px;margin:0 auto;text-align:center;margin-top:20%"><div><img src="img/example.jpg" alt=""></div>Gulp 演示 7<br/><input type="checkbox" checked>Hello World!<div></div></div><script src="js/index.a5bb2424.js"></script><script src="js/calculator/addition.f78b4480.js"></script><script>console.log(addition(1,1))</script></body></html>
```

看起来满足我们的需求了，但这时 `dist` 目录变成了这样：

```
dist
├── index.html
├── js
│   ├── calculator
│   │   ├── addition.f78b4480.js
│   │   ├── addition.js
│   │   ├── division.3e99bad9.js
│   │   ├── division.js
│   │   ├── multiply.e0dfcee8.js
│   │   ├── multiply.js
│   │   ├── subtraction.be5375aa.js
│   │   └── subtraction.js
│   ├── index.5e5e8a83.js
│   └── index.js
└── lib
    └── jquery.min.js
```

额。。。源文件怎么处理呢？我们可以通过使用 [`gulp-rev-dist-clean`](https://www.npmjs.com/package/gulp-rev-dist-clean) 插件来移除源文件。它本质上是使用 `src/rev-manifest.json` 文件来进行比对，然后删除的。

```
$ npm install --save-dev gulp-rev-dist-clean
```

vim gulpfile.js

```javascript
var gulp = require('gulp'),
    // TODO: modify
    revDistClean = require('gulp-rev-dist-clean'),
    revAll = require('gulp-rev-all'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync'),
    htmlmin = require('gulp-htmlmin');

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

// javascript task
function script(cb) {
    // 处理第三方库文件
    gulp.src('./src/lib/**/*.js')
        .pipe(gulp.dest('./dist/lib'))

    return gulp.src('./src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
}

// TODO: modify
// rev dist clean
function rev_dist_clean(cb) {
    return gulp.src([
            './dist/**/*',
            '!./dist/**/*.html',
            '!dist/lib/*'
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
        //prefix: 'https://www.example.com/', // html文件的css，js地址一般是相对路径，用此参数可配置前缀，一般用于设置CDN的前缀。
        dontGlobal: [ /^favicon.ico$/ ], // 不要做任何处理
        dontRenameFile: [ /\.html$/ ], // 不要加hash重命名，但是可以修改内部引用地址
        fileNameManifest: "rev-manifest.json", // 设置revAll.manifestFile()产生的文件名称，默认: rev-manifest.json
        hashLength: 8, // 追加的hash的长度，默认是8
        includeFilesInManifest: ['.css', '.js'], // 指定rev-manifest.json中可以有哪些类型，即不是对所有文件都生成一个Map，默认: ['.css', '.js']
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
    // TODO: modify
    gulp.watch(['./src/**/*', '!src/rev-manifest.json'] , {
        events: 'all',
        ignoreInitial: false
    }, gulp.series(
        html,
        script,
        rev_all,
        rev_dist_clean,
      	browserReload
    ))

    cb()
}

// browser server task
function browserServer(cb) {
    browserSync({
        server: {
            baseDir: "dist"
        }
    })
    cb()
}

// browser reload task
function browserReload(cb) {
    browserSync.reload()
    cb()
}

module.exports = {
    default: gulp.series(watch, browserServer)
}
```

当执行构建命令后，`dist` 目录：

```
dist
├── index.html
├── js
│   ├── calculator
│   │   ├── addition.f78b4480.f78b4480.js
│   │   ├── addition.f78b4480.js
│   │   ├── division.3e99bad9.3e99bad9.js
│   │   ├── division.3e99bad9.js
│   │   ├── multiply.e0dfcee8.e0dfcee8.js
│   │   ├── multiply.e0dfcee8.js
│   │   ├── subtraction.be5375aa.be5375aa.js
│   │   └── subtraction.be5375aa.js
│   ├── index.5e5e8a83.a5bb2424.js
│   └── index.5e5e8a83.js
└── lib
    └── jquery.min.js
```

如果跟随我的步骤一步一步操作，是会变成这样的，这是因为之前的步骤就已经生成了 `index.5e5e8a83.js` 文件，而再次执行便会对这个文件再加个戳。也可以看下 `src/rev-manifest.json` 文件，可以更好的理解其中的缘由：

```
{
  "js/index.5e5e8a83.js": "js/index.5e5e8a83.a5bb2424.js",
  "js/index.js": "js/index.5e5e8a83.js",
  "js/calculator/addition.f78b4480.js": "js/calculator/addition.f78b4480.f78b4480.js",
  "js/calculator/addition.js": "js/calculator/addition.f78b4480.js",
  "js/calculator/division.3e99bad9.js": "js/calculator/division.3e99bad9.3e99bad9.js",
  "js/calculator/division.js": "js/calculator/division.3e99bad9.js",
  "js/calculator/multiply.e0dfcee8.js": "js/calculator/multiply.e0dfcee8.e0dfcee8.js",
  "js/calculator/multiply.js": "js/calculator/multiply.e0dfcee8.js",
  "js/calculator/subtraction.be5375aa.js": "js/calculator/subtraction.be5375aa.be5375aa.js",
  "js/calculator/subtraction.js": "js/calculator/subtraction.be5375aa.js"
}

```

这将导致每构建一次文件的数量就会翻倍的增加，而要解决这个问题，咱们还得用个文件删除的插件 [`del`](https://www.npmjs.com/package/del) ，再每次构建前都先清空下 `dist` 目录。

```bash
$ npm install --save-dev del
```

vim gulpfile.js

```javascript
var gulp = require('gulp'),
    // TODO: modify
    del = require('del'),
    revDistClean = require('gulp-rev-dist-clean'),
    revAll = require('gulp-rev-all'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync'),
    htmlmin = require('gulp-htmlmin');

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

// javascript task
function script(cb) {
    // 处理第三方库文件
    gulp.src('./src/lib/**/*.js')
        .pipe(gulp.dest('./dist/lib'))

    return gulp.src('./src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
}

// TODO: modify
function clean(cb) {
    return del('./dist')
}

// rev dist clean
function rev_dist_clean(cb) {
    return gulp.src([
            './dist/**/*',
            '!./dist/**/*.html',
            '!dist/lib/*'
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
        //prefix: 'https://www.example.com/', // html文件的css，js地址一般是相对路径，用此参数可配置前缀，一般用于设置CDN的前缀。
        dontGlobal: [ /^favicon.ico$/ ], // 不要做任何处理
        dontRenameFile: [ /\.html$/ ], // 不要加hash重命名，但是可以修改内部引用地址
        fileNameManifest: "rev-manifest.json", // 设置revAll.manifestFile()产生的文件名称，默认: rev-manifest.json
        hashLength: 8, // 追加的hash的长度，默认是8
        includeFilesInManifest: ['.css', '.js'], // 指定rev-manifest.json中可以有哪些类型，即不是对所有文件都生成一个Map，默认: ['.css', '.js']
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
    // TODO: modify
    gulp.watch(['./src/**/*', '!src/rev-manifest.json'] , {
        events: 'all',
        ignoreInitial: false
    }, gulp.series(
        clean,
        html,
        script,
        rev_all,
        rev_dist_clean,
      	browserReload
    ))

    cb()
}

// browser server task
function browserServer(cb) {
    browserSync({
        server: {
            baseDir: "dist"
        }
    })
    cb()
}

// browser reload task
function browserReload(cb) {
    browserSync.reload()
    cb()
}

module.exports = {
    default: gulp.parallel(watch, browserServer)
}
```

这回再执行下构建命令，完美啦...

##### CSS 处理

可以对 `CSS` 文件进行：css文件压缩、less或sass 转 css、自动追加 vendor css。

通过 [`postcss`](https://www.npmjs.com/package/gulp-postcss) 插件，可以加速对 `css` 文件的处理，因为它仅解析一次。 

```bash
$ npm install --save-dev gulp-postcss cssnano autoprefixer
```

vim gulpfile.js

```javascript
var gulp = require('gulp'),
    // TODO: modify
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    del = require('del'),
    revDistClean = require('gulp-rev-dist-clean'),
    revAll = require('gulp-rev-all'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync'),
    htmlmin = require('gulp-htmlmin');

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

// javascript task
function script(cb) {
    // 处理第三方库文件
  	// TODO: modify
    gulp.src('./src/lib/**/*')
        .pipe(gulp.dest('./dist/lib'))

    return gulp.src('./src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
}

// TODO: modify
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
                browsers: ['last 3 version', ">= android 4"]
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

function clean(cb) {
    return del('./dist')
}

// rev dist clean
function rev_dist_clean(cb) {
    return gulp.src([
            './dist/**/*',
            '!./dist/**/*.html',
            '!dist/lib/*'
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
        //prefix: 'https://www.example.com/', // html文件的css，js地址一般是相对路径，用此参数可配置前缀，一般用于设置CDN的前缀。
        dontGlobal: [ /^favicon.ico$/ ], // 不要做任何处理
        dontRenameFile: [ /\.html$/ ], // 不要加hash重命名，但是可以修改内部引用地址
        fileNameManifest: "rev-manifest.json", // 设置revAll.manifestFile()产生的文件名称，默认: rev-manifest.json
        hashLength: 8, // 追加的hash的长度，默认是8
        includeFilesInManifest: ['.css', '.js'], // 指定rev-manifest.json中可以有哪些类型，即不是对所有文件都生成一个Map，默认: ['.css', '.js']
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
    // TODO: modify
    gulp.watch(['./src/**/*', '!src/rev-manifest.json'] , {
        events: 'all',
        ignoreInitial: false
    }, gulp.series(
        clean,
        html,
        script,
      	// TODO: modify
        css,
        rev_all,
        rev_dist_clean,
      	browserReload
    ))

    cb()
}

// browser server task
function browserServer(cb) {
    browserSync({
        server: {
            baseDir: "dist"
        }
    })
    cb()
}

// browser reload task
function browserReload(cb) {
    browserSync.reload()
    cb()
}

module.exports = {
    default: gulp.series(watch, browserServer)
}
```

css 源文件内容：

```css
body {
    font-size:10px
}

img {
    height:100px;
    width:100px;
    opacity: 1;
    transition: opacity 1s linear;
}
img:hover {
    opacity: 0;
}
```

构建后 css 文件内容：

```css
body{font-size:10px}img{height:100px;width:100px;opacity:1;-webkit-transition:opacity 1s linear;-o-transition:opacity 1s linear;transition:opacity 1s linear}img:hover{opacity:0}
```



##### Images 处理

可以使用插件：[gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin) 来压缩图片大小、转换图片类型。

```bash
$ cnpm install --save-dev gulp-imagemin

# Install cnpm 
$ npm install --global cnpm
```

vim gulpfile.js

```javascript
var gulp = require('gulp'),
    // TODO: modify
    imagemin = require('gulp-imagemin'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    del = require('del'),
    revDistClean = require('gulp-rev-dist-clean'),
    revAll = require('gulp-rev-all'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync'),
    htmlmin = require('gulp-htmlmin');

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

// javascript task
function script(cb) {
    // 处理第三方库文件
    gulp.src('./src/lib/**/*')
        .pipe(gulp.dest('./dist/lib'))

    return gulp.src('./src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
}

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

// TODO: modify
function images(cb) {
    return gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
}

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
        //prefix: 'https://www.example.com/', // html文件的css，js地址一般是相对路径，用此参数可配置前缀，一般用于设置CDN的前缀。
        dontGlobal: [ /^favicon.ico$/ ], // 不要做任何处理
        dontRenameFile: [ /\.html$/ ], // 不要加hash重命名，但是可以修改内部引用地址
        fileNameManifest: "rev-manifest.json", // 设置revAll.manifestFile()产生的文件名称，默认: rev-manifest.json
        hashLength: 8, // 追加的hash的长度，默认是8
        // TODO: modify
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
    // TODO: modify
    gulp.watch(['./src/**/*', '!src/rev-manifest.json'] , {
        events: 'all',
        ignoreInitial: false
    }, gulp.series(
        clean,
        images,
        html,
        script,
        css,
        rev_all,
        rev_dist_clean,
      	browserReload
    ))

    cb()
}

// browser server task
function browserServer(cb) {
    browserSync({
        server: {
            baseDir: "dist"
        }
    })
    cb()
}

// browser reload task
function browserReload(cb) {
    browserSync.reload()
    cb()
}

module.exports = {
    default: gulp.parallel(watch, browserServer)
}
```

总结下来，你可能需要安装这些插件。

```bash
$ npm install --save-dev \
        gulp \
        gulp-cli \
        gulp-htmlmin \
        gulp-rev-all \
        gulp-rev-dist-clean \
        del \
        gulp-uglify \
        gulp-babel \
        @babel/core \
        @babel/preset-env \
        browser-sync \
        gulp-postcss \
        cssnano \
        autoprefixer \
        gulp-imagemin
```
