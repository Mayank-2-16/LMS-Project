const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5
  },
});

module.exports = mongoose.model("OTP", otpSchema);































// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const OTPSchema = new Schema({
//     email: { type: 'string', unique: true},
//     otp: { type: 'number', unique: true},
//     createdAt: { type: Date, default: Date.now },
//     expiresAt: { type: Date }
// })

// const OTP = mongoose.model('OTP', OTPSchema);

// module.exports = OTP;