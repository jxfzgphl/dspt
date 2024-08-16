const express=require('express')
const app=express()

const bodyparser=require('body-parser')

const cors=require('cors')
app.use(cors())

//	当extended为false时，值为数组和字符串；为true时，值为任意类型
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.listen(3007, () => {
	console.log('http://127.0.0.1:3007:')
})