import fs from "fs";
import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server Started on port ${port}`)
})

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.get("/add_blog", (req, res) => {
    res.render("add_blog.ejs")
})

app.post("/blog_submit", (req, res) => {
    fs.readFile('blogs.json', 'utf8', (err, data) => {
        try {
            const dataList = JSON.parse(data);
            let len = dataList.length + 1
            const new_data = {
                id: len,
                title: req.body["title"],
                description: req.body["description"]
            }
            dataList.push(new_data)
            const jsonData = JSON.stringify(dataList, null, 2);
            fs.writeFile('blogs.json', jsonData, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                } else {
                    console.log('Data written to file successfully!');
                }
            });
            res.redirect("/")

        } catch (err) {
            console.error('Error parsing JSON:', err);
        }
    });
})

app.get("/blogs", (req, res) => {
    fs.readFile('blogs.json', 'utf8', (err, data) => {
        try {
            const dataList = JSON.parse(data);
            res.render("blogs.ejs", {
                list: dataList
            })
        } catch (err) {
            console.error('Error parsing JSON:', err);
            res.render("blogs.ejs")
        }
    });
})

app.get("/about", (req, res) => {
    res.send("<h1>About</h1>")
})

app.post("/blog", (req, res) => {
    console.log(req.body)
    res.send("<h1>About</h1>")
})