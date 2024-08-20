const joi=require('joi')

//string值是只能为字符串
//alphanum值为a-z A-Z 0-9
//min最大长度	max最小长度
//required必填项
//pattern正则表达式

//账号验证
const account=joi.string().alphanum().min(6).max(12).required()
//密码验证
const password=joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/).min(6).max(18).required()

exports.login_limit={
	//表示对req.body里面的收据进行验证
	body:{
		account,
		password,
	}
}