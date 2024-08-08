const userModel = require("../models/user.model");
const courseModel = require("../models/course.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// CREATE   

// READ
const getUserDetails = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const user = await userModel.findById(user_id);
        // console.log(user);
        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const isCourseBought = async (req, res) => {
    try {
        const { user_id, course_id } = req.params;
        console.log("user_id", user_id);
        console.log("course_id", course_id);
        const user = await userModel.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const course = await courseModel.findById(course_id);
        const isBought = course.students.includes(user_id);
        console.log("isBought", isBought);
        res.status(200).json(isBought);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }

}

const role = async (req, res) => {
    try {
        const user_id = req.user._id;
        const user = await userModel.findById(user_id);
        console.log(user.role);
        res.status(200).json(user.role);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

// UPDATE
const changePassword = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }

        const user = await userModel.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        console.log("user.password", user.password);
        await user.save();

        // Optionally, generate a new token if you want the user to stay logged in
        const token = jwt.sign({ _id: user._id, email: user.email }, "Secret-Key");

        res
        .cookie("token", token)
        // .status(200).json({ message: 'Password updated successfully' });
        .status(200).json({ message: 'Password updated successfully', token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

const updateDetails = async (req, res) => {
    try {
        console.log("req.body", req.body);
        console.log("req.params", req.params);

        const user_id = req.params.user_id;
        const { name, email, bio, phoneNumber } = req.body;
        // const user = await userModel.findById(user_id);
        const updatedUser = await userModel.findByIdAndUpdate(user_id, { name, email, bio, phoneNumber }, { new: true });

        res.status(200).json({ message: 'Details updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    getUserDetails,
    changePassword,
    updateDetails,
    isCourseBought, 
    role
};