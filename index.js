import express from "express";

const app = express();
const port = 3000

app.listen(port,()=>{
    console.log(`Server Started on port ${port}`)
})

app.get("/", (req,res)=>{
    res.send("<h1>Blog web application</h1>")
})
