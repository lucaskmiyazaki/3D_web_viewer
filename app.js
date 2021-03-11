const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const path = require('path');


app.get('/', (req, res) => {
    const file = req.url === '/' ? 'index.html' : req.url;
    const filePath = path.join(__dirname, "src", file);

    fs.readFile(
        filePath,
        (err, content) => {
            if(err) throw err
            res.end(content)
        }
    );
})

app.get('/models', (req, res) =>{
    const folderPath = path.join(__dirname, 'src/models');
    fs.readdir(folderPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        list = {"models": []};
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            list["models"].push(file);
        });
        console.log(list);
        res.end(JSON.stringify(list));
    });
})

app.use(express.static('src'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


