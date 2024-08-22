const db=require('../db/index.js')
// 导入dcrypt中间件
const bcrypt=require('bcryptjs')
//导入jwt，用于生成token
const jwt=require('jsonwebtoken')
//导入jwtconfig，用于加密和解密
const jwtconfig=require('../jwt-config/index.js')

exports.register=(req,res)=>{
	// req是前端传过来的数据,也就是require;res是返回前端的数据,也就是results
	const reginfo=req.body
	// 第一步,判断前端传过来的数据对否为空
	if(!reginfo.account||!reginfo.password){
		return res.send({
			status:1,
			message:'账号或密码不能为空'
		})
	}
	// 第二步,判断前端传过来的账号是否存在
	// 使用mysql的select语句
	const sql='select * from users where account = ?'
	//第一个参数为执行语句，第二个是数据参数，第三个是函数，用与处理结果
	db.query(sql,reginfo.account,(err,results)=>{
		if(results.length>0){
			return res.send({
				status:1,
				message:'账号已存在'
			})
		}
		// 第三步,用bcrypt中间件对密码进行加密
		reginfo.password=bcrypt.hashSync(reginfo.password,10)
		// 第四步,把账号和密码插入users表里
		const sql1='insert into users set ?'
		// 注册用户
		const identity='用户'
		// 创建时间
		const create_time=new Date()
		db.query(sql1,{
			account:reginfo.account,
			password:reginfo.password,
			identity,
			create_time,
			//初始未冻结状态为0
			status:0,
		},(err,results)=>{
			//插入失败
			//affectedRows为影响的行数，如果插入失败，那么就没有影响到行数，也就是行数不为1
			if(results.affectedRows!==1){
				return res.send({
					status:1,
					message:'账号注册失败'
				})
			}
			//插入成功
			res.send({
				status:1,
				message:'账号注册成功'
			})
		})
	})
}
exports.login=(req,res)=>{
	const loginfo=req.body
	// 第一步,查看数据表里有没有前端传过来的数据
	const sql='select * from users where account = ?'
	db.query(sql,loginfo.account,(err,results)=>{
		//执行sql语句失败的情况，一般是数据库断开的情况
		if(err) return res.cc(err)
		if(results.length!==1) return res.cc('登录失败')
		//对前端传过来的数据进行解密
		const compareResult = bcrypt.compareSync(loginfo.password,results[0].password)
		if(!compareResult){
			return res.cc('登录失败')
		}
		//对账号是否被冻结做判断,statu为1则被冻结
		if(results[0].status==1){
			return res.cc('账号被冻结')
		}
		//剔除加密后的密码，头像，创建数据，更新时间
		const user={
			...results[0],
			password:'',
			imageUrl:'',
			create_time:'',
			update_time:'',
		}
		//设置token的有效时长，有效期为7小时
		const tokenStr=jwt.sign(user,jwtconfig.jwtSecretKey,{
			expiresIn:'7h',
		})
		res.send({
			results:results[0],
			status:0,
			message:"登录成功",
			token:'Bearer '+tokenStr,
		})
	})
	
}