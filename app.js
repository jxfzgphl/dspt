const express=require('express')
const bodyparser=require('body-parser')
const cors=require('cors')
const loginrouter=require('./router/login')
const jwtconfig=require('./jwt-config/index.js')
const {expressjwt:jwt}=require('express-jwt')
const Joi=require('joi')
const app=express()

app.use(cors())
//	当extended为false时，值为数组和字符串；为true时，值为任意类型
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.use((req,res,next)=>{
	//status=0为失败，=1为成功，默认为1
	res.cc = (err,status = 1)=>{
		res.send({
			status:status,
			//判断error是错误对象还是字符串
			message: err instanceof Error ? err.message : err,
		})  
	}
	next()
})

app.use(jwt({
	secret:jwtconfig.jwtSecretKey,
	algorithms:['HS256']
}).unless({
	path:[/^\/api\//]
}))

app.use('/api',loginrouter)
//对不符合joi规则的情况进行报错
app.use((err,req,res,next)=>{
	if(err instanceof Joi.ValidationError) return res.cc(err,0) 
})


app.listen(3007, () => {
	console.log('http://127.0.0.1:3007:')
})