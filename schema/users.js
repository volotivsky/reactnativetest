import mongoose from "mongoose";

const Schema_user = new mongoose.Schema({
    number:{
        type:String,
        require:true
    },
    chats:{
        type:Array
    }

})

export default mongoose.model('users', Schema_user)