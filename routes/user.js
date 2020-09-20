const express = require('express');
const { collection } = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User Model
const User = require('../models/User');

// create a router for login page
router.get('/login', (req, res) => {
    res.render('login');
});

// create a router for registration page
router.get('/register', (req, res) => {
    res.render('register');
});

// Registration Handler
router.post('/register', (req,res) => {
    console.log(req.body);

    const { name, email, password, password2} = req.body;
    errors = [];

    // Validaton for the form fields
    
    // Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({
            msg: 'Please fill in all the fields'
        });
    }

    // Check for both password matching
    if(password != password2) {
        errors.push({
            msg: 'Passwords do not match'
        });
    }

    // Check pass lenght
    if(password.length < 6) {
        errors.push({
            msg: 'Password should be at least 6 characters long'
        });
    }

    if(errors.length > 0) {
        res.render('register', {
            errors, 
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({email:email}) 
        .then(user => {
            if(user) {
                errors.push({
                    msg: 'Email is already Registered'
                });
                res.render('register', {
                    errors, 
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                
                // Hash Password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;

                        // Set Password to hashed
                        newUser.password = hash;

                        // Save user to DB
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can login now.');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    });
                });
            }
        })
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})
module.exports = router;