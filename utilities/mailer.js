const nodemailer = require('nodemailer');

const MAIL_SETTINGS = {
    service: 'gmail',
    auth: {
        user: "ajladines01@gmail.com",
        pass: "hmmafrblaemipkwu",
    }
}

let transporter = nodemailer.createTransport(MAIL_SETTINGS)

module.exports.sendEmail = async function (params) {

    try {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'OTP " <ajladines@gmail.com>', // sender address
            to: params.TO,
            subject: "OTP ✔", // Subject line
            html: `<div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Thanks for Signing up!.</h2>
        <h4>You are a part of us!</h4>
        <p style="margin-bottom: 30px;">Please enter the sign-up OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
   </div>`
        });
        return info
    }catch (err) {
        console.log(err)
        return false
    }


}




