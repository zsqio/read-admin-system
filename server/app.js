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
var detailRouter = require('./routes/detail')
var wishRouter = require('./routes/wishes')
var collectRouter = require('./routes/collect')

app.use('/book', booksRouter)
app.use('/user', usersRouter)
app.use('/detail', detailRouter)
app.use('/wish', wishRouter)
app.use('/collect', collectRouter)

app.listen(9999, function () {
    console.log('server connect, listening at http://localhost:9999')
})
