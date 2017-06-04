// this is an ORM (Object Relational Model) as opposed to the native library used in the playground
var mongoose = require('mongoose');

// Tell mongoose that we want to use the built-in promise library as opposed to any 3 party
mongoose.Promise = global.Promise;
// since we are using a mlab db .. will need to config PROCESS.env.MONGODB_URI
// heroku config:set MONGODB_URI=somevalue .. or set on the web portal
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose
};
