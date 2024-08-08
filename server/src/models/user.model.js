const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validatorjs = require('validatorjs');

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        re_password: {
            type: String,
            // required: true
        },
        role: {
            type: String,
            required: true,
            enum: ['student', 'admin', 'teacher'],
            default: 'student'
        },
        twoFactorSecret: String,
        twoFactorEnabled: { 
            type: Boolean,
            default: false 
        },
        qrcode: String,
        bio: String,
        phoneNumber: String,
    }, 
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema);