const express= require("express")
const usersRouter =require("./routers/users")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()

app.use(cors({origin:["*"]}))

app.use(bodyParser.json())

app.use("/users", usersRouter)

app.get("/", (req,res)=>{
    res.json({message:"Ok"})
})


app.use((err, req, res, next)=>{
    console.log(err.message, err.stack)
    res.status(err.statusCode||500).json({message:err.message})
    return
})


app.listen(3000, ()=>console.log("A servger fut a 3000-es porton!"))