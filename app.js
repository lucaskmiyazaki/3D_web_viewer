const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

// Export files
app.get('/', (req, res) => {
    const file = req.url === '/' ? 'index.html' : req.url;
    const filePath = path.join(__dirname, "public", file);

    fs.readFile(
        filePath,
        (err, content) => {
            if(err) throw err
            res.end(content)
        }
    );
})

// Export the names of the model files
app.get('/models', (req, res) =>{
    const folderPath = path.join(__dirname, 'public/models');
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

// Slicer
app.get('/slic3r', (req, res) => {
    childProcess.exec('slic3r public/models/HumanHeart.stl -o public/gcode',
        function (error, stdout, stderr) {

            if (stderr){
                console.log({ message: stderr });
            }

            if (stdout){
                console.log(stdout);
                res.end();
            }

            if (error){
                console.log(error);
            }
        }
    );
})

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


