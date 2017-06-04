if (!process.env.NODE_ENV) {
  // NODE_ENV is an environment varaible which will be set by Heroku
  // We set it to 'TEST' in package.json -> npm test
  // So if not set: default to DEV
  process.env.NODE_ENV = 'DEV';
}

if (process.env.NODE_ENV === 'DEV') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (process.env.NODE_ENV === 'TEST') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';  
}
