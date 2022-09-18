const Article = require('../models/article');
const mongoose = require('mongoose');
const express = require('express');
const Router = new express.Router();
const auth = require('../middlewares/auth')
const { sendEmailwhenpostarticle} = require('../emails/welcome')
// create a new article
Router.post('/article',auth, async(req,res)=>{
    try{
  const article = await new Article({
    ...req.body,
    author:req.user._id
});
sendEmailwhenpostarticle(req.user.email,req.user.name);
  await article.save();
  res.status(201).send(article);
    }
    catch(err){
        res.status(500).send(err)

    }
});
//get all artices that the user himself has created
Router.get('/article',auth,async(req,res)=>{
    try{
  const article = await Article.find({ author:req.user._id})
  res.status(200).send(article);

    }
    catch(err){
        res.status(500).send(err)
    }
})
// get articles a user has created by id
Router.get('/article/:id',auth,async(req,res)=>{
try{
    const id = req.params.id
    if(!id){
        res.status(400).send()
    }
    const article =  await Article.findOne({
        id,
        author:req.user._id
    })
    if(!article){
        res.status(404).send("no article found")
    }
    res.status(200).send(article);

}
catch(err){
    res.status(500).send(err)
}
})
// get an article an update
Router.patch('/article/:id',auth, async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedupdates = ['title','body'];
    const isvalidoperation = updates.every((update)=>allowedupdates.includes(update))
    if(!isvalidoperation){
        return res.status(400).send({error:'invalid updates'});

    } 
    try{
        const id = req.params.id
   const article=  await Article.findOne({
      id
    ,author:req.user._id
})
   if(!article){
     return res.status(400).send('no recipe found');
   }
   updates.forEach((update) => article[update] = req.body[update])
        await article.save()
   res.status(200).send(article);

    }
    catch(err){
  res.status(404).send({error:'something went wrong'});
   }
})

Router.delete('/article/:id',auth,async(req,res)=>{ 
    const id = req.params._id
     try{
    
     const article= await Article.findOneAndRemove({
        id,
        author:req.user._id
    })
     if(!article){
        res.status(404).send({message:'article  not found'});
     }
     
     res.status(200).send(article);
     }
     catch(err){
     res.status(500).send({'message':'article not found'})
     }
     
     });
// get all 
     Router.get('/allarticles',async(req,res)=>{
        try{
    
      const allarticles = await Article.find({})
      res.status(200).send(allarticles);
        }
        catch(err){
          res.status(404).send(err)
        }
    
        });
module.exports = Router
