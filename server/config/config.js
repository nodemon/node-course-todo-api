if (!process.env.NODE_ENV) {
  // NODE_ENV is an environment varaible which will be set by Heroku
  // We set it to 'TEST' in package.json -> npm test
  // So if not set: default to DEV
  process.env.NODE_ENV = 'DEV';
}

/*
  Heroku config varaibles commands
    heroku config - lists all
    heroku config:set NAME=Nikhil
    heroku config:get NAME
    heroku config:unset NAME

*/



if (process.env.NODE_ENV === 'DEV' || process.env.NODE_ENV === 'TEST') {
  var config = require('./config.json');
  var envConfig = config[process.env.NODE_ENV];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}


/*
{
  "TEST": {
    "PORT": 3000,
    "MONGODB_URI" : "mongodb://localhost:27017/TodoAppTest",
    "JWT_SECRET" : "sjdfhsdfh430348530hsdf4-934jh"
  },
  "DEV" : {
    "PORT": 3000,
    "MONGODB_URI" : "mongodb://localhost:27017/TodoApp",
    "JWT_SECRET" : "223kj-9df-90f-9df-ddf9d-8gd"
  }
}
*/
