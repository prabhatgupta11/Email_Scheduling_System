const express=require("express")
const { connection } = require("mongoose")
require("dotenv").config()
const app=express()
app.use(express.json())


app.listen(process.env.PORT,async()=>{
    try{
       await connection;
       console.log("Connected to db")

    }catch(err)
    {
        console.log(err.message)
    }
    console.log(`server is running at ${process.env.PORT}`)
})