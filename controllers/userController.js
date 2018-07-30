var User = require('../models/user');
var bcrypt = require('bcryptjs');

module.exports = {
  getAllUsers: function(params, callback) {
    User.find(params, function(err, users) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, users);
      return;
    });
  },

  createUser: function(params, callback) {
    const password = params.password;

    bcrypt.genSalt(10, function(err, salt) {

      bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
          callback(err, null);
          return;
        }
        params.password = hash;

        User.create(params, function(err, user) {
          if (err) {
            callback(err, null);
            return;
          }
          callback(null, user);
          return;
        });
      });
    });
  },

  loginUser: function(params, callback) {
    User.findOne({ name: params.name }, function(err, user) {
      if (err) {
        callback(err, null);
        return;
      }
      bcrypt.compare(params.password, user.password, function(err, res) {
        // res === true
        if (err) {
          callback(err, null);
        }

        if (res === false) {
          callback(err, null);
        } else {
          callback(null, user);
        }
      });
    });
  },
  updateUserProfile: function(params, callback) {
    
  }
};
