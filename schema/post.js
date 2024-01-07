import mongoose from "mongoose";

const Schema_post = new mongoose.Schema({
    text:{
        type:String
    },
    time:{
        type:String
    }
})

export default mongoose.model('posts', Schema_post)