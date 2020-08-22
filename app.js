const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Passpott Config
require('./config/passport')(passport);
// DB Config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser:true , useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// body parser: since data is coming from the form 
app.use(express.urlencoded({extended:false}));

// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user'));


// const PORT = process.env.PORT || 5000;

let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  PORT = 8000;
}
app.listen(PORT, console.log(`Server listen on port ${PORT}`));