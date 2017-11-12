require('dotenv').config();

import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import index from './routes/index';
import login from './routes/login';

import * as ejs from 'ejs';
const session = require('express-session')

import Knex = require('knex');
import { MySqlConnectionConfig, } from 'knex';

const app: express.Express = express();

//view engine setup

app.set('views', path.join(__dirname, '../views'));
app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const connection: MySqlConnectionConfig = {
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};

const db = Knex({
  client: 'mysql',
  connection: connection
});

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(function(req,res,next){
  res.locals.session = req.session;
  next();
});

var auth = (req, res, next) => {
  if (req.session.logged) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.use('/login', login);
app.use('/', auth, index);

//catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

//error handlers

//development error handler
//will print stacktrace
if (process.env.NODE_ENV === 'development') {
  app.use((err: Error, req, res, next) => {
    res.status(err['status'] || 500);
    res.render('error', {
      title: 'error',
      message: err.message,
      error: err
    });
  });
}

//production error handler
// no stacktrace leaked to user
app.use((err: Error, req, res, next) => {
  res.status(err['status'] || 500);
  res.render('error', {
    title: 'error',
    message: err.message,
    error: {}
  });
});

export default app;
