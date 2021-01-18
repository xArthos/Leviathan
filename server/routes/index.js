// Modules
const router = require('express').Router();

// GET
router.get('/', (req, res) => {
    res.render('index', {
        user: req.session.user
    });
});

// Export
module.exports = router;