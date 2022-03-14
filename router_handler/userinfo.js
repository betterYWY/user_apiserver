const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')
//导入处理密码的模块
const bcrypt = require('bcryptjs')

//获取用户基本信息
exports.getUserInfo = (req,res)=>{
    //定义查询用户信息的sql语句
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id=?'
    //执行sql语句
    db.query(sql,req.user.id,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('获取用户信息失败')
        res.send({
            status:0,
            message: '获取成功',
            data: results[0]
        })
    })
}

//更新用户信息
exports.updateUserInfo = (req,res)=>{
    const sql = 'update ev_users set? where id =?'
    db.query(sql,[req.body,req.user.id],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('更新用户信息失败')

        res.cc('更新用户成功',0)
    })
}
// 更新用户密码
exports.updatePassword = (req,res) =>{
    //根据id查询用户的信息
    const sql = 'select * from ev_users where id = ?'
    db.query(sql,req.user.id,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('用户不存在')
        //判断密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldpwd,results[0].password)
        if(!compareResult) return res.cc('密码错误')
        // 更新密码
        const sql = 'update ev_users set password=? where id=?'
        const newpwd = bcrypt.hashSync(req.body.newpwd,10)
        db.query(sql,[newpwd,req.user.id],(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows !== 1) res.cc('密码更改失败')
            res.cc('更新密码成功',0)
        })
    })
}

// 更新用户头像
exports.updateAvatar = (req,res) =>{
    const sql = 'update ev_users set user_pic=? where id=?'
    db.query(sql,[req.body.avatar,req.user.id],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('更换头像失败')
        res.cc('更换头像成功',0)
    })
}