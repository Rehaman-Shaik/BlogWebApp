import fs, { writeFile } from 'fs/promises';
import bodyParser from "body-parser";
import express from "express";


//variables 
const app = express();
const port = 3000


//functions
async function readfile(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error:', err);
    }
}


async function writefile(dataList) {
    try {
        const jsonData = JSON.stringify(dataList, null, 2);
        await writeFile('blogs.json', jsonData, 'utf8');
    } catch (err) {
        console.log('Error writing to file:', err)
    }
}


app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));


// routes
app.listen(port, () => {
    console.log(`Server Started on port ${port}`)
})

app.get("/home", (req, res) => {
    res.render("index.ejs")
})

app.get("/add_blog", (req, res) => {
    res.render("add_blog.ejs")
})


app.post("/blog_submit", async  (req, res) => {
    let dataList = await readfile('blogs.json');
        const new_data = {
            id: dataList.length > 0 ? dataList.length + 1 : 1,
            title: req.body.title,
            description: req.body.description,
            author : req.body.author,
            date : req.body.date
        };
        dataList.push(new_data);
        await writefile(dataList);
        res.redirect("/home");
})

app.get("/blogs", async (req, res) => {
    let dataList = await readfile("blogs.json")
    res.render("blogs.ejs", {
        list: dataList
    })
})

app.get("/about", (req, res) => {
    res.render("about.ejs")
})

app.post("/blog", async (req, res) => {
    let dataList = await readfile("blogs.json")
    let index = req.body["id"] - 1
    const dict = dataList[index]
    res.render("blog.ejs", {
        data: dict
    })
})

app.post("/delete_blog", async (req, res) => {
    let dataList = await readfile("blogs.json")
    let index = req.body["id"] - 1
    dataList.splice(index, 1)
    dataList.forEach((item, index) => {
        item.id = index + 1;
    });
    writefile(dataList);        
    res.redirect("/blogs")
})

app.get("/", (req, res) => {
    res.render("landing.ejs")
})


//app.get("/login", (req, res) => {
//    res.render("login.ejs")
//})

app.get("/signup", (req, res) => {
    res.render("signup.ejs")
})

app.post("/signup_", async (req, res) => {
    let dataList = await readfile('users.json');
        const new_data = {
            id: dataList.length > 0 ? dataList.length + 1 : 1,
            username: req.body["username"],
            fname: req.body["fname"],
            lname: req.body["lname"],
            email: req.body["email"],
            password: req.body["password"]
        };
    dataList.push(new_data);
    await writefile(dataList);
    res.redirect("/home");
})

app.post("/update_blog_page", async (req, res) => {
    let dataList = await readfile("blogs.json")
    let index = req.body["id"] - 1
    const dict = dataList[index]
    res.render("update_blog.ejs", {
        data : dict
    })
})

app.post("/update_blog", async (req, res) =>{
    let newData = {
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        date: req.body.date
      };
    let dataList = await readfile("blogs.json")
    let itemToUpdate = dataList.find(item => item.id == req.body.id);
    if (itemToUpdate) {
      let obj = Object.assign(itemToUpdate, newData); // Update properties of the dictionarys
      await writefile(dataList)
    }
    writefile(dataList)
    res.redirect("/blogs")
}) 