require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then( (doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)){
    return res.status(400).send('Invalid Id');
  }

  Todo.findById(id).then( (todo)=> {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)){
    return res.status(400).send('Invalid Id');
  }

  Todo.findByIdAndRemove(id).then( (todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  // picks the following properties if they exist in the request
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid Id');
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then( (todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// POST /users
app.post('/users', (req, res) => {

  var body = _.pick(req.body, ['email', 'password']);

  var user = new User(body);

  user.save().then((user) => { // this user is the same object as defined above
    return user.generatAuthToken();
  }).then ((token) => {
    res.header('x-auth', token).send(user);
  }).catch( (e) => {
     res.status(400).send(e);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Started on port ${process.env.PORT}`);
})

module.exports = {app};
