import express from "express";

const app = express();
const port = 3000

app.use(express.static("public"))

app.listen(port,()=>{
    console.log(`Server Started on port ${port}`)
})

app.get("/", (req,res)=>{
    res.render("index.ejs")
})

app.get("/blogs", (req,res)=>{
    res.send("<h1>Blogs</h1>")
})

app.get("/about", (req,res)=>{
    res.send("<h1>About</h1>")
})