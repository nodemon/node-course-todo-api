const {MongoClient, ObjectID} = require('mongodb'); // ES6 object deconstruction


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // findOneAndUpdate
  //mongodb update operators: eg $set, $inc, $rename, $min, $max
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('593177e1c033e5c48427ed8b')
  }, {
    $set: {
      completed : true
    }
  }, {
    returnOriginal: false
  }).then ( (result) => {
    console.log(result);
  });

  db.collection('Users').findOneAndUpdate({
    $and : [ {name : 'Adam' }, { age:  { $gt: 30 }  }]
  }, {
    $set: {
      name : 'Adam Sr'
    },
    $inc: {
      age : 2
    }
  }, {
    returnOriginal: false
  }).then ( (result) => {
    console.log(result);
  });



});
