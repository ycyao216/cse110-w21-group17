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

app.get('/user(/*)', function (req, res) {
  res.sendFile('/html/timer.html', {
    root: "./frontend"
  });
});

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
    axios.get(`http://localhost:5000/userdata/${access_token}`)
      .then(res => {
        response.send(res.data);
      })
      .catch(error => {
        axios.post(`http://localhost:5000/userdata/`, {
          "id": access_token,
          "task_list_data": [],
          "user_log": [
            {
              "login_timestamp": "",
              "timer_state": "timer_init",
              "task": null,
              "accumulated_cycles": 0,
              "online": true
            }
          ],
          "settings": {
            "short_break_sec": 3,
            "short_break_cycles": 1,
            "long_break_sec": 5,
            "long_break_cycles": 4
          }
        }).then(res => response.send(res.data));
      });
  }
});

app.post('/uploaduserdata', async function (request, response) {
  let fetch_request = request.body;
  if ('data' in fetch_request && 'token' in fetch_request) {
    let access_token = fetch_request["token"];
    axios.put(`http://localhost:5000/userdata/${access_token}`, fetch_request["data"]).then(res => response.send(res.data));
  }
});
