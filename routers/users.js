const express= require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()
const users = require("../services/users")
const jwt = require("jsonwebtoken")

// const crypto = require('crypto')
// const kod = crypto.randomBytes(32).toString('hex')
// console.log("Kód: ", kod)
require('dotenv').config()
const SECRETKEY = process.env.SECRETKEY
console.log("Kód: ",  SECRETKEY)

function authenticationToken(req,res,next){
    // const token =   req.headers.authorization

    const token = req.cookies.token
    console.log("Token:",  req.cookies)
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
            res.cookie('token', token, {
                httpOnly:true,
                secure:true,
                sameSite:'none',
                maxAge:3600000
            })
            
            // const resUser= {...user, accessToken:token}
            const resUser= {...user}
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

router.put('/update-profile',authenticationToken, async(req, res)=>{
    const {address, userName} = req.body
    try {
        const updateUser= await users.updateprofile(req.user.id, {address, userName})
    }
    catch(err){
        res.status(401).send("Hiba történt a profile frissítésekor!")
    }

})


router.post("/logout", authenticationToken, async(req,res)=>{
    res.cookie('token', '', {
        httpOnly:true,
        secure:true,
        sameSite:'none',
        expires: new Date(0)
    })
    res.status(200).json({message:"A kijelentkezés sikeres!"})
})

module.exports= router
