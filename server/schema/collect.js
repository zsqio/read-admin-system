const mongoose = require('../db')
const Schema = mongoose.Schema

const collectSchema = new Schema({
    name: String,    //书名
    user: String,    //用户名
    collectDate: String,    //收藏时间

})

module.exports = mongoose.model('collect', collectSchema)