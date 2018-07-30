var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var userMiddleware = require('../utils/usersMiddleware');

/* GET users listing. */
router.get('/createuser', function(req, res, next) {
  console.log(req.session.user)
  res.render('register', { title: 'Sign up', error: '' });
});

router.get('/edituser', userMiddleware.findAuthUser, function(req, res, next) {
  console.log(req.session.userID)
  
});

router.post('/createuser', function(req, res, next) {

  userController.createUser(req.body, function(err, user) {
    if (err) {
      let errMessage;

      if (err.code === 11000) {
        errMessage = 'Name already exist choose another one';
        res.render('register', {error: errMessage});
        return;
      }
      res.render('result', {
        message: 'Failure to create new User, try again.',
        error: err
      });
      return;
    }


    req.session.userID = user._id;

    res.render('index', {
      message: 'Hello ' + user.name + ", you've successfully logged in",
      currentUser: user
    });
    return;
  });
});

router.post('/login', function(req, res, next) {
  userController.loginUser(req.body, function(err, user) {
    if (err) {
      res.status(404).json({
        message: 'Fail',
        error: err
      });
      return;
    }

    if (user === null) {
      res.render('result', {
        message: 'Failure to login, Please check your username and password',
        error: 'Check your username and password'
      });
      return;
    }
    res.render('index', {
      message: 'Hello ' + user.name + ", you've successfully logged in",
      currentUser: user
    });
    return;
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Please Log In' });
});

router.get('/signout', function(req, res, next) {
  req.session = null;
  res.render('index', {currentUser: '', message: ''})
});

router.put('/update-profile', function(req, res, next) {
  let userID = req.session.userID

  res.json({
    data: userID
  })
});

module.exports = router;
