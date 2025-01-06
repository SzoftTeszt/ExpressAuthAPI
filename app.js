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

app.listen(3000, ()=>console.log("A servger fut a 3000-es porton!"))