const express = require('express')
const router = express.Router()
const UserSchema = require('../schema/user')


// 登录
router.post('/login', (req, res) => {
    const { name, pwd } = req.body
    UserSchema.find({ name, pwd }, (err, data) => {
        if (err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            if (data.length !== 0) {
                res.json({
                    result: true,
                    msg: '登录成功'
                })
            } else {
                res.json({
                    result: false,
                    msg: '用户不存在或密码错误'
                })
            }
        }
    })
})

// 用户列表
router.get('/list', (req, res) => {
    UserSchema.find({}, (err, data) => {
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

// 新增用户
router.post('/add', (req, res) => {
    const { name, pwd } = req.body
    if (name !== '' && pwd !== '') {
        const user = new UserSchema({
            name,
            pwd
        })
        UserSchema.find({ name }, (err, data) => {
            if (err) {
                res.json({
                    result: false,
                    msg: err
                })
            } else {
                if (data.length !== 0) {
                    res.json({
                        result: false,
                        msg: '该用户已存在'
                    })
                } else {
                    user.save((err, data) => {
                        if (err) {
                            res.json({
                                result: false,
                                msg: err
                            })
                        } else {
                            res.json({
                                result: true,
                                msg: '新用户添加成功'
                            })
                        }
                    })
                }
            }
        })
    } else {
        res.json({
            result: false,
            msg: '用户名或密码不能为空'
        })
    }
})

// 删除用户
router.post('/del', (req, res) => {
    const { name } = req.body
    UserSchema.remove({ name }, (err, data) => {
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
