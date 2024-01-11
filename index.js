import express from "express";
import mongoose from "mongoose";
import Schema_post from './schema/post.js'
import Schema_user from './schema/users.js'
import cors from 'cors'
import jwt from "jsonwebtoken";
import checkAuth from './checkAuth.js'
const app = express()
mongoose.connect('mongodb+srv://reganme0:dfwUOo9d0n0xflw4@vlavol.cptqlrl.mongodb.net/testmobile?retryWrites=true&w=majority')
.then(()=>console.log('DB ok'))
.catch(()=>console.log('DB err'))

app.use(express.json())
app.use(cors())

app.get('/', async (req,res)=>{
    const posts =await Schema_post.find()
    res.json(posts)
})
app.post('/user', async (req,res)=>{
    const users = await Schema_user.findOne({
        number:req.body.number
    })
    if (users) return res.status(401).json({mes:'пользователь с таким телефоном существует'})
    const doc = await Schema_user({  
        number:req.body.number 
    })
    const user = await doc.save()
    const token = jwt.sign({userId:user._id}, 'secret')
    res.json(token)
})
app.post('/',checkAuth, async (req,res)=>{
    try{
        const date = new Date()
        const time = date.getHours()+':'+date.getMinutes()
        const user = await Schema_user.findById({
            _id:req.userId
        })
        const friend = await Schema_user.findOne({
            number:req.body.number
        })
        for (let i = 0;i<user.chats.length;i++){
            let chat = user.chats[i]
            if(chat.name==req.body.number){
                let cha = chat.sms
                cha.push(req.body.sms)
                chat.sms=cha
                user.chats[i]=chat
                await Schema_user.findByIdAndUpdate({
                    _id:req.userId
                },{
                    chats:user.chats
                })
            }
        }
        for (let i = 0;i<friend.chats.length;i++){
            let chat = friend.chats[i]
            if(chat.name==user.number){
                let cha = chat.sms
                cha.push(req.body.sms)
                chat.sms=cha
                friend.chats[i]=chat
                await Schema_user.findOneAndUpdate({
                    number:req.body.number
                },{
                    chats:friend.chats
                })
            }
            return( res.json('успешно'))
        }
        res.json('ошибка')


        
        
    }catch(err){
        console.log(err)
    }
})
app.get('/auth', checkAuth, async (req,res)=>{
    try{
        const user = await Schema_user.findById({
            _id:req.userId
        })
        if (!user) return res.json('не удалось проверить аунтификацию')
        res.json(user)
    }catch(err){
        res.json(err)
    }
})
app.post('/chat', checkAuth, async (req,res)=>{
    const user = await Schema_user.findById({
        _id:req.userId
    })
    const friend = await Schema_user.findOne({
        number:req.body.number
    })
    if(!friend) return res.status(100).json('Пользователя не существует')
    for(let i=0; i<user.chats.length;i++){
        let chat = user.chats[i]
        if(chat.name==req.body.name){
            return res.status(404).json('Пользователь уже есть в чате')
        }
    }
    let list = user.chats
    list.push({name:req.body.number, sms:[]})
    let listfriend = friend.chats
    listfriend.push({name:user.number, sms:[]})
    await Schema_user.findOneAndUpdate({
        _id:req.userId
    },{
        chats:list
    })
    await Schema_user.findByIdAndUpdate({
        _id:friend._id
    },{
        chats:listfriend
    })
    const user2 = await Schema_user.findById({
        _id:req.userId
    })
    res.json(user2)
})
app.listen(1111, ()=>{
    console.log('server ok')
})
