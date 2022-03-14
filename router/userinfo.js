const express = require('express')

const router = express.Router()

// 导入验证数据的中间件和验证规则
const expressJoi = require('@escook/express-joi')
const {update_userinfo_schema, update_password_schema, update_avatar_schema} = require('../schema/user')

// 导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// 获取用户信息
router.get('/userinfo',userinfo_handler.getUserInfo)

//更新用户信息
router.post('/userinfo',expressJoi(update_userinfo_schema),userinfo_handler.updateUserInfo)

//更改密码的路由
router.post('/updatepwd',expressJoi(update_password_schema),userinfo_handler.updatePassword)

// 更换头像的路由
router.post('/update/avatar',expressJoi(update_avatar_schema),userinfo_handler.updateAvatar)

module.exports = router