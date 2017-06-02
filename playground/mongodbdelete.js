const {MongoClient, ObjectID} = require('mongodb'); // ES6 object deconstruction


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');


  // deleteMany
  // db.collection('Todos').deleteMany({text: "Something to do 1"})
  // .then( (result)=> {
  //   console.log(result);
  // });

  //deleteOne
  // db.collection('Todos').deleteOne({text: "Something to do"})
  // .then ( (result) => {
  //   console.log(result);
  // })

  //findOneAndDelete: will return the document deleted
  db.collection('Todos').findOneAndDelete({completed: false})
  .then ( (result) => {
    console.log(result);
  })

});
