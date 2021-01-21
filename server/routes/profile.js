// Modules
import express from 'express';

// Models
import User from '../model/User.js';

// Controllers
import { 
    authenticateToken,
    refreshToken
    } from '../controllers/jwtToken.js';
import  { editValidation } from '../controllers/validation.js';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Setting the router
const router = express.Router();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    // console.log(user)

    User.findOneAndUpdate(user ,req.body , (err, data) => {
        // console.log(req.body)
        // console.log(data)
    })
});

// Export
export default router;