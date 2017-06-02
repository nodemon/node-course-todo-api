// this is an ORM (Object Relational Model) as opposed to the native library used in the playground
var mongoose = require('mongoose');

// Tell mongoose that we want to use the built-in promise library as opposed to any 3 party
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
};
