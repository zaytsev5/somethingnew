const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser')
const path = require('path')
const favicon = require('serve-favicon')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json())

// Passport Config

// MySql DB

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB ALTER TABLE `tickets` ADD PRIMARY KEY(`ticketID`);
mongoose
  .connect(
    db,
    {useNewUrlParser:true},
    
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')))


// Express body parser
app.use(express.urlencoded({ extended: true }));
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes

app.use('/', require('./routes/index.js'));
app.use('/user', require('./routes/users.js'));
app.use('/apis', require('./routes/apis.js'));
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(function (req, res, next) {
  res.status(404).render('verified');

})
// app.use(function (err,req, res, next) {
//   res.status(404||err.message).send(err.status)
 
// })
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

