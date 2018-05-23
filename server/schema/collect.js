const mongoose = require('../db')
const Schema = mongoose.Schema

const collectSchema = new Schema({
    name: String,    //书名
    user: String,    //用户名
    cover: String,   //封面
    collectDate: Number,    //收藏时间

})

module.exports = mongoose.model('collect', collectSchema)