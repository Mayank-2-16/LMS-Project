const mongoose = require('mongoose')
const sessionSchema = new mongoose.Schema({
    email: { type: String },
    session: { type: String },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
})

module.exports = mongoose.model('Session', sessionSchema);