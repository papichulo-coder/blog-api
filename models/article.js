require("dotenv").config()
const mongoose = require('mongoose')
const Articleschema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description: {
        type: String,
        min:20,
        max:200
      },
    body: {
        type: String,
        required: true,
        min:20,
        max:20000
      },
 author:{
        ////this is used to connect the user and recipes
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    }
},{
    timestamps:true
}
)
const Article = mongoose.model('article',Articleschema)
module.exports= Article