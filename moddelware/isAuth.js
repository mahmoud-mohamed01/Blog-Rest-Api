import jwt  from "jsonwebtoken";

async function isAuth (req,res,next)
{

    let auhorizationHeader=req.get("Authorization");
    if(!auhorizationHeader)
    {
     return res.status(401).json({ message: "not Authenticated" });

    }

    let token =auhorizationHeader.split(" ")[1];
    let decodedToken=jwt.verify(token,"supersecret");

    if(!decodedToken)
    {
        return res.status(401).json({message:"not Authenticated"});

    }
    else{
        req.userId=decodedToken.userId;
        next();
    }

}

export default isAuth;