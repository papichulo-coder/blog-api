const express = require('express')
const app = express();
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const article = require('./routes/article')
const User = require('./routes/User');

const port = 3000
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
// create article
app.use(article);
app.use(User)
mongoose.connect(process.env.MONGOBD_CONNECT).then(()=>{
    console.log('database connected');

}).catch(()=>{
    console.log('error in connecting to database');
})
app.listen(port)