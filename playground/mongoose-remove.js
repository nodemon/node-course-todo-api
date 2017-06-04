const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {ObjectID} = require('mongodb');

Todo.remove({}).then( (result) => {
  console.log(result);
});

Todo.findOneAndRemove({_id:'59336262b12bea04d8c1904f'}).then( (todo) => {
  console.log(todo);
});


Todo.findByIdAndRemove('59336262b12bea04d8c1904f').then( (todo) => {
  console.log(todo);
});
