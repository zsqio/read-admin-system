const mongoose = require('../db')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    name: String,    //书名
    user: String,    //用户名
    userAvatar: String,   //用户头像
    comment: String,  //评论内容
    commentDate: String,    //评论时间


})

module.exports = mongoose.model('comment', commentSchema)