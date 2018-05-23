const mongoose = require('../db')
const Schema = mongoose.Schema

const BookSchema = new Schema({
    name: String, // 图书名称,
    engName: String, //图书英文名称,
    isbn: String,
    cover: String, // 封面
    score: Number, // 评分
    author: String, // 作者
    authorIntro: String, //作者简介
    desc: String, // 简短书评
    bookIntro: String, //图书内容简介
    publisher: String, // 出版社
    tag: Array,  //标签
    record_date: Number,  //录入时间
})

module.exports = mongoose.model('Book', BookSchema)
