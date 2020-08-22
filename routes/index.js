const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
// create a router 

// Welcome Page
router.get('/', (req, res) => {
    // render the welcome view by res.render('welcome')
    res.render('welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    });
});

module.exports = router;