const {MongoClient, ObjectID} = require('mongodb'); // ES6 object deconstruction

var obj = new ObjectID();
console.log(obj); // this will generate a new objectID

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: false
  }, (err, result) => {
    if (err) {
      console.log('Unable to insert todo')
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  })

  db.collection('Users').insertOne({
    _id : 1,  // can set _id to anything unique
    name: 'Nikhil',
    age : 31
  }, (err, result) => {
    if (err) {
      console.log('Unable to insert user')
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  })

  db.close();
});
