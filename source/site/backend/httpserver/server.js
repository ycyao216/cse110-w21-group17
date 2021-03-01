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

// server rest api
const axios = require('axios')
app.use(express.json());


console.log(process.cwd()); // Should start at site folder

// serve website
var root_dir = process.cwd() + "/frontend";

app.get('/', function (req, res) {
  res.sendFile('/html/timer.html', {
    root: "./frontend"
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


// server rest api
app.post('/fetchuserdata', async function (request, response) {
  let fetch_request = request.body;
  if ('token' in fetch_request) {
    let access_token = fetch_request["token"];
    const res = await axios.get(`http://localhost:5000/userdata?userid=${access_token}`);
    if (access_token in res.data) {
      response.send(res.data[access_token]);
    } else {
      response.status(400).send({
        message: "Wrong token"
      });
    }
  } else {
    response.status(400).send({
      message: "Wrong json format"
    });
  }
});


