const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
  ensureAuthentication
} = require('../helpers/auth')



// Load Idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Ideas Route 
router.get('/', ensureAuthentication, (req, res) => {
  Idea.find({
      user: req.user.id
    })
    .sort({
      date: 'desc'
    })
    .then(ideas => {
      res.render('ideas/index', {
        ideas
      })
    })

});
// Add Idea Route 
router.get('/add', ensureAuthentication, (req, res) => {
  res.render('ideas/add')
});
// Edit Idea Route 
router.get('/edit/:id', ensureAuthentication, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {

    if (idea.user != req.user.id) {
      req.flash('error_msg', 'Not authorized');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea
      })

    }

  })
});
// Process Form Route 
router.post('/', ensureAuthentication, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({
      text: 'Please add title of Idea'
    });
  }

  if (!req.body.details) {
    errors.push({
      text: 'Please add details of Idea'
    });
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    //res.send('passed')
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }

    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video idea added  ');
        res.redirect('/ideas');
      })
  }

});

// Edit Form process
router.put('/:id', ensureAuthentication, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save().then(idea => {
      req.flash('success_msg', 'Video idea updated');
      res.redirect('/')
    })
  })
})

// Delete Idea
router.delete('/:id', ensureAuthentication, (req, res) => {
  Idea.remove({
    _id: req.params.id
  }).then(() => {
    req.flash('success_msg', 'Video idea removed');
    res.redirect('/')
  })
})


module.exports = router;