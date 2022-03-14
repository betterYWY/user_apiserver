
const express = require('express')

const app = express()

// 导入并配置cors中间件
const cors = require('cors')
app.use(cors())

// 配置解析application/x-www-form-urlencoded表单数据的中间件,
app.use(express.urlencoded({extended:false}))

//封装res.cc函数用于处理信息
app.use((req,res,next)=>{
    // status默认值为1，表示失败
    res.cc = function(err,status=1){
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})


//配置解析Token的中间件
const expressJwt = require('express-jwt')
const config = require('./config')
app.use(expressJwt({secret:config.jwtSecretKey}).unless({path:[/^\/api/]}))

// 导入并使用用户路由模块
const userRouter = require('./router/user')
const Joi = require('@hapi/joi')
app.use('/api',userRouter)

// 导入并使用用户信息的模块
const userinfoRouter = require('./router/userinfo')

app.use('/my',userinfoRouter)

//定义错误级别中间件
app.use((err,req,res,next)=>{
    // 验证失败导致的错误
    if(err instanceof Joi.ValidationError) return res.cc(err)
    //身份认证失败的错误
    if(err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    //未知的错误
    res.cc(err)
})

app.listen('3007',()=>{
    console.log('api server running at http://127.0.0.1:3007')
})