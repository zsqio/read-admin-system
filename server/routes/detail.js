const express = require('express')
const router = express.Router()
const DetailSchema = require('../schema/detail')

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


//插入一条详情
router.post('/add', (req, res) => {
    const { name } = req.body
    DetailSchema.find({ name }, (err, data) => {
        if (err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            // 录入的图书不存在，则录入
            if (data.length === 0) {
                insert(req.body).then(r => {
                    if (r.result) {
                        res.json({
                            result: true,
                            msg: '图书详情录入成功'
                        })
                    } else {
                        res.json({
                            result: false,
                            msg: r.msg
                        })
                    }
                }).catch(err => {
                    res.json({
                        result: false,
                        msg: err
                    })
                })
            } else {
                res.json({
                    result: false,
                    msg: '该图书详情已存在~'
                })
            }
        }
    })
})
//像数据库中新插入一条数据
function insert({ name, authorIntro, bookIntro, comments}) {
    return new Promise((resolve, reject) => {
        let detail = new DetailSchema({
            name,
            authorIntro,
            bookIntro,
            comments,
            record_date: new Date().getTime(),
        })
        detail.save((err, data) => {
            if (err) {
                reject({ result: false, msg: err })
            } else {
                resolve({ result: true, msg: '', data: data })
            }
        })
    })
}

// 获取图书详情信息
router.get('/', (req, res) => {
    const {name} = req.query
    const filter = {}
    if (name) {
        filter.name = name
    }
    if (name) {
        DetailSchema
            .find()
            .where(filter)
            .exec((err, data) => {
                if (err) {
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
    } else {
        DetailSchema
            .find()
            .where(filter)
            .exec((err, data) => {
                if (err) {
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
    }
})
module.exports = router
