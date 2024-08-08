// routes/twoFactorRoutes.js
const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/user.model');
const verifyToken = require("../utils/verifyToken")

const app = express();
const cors = require('cors')
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}
app.use(cors(corsOptions))

router.post('/setup', async (req, res) => {
    try {
      console.log("twofactor.router.js")
      console.log(req.cookies.token)
      const token = req.cookies.token;
      const userId = JSON.parse(atob(token.split('.')[1]))._id;
      console.log(userId)
      console.log("twofactor.router.js")
      const secret = speakeasy.generateSecret();
      const user = await User.findById(userId);
      console.log(user)
      
      if (!user) {
        console.log("twofactor.router.js2")
        return res.status(404).json({ error: 'User not found' });
      }
      
      user.twoFactorSecret = secret.base32;
      await user.save();
      
      // console.log("User");
      console.log("twofactor.router.js3")
      qrcode.toDataURL(secret.otpauth_url, async (err, data_url) => {
        if (err) {
          console.log("twofactor.router.js4")
          return res.status(500).send(err);
        }
        console.log("twofactor.router.js5")
        const user = await User.findByIdAndUpdate(
          userId,
          {qrcode: data_url},
        );
        console.log("twofactor.router.js6")
        res.status(200).json({ secret: secret.base32, qrCode: data_url });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});

router.post('/verify', async (req, res) => {
    try {
      const token = req.cookies.token;
      const userId = JSON.parse(atob(token.split('.')[1]))._id;
      const user = await User.findById(userId);
      console.log("Hello")
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: req.body.token
      });
  
      if (verified) {
        user.twoFactorEnabled = true;
        await user.save();
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});


module.exports = router;
