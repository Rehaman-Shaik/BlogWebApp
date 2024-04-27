import fs from 'fs/promises';
import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000


async function readfile() {
    try {
        const data = await fs.readFile('blogs.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error:', err);
        throw err; // Re-throw the error to handle it outside
    }
}

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
                const jsonData = JSON.stringify(dataList, null, 2);
                fs.writeFile('blogs.json', jsonData, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing to file:', err);
                    } else {
                        console.log('Data written to file successfully!');
                    }
                });
                res.redirect("/")
            } else {
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
        })
        .catch(err => {
            // Handle error
            console.error('Error:', err);
        });
})

app.get("/blogs", (req, res) => {
    readfile()
        .then(dataList => {
            res.render("blogs.ejs", {
                list: dataList
            })
        })
        .catch(err => {
            // Handle error
            console.error('Error:', err);
        });
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
        .catch(err => {
            // Handle error
            console.error('Error:', err);
        });
})

app.post("/delete_blog", (req, res) => {
    readfile()
        .then(dataList => {
            let index = req.body["id"] - 1
            dataList.splice(index, 1)
            dataList.forEach((item, index) => {
                item.id = index + 1;
            });
            const jsonData = JSON.stringify(dataList, null, 2);
            fs.writeFile('blogs.json', jsonData, 'utf8', (err) => {
                console.log('Data written to file successfully!');
            });
        })
        .catch(err => {
            // Handle error
            console.error('Error:', err);
        });
    res.redirect("/blogs")
})