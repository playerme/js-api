import gulp from 'gulp';
import babel from 'gulp-babel';
import env from 'gulp-env';
import mocha from 'gulp-mocha';
import eslint from 'gulp-eslint';
import del from 'del';
import runSequence from 'run-sequence';
import plumber from 'gulp-plumber';
import yargs from 'yargs';

const config = {
  paths: {
    js: {
      src: 'src/**/*.js',
      dist: 'dist/'
    },
    test: {
      src: 'test/**/*.js',
      dist: 'test-dist/',
      run: 'test-dist/**/*.js'
    }
  }
};

gulp.task('clean', () =>
  del([config.paths.js.dist, config.paths.test.dist])
);

gulp.task('build', ['clean', 'babel-src', 'babel-test']);

gulp.task('babel-src', ['lint-src'], () =>
  gulp.src(config.paths.js.src)
    .pipe(babel())
    .pipe(gulp.dest(config.paths.js.dist))
);

gulp.task('babel-test', ['lint-test'], () =>
  gulp.src(config.paths.test.src)
    .pipe(babel())
    .pipe(gulp.dest(config.paths.test.dist))
);

gulp.task('lint-src', () =>
  gulp.src(config.paths.js.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('lint-test', () =>
  gulp.src(config.paths.test.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('watch', () => {
  gulp.watch(config.paths.js.src, ['babel-src', 'test']);
  gulp.watch(config.paths.test.src, ['babel-test', 'test']);
});

let envConfig;

try {
  envConfig = require('./.env.json');
} catch (error) {
  envConfig = {};
}

const envs = env.set(envConfig);

gulp.task('test', ['build'], () =>
  gulp.src([config.paths.test.run])
    .pipe(envs)
    .pipe(plumber())
    .pipe(mocha({ reporter: 'spec', grep: yargs.argv['mocha-grep'] }))
    .pipe(envs.reset)
);

// Default Task
gulp.task('default', () =>
  runSequence('clean', ['build', 'test'])
);
