// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth route
router.post('/login', passport.authenticate('local'), (req, res) => {
  console.log("auth.routes.js")
    res.json({ success: true, user: req.user });
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;