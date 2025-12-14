const express = require('express');
const path = require('path');
const { dbMiddleware} = require('./bin/db');


const indexRouter = require('./routes/index');
//add more handlers here

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(dbMiddleware);
app.use('/', indexRouter);
//add more routes here

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/menu', (req, res) => {
  res.render('menu', { title: 'Menu' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

app.get('/comments', (req, res) => {
  res.render('comments', { title: 'Comments' });
});


module.exports = app;