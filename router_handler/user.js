//导入数据库操作模块
const db = require('../db/index')

//导入bcryptjs包进行加密
const bcryptjs = require('bcryptjs')

//导入生成Token的包
const jwt = require('jsonwebtoken')
const config = require('../config')

//注册新用户的处理函数
exports.regUser = (req,res)=>{
    //获取客户端提交的用户信息
    const userinfo = req.body
    //对表单数据进行合法性的校验
    // if(!userinfo.username || !userinfo.password){
    //     return res.cc(err)
    // }

// 定义sql语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username = ?'
    db.query(sqlStr,userinfo.username,(err,results)=>{
        if(err) return res.send({status: 1,message:err.message})
        //判断用户名是否被占用
        if(results.length > 0){
            return res.cc('用户名被占用')
        }
        //调用bcryptjs.hanshSync（）对密码进行加密
        userinfo.password = bcryptjs.hashSync(userinfo.password,10)
        //定义插入新用户的sql语句
        const sql = 'insert into ev_users set ?'
        db.query(sql,{username: userinfo.username,password:userinfo.password},(err,results)=>{
            if(err) return res.cc(err) 
            if(results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试')
            res.cc('注册成功',0)
        })
    })
    
}

// 登录的处理函数
exports.login = (req,res)=>{
    //接收表单的数据
    const userinfo = req.body
    //定义sql语句
    const sql = 'select * from ev_users where username = ?'
    //执行sql语句
    db.query(sql,userinfo.username,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('登录失败!')

        //判断密码是否正确
        const compareResult = bcryptjs.compareSync(userinfo.password, results[0].password)
        if(!compareResult) return res.cc('登录失败,密码错误')
        
        //生成Token字符串
        const user = {...results[0],password:'',user_pic:''}
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:'1h'})
        //将token响应给客户端
        res.send({
            status: 0,
            message:'登录成功',
            token: 'Bearer ' + tokenStr
        })

    })
}