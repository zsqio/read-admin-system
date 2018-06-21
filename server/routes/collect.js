const express = require('express')
const router = express.Router()
const CollectSchema = require('../schema/collect')

//查找某个用户的全部收藏
router.get('/list', (req, res) => {
    const { user } = req.query
    CollectSchema.find({ user }, (err, data) => {
        if(err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            if(data.length === 0) {
                res.json({
                    result: true,
                    data: data
                })
            } else {
                res.json({
                    result: true,
                    data: data
                })
            }
        }
    })
})

//查找某本书是否被收藏
router.get('/status', (req, res) => {
    const { name, user } = req.query 
    CollectSchema.find({ name, user }, (err, data) => {
        if (err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            if(data.length === 0) {
                res.json({
                    result: true,
                    status: 0,
                })
            } else {
                res.json({
                    result: true,
                    status: 1
                })
            }
            
        }
    })
})

// 录入收藏信息
router.post('/insert', (req, res) => {
    const { name, user } = req.body 
    CollectSchema.find({ name, user }, (err, data) => {
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
                            msg: '收藏成功'
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
                    msg: '您已经收藏过该图书~'
                })
            }
        }
    })
})
//像数据库中新插入一条数据
function insert({ name, user, cover}) {
    return new Promise((resolve, reject) => {
        let collect = new CollectSchema({
            name,
            user,
            cover,
            collectDate: new Date().getTime(),
        })
        collect.save((err, data) => {
            if (err) {
                reject({ result: false, msg: err })
            } else {
                resolve({ result: true, msg: '', data: data })
            }
        })
    })
}

//取消收藏,相当于删除一条记录
router.post('/delete', (req, res) => {
    const { name, user } = req.body 
    CollectSchema.remove({ name, user }, (err, data) => {
        if (err) {
            res.json({
                result: false,
                msg: err
            })
        } else {
            res.json({
                result: true,
                msg: '取消收藏成功'
            })
        }
    })
})


module.exports = router