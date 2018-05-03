const mongoose = require('../db')
const Schema = mongoose.Schema

const detailSchema = new Schema({
    name: String,
    authorIntro: String,
    bookIntro: String,
    comments: Array,

})

module.exports = mongoose.model('detail', detailSchema)