import fs, { writeFile } from 'fs/promises';
import bodyParser from "body-parser";
import express from "express";


//variables 
const app = express();
const port = 3000


//functions
async function readfile() {
    try {
        const data = await fs.readFile('blogs.json', 'utf8');
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


app.post("/blog_submit", (req, res) => {
    readfile()
        .then(dataList => {
            if (dataList.length != 0) {
                let len = dataList.length + 1
                const new_data = {
                    id: len,
                    title: req.body["title"],
                    description: req.body["description"]
                }
                dataList.push(new_data)
                writefile(dataList);
                res.redirect("/")
            } else {
                const dataList = []
                const new_data = {
                    id: 1,
                    title: req.body["title"],
                    description: req.body["description"]
                }
                dataList.push(new_data)
                writefile(dataList);
                res.redirect("/")
            }
        })
})

app.get("/blogs", (req, res) => {
    readfile()
        .then(dataList => {
            res.render("blogs.ejs", {
                list: dataList
            })
        })
})

app.get("/about", (req, res) => {
    res.render("about.ejs")
})

app.post("/blog", (req, res) => {
    readfile()
        .then(dataList => {
            let index = req.body["id"] - 1
            const dict = dataList[index]
            res.render("blog.ejs", {
                data: dict
            })
        })
})

app.post("/delete_blog", (req, res) => {
    readfile()
        .then(dataList => {
            let index = req.body["id"] - 1
            dataList.splice(index, 1)
            dataList.forEach((item, index) => {
                item.id = index + 1;
            });
            writefile(dataList);

        })
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

app.post("/signup_", (req, res) => {
    res.render("signup.ejs")
})