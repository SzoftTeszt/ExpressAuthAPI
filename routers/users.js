const express= require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()
const users = require("../services/users")
const jwt = require("jsonwebtoken")

const SECRETKEY ="Titkoskod"

function authenticationToken(req,res,next){
    const token =   req.headers.authorization
    console.log("Token", token)
    if (!token) return res.status(401).json({message:"Hozzáférés megtagadva, nincs token!"})
    
    jwt.verify(token, SECRETKEY, (err,user)=>{
        if (err) return res.status(401).json({message:"Hozzáférés megtagadva, érvénytelen token!"})
        req.user=user
        console.log("User", req.user)
        next()    
        })  
    }

router.post("/signup", async(req,res,next)=>{
    let user=req.body
    console.log(user)
    user.password= await bcrypt.hash(user.password,8)
    try{
        res.status(201).json(await users.create(user))
    }
    catch(err){
        next(err)
    }
})


router.post("/signin", async(req,res,next)=>{
    let {email, password}=req.body
    console.log("email", email)
    try{
        const user = await users.getMail(email);
        console.log("User", user)
      
        const passwordMatch = await bcrypt.compare(password, user.password)
        
        if (user && passwordMatch){
            const token = await jwt.sign({id:user.id}, SECRETKEY, {expiresIn:"1h"})
            const resUser= {...user, accessToken:token}
            delete resUser.password
            res.status(200).json(resUser)
        }
        else {
            res.status(401).send("Érvénytelen hitelesítést!")
        }
    
    }
    catch(error){
        console.log()
        next(error)
    }    
})

router.get("/secretdata", authenticationToken, async(req,res)=>{
    res.status(200).json({message:"Itt a titok!"})
})

module.exports= router
