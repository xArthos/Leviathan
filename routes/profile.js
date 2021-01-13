// Modules
const router = require('express').Router();

// Models
const User = require('../model/User');

// Controllers
const { 
    authenticateToken,
    refreshToken
    } = require('../controllers/jwtToken');
const  { editValidation } = require('../controllers/validation')


// GET Routes
router.get('/', refreshToken, authenticateToken, (req, res) => {
    const user = req.session.user;
    // console.log(req.user)

    if (user == null || !user) {
        res.redirect('/');
    } else {
        res.render('profile', {
            user,
            msg: req.flash('info')
        });
    };
});

// POST Routes
router.post('/editInfo', refreshToken, authenticateToken, editValidation, (req, res) => {
    const user = req.session.user;
    console.log(user)

    User.findOneAndUpdate(user ,req.body , (err, data) => {
        console.log(req.body)
        console.log(data)
    })
});

// Export
module.exports = router;