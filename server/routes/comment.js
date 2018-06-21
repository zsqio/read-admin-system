const express = require('express')
const router = express.Router()
const CommentSchema = require('../schema/comment')

router.post('/add', (req, res) => {
    insert(req.body).then(r => {
        if (r.result) {
            res.json({
                result: true,
                msg: '评论发表成功'
            })
        } else {
            res.json({
                result: false,
                msg: '评论发表失败'
            })
        }
    }).catch( err => {
        res.json({
                result: false,
                msg: err
            })
    })
})

//像数据库中新插入一条数据
function insert({ name, user, userAvatar, comment}) {
    return new Promise((resolve, reject) => {
        let newComment = new CommentSchema({
            name,
            user,
            userAvatar,
            comment,
            commentDate: new Date().getTime()
        })
        newComment.save((err, data) => {
            if (err) {
                reject({ result: false, msg: err })
            } else {
                resolve({ result: true, msg: '', data: data })
            }
        })
    })
}

router.get('/list', (req, res) => {
    const { name } = req.query
    CommentSchema.find({ name })
                .exec((err, data) => {
        if(err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            res.json({
                result: true,
                data: data
            })
        }
    })
})

router.get('/all', (req, res) => {
    CommentSchema
        .find()
        .sort({"commentDate": -1})
        .exec((err, data) => {
            if (err) {
                    res.json({
                        result: false,
                        msg: err
                    })
                } else {
                    res.json({
                        result: true,
                        data: data,
                    })
                }
        })
})

router.post('/delete', (req, res) => {
    const { id } = req.body 
    CommentSchema.remove({ _id: id }, (err, data) => {
        if (err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            res.json({
                result: true,
                msg: '屏蔽成功'
            })
        }
    })
})

module.exports = router