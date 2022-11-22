const otpGenerator = require('otp-generator');

module.exports.otp = () =>{
    return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false});
}


