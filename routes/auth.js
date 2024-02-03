import express from "express";
import { body } from "express-validator";
import { login, signup } from "../controllers/auth.js";


let userRouter=express.Router();


userRouter.put("/signup",
body("email","enter valid email").notEmpty().isEmail(),
body("password").isLength({min:5}),
body("name").not().isEmpty(),
signup
)


userRouter.post("/login",login)




export default userRouter;