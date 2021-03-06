var express = require('express');
var createError = require('http-errors');
var path = require('path');
require('dotenv/config');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
;
const mongoose = require('mongoose')
var productRoute = require('./routes/products');
var catagoriesRoute = require('./routes/catagories'); 
var paymentRoute = require('./routes/razorpay');
var userRoute = require('./routes/register'); 
var collegeRoute = require('./routes/collegeRoute')
var app = express();

// view engine setup incommin engine setup

mongoose.connect(
    process.env.MongoURI,{ useNewUrlParser: true, useUnifiedTopology: true, 
    })
  .then(() => console.log("Successfully connected to database:)"))
  .catch(err => console.log(err));

  
app.use(cors({
    origin:  process.env.CORS
   
  }))
  app.set('views', path.join(__dirname, 'views'));
  app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/pro',productRoute)
app.use('/cat', catagoriesRoute);
app.use('/pay',paymentRoute)
app.use('/auth', userRoute);
app.use('/college', collegeRoute);
app.use(express.urlencoded({ extended: false }))
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
module.exports = app;
