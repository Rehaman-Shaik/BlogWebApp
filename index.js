import fs from "fs";
import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port,()=>{
    console.log(`Server Started on port ${port}`)
})

app.get("/", (req,res)=>{
    res.render("index.ejs")
})

app.get("/blogs", (req,res)=>{
    res.send("<h1>Blogs</h1>")
})

app.get("/add_blog", (req,res)=>{
    res.render("add_blog.ejs")
})

app.post("/blog_submit",(req,res)=>{
    console.log(req.body)
    //console.log(req.body["title"])
    const data = [{
        title : req.body["title"],
        description : req.body["description"]
    }]
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFile('blogs.json', jsonData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data written to file successfully!');
        }
    });
    res.redirect("/")
})

app.get("/about", (req,res)=>{
    res.send("<h1>About</h1>")
})