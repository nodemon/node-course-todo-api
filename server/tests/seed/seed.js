const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const user1_Id = new ObjectID();
const user2_Id = new ObjectID();

const testUsers = [{
  _id: user1_Id,
  email: 'user1@email.com',
  password: 'user1pass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: user1_Id.toHexString(), access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: user2_Id,
  email: 'user2@email.com',
  password: 'user2pass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: user2_Id.toHexString(), access: 'auth'}, 'abc123').toString()
  }]
}]

const testTodos = [{
   _id: new ObjectID(),
   text : 'First test todo',
   _creator: user1_Id
 }, {
   _id: new ObjectID(),
    text : 'Second test todo',
    _creator: user2_Id,
    completed: true,
    completedAt: 333
  }];

const populateTodos = (done) => {
  Todo.remove({}).then( () => {
    return Todo.insertMany(testTodos);
  }).then( ()=> done());
}

const populateUsers = (done) => {
  User.remove({}).then( () => {
    var user1Promise = new User(testUsers[0]).save();
    var user2Promise = new User(testUsers[1]).save();

    return Promise.all([user1Promise, user2Promise]);
  }).then(() => done());
}

module.exports = {testTodos, populateTodos, testUsers, populateUsers};
