const express = require('express')
const router = express.Router()
const BookSchema = require('../schema/book')

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

// 录入图书信息
router.post('/record', (req, res) => {
    const { name } = req.body
    BookSchema.find({ name }, (err, data) => {
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
                            msg: '图书信息录入成功'
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
                    msg: '该图书已经上架啦~'
                })
            }
        }
    })
})
function insert({ name, engName,  cover, author, publisher, score, desc ,}) {
    return new Promise((resolve, reject) => {
        let book = new BookSchema({
            name,
            engName,
            cover,
            author,
            publisher,
            score,
            desc,
            record_date: new Date().getTime(),
        })
        book.save((err, data) => {
            if (err) {
                reject({ result: false, msg: err })
            } else {
                resolve({ result: true, msg: '', data: data })
            }
        })
    })
}

// 图书下架
router.post('/offshelf', (req, res) => {
    const { name } = req.body
    BookSchema.remove({ name }, (err, data) => {
        if (err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            res.json({
                result: true,
                msg: '下架成功'
            })
        }
    })
})

// 获取图书信息
router.get('/list', (req, res) => {
    const { status, title, order } = req.query
    const filter = {}
    if (status && status !== '0') {
        filter.status = Number(status)
    }
    if (title) {
        filter.title = title
    }
    if (order) {
        BookSchema
            .find()
            .where(filter)
            .sort({ borrowCount: -1 })
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
        BookSchema
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
