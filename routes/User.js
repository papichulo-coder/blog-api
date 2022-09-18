const User = require('../models/user');
const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');
const Article = require('../models/article');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/welcome')
router.post('/user/signup',async (req,res)=>{
    try{
       const user = await new User(req.body);
       const token =  await user.generateAuthToken()
       
      await user.save()  
      sendWelcomeEmail(user.email, user.name)
      res.status(201).send({user,token});
    }
    catch(err){
       res.status(500).send(err)
    }
    }
  )
  
   
   router.post('/user/login',async (req,res)=>{
     try{
      
   const user = await User.findByCredentials(req.body.email,req.body.password);
  const token =  await user.generateAuthToken()
   res.send({user,token}); 
     }
     catch(e){
  res.status(500).send({message:"either email or password incorrect try again later"})
     }
   })
  
   router.post('/user/logout',auth,async (req,res)=>{
     try{
  req.user.tokens = req.user.tokens.filter((token)=>{
   return token.token !== req.token
  });
    await req.user.save();
    res.send({message:'you have logged out'})
     }
     catch(err){
  res.send({message:'error occured'});
  
     }
   })
  // this route is used to get details of a logged in user

   router.get('/user/me',auth,async (req,res)=>{
  res.send(req.user)
       
   })
  
  
  // this is to delete a user account
  
   router.delete('/user/me',auth,async (req,res)=>{ 
    try{
      sendCancelationEmail(user.email, user.name)
    await req.user.remove()
  
    res.status(200).send(req.user)
    }
    catch(err){
     res.status(500).send({'message':'user not found'})
     }
            
    });
  
  router.patch('/user/me/' ,auth,async (req,res)=>{
   //this helps to check if  the keyword to  be updated is a part of the models
   //if false it  returns  an error if true it continues with the updating process
           
  const updates = Object.keys(req.body);
   const allowedupdates =['name','email','password','age'];
  const isvalidoperation = updates.every((update)=>allowedupdates.includes(update))
   if(!isvalidoperation){
      res.status(400).send({'error':'this cant be updated '})
    }
  
  try{
  
   updates.forEach((update)=>{
     req.user[update]= req.body[update]
   })
      await req.user.save();
  
    res.send(req.user)
   }
    catch(err){
    res.send(err);
    }
     })
  
     router.post('/user/logoutall',auth,async (req,res)=>{
      try{
     req.user.tokens =[]
     await req.user.save();
     res.send({message:'logged out of all devices'});
  
      }
      catch(err){
   res.send({message:'login again to do this'});
   
      }
    })
    // this is the route where all  public users can read all th articles
    
  module.exports = router