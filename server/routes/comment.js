const express = require('express')
const router = express.Router()
const CommentSchema = require('../schema/comment')

// 设置跨域
router.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')

    if (req.method === 'OPTIONS') {
        res.sendStatus(200) // 让options请求快速返回
    } else {
        next()
    }
})

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
    CommentSchema.find({ name }, (err, data) => {
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

module.exports = router