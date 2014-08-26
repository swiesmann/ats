var gulp = require('gulp');
var mbp = require('./mbp');
var plugins = require("gulp-load-plugins")();

//
// LOAD CONFIG
//
var config = mbp.config('config/global.yml');
var replace_patterns = mbp.getReplacePatterns([
  "project_name",
  "project_lang"
]);

//
// TASKS
//

// Templates
gulp.task('templates', function () {
    gulp.src('src/frontend/**/*.tpl.html')
      .pipe(plugins.html2js({
        base: 'src/frontend/app/',
        outputModuleName: 'templates',
        useStrict: true
      }))
      .pipe(plugins.concat('templates.js'))
      .pipe(gulp.dest(config.build.dist_folder));
});

// Connect
gulp.task('connect', function () {
  plugins.connect.server({
    root: config.build.dist_folder,
    livereload: config.build.connect.livereload
  });
});

// Usemin
gulp.task('usemin', function () {
  gulp.src('src/frontend/*.html')
    .pipe(plugins.replaceTask(replace_patterns))
    .pipe(plugins.usemin({
      css: [plugins.minifyCss(), 'concat'],
      html: [plugins.minifyHtml({empty: true})],
      js: [plugins.uglify(), plugins.rev()]
    }))
    .pipe(gulp.dest(config.build.dist_folder));
});

// Fonts autodiscover
gulp.task('fonts', function() {
  gulp.src(['!local', '**/*.{ttf,woff,eof,svg}'])
    .pipe(plugins.flatten())
    .pipe(gulp.dest(config.build.dist_fonts));
});


// Lint Task
gulp.task('lint', function () {
  return gulp.src(config.build.js_files)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'));
});

// Images
gulp.task('images', function(){
  gulp.src('/home/roland/dev/mbp/src/frontend/assets/img/**')
  .pipe(gulp.dest(config.build.dist_images));
});

// Styles
gulp.task('styles', function () {
  return gulp.src('src/frontend/assets/sass/application.scss')
    .pipe(plugins.compass({
      logging: true,
      style: 'compressed',
      comments: false,
      config_file: './config.rb',
      css: 'src/frontend/assets/stylesheets',
      sass: 'src/frontend/assets/sass'
    }))
  .pipe(gulp.dest(config.build.dist_styles));
});

// Concatenate & Minify JS
// replace -> inject -> concat -> rename -> uglify = awesome
gulp.task('compile_scripts', function () {
  return gulp.src('src/frontend/**/*.js')
    .pipe(plugins.replaceTask(replace_patterns))
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.concat('all.js'))
    .pipe(gulp.dest(config.build.dist_js))
    .pipe(plugins.rename('all.min.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(config.build.dist_js));
});

// Watch Files For Changes
gulp.task('watch', function () {
  gulp.watch('src/frontend/**/*.js', ['lint', 'compile_scripts']);
  gulp.watch('**/*.scss', ['styles']);
  gulp.watch('src/frontend/index.html', ['usemin']);
  gulp.watch('src/frontend/**/*.tpl.html', ['templates']);
});

// Default Task
gulp.task('default', [
  'compile_scripts',
  'fonts',
  'images',
  'styles',
  'usemin',
  'templates',
  'connect',
  'watch'
]);