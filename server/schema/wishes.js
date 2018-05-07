const mongoose = require('../db')
const Schema = mongoose.Schema

const WishSchema = new Schema({
    name: String,  //书名
    author: String, //作者
    user: String,    //心愿者
    inforStatus: Boolean,   //够否开启提醒
    status: Number  //是否上架
})

module.exports = mongoose.model('Wish', WishSchema)
