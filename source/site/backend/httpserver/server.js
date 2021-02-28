// serve website
const express = require('express');
const app = express();
const httpport = 3000;

// serve database
const jsonServer = require('json-server')
const jsonport = 5000;
const server = jsonServer.create()
const router = jsonServer.router('backend/data/db.json')
const middlewares = jsonServer.defaults()

console.log(process.cwd()); // Should start at site folder

// serve website
var root_dir = process.cwd() + "/frontend";

app.get('/', function(req, res) {
    res.sendFile('html/timer.html', {
        root: "./"
    });
});

app.use('/', express.static(root_dir));

app.listen(httpport, () => console.log(`http server running on port ${httpport}!`));



// serve database
server.use(middlewares)
server.use(router)
server.listen(jsonport, () => {
  console.log(`json server running on port ${jsonport}!`)
})
