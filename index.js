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
        if (data.length != 0) {
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
        }}
        else{
            const dataList = []
            const new_data = {
                id: 1,
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
        }
    });
})

app.get("/blogs", (req, res) => {
    fs.readFile('blogs.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
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
    res.render("about.ejs")
})

app.post("/blog", (req, res) => {
    fs.readFile('blogs.json', 'utf8', (err, data) => {
        const dataList = JSON.parse(data);
        let index = req.body["id"] - 1
        const dict = dataList[index]
        res.render("blog.ejs", {
            data: dict
        })
    });
})

app.post("/delete_blog", (req, res) => {
    fs.readFile('blogs.json', 'utf8', (err, data) => {
        const dataList = JSON.parse(data);
        let index = req.body["id"] - 1
        dataList.splice(index, 1)
        dataList.forEach((item, index) => {
            item.id = index + 1;
        });
        const jsonData = JSON.stringify(dataList, null, 2);
        fs.writeFile('blogs.json', jsonData, 'utf8', (err) => {
            console.log('Data written to file successfully!');
        });
    });
    res.redirect("/blogs")
})