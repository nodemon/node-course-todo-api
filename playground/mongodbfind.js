const {MongoClient, ObjectID} = require('mongodb'); // ES6 object deconstruction

var obj = new ObjectID();
console.log(obj); // this will generate a new objectID

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');


  db.collection('Todos').find({
    _id : ObjectID('59303392a2e5311cc86f9b67')
  }).toArray()
  .then((docs)=>{
    console.log(JSON.stringify(docs, undefined, 2));
  },(err)=>{
    console.log('error' + err);
  });

  db.collection('Todos').find({completed: true}).count().then((count) => {
      console.log('Todo completed count' + count);
  })

  db.collection('Todos').find({
    _id : ObjectID('59303392a2e5311cc86f9b67')
  }).toArray()
  .then((docs)=>{
    console.log(JSON.stringify(docs, undefined, 2));
  },(err)=>{
    console.log('error' + err);
  });


});
