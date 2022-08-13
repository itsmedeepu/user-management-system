const mongoose=require("mongoose")
const Users=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true

    },
    status:{
        type:Boolean,
        default:false


    }

})
module.exports= mongoose.model("Users",Users);