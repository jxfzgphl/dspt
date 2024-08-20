// 登入注册模块路由
// 导入express框架
const express=require('express')
const joi=require('joi')
//使用express框架的路由
const router=express.Router()
// 导入login的路由处理模块
const loginhandle=require('../router-handle/login')
//导入exprjoi
const expressjoi=require('@escook/express-joi')
//导入验证规则
const {
	login_limit
}=require('../limit/login.js')
//注册
router.post('/register',expressjoi(login_limit),loginhandle.register)
//登入
router.post('/login',expressjoi(login_limit),loginhandle.login)

//对外暴露路由
module.exports =router