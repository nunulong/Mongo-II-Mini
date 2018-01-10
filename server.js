const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Person = require('./models.js');

const port = process.env.PORT || 3000;

const server = express();

// error status code constants
const STATUS_SERVER_ERROR = 500;
const STATUS_USER_ERROR = 422;

server.use(bodyParser.json());

// Your API will be built out here.
server.get('/users', (req, res) => {
  Person.find({})
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(`Error: ${error}`);
    });
});

server.get('/users/:direction', (req, res) => {
  const dir = req.params.direction;
  Person.find({}).sort({ firstName: `${dir}` })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    });
});

server.get('/user-get-friends/:id', (req, res) => {
  const { id } = req.params;
  Person.findById(id)
    .then(user => {
      res.status(200).json(user.friends);
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    });
});

server.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updateInfo = req.body;
  console.log(req.body);
  Person.findByIdAndUpdate(id, updateInfo)
    .then(user => {
      user.save();
      res.status(200).json({ message: "User updated successfully" });
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    });
});

mongoose.Promise = global.Promise;
const connect = mongoose.connect('mongodb://localhost/people', {
  useMongoClient: true
});
/* eslint no-console: 0 */
connect.then(
  () => {
    server.listen(port);
    console.log(`Server Listening on ${port}`);
  },
  err => {
    console.log('\n************************');
    console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
    console.log('************************\n');
  }
);
