const mongoose = require("mongoose");

const DBConn = () => mongoose.connect('mongodb://127.0.0.1:27017/otp')

module.exports = DBConn

