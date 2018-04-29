const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load User Model
require('../models/Users');
const User = mongoose.model('users')

// login Route
router.get('/login', (req, res) => {
  res.render('users/login')
});
// Register Route
router.get('/register', (req, res) => {
  res.render('users/register')
});

// Login form POST

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    //options
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})


// Register POST 

router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({
      text: 'Enter the same password'
    });
  }
  if (req.body.password.length < 4) {
    errors.push({
      text: 'Password have to be at least 4 characters long'
    });
  }
  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    })

  } else {
    User.findOne({
        email: req.body.email
      })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email already registered');
          res.redirect('/users/login')
        } else {

        }

      })
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    })

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save()
          .then(user => {
            req.flash('success_msg', 'You are now registered and you can login.');
            res.redirect('/users/login');
          })
          .catch(err => {
            console.log(err);
            return;
          })
      })
    })
  }

});

// Logout User route

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out')
  res.redirect('/users/login')
})

module.exports = router;