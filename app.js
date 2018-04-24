const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 5000;


// Map global promises - get rid of warning
mongoose.Promise = global.Promise;

// Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev'
    //, {    useMongoClient: true  } WARNING: The `useMongoClient` option is no longer necessary in mongoose 5.x, please remove it.
  )
  .then(() => console.log('MongoDB Connected ... '))
  .catch(err => console.log(err));

// Load Idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware 

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser Middleware 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('_method'))

// Index Route 

app.get('/', (req, res) => {
  const title = "Welcome1";
  res.render('index', {
    title
  });
});

// About Route 
app.get('/about', (req, res) => {
  res.render('about')
});
// Ideas Route 
app.get('/ideas', (req, res) => {
  Idea.find({})
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
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')
});
// Edit Idea Route 
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render('ideas/edit', {
      idea
    })
  })
});
// Process Form Route 
app.post('/ideas', (req, res) => {
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
    }

    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      })
  }

});

// Edit Form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save().then(idea => {
      res.redirect('/ideas')
    })
  })
})

// Delete Idea
app.delete('/ideas/:id', (req, res) => {
  Idea.remove({
    _id: req.params.id
  }).then(() => {
    res.redirect('/ideas')
  })
})


app.listen(port, () => {
  console.log('App Express is running')
})