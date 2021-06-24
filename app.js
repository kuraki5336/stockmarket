var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

/** router */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var kafka = require('./routes/kafka');
var consumergroup = require('./routes/consumergroup');
var consumergroup2 = require('./routes/consumergroup2');
// var kfkps = require('./routes/kafka/kafkaPS');
// var kfkcs = require('./routes/kafka/kafkaCS');
var { storeRouter } = require('./routes/storemark')
var schedule = require('./routes/schedule')



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/store', storeRouter);
app.use('/kafka', kafka);
// app.use('/kfkps', kfkps);
// app.use('/kfkps', kfkcs);
// app.use('/consumergroup', consumergroup);
// app.use('/consumergroup2', consumergroup2);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
