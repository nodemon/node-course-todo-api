/* Middleware to handle user authentication */
const {User} = require('./../models/user');


var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then( (user) => {
    if (!user) {
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch( (e) => {
    res.status(401).send(); // return 401 response
  })
}

module.exports = {authenticate};
