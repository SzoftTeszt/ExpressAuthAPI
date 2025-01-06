const express= require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()
const users = require("../services/users")

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


module.exports= router
