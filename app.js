const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;


//Load routes 
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// Passport config
require('./config/passport')(passport)

// DB config 

const db = require('./config/database')

// Map global promises - get rid of warning
mongoose.Promise = global.Promise;

// Connect to Mongoose
mongoose.connect(db.mongoURI)
  .then(() => console.log('MongoDB Connected ... '))
  .catch(err => console.log(err));



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

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('_method'))

// Express-session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash 
app.use(flash())

// Global variables 
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null
  next();
})


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

// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () => {
  console.log('App Express is running')
})