const express = require('express');
const path = require('path');
require('dotenv').config({ path: '.env' });
const session = require('express-session');
const noCache = require('nocache');
const nodeMailer = require('nodemailer');
const logger = require('morgan');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const errorhandler = require('./Middlewares/errorhandler');
const cors = require('cors')

const db = require('./Config/connection');
db.dbConnect();

const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/user');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//session and noCache
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: process.env.Session_Secret,
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));
app.use(noCache());

// use over-ride
app.use(methodOverride('_method'));
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'Public')));


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/admin', adminRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res) {
  res.render('user/404')
});

//middle ware
// error handler
app.use(errorhandler.errorhandler);

app.listen(process.env.PORT, () => {
  console.log(`PORT ${process.env.PORT} is running...`);
});