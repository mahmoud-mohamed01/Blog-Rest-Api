import {Router} from "express"
import {body}from"express-validator";
import { createPost, getPosts,getPost, updatePost, deletePost } from "../controllers/feed.js";
import isAuth from "../moddelware/isAuth.js";

let feedRouter=Router();


//get 
feedRouter.get("/posts",isAuth,getPosts)
feedRouter.get("/post/:postId",isAuth, getPost);


feedRouter.post("/post",isAuth,body("title").isLength({min:5}),createPost);
feedRouter.put("/post/:postId",isAuth, updatePost);


feedRouter.delete("/post/:postId",isAuth, deletePost);






export default feedRouter;