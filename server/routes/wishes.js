const express = require('express')
const router = express.Router()
const WishSchema = require('../schema/wishes')


// 后台愿望列表
router.get('/list', (req, res) => {
    WishSchema
        .find()
        .exec((err, data) => {
            console.log(err, data)
            if (err) {
                res.json({
                    result: false,
                    msg: err
                })
            } else {
                res.json({
                    result: true,
                    msg: '查询成功',
                    data: data
                })
            }
        })
})

// 用户愿望列表
router.get('/mine', (req, res) => {
    const { user } = req.query
    WishSchema.find({ user }, (err, data) => {
        if (err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            res.json({
                result: true,
                msg: '查询成功',
                data: data
            })
        }
    })
})

// 加入愿望清单
router.post('/add', (req, res) => {
    const { name, author, user, informStatus } = req.body
    if (name !== '' && author !== '') {
        const wish = new WishSchema({
            name,
            author,
            user,
            informStatus,
            status: 0,
            recordDate: new Date().getTime()
        })
        WishSchema.find({ name, user }, (err, data) => {
            if (err) {
                res.json({
                    result: false,
                    msg: err
                })
            } else {
                if (data.length !== 0) {
                    res.json({
                        result: false,
                        msg: '愿望单中已经存在咯~'
                    })
                } else {
                    wish.save((err, data) => {
                        if (err) {
                            res.json({
                                result: false,
                                msg: err
                            })
                        } else {
                            res.json({
                                result: true,
                                msg: '加入愿望单成功'
                            })
                        }
                    })
                }
            }
        })
    } else {
        res.json({
            result: false,
            msg: '用户名或书名不能为空'
        })
    }
})

// 移除愿望清单
router.post('/delete', (req, res) => {
    console.log(req.body)
    const { name, user } = req.body
    WishSchema.remove({ name, user }, (err, data) => {
        if (err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            res.json({
                result: true,
                msg: '删除成功'
            })
        }
    })
})

module.exports = router
