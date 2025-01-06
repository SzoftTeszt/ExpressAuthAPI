const express= require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()
const users = require("../services/users")
const jwt = require("jsonwebtoken")

const SECRETKEY ="Titkoskod"

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
            const resUser= {...user, accestoken:token}
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


module.exports= router
