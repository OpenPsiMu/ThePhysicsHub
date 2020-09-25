const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');
const contributeRouter = require('./routes/contribute');
const simulationsRouter = require('./routes/simulations');
const simplePendulum = require('./routes/simplePendulum');
const elasticPendulum = require('./routes/elasticPendulum');
const forceTableRouter = require('./routes/force_table');
const collisionRouter = require('./routes/collision');
const nBodyRouter = require('./routes/nBody');
const coupledPendulum = require('./routes/coupledPendulum');
const doublePendulum2D = require('./routes/doublePendulum2D');
const projectileMotion2D = require('./routes/projectileMotion2D');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/contribute', contributeRouter);
app.use('/simulations', simulationsRouter);
app.use('/simulations/simplePendulum', simplePendulum);
app.use('/simulations/elasticPendulum', elasticPendulum);
app.use('/simulations/force_table', forceTableRouter);
app.use('/simulations/collision', collisionRouter);
app.use('/simulations/nBody', nBodyRouter);
app.use('/simulations/coupledPendulum', coupledPendulum);
app.use('/simulations/doublePendulum2D', doublePendulum2D);
app.use('/simulations/projectileMotion2D', projectileMotion2D);

// Stylesheets
app.use(express.static(__dirname + '/public'));
module.exports = app;
