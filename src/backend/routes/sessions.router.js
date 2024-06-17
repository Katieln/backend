const { Router } = require('express');
const passport = require('passport');
const router = Router();

router.get('/gh', passport.authenticate("github", {}), (req, res) => {});

router.get('/Github', passport.authenticate("github", { failureRedirect: '/failedlogin' }), (req, res) => {
    res.setHeader('content-type', 'application/json');
    return res.status(200).json({ payload: "ok" });
});

module.exports = router;



