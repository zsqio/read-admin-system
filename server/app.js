const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const DB_URL = 'mongodb://localhost:27017/book'
mongoose.connect(DB_URL)

// 解析表单数据
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 引入 路由模块
var booksRouter = require('./routes/books')
var usersRouter = require('./routes/users')
var wishRouter = require('./routes/wishes')
var collectRouter = require('./routes/collect')
var commentRouter = require('./routes/comment')


// 设置跨域
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.header('Origin'));
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    next();
 });

app.use('/book', booksRouter)
app.use('/user', usersRouter)
app.use('/wish', wishRouter)
app.use('/collect', collectRouter)
app.use('/comment', commentRouter)

app.listen(9999, function () {
    console.log('server connect, listening at http://localhost:9999')
})
