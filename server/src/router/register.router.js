const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const sendVerificationEmail = require("../utils/mailSender");
const userModel = require("../models/user.model");
const otpModel = require("../models/otp.model");

router.post("/", (req, res) => {
    console.log(req.body);
    try {
        console.log("ehjjjjh");
        let { name, email, password, re_password, isTeacher } = req.body;
        name = name.trim();
        email = email.trim();
        password = password.trim();
        const otp = Math.round(Math.random() * 1000000);
        if (!(name && email && password))
            throw new Error("All fields are required");
        else if (name.length < 3 || name.length > 20)
            throw new Error("Name must be between 3 and 20 characters");
        else if (!/^[a-zA-Z ]*$/.test(name)) throw new Error("Invalid name");
        else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
            throw new Error("Invalid email");
        // else if(!/^[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(password)) throw new Error('Create a strong password');
        else if (password != re_password) throw new Error("Re-password is Wrong");
        else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) throw err;
                    const user = await userModel.findOne({ email: email });
                    if (user != undefined) {
                        res.status(201).json({ message: "User already exists" });
                    } else {
                        let createdUser = await userModel.create({
                            name: name,
                            email: email,
                            password: hash,
                            role: isTeacher ? "teacher" : "student",
                        });
                        await createdUser.save();
                        console.log(hash);
                        console.log(otp);
                        let createdotp = otpModel.create({
                            email: email,
                            otp: otp,
                            createdAt: new Date(),
                        });
                        sendVerificationEmail(email, otp);
                        const savedUser = await createdUser.save();
                        req.session.userId = createdUser._id;
                        res.status(200).json(savedUser);
                    }
                });
            });
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
});

router.post("/otp", async (req, res) => {
    console.log(req.body.email);
    console.log(req.body.otpNew);
    try {
        let { email, otpNew } = req.body;
        email = email.trim();
        if (!(email && otpNew)) {
            throw new Error("OTP is required");
        } else {
            const user = await userModel.findOne({ email: email });
            console.log(user);
            if (user) {
                const otpData = await otpModel.findOne({ email: email });
                console.log(otpData);
                if (otpData.otp == otpNew) {
                    console.log("Registered successfully");
                    res.json("success");
                } else {
                    throw new Error("Invalid OTP");
                }
            } else {
                throw new Error("Invalid Email");
            }
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports = router;
