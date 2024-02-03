import express from"express";
import { validationResult } from "express-validator";
import Post from "../models/Post.js";
import fs from"fs";
import User from "../models/User.js";
import { io } from "../App.js";



async function getPosts(req,res)
{

    let curentPAge=req.query.page||1;
    let postsPerPage=3;
    let totalPosts=await Post.countDocuments();

    let posts=await Post.find().sort({createdAt:-1}).skip((curentPAge-1)*postsPerPage).limit(postsPerPage);
    res.status(200).json({ posts: posts,totalItems:totalPosts });   
}

async function createPost(req,res)
{
    let{title,content}=req.body;
    let erros=validationResult(req);
    if(!erros.isEmpty())
    {
        res.status(422).json({message:"validtion error, data is not correct",erros:erros.array()});
    }
    const imageUrl="http://localhost:5000"+req.file.path.replace(/\\/g, "/").substring("public".length);

    let user=await User.findById(req.userId);

    let post=new Post({title:title,content:content,imageUrl:imageUrl,creator: req.userId});
    await post.save();

    user.posts.push(post);
    await user.save()

    io.emit("posts",{action:"create post",post:post});

    res.status(201).json({message:"created post " ,post:post,creator:{_id:user._id ,name:user.userName} });
}


async function getPost(req,res)
{
    let postId=req.params.postId;
    let post=await Post.findById(postId);
    if(post)
    {
        return res.status(200).json({message:"post fetched",post:post})

    }
    else
    {
        return res.status(404).json({ message: "post not found"});
    }

}


async function updatePost(req,res)
{
    let postId = req.params.postId;
    let { title, content} = req.body;
    let imageUrl;
    if (req.file!==undefined) {
      imageUrl ="http://localhost:5000"+req.file.path.replace(/\\/g, "/").substring("public".length);

    }


    try
    {
        let post=await Post.findById(postId)
        if(post.creator.toString()!=req.userId)
        {
            return res.status(403).json({ message: "not Authorized"});
        }
        if(imageUrl!=undefined)
        {
            let imageName=post.imageUrl.slice(22);
            fs.unlink("images/"+imageName,()=>{
            });
        }
        
        
        post.title=title || post.title;
        post.content=content||post.content;
        post.imageUrl=imageUrl||post.imageUrl;
        post.save();
        io.emit("posts",{action:"update post",post:post});

         res.status(200).json({ message: "upated", post: post });
        
    }
    catch(error)
    {
        console.log(error);
    }
    
}



async function deletePost(req,res)
{
   let postId = req.params.postId;
   let post=await Post.findById(postId);

   if(post.creator.toString()!=req.userId)
   {
        return res.status(403).json({ message: "not Authorized" });
   }

   //getting the name of image of the post to delete
   let imageName = post.imageUrl.slice(22);
   fs.unlink("images/" + imageName, () => {});

   await Post.findByIdAndDelete(postId);
   res.json({message:"deleted sucssesfuly"});

   //delete the post from the user model
   let user=await User.findById(req.userId);
   user.posts=user.posts.filter((post)=>{return post.toString()!= postId});
   await user.save();

  io.emit("posts", { action: "delete post", post: postId });

   

}


export{getPosts,createPost,getPost,updatePost,deletePost};
