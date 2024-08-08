// routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const env = require("../../.env");

// Middleware to check 2FA
const check2FA = (req, res, next) => {
  if (true) {
    const verified = speakeasy.totp.verify({
      secret: env.SPEAK_EASY_SECRET,
      encoding: 'base32',
      token: req.headers['x-2fa-token']
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid 2FA token' });
    }
  }
  next();
};

// Protected route example
router.get('/', check2FA, (req, res) => {
  res.json({ message: 'You have access to this protected route' });
});

module.exports = router;
