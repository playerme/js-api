import gulp from 'gulp';
import babel from 'gulp-babel';
import env from 'gulp-env';
import mocha from 'gulp-mocha';
import eslint from 'gulp-eslint';
import del from 'del';
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

let envConfig;

try {
  envConfig = require('./.env.json');
} catch (error) {
  envConfig = {};
}

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
  envConfig.WATCH_MODE = true;

  return gulp.watch(
    [
      config.paths.js.src,
      config.paths.test.src
    ],
    ['build', 'test']
  );
});

gulp.task('test', ['build'], () => {
  const envs = env.set(envConfig);

  return gulp.src([config.paths.test.run], { read: false })
    .pipe(plumber({
      errorHandler(error) {
        if (!envConfig.WATCH_MODE) throw error;
      }
    }))
    .pipe(envs)
    .pipe(mocha({ reporter: 'spec', grep: yargs.argv['mocha-grep'] }))
    .pipe(envs.reset);
});

gulp.task('default', ['build', 'test']);
