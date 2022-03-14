//导入定义验证规则的包
const joi = require('joi')

//定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()
const avatar = joi.string().dataUri().required()
//定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
    body:{
        username,
        password
    }
}
// 定义更新用户基本信息的规则对象
exports.update_userinfo_schema = {
    body: {
        nickname,
        email
    }
}

// 定义更新密码的规则对象
exports.update_password_schema ={
    body:{
        oldpwd: password,
        newpwd: joi.not(joi.ref('oldpwd')).concat(password)
    }
}

//定义更新头像的验证规则
exports.update_avatar_schema = {
    body: {
        avatar
    }
}
