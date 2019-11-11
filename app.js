require('dotenv').config({path: 'env/dev.env'});
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const busboy = require('connect-busboy');

const bodyParser = require('body-parser');


const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// UPLOAD FILES
app.use(busboy({
    highWaterMark: 2*1024*1024,
}));
// DATABASE
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_ADDR, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);
const dataBase = mongoose.connection;
dataBase.on('error', (error) => console.error(error));
dataBase.once('open', () => console.log('Connected to DataBase'));
// ROUTERS
const indexRouter = require('./routes/index');
const userRouter = require('./routes/UserRoute');
const movieRouter = require('./routes/MovieRoute');
app.use('/api/v1', indexRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/movie', movieRouter);


module.exports = app;
