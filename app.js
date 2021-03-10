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

app.use(express.static('src'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


