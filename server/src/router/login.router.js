const express = require('express');
const router = express.Router();
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
    try {
      console.log(req.body);
      const user = await userModel.findOne({ email: req.body.email });
      console.log(user);
      if (!user) {
        return res.status(404).json("User not found!");
      }
      const match = await bcrypt.compare(req.body.password, user.password);
      console.log(match);
      if (!match) {
        return res.status(401).json("Wrong credentials!");
      }
      const token = jwt.sign({ _id: user._id, email: user.email }, "Secret-Key");
      console.log(token);
      const { password, ...info } = user._doc;
      res
        .cookie("token", token, {})
        .status(200)
        .json(info);
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;