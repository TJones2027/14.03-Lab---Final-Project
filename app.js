const express = require('express');
const path = require('path');
const createError = require('http-errors'); // ✅ FIXES YOUR ERROR
const { dbMiddleware } = require('./bin/db');

const indexRouter = require('./routes/index');

const app = express();

/* =========================
   IN-MEMORY COMMENTS STORE
   ========================= */
const comments = [];

/* =========================
   VIEW ENGINE SETUP
   ========================= */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/* =========================
   MIDDLEWARE
   ========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(dbMiddleware);

/* =========================
   ROUTES
   ========================= */
app.use('/', indexRouter);

app.get('/menu', (req, res) => {
  res.render('menu', { title: 'Menu' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

/* ===== COMMENTS ===== */
app.get('/comments', (req, res) => {
  res.render('comments', {
    title: 'Comments',
    comments: comments
  });
});

app.post('/comments', (req, res) => {
  const { comment } = req.body;

  if (comment && comment.trim() !== '') {
    comments.unshift(comment);
  }

  res.redirect('/comments');
});

/* =========================
   ERROR HANDLING
   ========================= */

// Catch 404
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
