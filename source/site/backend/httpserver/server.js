const express = require('express');
const app = express();
const port = 3000;

console.log(process.cwd()); // Should start at frontend folder

var root_dir = process.cwd();

app.get('/', function (req, res) {
    res.sendFile('html/timer.html', {
        root: "./"
    });
});

app.use('/', express.static(root_dir));

app.listen(port, () => console.log(`listening on port ${port}!`));