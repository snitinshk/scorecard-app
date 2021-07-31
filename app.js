
require('dotenv').config({ path: './.env' })
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var routes = require('./routes/index');
const cron = require('node-cron')
var upComingMatches = require('./controllers/fetch-data')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** include route file */
app.use('/', routes);
/** include route file */

/** Db iniate */ 
mongoose.connect('mongodb+srv://'+process.env.DBUSER+':'+process.env.DBPASS+'@'+process.env.DB+'.l4tii.mongodb.net/'+process.env.DB+'?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
/** Db iniate */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
/**
 * Crone Schedule
 */
 cron.schedule('*/5 * * * *', async function () {
  // upComingMatches.getUpcomingMatches()
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
