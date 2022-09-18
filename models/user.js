require("dotenv").config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator');
const jwt = require('jsonwebtoken')
const Article = require('./article')
const Userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    } 
    ,tokens:[{
            token:{
                type:String,
                required:true
            }
        }]
    
},{
    timestamps:true
})

Userschema.pre("save", async function(next){
    const user = this 
    
  if(user.isModified('password')){
      user.password = await bcrypt.hash(user.password,8)
  }
  next();
  })

  Userschema.pre("remove", async function(next){
    const user = this
      await Article.deleteMany({ author:user._id })
    next();
    
   })
// this  is used  to prevent the tokens and password
// from being sent back  to the user when a user is logged in

Userschema.methods.generateAuthToken =  async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.PAYLOAD,{ expiresIn: '1hr' });
    user.tokens = user.tokens.concat({token});
    await user.save();

    return token; 
}

   Userschema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}

// this is used to verify the user credentials
// i.e email and password sent in login is correct
Userschema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({ email })
    if(!user){
        throw new Error ('Unable to login');
    }
    const ismatch = await bcrypt.compare(password,user.password);
    if(!ismatch){
        throw new Error('Unable to login');
    }
    return user
}

Userschema.virtual('articles',{
    ref:'Article',
    foreignField:'author',
    localField:'_id'
});
const User = mongoose.model('User', Userschema);
module.exports = User