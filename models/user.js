const mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    OTP: { type: String, required: true },
    verified: { type: Boolean, value: false },
});

const User = mongoose.model("user", userSchema);

module.exports =  User