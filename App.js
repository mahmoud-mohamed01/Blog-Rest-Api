import express from "express";
import feedRouter from "./routes/feed.js";
import cors from"cors";
import mongoose from "mongoose";
import multer from "multer";
import auth from"./routes/auth.js";
import {Server} from"socket.io";

const App=express();
const portNumber=5000;


const fileStorage=multer.diskStorage(
    {
        destination:(req,file,cb)=>
        {
            cb(null,"images");
        },
        filename:(req,file,cb)=>
        {
            cb(null,Date.now()+file.originalname);
        }
    });



App.use(express.urlencoded({extended:true}));
App.use(express.json());
App.use(express.static("images"));
App.use(cors());

App.use(multer({storage:fileStorage}).single("image"));


App.use("/feed",feedRouter);
App.use("/auth",auth);


let server=App.listen(portNumber,async(req,res)=>
{  
    await mongoose.connect("mongodb+srv://admin-mahmoud:mahmoud123@cluster0.rkskfqb.mongodb.net/updatedBlog");
    console.log("server started at port: "+portNumber);
});

const io = new Server(server, { cors: { origin: "http://localhost:3000" } });

io.on("connection", (client) => {
  console.log("client conneected");
});


export{io};